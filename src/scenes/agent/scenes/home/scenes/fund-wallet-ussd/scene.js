import moment from 'moment';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {stopwatch} from '../../../../../../../App';
import BaseForm from '../../../../../../components/base-form';
import Button from '../../../../../../components/button';
import {ConfirmationBottomSheetUssd} from '../../../../../../components/confirmation-ussd';
import Header from '../../../../../../components/header';
import {ReceiptBottomSheet} from '../../../../../../components/receipt';
import {
  APP_NAME,
  TRANSACTION_STATUS_LABELS,
  USER,
  WITHDRAW,
} from '../../../../../../constants';
import {ERROR_STATUS, HTTP_FORBIDDEN} from '../../../../../../constants/api';
import {USSD_FUNDING_PAYMENT_ITEM_CODE} from '../../../../../../constants/api-resources';
import {NGN} from '../../../../../../constants/currencies';
import {BLOCKER} from '../../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import amountField from '../../../../../../fragments/amount-field';
import UserManagement from '../../../../../../services/api/resources/user-management';
import {liquidityService} from '../../../../../../setup/api';
import {
  convertNgkToNgn,
  convertNgnToNgk,
} from '../../../../../../utils/converters/currencies';
import {getDeviceDetails} from '../../../../../../utils/device';
import {flashMessage} from '../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import {formatNgnAmount} from '../../../../../../utils/formatters';
import {generateChecksum} from '../../../../../../utils/helpers';
import {loadData} from '../../../../../../utils/storage';
import ServiceTypes from '../../../services//types';
import {USSDWithdrawalForm} from '../../../services/forms/ussd-withdrawal-form';

export default class FundWalletViaUssdScene extends BaseForm {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      form: {},
    };

    this.updateUssdFormField = this.updateUssdFormField.bind(this);
  }

  userManagement = new UserManagement();

  requiredFields = ['posModel'];

  async componentDidMount() {
    const {category, option, product, subCategory} =
      this.props.route?.params || {};

    this.serviceType = new ServiceTypes[category]({
      category,
      option,
      product,
      subCategory,
    });

    this.setState({
      deviceDetails: await getDeviceDetails(),
      product,
    });
  }

  onProceedFailure() {
    this.confirmationBottomSheet && this.confirmationBottomSheet.close();

    this.setState({
      payment: null,
      processed: false,
      isLoading: false,
    });
  }

  onProceedSuccess(response) {
    this.setState({
      receiptFields: this.getReceiptFields(response),
      errorMessage: null,
      isLoading: false,
    });
    this.confirmationBottomSheet && this.confirmationBottomSheet.close();
    this.receiptBottomSheet.open();
  }

  getReceiptFields(response) {
    return [
      {
        'Transaction Date': moment().format('DD/MM/YYYY h:mm a'),
        'Transaction Type': 'PAYPOINT_FUND',
        'Transaction Ref': this.state.payment.transactionRef,
        'Transaction Status': TRANSACTION_STATUS_LABELS[response.code],
        'Phone Number': this.state.form.phone,
        'Bank Name': this.state.form.bankName,
        Amount: formatNgnAmount(convertNgkToNgn(this.state.payment.amount)),
        Fee: formatNgnAmount(convertNgkToNgn(this.state.payment.fee)),
      },
    ];
  }

  cancelConfirmation() {
    this.confirmationBottomSheet.close();
  }

  onCancelConfirmation() {
    this.confirmationBottomSheet.close();
  }

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return false;
    }

    return true;
  }

  onInitiateSuccess(payment) {
    this.setState({
      isLoading: false,
      payment,
      form: this.state.form,
    });

    this.showConfirmationTab(payment);
  }

  async initiateUssdCashOutPayment() {
    /*const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    };*/

    const checkForm = Object.keys(this.state.form);
    if (!checkForm.includes('amount') || !checkForm.includes('bankCode')) {
      flashMessage(
        'Error',
        'Invalid input. Kindly fill all the required fields',
        BLOCKER,
      );
      return;
    }

    const currentUser = JSON.parse(await loadData(USER));
    const {deviceUuid} = await getDeviceDetails();

    const formData = this.state.form;

    const customerPhoneNo = formData.phone;
    const amount = convertNgnToNgk(formData.amount);
    const bankCode = formData.bankCode;
    const username = currentUser.username;
    const httpMethod = 'POST';
    stopwatch.start();

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const initiateUssdCashOutResponse =
      await liquidityService.initializeUssdFund(
        amount,
        bankCode,
        generateChecksum(
          `${username}${httpMethod}${amount}${httpMethod}${deviceUuid}`,
        ),
        customerPhoneNo,
        deviceUuid,
        USSD_FUNDING_PAYMENT_ITEM_CODE,
      );
    stopwatch.stop();

    const initiateUssdCashOutResponseStatus =
      initiateUssdCashOutResponse.status;
    const initiateUssdCashOutResponseObj = initiateUssdCashOutResponse.response;

    if (initiateUssdCashOutResponseStatus === ERROR_STATUS) {
      const handledError = await handleErrorResponse(
        initiateUssdCashOutResponseObj,
      );

      this.setState({
        errorMessage: handledError,
        isLoading: false,
      });

      flashMessage(APP_NAME, handledError, BLOCKER);

      return;
    }

    this.onInitiateSuccess(initiateUssdCashOutResponseObj);

    logEvent(TRANSACTION_INITIATE_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_INITIATE_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });
  }

  async proceed() {
    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const {deviceUuid} = await getDeviceDetails();

    const requestPayload = this.state.payment;

    this.proceedResponseObj = await liquidityService.proceedUssdFund(
      {
        ...requestPayload,
        pin: requestPayload.pin,
      },
      deviceUuid,
    );
    console.log({proceedResponseObj: this.proceedResponseObj});

    if (
      this.proceedResponseObj.code === HTTP_FORBIDDEN ||
      this.proceedResponseObj.status === ERROR_STATUS
    ) {
      this.onProceedFailure();
    } else {
      this.onProceedSuccess(this.proceedResponseObj.response);
    }

    return;
  }

  getConfirmationFields(data) {
    const amount = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.amount)),
    );

    fee = amountField(NGN, JSON.stringify(convertNgkToNgn(data.fee)));
    return {
      amount,
      fee: fee,
      ussdCode: data.ussdCode,
    };
  }

  showConfirmationTab(payment) {
    this.setState({
      confirmationFields: this.getConfirmationFields(payment),
    });

    setTimeout(() => this.confirmationBottomSheet.open(), 100);
  }

  showReceipt() {
    this.setState({
      receiptFields: this.getReceiptFields(),
    });

    this.confirmationBottomSheet.close();
    this.receiptBottomSheet.open();
  }

  onCloseBottomSheet() {
    console.log('ON CLOSE BOTTOM SHEET');

    this.setState({
      bottomSheet: null,
      payment: null,
      processed: false,
      selectedSubOption: null,
    });
    // return;
  }

  onCancelConfirmation() {
    this.confirmationBottomSheet.close();
  }

  cancelReceipt() {
    this.receiptBottomSheet.close();
  }

  updateUssdFormField(params) {
    const newForm = {
      ...this.state.form,
      ...params,
    };

    this.setState({
      form: newForm,
    });
  }

  render() {
    const {category, option, product, subCategory} =
      this.props.route?.params || {};

    const {subOptionData, subOptions} = this.props;

    console.log({subCategory, subOptionData, subOptions});

    this.category = category;
    this.option = option;
    this.product = product;
    this.subCategory = subCategory;

    if (this.option) {
      form = form[this.option];
    }

    return (
      <ScrollView>
        <View
          style={{
            backgroundColor: COLOUR_WHITE,
            flex: 1,
          }}>
          <Header
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
            }}
            navigationIconColor={COLOUR_WHITE}
            leftComponent={
              <Icon
                color={COLOUR_RED}
                underlayColor="transparent"
                name="chevron-left"
                size={40}
                type="material"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            hideNavigationMenu={this.props.hideNavigator}
            showNavigationMenu={this.props.showNavigator}
            statusBarProps={{
              backgroundColor: 'transparent',
              barStyle: CONTENT_LIGHT,
            }}
            title="Fund Via USSD"
            titleStyle={{
              color: COLOUR_WHITE,
              fontWeight: 'bold',
            }}
            rightComponent
          />

          <View
            style={{
              padding: 30,
            }}>
            <View>
              <React.Fragment>
                <ConfirmationBottomSheetUssd
                  category="withdraw"
                  form={this.state.form}
                  isLoading={this.state.isLoading}
                  onClose={() => this.onCloseBottomSheet()}
                  requestClose={() => this.cancelConfirmation()}
                  onHome={this.cancelConfirmation}
                  onSubmit={() => this.proceed()}
                  // payment={payment}
                  // processed={processed}
                  // product={product}
                  serviceType={this.serviceType}
                  sheetRef={sheet => (this.confirmationBottomSheet = sheet)}
                  subCategory="Via USSD"
                  fields={this.state.confirmationFields}
                />

                <ReceiptBottomSheet
                  icon={product?.imageUrl}
                  paymentDetailsTitle={null}
                  iconPath={this.state.iconPath}
                  fields={this.state.receiptFields}
                  onClose={() => this.onCloseBottomSheet()}
                  requestClose={() => this.cancelReceipt()}
                  onHome={() => {
                    // this.props.navigation.reset(
                    //   [NavigationActions.navigate({ routeName: "Agent" })],
                    //   0
                    // );
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{name: 'Agent'}],
                    });
                  }}
                  sheetRef={sheet => (this.receiptBottomSheet = sheet)}
                  showAnimation={true}
                  subMessage={
                    'Here is your receipt.\nSee account details below.'
                  }
                />

                <USSDWithdrawalForm
                  form={this.state.form}
                  updateFormField={this.updateUssdFormField}
                />
              </React.Fragment>
              <View
                style={{
                  elevation: 5,
                  padding: 20,
                }}>
                <Button
                  loading={this.state.isLoading || this.props.isLoading}
                  title="PROCEED"
                  onPressOut={() => {
                    this.initiateUssdCashOutPayment();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
