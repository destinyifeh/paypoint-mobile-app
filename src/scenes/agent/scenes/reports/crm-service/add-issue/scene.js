import React from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import Button from '../../../../../../components/button';
import Header from '../../../../../../components/header';
import Modal from '../../../../../../components/modal';
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  SUCCESSFUL_STATUS,
  SUCCESS_STATUS,
} from '../../../../../../constants/api';
import {BLOCKER} from '../../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_SIZE_BIG,
} from '../../../../../../constants/styles';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../../services/redux/actions/navigation';
import {crmService} from '../../../../../../setup/api';
import {flashMessage} from '../../../../../../utils/dialog';
import ComplaintFileUploader from '../components/complaint-upload';
import {
  ComplaintFormForBills,
  ComplaintFormForCashout,
  ComplaintFormForFunding,
  ComplaintFormForRecharge,
  ComplaintFormForTransfer,
  ComplaintNormalForm,
} from './components/complaint-form';
class AddIssueScene extends React.Component {
  constructor() {
    super();
    this.state = {
      attachment: '',
      fileLoader: false,
      documentType: '',
      form: '',
      showSuccessModal: false,
      transaction: {},
      loading: false,
      invalidFileField: false,
      invalidCommentField: false,
      loadingFile: false,
    };
    this.comment = React.createRef();
    this.responseCodeHandler = this.responseCodeHandler.bind(this);
    this.showErrorAlert = this.showErrorAlert.bind(this);
  }

  componentDidMount() {
    const {transaction} = this.props.route.params || {};
    this.setState({
      transaction: transaction,
      invalidFileField: false,
    });
    this.comment.current?.focus();
  }

  setFile(file) {
    this.setState({attachment: file});
  }

  updateFormField(params) {
    const newForm = {
      ...this.state.form,
      ...params,
    };
    this.setState({form: newForm});
  }
  async pickDocument() {
    this.setState({loadingFile: true, invalidFileField: false});
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        result.uri,
        result.type, // mime type
        result.name,
        result.size,
      );
      const THREE_MB = 3145728;
      if (result.size > THREE_MB) {
        Alert.alert(null, 'File is more than 3MB, try again');
        this.setState({loadingFile: false});
        return false;
      }
      if (
        result.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        result.type === 'application/msword'
      ) {
        this.setState({
          documentType: 'doc',
          attachment: result,
          invalidFileField: false,
          loadingFile: false,
        });
      } else if (result.type === 'application/pdf') {
        this.setState({
          documentType: 'pdf',
          attachment: result,
          invalidFileField: false,
          loadingFile: false,
        });
      } else if (
        result.type === 'image/png' ||
        result.type === 'image/jpg' ||
        result.type === 'image/jpeg'
      ) {
        this.setState({
          documentType: 'photo',
          attachment: result,
          invalidFileField: false,
          loadingFile: false,
        });
      } else {
        Alert.alert(null, 'Unsupported file format, try again.');
        this.setState({loadingFile: false});
        return;
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.setState({loadingFile: false});
        return false;
      } else {
        this.setState({loadingFile: false});
      }
    }
  }

  onRemoveFile() {
    this.setState({attachment: '', invalidFileField: false});
  }

  showErrorAlert(message) {
    return Alert.alert(
      null,
      message,
      [
        {
          text: 'Home',
          onPress: () => {
            this.props.navigation.navigate('Agent');
          },
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],

      {cancelable: false},
    );
  }
  async onSubmitComplaint() {
    const {comment} = this.state.form;
    const {attachment} = this.state;
    this.setState({loading: true});

    const {
      amount,
      dateCreated,
      transactionRef,
      statusCode,
      transactionType,
      rrn,
      maskedPan,
      beneficiaryAccountNumber,
      mobileNo,
      paymentMethod,
      beneficiaryPhoneNo,
      customerId,
      terminalId,
      customerMsisdn,
      beneficiaryMobileNumber,
    } = this.state.transaction;

    const attachedDoc = {
      ...attachment,
      filename: attachment.name,
    };

    const theTransactionType =
      transactionType === 'CASH_OUT' && paymentMethod === 'USSD'
        ? 'USSD_CASHOUT'
        : transactionType === 'NIP'
        ? 'TRANSFER'
        : transactionType;
    const payload = {
      amount: amount.replace('₦', ''),
      transactionDate: dateCreated,
      transactionRef: transactionRef,
      transactionType: theTransactionType,

      attachment: attachedDoc,
      transactionStatus: statusCode,
      description: comment,
      documentType: attachment?.type,
      beneficiaryAccountNo: beneficiaryAccountNumber ?? null,
      agentPhoneNo: mobileNo ?? null,
      rrn: rrn ?? null,
      maskedPan: maskedPan ?? null,
      beneficiaryPhoneNo: beneficiaryMobileNumber
        ? beneficiaryMobileNumber
        : customerMsisdn
        ? customerMsisdn
        : mobileNo,
      customerId: customerId ?? null,
      customerPhoneNo: customerMsisdn ?? null,
      terminalId: terminalId ?? null,
    };

    console.log(payload, 'payloader');
    try {
      const res = await crmService.submitComplaint(payload);
      const {status, response, code} = res;
      console.log(res, 'respo');
      if (response?.description === 'Please update your email.') {
        this.setState({loading: false});
        this.showErrorAlert(
          'Please kindly update your email to continue this operation',
        );
        return;
      }
      if (
        status === SUCCESS_STATUS &&
        response?.description === SUCCESSFUL_STATUS
      ) {
        this.setState({
          loading: false,
          showSuccessModal: true,
          form: '',
          attachment: '',
        });
        return;
      } else {
        flashMessage(
          null,
          'Oops! Something went wrong, please try again later.',
          BLOCKER,
        );
        this.setState({loading: false});

        return false;
      }
    } catch (err) {
      console.log(err, 'An error occured');

      this.setState({loading: false});
    }
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
              this.props.navigation.replace('IssueHistory');
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
              Request Submitted!
            </Text>
            <Text style={{textAlign: 'center', fontFamily: FONT_FAMILY_BODY}}>
              Your request has been submitted. Please check the issue history to
              track your request.
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

  responseCodeHandler(code) {
    if (code === HTTP_NOT_FOUND) {
      this.setState({
        loading: false,
      });
      flashMessage(
        null,
        "Oops! Sorry, the resource you're looking for could not be found.",
        BLOCKER,
      );
    } else if (code === HTTP_INTERNAL_SERVER_ERROR) {
      this.setState({
        loading: false,
      });
      flashMessage(
        null,
        'Oops! Something went wrong, please try again later.',
        BLOCKER,
      );
    } else if (code === 503) {
      this.setState({
        loading: false,
      });
      flashMessage(
        null,
        'Oops! Something went wrong, please try again later.',
        BLOCKER,
      );
    } else {
      this.setState({
        loading: false,
      });
      flashMessage(
        null,
        'Oops! Something went wrong, please try again later.',
        BLOCKER,
      );
    }
  }

  render() {
    const {
      invalidFileField,
      attachment,
      documentType,
      form,
      transaction,
      loading,
      loadingFile,
    } = this.state;
    const maxLength = 75;
    const commentLength = form?.comment?.length;
    const progressRatio = `${
      commentLength === undefined ? 0 : commentLength
    }/${maxLength}`;

    const getTransactionType = transaction => {
      console.log(transaction, 'gettings');
      switch (transaction.transactionType) {
        case 'TRANSFER':
        case 'NIP':
          return (
            <ComplaintFormForTransfer
              updateFormField={val => this.updateFormField(val)}
              propagateError={this.props.propagateFormErrors}
              progressRatio={progressRatio}
              transaction={transaction}
              commentRef={this.comment}
            />
          );

        case 'PAYPOINT_FUND':
          return (
            <ComplaintFormForFunding
              updateFormField={val => this.updateFormField(val)}
              propagateError={this.props.propagateFormErrors}
              progressRatio={progressRatio}
              transaction={transaction}
              commentRef={this.comment}
            />
          );
        case 'CASH_OUT':
          return (
            <ComplaintFormForCashout
              updateFormField={val => this.updateFormField(val)}
              propagateError={this.props.propagateFormErrors}
              progressRatio={progressRatio}
              transaction={transaction}
              commentRef={this.comment}
            />
          );
        case 'RECHARGE':
          return (
            <ComplaintFormForRecharge
              updateFormField={val => this.updateFormField(val)}
              propagateError={this.props.propagateFormErrors}
              progressRatio={progressRatio}
              transaction={transaction}
              commentRef={this.comment}
            />
          );
        case 'BILLS':
          return (
            <ComplaintFormForBills
              updateFormField={val => this.updateFormField(val)}
              propagateError={this.props.propagateFormErrors}
              progressRatio={progressRatio}
              transaction={transaction}
              commentRef={this.comment}
            />
          );
        default:
          return (
            <ComplaintNormalForm
              updateFormField={val => this.updateFormField(val)}
              propagateError={this.props.propagateFormErrors}
              progressRatio={progressRatio}
              transaction={transaction}
              commentRef={this.comment}
            />
          );
      }
    };

    return (
      <ScrollView
        style={{
          // backgroundColor: "#F3F3F4",
          flex: 1,
          paddingBottom: 10,
          backgroundColor: '#FFFFFF',
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
          title="Make a Complaint"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <View style={styles.mainInnerContainer}>
          {this.state.showSuccessModal && this.successModal}

          {getTransactionType(transaction)}

          <ComplaintFileUploader
            addFile={() => this.pickDocument()}
            attachment={attachment}
            onRemoveFile={() => this.onRemoveFile()}
            documentType={documentType}
            optional={true}
            required={invalidFileField}
            loadingFile={loadingFile}
          />
          <Button
            onPress={() => this.onSubmitComplaint()}
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
              marginBottom: 30,
              marginTop: 20,
            }}
            title="Submit"
            buttonStyle={{backgroundColor: COLOUR_BLUE}}
            loading={loading}
            disabled={!form.comment}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainInnerContainer: {
    marginHorizontal: 30,
    marginBottom: 30,
  },
  formInputOuterContainerStyle: {
    marginTop: 20,
  },
  formInputInnerContainerStyle: {
    marginTop: 0,
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(AddIssueScene);
