import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import {Alert} from 'react-native';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import Button from '../../../../../../components/button';
import Header from '../../../../../../components/header';
import Modal from '../../../../../../components/modal';
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  SUCCESSFUL_STATUS,
  SUCCESS_STATUS,
} from '../../../../../../constants/api';
import {BLOCKER, CASUAL} from '../../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_BOLD,
  FONT_SIZE_BIG,
} from '../../../../../../constants/styles';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../../services/redux/actions/navigation';
import {crmService} from '../../../../../../setup/api';
import {flashMessage} from '../../../../../../utils/dialog';
import ComplaintCommentForm from './components/comment-form';
import ComplaintCommentItems from './components/comment-items';
import IssueDetailItems from './components/issue-detail-items';
import ReopenIssueForm from './components/reopen-issue';
class IssueDetailsScene extends React.Component {
  constructor() {
    super();
    this.state = {
      transaction: '',
      isLoading: false,
      isError: false,
      ticketId: '',
      resolved: false,
      refreshComment: false,
      info: '',
      showSuccessModal: false,
      previousResponse: '',
    };

    this.sheetRef = React.createRef();
    this.getTicketDetails = this.getTicketDetails.bind(this);
    this.getComment = this.getComment.bind(this);
    this.showCommentErrorNotification =
      this.showCommentErrorNotification.bind(this);
    this.responseCodeHandler = this.responseCodeHandler.bind(this);
    this.getReopenSuccessModal = this.getReopenSuccessModal.bind(this);
    this.getUpdatedTicketDetails = this.getUpdatedTicketDetails.bind(this);
  }

  componentDidMount() {
    const {transaction} = this.props.route.params || {};

    this.getTicketDetails(transaction);
  }

  async getTicketDetails(params) {
    this.setState({
      ticketId: params?.ticketNumber,
      isLoading: true,
      isError: false,
      info: params,
    });
    try {
      const {status, response, code} = await crmService.getTicketNumber(
        params?.ticketNumber,
      );
      console.log(response, 'respo');
      const {data, description} = response;
      if (status === SUCCESS_STATUS && description === SUCCESSFUL_STATUS) {
        this.setState({transaction: data, isLoading: false, isError: false});
        return;
      }
      this.responseCodeHandler(code);
      this.setState({isLoading: false});
      return false;
    } catch (err) {
      console.log(err);
    }
  }

  responseCodeHandler(code) {
    if (code === HTTP_NOT_FOUND) {
      this.setState({
        isError: false,
        transaction: '',
        isLoading: false,
      });
      flashMessage(
        null,
        "Oops! Sorry, the page or resource you're looking for could not be found.",
        BLOCKER,
      );
    } else if (code === HTTP_INTERNAL_SERVER_ERROR) {
      this.setState({
        isError: true,
        transaction: '',
        isLoading: false,
      });
      flashMessage(
        null,
        'Oops! Something went wrong, please try again later.',
        BLOCKER,
      );
    } else if (code === 503) {
      this.setState({
        isError: true,
        transaction: '',
        isLoading: false,
      });
      flashMessage(
        null,
        'Oops! Something went wrong, please try again later.',
        BLOCKER,
      );
    } else {
      this.setState({
        isError: true,
        transaction: '',
        isLoading: false,
      });
      flashMessage(
        null,
        'Oops! Something went wrong, please try again later.',
        BLOCKER,
      );
    }
  }

  async getComment(ticketNumber) {
    try {
      const {status, response} = await crmService.getTicketNumber(ticketNumber);
      const {data, description} = response;
      if (status === SUCCESS_STATUS && description === SUCCESSFUL_STATUS) {
        this.setState(prevState => {
          const updatedTransaction = {...prevState.transaction};
          updatedTransaction.comments = [...data.comments];
          return {transaction: updatedTransaction};
        });
      } else {
        this.showCommentErrorNotification(
          null,
          'Oops! An error occurred while fetching your comment.',
          ticketNumber,
        );
        this.sheetRef.current?.close();
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOnRefreshComment(ticketNumber) {
    this.setState({refreshComment: true});
    try {
      const {status, response} = await crmService.getTicketNumber(ticketNumber);
      const {data, description} = response;
      if (status === SUCCESS_STATUS && description === SUCCESSFUL_STATUS) {
        this.setState(prevState => {
          const updatedTransaction = {...prevState.transaction};
          updatedTransaction.comments = [...data.comments];
          return {transaction: updatedTransaction};
        });
        this.setState({refreshComment: false});
      } else {
        this.showCommentErrorNotification(
          null,
          'Oops! An error occurred while fetching your comment.',
          ticketNumber,
        );
        this.sheetRef.current?.close();
        this.setState({refreshComment: false});
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getUpdatedTicketDetails() {
    this.setState({
      isLoading: true,
      isError: false,
    });
    try {
      const {status, response, code} = await crmService.getTicketNumber(
        this.state.ticketId,
      );
      const {data, description} = response;
      if (status === SUCCESS_STATUS && description === SUCCESSFUL_STATUS) {
        this.setState({transaction: data, isLoading: false, isError: false});
        return;
      }
      flashMessage('Unable to retrieve the updated data.', CASUAL);
      this.setState({isLoading: false});
      this.props.navigation.replace('IssueHistory');
      return false;
    } catch (err) {
      console.log(err);
    }
  }

  showCommentErrorNotification(title, message, ticketNumber) {
    return Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancelled'),
          style: 'cancel',
        },
        {
          text: 'Refresh',
          onPress: () => this.getOnRefreshComment(ticketNumber),
        },
      ],

      {cancelable: false},
    );
  }
  get onErrorOccured() {
    return (
      <View style={{alignSelf: 'center'}}>
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Oops!</Text>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: FONT_SIZE_BIG,
          }}>
          An error occured. {'\n'}Please, try again.
        </Text>

        <Button
          containerStyle={{
            alignSelf: 'center',
            backgroundColor: 'white',
            marginTop: 30,
            width: '80%',
          }}
          // loading={this.state.isLoading}
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
          onPressOut={this.getTicketDetails(this.state.info)}
        />
      </View>
    );
  }

  getReopenSuccessModal() {
    return this.setState({showSuccessModal: true});
  }

  get getSuccessModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({
                showSuccessModal: false,
              });
              this.getUpdatedTicketDetails();
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: '100%',
            },
            title: 'OKAY',
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: FONT_FAMILY_BODY,
                fontSize: FONT_SIZE_BIG,
                textAlign: 'center',
                marginBottom: 5,
              }}>
              Ticket Reopened!
            </Text>
            <Text style={{textAlign: 'center', fontFamily: FONT_FAMILY_BODY}}>
              Your ticket with ID{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  fontFamily: FONT_FAMILY_BODY_BOLD,
                }}>
                {this.state.ticketId}
              </Text>{' '}
              has been reopened
            </Text>
          </View>
        }
        image={require('../../../../../../assets/media/images/clap.png')}
        isModalVisible={true}
        size="md"
        title="Success"
        withButtons
        hideCloseButton
      />
    );
  }
  render() {
    const {
      transaction,
      isError,
      isLoading,
      ticketId,
      refreshComment,
      showSuccessModal,
    } = this.state;
    console.log(transaction, 'details trans');
    return (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          flex: 1,
          paddingBottom: 10,
        }}
        onTouchMove={() =>
          this.props.isNavigatorVisible ? this.props.hideNavigator() : null
        }>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          leftComponent={
            <Icon
              underlayColor="transparent"
              color={COLOUR_WHITE}
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Issue Details"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />
        <View
          style={{
            marginHorizontal: 30,
            marginVertical: 15,
            flex: 1,
          }}>
          {isError && this.onErrorOccured}

          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              {isError ? null : (
                <>
                  <ScrollView
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}>
                    <IssueDetailItems transaction={transaction} />
                    {showSuccessModal && this.getSuccessModal}
                    <ComplaintCommentItems
                      transaction={transaction}
                      refreshComment={refreshComment}
                    />
                  </ScrollView>
                  {transaction?.status === 'Active' ? (
                    <>
                      <Button
                        onPress={() => this.sheetRef.current?.open()}
                        containerStyle={{
                          backgroundColor: COLOUR_BLUE,
                          marginBottom: 30,
                          marginTop: 20,
                        }}
                        title="Add Comment"
                        buttonStyle={{backgroundColor: COLOUR_BLUE}}
                        loading={false}
                      />
                      <ComplaintCommentForm
                        sheetRef={this.sheetRef}
                        getComment={this.getComment}
                        ticketNumber={ticketId}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        onPress={() => this.sheetRef.current?.open()}
                        containerStyle={{
                          backgroundColor: COLOUR_BLUE,
                          marginBottom: 30,
                          marginTop: 20,
                        }}
                        title={
                          transaction?.expired === true
                            ? 'Closed'
                            : 'Reopen Ticket'
                        }
                        buttonStyle={{backgroundColor: COLOUR_BLUE}}
                        loading={false}
                        disabled={transaction?.expired}
                      />

                      <ReopenIssueForm
                        sheetRef={this.sheetRef}
                        getComment={this.getComment}
                        ticketNumber={ticketId}
                        getReopenSuccessModal={this.getReopenSuccessModal}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueDetailsScene);
