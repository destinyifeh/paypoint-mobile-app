import React from 'react';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import CryptoJS from 'crypto-js';
import IswMobileSdk, {
  Environment,
  IswPaymentInfo,
  IswSdkConfig,
} from 'react-native-isw-mobile-sdk';

import {liquidityService} from '../../../../../../../App';
import Button from '../../../../../../components/button';
import H1 from '../../../../../../components/h1';
import Header from '../../../../../../components/header';
import Hyperlink from '../../../../../../components/hyperlink';
import {
  CONTACT_US_EMAIL,
  PENDING_FUND_WALLET_MESSAGE,
  SUCCESSFUL_FUND_WALLET_MESSAGE,
  USER,
} from '../../../../../../constants';
import {
  IN_APP_FUNDING_DROP_OFF,
  IN_APP_FUNDING_INITIATE_CLICK,
  IN_APP_FUNDING_INITIATE_FAILURE,
  IN_APP_FUNDING_INITIATE_SUCCESS,
  IN_APP_FUNDING_PROCEED_CLICK,
  IN_APP_FUNDING_PROCEED_FAILURE,
  IN_APP_FUNDING_PROCEED_SUCCESS,
} from '../../../../../../constants/analytics';
import {ERROR_STATUS} from '../../../../../../constants/api';
import {ENVIRONMENT_IS_TEST} from '../../../../../../constants/api-resources';
import {BLOCKER} from '../../../../../../constants/dialog-priorities';
import {COLOUR_WHITE} from '../../../../../../constants/styles';
import {logEvent} from '../../../../../../core/logger';
import {setIsFastRefreshPending} from '../../../../../../services/redux/actions/tunnel';
import Base64 from '../../../../../../utils/base-64';
import {getDeviceDetails} from '../../../../../../utils/device';
import {flashMessage} from '../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import {generateChecksum} from '../../../../../../utils/helpers';
import {loadData} from '../../../../../../utils/storage';
import {AmountForm} from './form';
import styles from './styles';

class FundWalletInAppScene extends React.Component {
  didUserCancel = false;
  state = {
    isLoading: false,
    user: {},
  };

  constructor() {
    super();

    this.decodeMerchantSecret = this.decodeMerchantSecret.bind(this);
    this.onSubmitAmountFormButtonPress =
      this.onSubmitAmountFormButtonPress.bind(this);
    this.onWebPayCancel = this.onWebPayCancel.bind(this);
    this.onWebPaySuccess = this.onWebPaySuccess.bind(this);
  }

  componentDidMount() {
    loadData(USER).then(data => {
      const user = JSON.parse(data);
      this.setState({
        user,
      });
    });

    getDeviceDetails().then(data =>
      this.setState({
        ...data,
      }),
    );
  }

  _generateChecksum() {
    const {deviceUuid, user} = this.state;
    const httpMethod = 'POST';

    return generateChecksum(
      `${user.username}${httpMethod}${this.amount}${httpMethod}${deviceUuid}`,
    );
  }

  async onSubmitAmountFormButtonPress() {
    const {deviceUuid} = this.state;

    const formData = this.amountForm.state.form;
    const formIsComplete = this.amountForm.state.isComplete;
    const formIsValid = this.amountForm.state.isValid;

    console.log({formData});

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateAmountFormErrors: true,
      });

      // return
    }

    this.amount = formData.amount * 100;
    this.checksum = this._generateChecksum();

    this.setState({
      isLoading: true,
    });

    logEvent(IN_APP_FUNDING_INITIATE_CLICK);

    const {response, status} = await liquidityService.initializeWebPay(
      this.amount,
      this.checksum,
      deviceUuid,
    );

    console.log({response, status});

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      logEvent(IN_APP_FUNDING_INITIATE_FAILURE);

      flashMessage(null, await handleErrorResponse(response), BLOCKER);

      return;
    }

    logEvent(IN_APP_FUNDING_INITIATE_SUCCESS);

    console.log(response.data);

    this.setState({
      ...response.data,
    });

    this.payableAmount = parseInt(response.data.amount);

    this.triggerPayment(this.payableAmount);
  }

  async onWebPayCancel() {
    this.didUserCancel = true;
    logEvent(IN_APP_FUNDING_DROP_OFF);
  }

  async onWebPaySuccess(webpayResponse) {
    console.log({webpayResponse});

    logEvent(IN_APP_FUNDING_PROCEED_CLICK);

    const {
      amount,
      currencyCode,
      deviceUuid,
      fee,
      merchantId,
      merchantCode,
      merchantCustomerName,
      paymentItemCode,
      responseCode,
      transactionRef,
      user,
    } = this.state;
    const narration = '';

    this.setState({
      isLoading: true,
    });

    const {response, status} = await liquidityService.proceedWebPay(
      {
        amount,
        currencyCode,
        customerMsisdn: user.mobileNo,
        fee,
        merchantId,
        merchantCode,
        merchantCustomerName,
        narration,
        paymentItemCode,
        responseCode,
        transactionRef,
      },
      deviceUuid,
    );

    console.log({response, status});

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      this.props.navigation.goBack();
      flashMessage(
        'Transaction in Progress',
        PENDING_FUND_WALLET_MESSAGE,
        BLOCKER,
      );

      logEvent(IN_APP_FUNDING_PROCEED_FAILURE);

      return;
    }

    logEvent(IN_APP_FUNDING_PROCEED_SUCCESS);

    setTimeout(() => this.props.setIsFastRefreshPending(true), 200);

    flashMessage('Success', SUCCESSFUL_FUND_WALLET_MESSAGE, BLOCKER);

    setTimeout(() => this.props.navigation.goBack(), 1800);
  }

  decodeMerchantSecret(merchantSecret) {
    const key = this.checksum.slice(0, 16);

    var base64EncodedKeyFromJava = Base64.btoa(key);
    var keyForCryptoJS = CryptoJS.enc.Base64.parse(base64EncodedKeyFromJava);
    var encryptString = merchantSecret;
    var decodeBase64 = CryptoJS.enc.Base64.parse(encryptString);
    var decryptedData = CryptoJS.AES.decrypt(
      {
        ciphertext: decodeBase64,
      },
      keyForCryptoJS,
      {
        mode: CryptoJS.mode.ECB,
      },
    );
    var decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }

  triggerPayment(amount) {
    const {
      currencyCode,
      merchantCode,
      merchantId,
      merchantSecret,
      merchantCustomerName,
      transactionRef,
      user,
    } = this.state;

    const decodedMerchantSecret = this.decodeMerchantSecret(merchantSecret);

    const config = new IswSdkConfig(
      merchantId,
      decodedMerchantSecret,
      merchantCode,
      currencyCode,
    );

    const onSdkInitialized = isSuccessful => {
      console.log(`WebPay SDK Init Status: ${isSuccessful}`);
    };

    const env = ENVIRONMENT_IS_TEST ? Environment.TEST : Environment.PRODUCTION;
    IswMobileSdk.initialize(config, env, onSdkInitialized);

    console.log('Paying', amount);

    const customerId = user.username,
      customerName = merchantCustomerName,
      customerEmail = user.email || CONTACT_US_EMAIL,
      customerMobile = user.mobileNo,
      reference = transactionRef;

    // create payment information object
    const paymentInfo = new IswPaymentInfo(
      customerId,
      customerName,
      customerEmail,
      customerMobile,
      reference,
      amount,
    );

    const userDidComplete = result => {
      this.onWebPaySuccess();
    };

    const userDidCancel = result => {
      this.onWebPayCancel();
    };

    IswMobileSdk.pay(paymentInfo, userDidComplete, userDidCancel);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height: 70, marginBottom: 25}}>
          <Header
            hideNavigationMenu={this.props.hideNavigator}
            navigationIconColor={COLOUR_WHITE}
            showNavigationMenu={this.props.showNavigator}
            statusBarProps={{
              backgroundColor: 'transparent',
            }}
            paypointLogo
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}>
          <H1
            style={{
              marginBottom: 30,
              marginTop: 40,
              textAlign: 'center',
            }}>
            How much would you like to fund?
          </H1>
          <AmountForm
            isDisabled={this.state.isLoading}
            propagateFormErrors={this.state.propagateAmountFormErrors}
            ref={form => (this.amountForm = form)}
          />
          <Hyperlink href="Agent">Back to Home</Hyperlink>
        </ScrollView>

        <Button
          containerStyle={styles.continueButton}
          loading={this.state.isLoading}
          onPress={this.onSubmitAmountFormButtonPress}
          title="CONTINUE"
        />
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
  };
}

export default connect(null, mapDispatchToProps)(FundWalletInAppScene);
