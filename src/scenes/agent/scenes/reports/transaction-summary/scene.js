import React from 'react';
import {ActivityIndicator, Dimensions, ScrollView, View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';
import {connect} from 'react-redux';

import Accordion from '../../../../../components/accordion';
import Button from '../../../../../components/button';
import Header from '../../../../../components/header';
import Hyperlink from '../../../../../components/hyperlink';
import GradientIcon from '../../../../../components/icons/gradient-icon';
import Modal from '../../../../../components/modal';
import Receipt from '../../../../../components/receipt';
import Text from '../../../../../components/text';
import {WINDOW_WIDTH} from '../../../../../constants';
import {
  ERROR_STATUS,
  FAILED_STATUS,
  SUCCESSFUL_STATUS,
  SUCCESS_STATUS,
} from '../../../../../constants/api';
import {
  QUICKTELLER_API_TERMINAL_ID,
  SHOW_CRM,
} from '../../../../../constants/api-resources';
import {BLOCKER, CASUAL} from '../../../../../constants/dialog-priorities';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_LINK_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_SIZE_BIG,
} from '../../../../../constants/styles';
import {TransactionHistoryReceiptSerializer as ReceiptSerializer} from '../../../../../serializers/resources/receipt';
import TransactionSerializer from '../../../../../serializers/resources/transaction';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../services/redux/actions/navigation';
import {addRequeriedTransaction} from '../../../../../services/redux/actions/tunnel';
import {
  crmService,
  quicktellerService,
  transactionHistoryService,
  transactionService,
} from '../../../../../setup/api';
import {flashMessage} from '../../../../../utils/dialog';
import {startFileDownload} from '../../../../../utils/download-manager';
import handleErrorResponse from '../../../../../utils/error-handlers/api';
const window_height = Dimensions.get('window').height;

const COPY_ON_PRESS_FIELDS = [
  'Transaction Ref',
  'Biller Number',
  'Customer Phone',
  'Reversal Ref',
];

class TransactionSummary extends React.Component {
  LINKED_REVERSAL_MESSAGE =
    'We are checking if this transaction has been reversed.';
  REQUERY_TRANSACTION_MESSAGE =
    'We are currently fetching the latest transaction status';
  REQUERY_TRANSACTION_TYPES = ['Pending'];
  TRANSACTION_TYPES_WITHOUT_RECEIPT = [
    'REVERSAL',
    'COMMISSION_UNLOAD',
    'PAYPOINT_FUND',
  ];

  receiptSerializer = new ReceiptSerializer();
  transactionSerializer = new TransactionSerializer();

  constructor() {
    super();

    this.state = {
      isLoadingExtraData: false,
      reversalStatus: 'N/A',
      transaction: {},
      reversalTransaction: {},
      isLoadingComplaint: false,
      showSuccessModal: false,
    };

    this.getFullTransactionDetails = this.getFullTransactionDetails.bind(this);
    this.getLinkedReversal = this.getLinkedReversal.bind(this);
    this.getServiceDetails = this.getServiceDetails.bind(this);
    this.loadData = this.loadData.bind(this);
    this.requeryTransaction = this.requeryTransaction.bind(this);
  }

  async componentDidMount() {
    const transaction = this.props.route?.params?.transaction;

    this.setState({
      transaction: transaction || {},
    });

    setTimeout(() => {
      this.loadData();
      this.getServiceDetails();
    }, 0);
  }

  async getServiceDetails() {
    const {transaction} = this.state;

    const {response, status} = await quicktellerService.searchForBiller(
      transaction.service || transaction.narration,
      QUICKTELLER_API_TERMINAL_ID,
    );

    if (status === ERROR_STATUS || !response.length) return;

    const [service] = response;

    this.setState({
      service,
    });

    if (transaction.transactionType !== 'BILLS') return;

    const res = await startFileDownload(service.imageUrl);

    const [downloadInfo, destinationPath] = res;

    this.setState({
      icon: service.imageUrl,
      iconPath: destinationPath,
    });

    return;
  }

  async loadData() {
    const {transaction} = this.state;

    if (transaction.hasExtraData) {
      this.getFullTransactionDetails();
    }

    if (transaction.canBeRequeried) {
      this.requeryTransaction();
    }

    if (transaction.canHaveReversal) {
      this.getLinkedReversal();
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getFullTransactionDetails() {
    this.setState({isLoadingExtraData: true});

    const {response, status} =
      await transactionHistoryService.retrieveTransactionByRef(
        null,
        this.state.transaction.transactionRef,
      );

    if (status === ERROR_STATUS) {
      return;
    }

    this.setState({
      transaction: {
        ...this.state.transaction,
        extraInfoList:
          this.transactionSerializer.serializeExtraFieldsFixed(response)[0],
      },
    });
  }

  async getLinkedReversal() {
    this.setState({isLoadingReversal: true});
    flashMessage(null, this.LINKED_REVERSAL_MESSAGE, CASUAL);

    const {
      transaction: {transactionRef},
    } = this.state;
    const {response, status} = await transactionService.getLinkedReversal(
      transactionRef,
    );

    this.setState({isLoadingReversal: false});

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), CASUAL);

      return;
    }

    const reversalTransaction =
      this.transactionSerializer.serializeApiData(response);

    this.setState({
      parsedReversalTransaction:
        this.transactionSerializer.serializeRequeriedTransaction(
          reversalTransaction,
        ),
      reversalTransaction,
    });
  }

  async requeryTransaction() {
    this.setState({isLoadingRequery: true});
    flashMessage(null, this.REQUERY_TRANSACTION_MESSAGE, CASUAL);

    const {
      transaction: {transactionRef},
    } = this.state;
    let {response, status} = await transactionHistoryService.requeryTransaction(
      transactionRef,
    );

    this.setState({
      isLoadingRequery: false,
    });

    if (status === ERROR_STATUS) {
      // TODO remove this `return` statement
      return;

      flashMessage(null, await handleErrorResponse(response), CASUAL);

      return;
    }

    this.props.addRequeriedTransaction(response);

    this.setState({
      transaction: this.transactionSerializer.serializeApiData(response),
    });
  }

  doesTransactionHaveReceipt() {
    return (
      !this.TRANSACTION_TYPES_WITHOUT_RECEIPT.includes(
        this.state.transaction.transactionType,
      ) && !this.state.transaction.esbRef
    );
  }

  get successModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({
                showSuccessModal: false,
              });
              //this.props.navigation.replace("IssueHistory");
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
              Oops!
            </Text>
            <Text style={{textAlign: 'center', fontFamily: FONT_FAMILY_BODY}}>
              This transaction type is currently unavailable to make a
              complaint. For inquiries/complaint, call{' '}
              <Text style={{color: COLOUR_BLACK}}>07009065000</Text> or send an
              email to{' '}
              <Text style={{color: COLOUR_BLACK}}>
                support@interswitchgroup.com
              </Text>
            </Text>
          </View>
        }
        // image={require("../../../../../../assets/media/images/clap.png")}
        isModalVisible={true}
        size="md"
        title="Quickteller Paypoint"
        withButtons
        hideCloseButton
      />
    );
  }

  async handleComplaint() {
    const {transaction} = this.state;
    const transactionTypesToCheck = [
      'BILLS',
      'TRANSFER',
      'RECHARGE',
      'NIP',
      'PAYPOINT_FUND',
      'CASH_OUT',
    ];
    const checkTransactionType = transactionTypesToCheck.includes(
      transaction.transactionType,
    );

    this.setState({isLoadingComplaint: true});
    if (!checkTransactionType) {
      this.setState({isLoadingComplaint: false, showSuccessModal: true});
    } else {
      try {
        const {response, status} = await crmService.getTransactionTicket(
          transaction?.transactionRef,
        );
        const {data, description} = response;

        if (status === ERROR_STATUS) {
          flashMessage(
            'Oops!',
            'Something went wrong, please try again later.',
            BLOCKER,
          );
          this.setState({isLoadingComplaint: false});

          return false;
        }
        if (data === undefined) {
          flashMessage(
            'Oops!',
            'Something went wrong, please try again later.',
            BLOCKER,
          );
          this.setState({isLoadingComplaint: false});

          return false;
        } else if (
          description ===
          'Ticket not found with transaction reference: undefined'
        ) {
          flashMessage(
            'Oops!',
            'Ticket not found with transaction reference: undefined.',
            BLOCKER,
          );
          this.setState({isLoadingComplaint: false});

          return false;
        } else if (data !== null && status === SUCCESS_STATUS) {
          this.props.navigation.navigate('IssueDetails', {
            transaction: data,
          });
          this.setState({isLoadingComplaint: false});
          return;
        } else {
          this.props.navigation.navigate('AddIssue', {
            transaction: transaction,
          });
          this.setState({isLoadingComplaint: false});
          return;
        }
      } catch (err) {
        return false;
      }
    }
  }
  render() {
    const {
      icon,
      iconPath,
      isLoadingExtraData,
      isLoadingRequery,
      isLoadingReversal,
      transaction,
      reversalTransaction,
      parsedReversalTransaction,
    } = this.state;
    const {amount, formattedDateTime, narration, statusCode} = transaction;

    const summaryContent =
      this.transactionSerializer.getSummaryContent(transaction);

    const mainPageContent = (
      <ScrollView>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
            backgroundColor: '#F3F3F4',
            height: 300,
          }}>
          <GradientIcon
            colors={['#83F4FA', '#00B8DE']}
            icon="tag"
            style={{
              justifyContent: 'center',
            }}
          />

          <Text title style={{color: COLOUR_BLACK}}>
            {narration}
          </Text>
          <Text>{formattedDateTime}</Text>
          <Text style={{color: COLOUR_BLACK, fontSize: FONT_SIZE_BIG}}>
            {amount}
          </Text>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              center
              title
              isFailedStatus={statusCode === FAILED_STATUS}
              isSuccessStatus={statusCode === SUCCESSFUL_STATUS}>
              {statusCode}
            </Text>
            {isLoadingRequery && (
              <ActivityIndicator size="small" style={{marginLeft: 8}} />
            )}
          </View>
          {transaction.canHaveReversal && (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text center mid>
                {`Reversal Status: `}
              </Text>
              <Text
                center
                mid
                isFailedStatus={reversalTransaction.statusCode === 'Failed'}
                isSuccessStatus={
                  reversalTransaction.statusCode === 'Successful'
                }>
                {reversalTransaction.statusCode}
              </Text>
              {isLoadingReversal && (
                <ActivityIndicator size="small" style={{marginLeft: 8}} />
              )}
            </View>
          )}
        </View>

        {Object.keys(summaryContent).map((title, index) => {
          const items = summaryContent[title];

          return (
            <Accordion
              content={
                <View>
                  {Object.keys(items).map((key, index) => {
                    const value = items[key];

                    if (value === undefined) {
                      return <React.Fragment />;
                    }

                    return (
                      <React.Fragment key={index}>
                        <Text bold>{key}</Text>
                        <Text
                          copyOnPress={COPY_ON_PRESS_FIELDS.includes(key)}
                          style={{marginBottom: 12}}>
                          {value}
                        </Text>
                      </React.Fragment>
                    );
                  })}
                </View>
              }
              expanded={true}
              header={title}
              key={index}
            />
          );
        })}

        {transaction.hasExtraData && (
          <Accordion
            content={
              isLoadingExtraData && Boolean(transaction.extraInfoList) ? (
                <View>
                  {Object.keys(transaction.extraInfoList).map((key, index) => {
                    const value = transaction.extraInfoList[key];

                    if (value === undefined) {
                      return <React.Fragment />;
                    }

                    return (
                      <React.Fragment key={index}>
                        <Text bold>{key}</Text>
                        <Text
                          copyOnPress={COPY_ON_PRESS_FIELDS.includes(key)}
                          style={{marginBottom: 12}}>
                          {value}
                        </Text>
                      </React.Fragment>
                    );
                  })}
                </View>
              ) : (
                <ActivityIndicator color={COLOUR_BLUE} />
              )
            }
            expanded={true}
            header={'Extra'}
          />
        )}

        {transaction.canHaveReversal && (
          <Accordion
            content={
              !isLoadingReversal && Boolean(parsedReversalTransaction) ? (
                <View>
                  {Object.keys(parsedReversalTransaction).map((key, index) => {
                    const value = parsedReversalTransaction[key];

                    if (value === undefined) {
                      return <React.Fragment />;
                    }

                    return (
                      <React.Fragment key={index}>
                        <Text bold>{key}</Text>
                        <Text
                          copyOnPress={COPY_ON_PRESS_FIELDS.includes(key)}
                          style={{marginBottom: 12}}>
                          {value}
                        </Text>
                      </React.Fragment>
                    );
                  })}
                </View>
              ) : (
                <ActivityIndicator color={COLOUR_BLUE} />
              )
            }
            expanded={true}
            header={'Reversal Data'}
          />
        )}
        {SHOW_CRM && (
          <Button
            onPress={() => this.handleComplaint()}
            containerStyle={{
              width: WINDOW_WIDTH * 0.9,
              alignSelf: 'center',
              marginTop: 5,
              marginBottom: 30,
              backgroundColor: COLOUR_WHITE,
              borderWidth: 1,
              borderColor: COLOUR_LINK_BLUE,
            }}
            title="Make a Complaint"
            titleStyle={{
              color: COLOUR_LINK_BLUE,
            }}
            //type="outline"
            loading={this.state.isLoadingComplaint}
            loadingProps={{color: COLOUR_LINK_BLUE}}
          />
        )}
        {this.state.showSuccessModal && this.successModal}
      </ScrollView>
    );

    return (
      <View style={{flex: 1}}>
        <RBSheet
          animationType="fade"
          closeOnDragDown={false}
          duration={250}
          height={window_height * 0.9}
          onClose={this.onCancelConfirmation}
          ref={sheet => (this.receiptBottomSheet = sheet)}>
          <Receipt
            icon={icon}
            iconPath={iconPath}
            onDismiss={() => this.receiptBottomSheet.close()}
            onHome={() => {
              this.receiptBottomSheet.close();
              // this.props.navigation.reset(
              //   [NavigationActions.navigate({ routeName: "Agent" })],
              //   0
              // );
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'DefaultScene'}],
              });
            }}
            fields={this.receiptSerializer.getReceiptFields({
              ...transaction,
              extra: transaction.extraInfoList,
            })}
            receiptType="***RE-PRINT***"
            newRemoteConfig={this.props.remoteConfig}
          />
        </RBSheet>

        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          goBack={() => this.props.navigation.goBack()}
          withNavigateBackIcon
          title="Transaction Details"
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
          rightComponent={
            <Hyperlink
              onPress={() => {
                this.receiptBottomSheet.open();
              }}
              style={{
                alignItems: 'flex-end',
                color: COLOUR_WHITE,
                fontSize: 12,
                textAlign: 'right',
                width: 90,
              }}>
              See Receipt
            </Hyperlink>
          }
        />

        {mainPageContent}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    remoteConfig: state.tunnel.remoteConfig,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addRequeriedTransaction: transaction =>
      dispatch(addRequeriedTransaction(transaction)),
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionSummary);
