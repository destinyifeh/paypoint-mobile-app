import React from 'react';

import PropTypes from 'prop-types';
import {Dimensions, InteractionManager, ScrollView, View} from 'react-native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import {connect} from 'react-redux';

import numeral from 'numeral';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import {FeatureBanner} from '../../../../../../components/banner';
import Button from '../../../../../../components/button';
import CLI from '../../../../../../components/clickable-list-item';
import {ConfirmationBottomSheet} from '../../../../../../components/confirmation';
import Header from '../../../../../../components/header';
import {ReceiptBottomSheet} from '../../../../../../components/receipt';
import Text from '../../../../../../components/text';
import {
  APP_NAME,
  CASH_IN,
  TRANSACTION_CURRENCY,
  USER,
  WITHDRAW,
} from '../../../../../../constants';
import {
  CASH_IN_INITIATE_CLICK,
  CASH_IN_INITIATE_FAILURE,
  CASH_IN_INITIATE_SUCCESS,
  CASH_IN_PROCEED_CLICK,
  CASH_IN_PROCEED_FAILURE,
  CASH_IN_PROCEED_SUCCESS,
  POS_CASH_IN_INITIATE_CLICK,
  POS_CASH_IN_INITIATE_FAILURE,
  POS_CASH_IN_INITIATE_SUCCESS,
  POS_CASH_IN_PROCEED_CLICK,
  POS_CASH_IN_PROCEED_FAILURE,
  POS_CASH_IN_PROCEED_SUCCESS,
  POS_TRANSACTION_INITIATE_CLICK,
  POS_TRANSACTION_INITIATE_FAILURE,
  POS_TRANSACTION_INITIATE_SUCCESS,
  POS_TRANSACTION_PROCEED_CLICK,
  POS_TRANSACTION_PROCEED_FAILURE,
  POS_TRANSACTION_PROCEED_SUCCESS,
  PURCHASE,
  TRANSACTION_INITIATE_CLICK,
  TRANSACTION_INITIATE_FAILURE,
  TRANSACTION_INITIATE_SUCCESS,
  TRANSACTION_PROCEED_CLICK,
  TRANSACTION_PROCEED_FAILURE,
  TRANSACTION_PROCEED_SUCCESS,
  WITHDRAW_INITIATE_CLICK,
  WITHDRAW_INITIATE_FAILURE,
  WITHDRAW_INITIATE_SUCCESS,
  WITHDRAW_PROCEED_CLICK,
  WITHDRAW_PROCEED_FAILURE,
  WITHDRAW_PROCEED_SUCCESS,
} from '../../../../../../constants/analytics';
import {
  DEFAULT_API_ERROR_MESSAGE,
  ERROR_STATUS,
  HTTP_FORBIDDEN,
} from '../../../../../../constants/api';
import {
  DEFAULT_MESSAGE_FOR_PENDING_TRANSACTIONS,
  QUICKTELLER_API_TERMINAL_ID,
  USE_MOCK_FOR_WITHDRAW,
  WITHDRAW_PAYMENT_ITEM_CODE,
} from '../../../../../../constants/api-resources';
import {BLOCKER, CASUAL} from '../../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_PRIMARY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import {logEvent} from '../../../../../../core/logger';
import {TransactionReceiptSerializer as ReceiptSerializer} from '../../../../../../serializers/resources/receipt';
import {TransactionConfirmationSerializer} from '../../../../../../serializers/resources/transaction-confirmation';
import Transaction from '../../../../../../services/api/resources/transaction';
import {setPropagateFormErrors} from '../../../../../../services/redux/actions/forms';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../../services/redux/actions/navigation';
import {setIsFastRefreshPending} from '../../../../../../services/redux/actions/tunnel';
import {liquidityService} from '../../../../../../setup/api';
import {convertNgnToNgk} from '../../../../../../utils/converters/currencies';
import {getDeviceDetails} from '../../../../../../utils/device';
import {flashMessage} from '../../../../../../utils/dialog';
import {startFileDownload} from '../../../../../../utils/download-manager';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import {generateChecksum} from '../../../../../../utils/helpers';
import spn from '../../../../../../utils/sanitizers/phone-number';
import {loadData} from '../../../../../../utils/storage';
import {Stopwatch} from '../../../../../../utils/time';
import CartMenuBottomSheet from '../../components/cart-menu';
import ServiceTypes from '../../types';

const stopwatch = new Stopwatch();

const ClickableListItem = CLI;
const sanitizePhoneNumber = spn;

// TODO: Move these to a fixture
const MOCK_INITIATE_WITHDRAW_RESPONSE = {
  code: '20000',
  description: 'Successful',
  responseData: {
    customerId: '2348164355403',
    amount: '1000',
    checksum: '0c6600c2095f4a49a84a7004702f94b8',
    ussdCode: '*737*500*1092#',
    bankCode: 'FCMB',
    paymentItemCode: 'IFIS05',
    merchantCode: 'MX6072',
    merchantId: 'IKIA14F5B0EE0F00004D5A95FC1C56E7F8C12CEB22ED',
    fee: '0',
  },
};
const MOCK_PROCEED_WITHDRAW_RESPONSE = {
  code: '02',
  description:
    'Transaction is pending. Please, check transaction reports later.',
  amount: 200000,
  requestReference: '1321000000000001766',
  walletReference: '4AD4C8CA23ED4A5C9019B330756C2165',
};
const windowHeight = Dimensions.get('window').height;

const REQUEST_FIELDS = ['billsPaymentRequest', 'rechargeRequest', 'w2WRequest'];
const SUB_OPTIONS_FIELDS = [
  {
    path: 'billsPaymentRequest.subAccounts',
    name: 'Sub Account',
    value: 'accNo',
    display: 'accountName',
  },
];

function SubOptionsView({onDismiss, onSelect, subOptions, subOptionData}) {
  const {display, value} = subOptionData;

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text bold grey style={{marginBottom: 24}}>
        Select an option
      </Text>

      {subOptions.map((option, index) => (
        <ClickableListItem
          key={index}
          onPress={() => onSelect(option[value])}
          style={{
            borderColor: COLOUR_LIGHT_GREY,
            borderBottomWidth: 1,
            marginTop: 8,
            paddingBottom: 10,
          }}>
          <Text big black>
            {option[display]}
          </Text>
          <Text small>{option[value]}</Text>
          <Icon
            color={COLOUR_GREY}
            name="chevron-right"
            size={32}
            containerStyle={{
              position: 'absolute',
              top: 12,
              right: 0,
            }}
          />
        </ClickableListItem>
      ))}

      <Button onPress={onDismiss} transparent title="CANCEL" />
    </View>
  );
}

SubOptionsView.propTypes = {
  onDismiss: PropTypes.func,
  onSelect: PropTypes.func,
  subOptions: PropTypes.array,
  subOptionData: PropTypes.object,
};

class ProductPaymentScene extends React.Component {
  constructor() {
    super();

    this.transaction = new Transaction();
    this.receiptSerializer = new ReceiptSerializer();
    this.transactionConfirmationSerializer =
      new TransactionConfirmationSerializer();

    this.state = {
      confirmationFields: [],
      deviceDetails: {},
      form: {},
      meta: {},
      payment: null,
      processed: false,
      processPaymentResponse: {},
      propagateFormErrors: false,
      cart: [],
      disabledOptions: [],
      receiptFields: [],
      selectedSubOption: null,
      subOptions: null,
    };

    this.cancelConfirmation = this.cancelConfirmation.bind(this);
    this.cancelReceipt = this.cancelReceipt.bind(this);
    this.checkFormValidity = this.checkFormValidity.bind(this);
    this.onCancelConfirmation = this.onCancelConfirmation.bind(this);
    this.onCloseBottomSheet = this.onCloseBottomSheet.bind(this);
    this.onInitiateSuccess = this.onInitiateSuccess.bind(this);
    this.onProceedSuccess = this.onProceedSuccess.bind(this);
    this.onProceedFailure = this.onProceedFailure.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    this.showConfirmationTab = this.showConfirmationTab.bind(this);
    this.shouldShowSubOptions = this.shouldShowSubOptions.bind(this);
    this.showSubOptions = this.showSubOptions.bind(this);
  }

  componentWillUnmount() {
    this.props.setPropagateFormErrors(false);
  }

  async componentDidMount() {
    const {category, option, product, subCategory} =
      this.props.route?.params || {};

    this.serviceType = new ServiceTypes[category]({
      category,
      option,
      product,
      subCategory,
    });

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    if (product?.imageUrl) {
      const [, destinationPath] = await startFileDownload(product.imageUrl);
      this.setState({
        iconPath: destinationPath,
      });
    }

    this.setState({
      deviceDetails: await getDeviceDetails(),
      product,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.subOptions !== this.props.subOptions &&
      this.props.subOptions
    ) {
      if (this.props.selectedSubOption) {
        this.showConfirmationTab();
      } else {
        this.showSubOptions();
      }
    } else if (
      !this.props.subOptions &&
      prevProps.initiateResponse !== this.props.initiateResponse
    ) {
      if (this.props.initiateResponse) {
        this.showConfirmationTab();
      } else {
        this.confirmationBottomSheet?.close();
      }
    } else if (this.props.selectedSubOption !== prevProps.selectedSubOption) {
      this.showConfirmationTab();
    }

    if (prevProps.cart.length !== this.props.cart.length) {
      if (this.props.cart.length) {
        this.cartMenuSheet.open();
      } else {
        this.cartMenuSheet?.close();
      }
    }

    if (
      prevProps.proceedResponse !== this.props.proceedResponse &&
      this.props.proceedResponse
    ) {
      this.showReceipt();
    }
  }

  get headerTitle() {
    if (this.category === 'Airtime & Data') {
      return this.subCategory?.name || this.category;
    }

    if (this.product) {
      return this.product?.name;
    }

    if (this.subCategory) {
      return this.subCategory?.name;
    }

    return this.serviceType?.friendlyName;
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
    const [subOptions, subOptionsName, subOptionData] =
      this.getSubOptionsFromPaymentObject(payment);

    this.setState({
      isLoading: false,
      payment,
      form: this.form.state.form,
      meta: this.form.state,
      subOptionData,
      subOptions,
      subOptionsName,
    });

    if (this.shouldShowConfirmationTab()) {
      this.showConfirmationTab();
    } else if (this.shouldShowSubOptions()) {
      this.showSubOptions();
    }

    this.cartMenuSheet.close();
  }

  onProceedSuccess() {
    if (this.shouldShowReceipt()) {
      this.showReceipt();
    }
  }

  getSubOptionsFromPaymentObject(payment) {
    let subOptions = null;
    let subOptionsName = null;
    let subOptionData = null;

    SUB_OPTIONS_FIELDS.forEach(value => {
      const {path, name} = value;
      const pathSplitted = path.split('.');

      let thisRes = payment;
      pathSplitted.forEach(subField => {
        if (thisRes) {
          thisRes = thisRes[subField];
        }
      });

      if (Boolean(thisRes)) {
        subOptions = thisRes;
        subOptionsName = name;
        subOptionData = value;
      }
    });

    return [subOptions, subOptionsName, subOptionData];
  }

  onProceedFailure() {
    // this.bottomSheet && this.bottomSheet.close();
    this.confirmationBottomSheet && this.confirmationBottomSheet.close();

    this.setState({
      payment: null,
      processed: false,
    });
  }

  checkIfTransactionIsOutrightFailure() {
    return;
  }

  checkIfTransactionIsOutrightSuccess() {
    return;
  }

  async initiateCashInPayment() {
    logEvent(TRANSACTION_INITIATE_CLICK, {
      transactionType: CASH_IN,
    });

    logEvent(CASH_IN_INITIATE_CLICK);

    if (this.state.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_TRANSACTION_INITIATE_CLICK, {
        transactionType: CASH_IN,
      });
      logEvent(POS_CASH_IN_INITIATE_CLICK, {
        transactionType: CASH_IN,
      });
    }

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {deviceDetails} = this.state;
    const formData = this.form.state.form;

    const {customerIdField, name, paymentCode, serviceName} =
      this.form.state.selectedBillerOption;
    const amount = convertNgnToNgk(formData.amount);
    const currentUser = JSON.parse(await loadData(USER));
    const deviceId = deviceDetails.deviceUuid;
    const channel = '7';
    const httpMethod = 'POST';
    const username = currentUser.username;

    stopwatch.start();

    const initiateCashInResponse = await this.transaction.initiateCashInPayment(
      {
        amount: amount,
        paymentInstrumentType: 'CASH',
        channel,
        customerMsisdn: sanitizePhoneNumber(
          formData.phone,
          formData.countryShortCode,
        ),
        customerId: formData.customerId,
        gender: formData.gender,
        narration: `${serviceName} (${name})`,
        paymentItemCode: paymentCode,
        terminalId: QUICKTELLER_API_TERMINAL_ID,
      },
      generateChecksum(
        `${username}${httpMethod}${amount}${httpMethod}${paymentCode.trim()}` +
          `${httpMethod}${deviceId}`,
      ),
      deviceId,
    );

    stopwatch.stop();

    const initiateCashInResponseStatus = initiateCashInResponse.status;
    const initiateCashInPaymentResponseObj = initiateCashInResponse.response;

    if (initiateCashInResponseStatus === ERROR_STATUS) {
      const handledError = await handleErrorResponse(
        initiateCashInPaymentResponseObj,
        {
          customerIdField,
          customerId: formData.customerId,
        },
      );

      this.setState({
        errorMessage: handledError,
        isLoading: false,
      });

      flashMessage(APP_NAME, handledError, BLOCKER);

      logEvent(TRANSACTION_INITIATE_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        transactionType: CASH_IN,
        errorCode: initiateCashInResponse.code,
        errorSource: initiateCashInResponse.errorSource,
      });

      logEvent(CASH_IN_INITIATE_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: initiateCashInResponse.code,
        errorSource: initiateCashInResponse.errorSource,
      });

      if (this.state.deviceDetails.deviceIsPosTerminal) {
        logEvent(POS_TRANSACTION_INITIATE_FAILURE, {
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: initiateCashInResponse.code,
          errorSource: initiateCashInResponse.errorSource,
        });
        logEvent(POS_CASH_IN_INITIATE_FAILURE, {
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: initiateCashInResponse.code,
          errorSource: initiateCashInResponse.errorSource,
        });
      }

      return;
    }

    this.onInitiateSuccess(initiateCashInPaymentResponseObj);

    this.setState({
      errorMessage: null,
      isLoading: false,
      payment: initiateCashInPaymentResponseObj,
    });

    logEvent(TRANSACTION_INITIATE_SUCCESS, {
      transactionType: CASH_IN,
      secondsElapsed: stopwatch.secondsElapsed,
    });

    logEvent(CASH_IN_INITIATE_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });

    if (this.state.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_TRANSACTION_INITIATE_SUCCESS, {
        transactionType: CASH_IN,
        secondsElapsed: stopwatch.secondsElapsed,
      });
      logEvent(POS_CASH_IN_INITIATE_SUCCESS, {
        secondsElapsed: stopwatch.secondsElapsed,
      });
    }
  }

  async initiatePaycodeCashOutPayment() {
    logEvent(TRANSACTION_INITIATE_CLICK, {
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_INITIATE_CLICK, {
      subCategory: this.subCategory?.name,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const currentUser = JSON.parse(await loadData(USER));
    const {deviceUuid} = await getDeviceDetails();

    const formData = this.form.state.form;
    this.formData = formData;

    const amount = convertNgnToNgk(formData.amount);
    const paycode = formData.paycode;
    const customerName = formData.customerName;
    const subscriberId = formData.subscriberId;
    const customerPhoneNo = formData.customerPhoneNo;
    const customerEmail = formData.customerEmail;
    const customerGender = formData.gender;
    const username = currentUser.username;
    const [customerFirstName, customerLastName] = customerName.split(' ');
    const httpMethod = 'POST';

    stopwatch.start();

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const initiateCashOutResponse =
      await liquidityService.initiatePaycodeCashOut(
        amount,
        paycode,
        sanitizePhoneNumber(subscriberId),
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhoneNo,
        customerGender,
        generateChecksum(
          `${username}${httpMethod}${amount}${httpMethod}${deviceUuid}`,
        ),
        deviceUuid,
      );

    stopwatch.stop();

    const initiateCashOutResponseStatus = initiateCashOutResponse.status;
    const initiateCashOutResponseObj = initiateCashOutResponse.response;

    if (initiateCashOutResponseStatus === ERROR_STATUS) {
      const handledError = await handleErrorResponse(
        initiateCashOutResponseObj,
      );

      this.setState({
        errorMessage: handledError,
        isLoading: false,
      });

      logEvent(TRANSACTION_INITIATE_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        transactionType: WITHDRAW,
        errorCode: initiateCashOutResponse.code,
        errorSource: initiateCashOutResponse.errorSource,
      });

      logEvent(WITHDRAW_INITIATE_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: initiateCashOutResponse.code,
        errorSource: initiateCashOutResponse.errorSource,
      });

      flashMessage(APP_NAME, handledError, BLOCKER);

      return;
    }

    this.onInitiateSuccess(initiateCashOutResponseObj);

    logEvent(TRANSACTION_INITIATE_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_INITIATE_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });
  }

  async initiateUssdCashOutPayment() {
    logEvent(TRANSACTION_INITIATE_CLICK, {
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_INITIATE_CLICK);

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const currentUser = JSON.parse(await loadData(USER));
    const {deviceUuid} = await getDeviceDetails();

    const formData = this.form.state.form;

    const amount = convertNgnToNgk(formData.amount);
    const bankCode = formData.bankCode;
    const phone = formData.phone;
    const username = currentUser.username;
    const paymentItemCode = WITHDRAW_PAYMENT_ITEM_CODE;
    const httpMethod = 'POST';

    stopwatch.start();

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const initiateCashOutResponse = await liquidityService.initiateUssdCashOut(
      amount,
      bankCode,
      generateChecksum(
        `${username}${httpMethod}${amount}${httpMethod}${deviceUuid}`,
      ),
      phone,
      deviceUuid,
      paymentItemCode,
    );

    stopwatch.stop();

    const initiateCashOutResponseStatus = initiateCashOutResponse.status;
    const initiateCashOutResponseObj = initiateCashOutResponse.response;

    if (initiateCashOutResponseStatus === ERROR_STATUS) {
      const handledError = await handleErrorResponse(
        initiateCashOutResponseObj,
      );

      this.setState({
        errorMessage: handledError,
        isLoading: false,
      });

      logEvent(TRANSACTION_INITIATE_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        transactionType: WITHDRAW,
        errorCode: initiateCashOutResponse.code,
        errorSource: initiateCashOutResponse.errorSource,
      });

      logEvent(WITHDRAW_INITIATE_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: initiateCashOutResponse.code,
        errorSource: initiateCashOutResponse.errorSource,
      });

      if (USE_MOCK_FOR_WITHDRAW) {
        this.setState({
          errorMessage: null,
          isLoading: false,
          payment: MOCK_INITIATE_WITHDRAW_RESPONSE,
        });

        this.onInitiateSuccess(MOCK_INITIATE_WITHDRAW_RESPONSE);

        return;
      }

      flashMessage(APP_NAME, handledError, BLOCKER);

      return;
    }

    this.onInitiateSuccess(initiateCashOutResponseObj);

    logEvent(TRANSACTION_INITIATE_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_INITIATE_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });
  }

  async processCashInPayment() {
    logEvent(TRANSACTION_PROCEED_CLICK, {
      transactionType: CASH_IN,
    });

    logEvent(CASH_IN_PROCEED_CLICK);

    if (this.state.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_TRANSACTION_PROCEED_CLICK, {
        transactionType: CASH_IN,
      });

      logEvent(POS_CASH_IN_PROCEED_CLICK);
    }

    this.setState({
      isLoading: true,
    });

    const {
      deviceDetails: {deviceUuid},
    } = this.state;
    const {payment} = this.state;

    stopwatch.start();
    const processBillPaymentResponse =
      await this.transaction.processCashInPayment(payment, deviceUuid);
    stopwatch.stop();

    const processBillPaymentResponseStatus = processBillPaymentResponse.status;
    const processBillPaymentResponseObj = processBillPaymentResponse.response;
    const processBillPaymentResponseCode = processBillPaymentResponse.code;

    if (processBillPaymentResponseCode === HTTP_FORBIDDEN) {
      this.setState({
        isLoading: false,
        processed: true,
        processPaymentResponse: {},
      });

      flashMessage(
        null,
        await handleErrorResponse(processBillPaymentResponseObj),
        CASUAL,
      );

      logEvent(TRANSACTION_PROCEED_FAILURE, {
        transactionType: CASH_IN,
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      logEvent(CASH_IN_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      this.onProceedFailure();

      if (this.state.deviceDetails.deviceIsPosTerminal) {
        logEvent(POS_TRANSACTION_PROCEED_FAILURE, {
          transactionType: CASH_IN,
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });

        logEvent(POS_CASH_IN_PROCEED_FAILURE, {
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });
      }

      return;
    } else if (processBillPaymentResponseStatus === ERROR_STATUS) {
      const errorMessage = await handleErrorResponse(
        processBillPaymentResponseObj,
      );

      if (errorMessage === DEFAULT_API_ERROR_MESSAGE) {
        this.setState({
          isLoading: false,
          processed: true,
          processPaymentResponse: {},
        });

        flashMessage(null, DEFAULT_MESSAGE_FOR_PENDING_TRANSACTIONS, CASUAL);

        logEvent(TRANSACTION_PROCEED_FAILURE, {
          transactionType: CASH_IN,
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });

        logEvent(CASH_IN_PROCEED_FAILURE, {
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });

        if (this.state.deviceDetails.deviceIsPosTerminal) {
          logEvent(POS_TRANSACTION_PROCEED_FAILURE, {
            transactionType: CASH_IN,
            secondsElapsed: stopwatch.secondsElapsed,
            errorCode: processBillPaymentResponse.code,
            errorSource: processBillPaymentResponse.errorSource,
          });

          logEvent(POS_CASH_IN_PROCEED_FAILURE, {
            secondsElapsed: stopwatch.secondsElapsed,
            errorCode: processBillPaymentResponse.code,
            errorSource: processBillPaymentResponse.errorSource,
          });
        }

        this.onProceedFailure();

        return;
      }

      logEvent(TRANSACTION_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        transactionType: CASH_IN,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      logEvent(CASH_IN_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      if (this.state.deviceDetails.deviceIsPosTerminal) {
        logEvent(POS_CASH_IN_PROCEED_FAILURE, {
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });
        logEvent(POS_TRANSACTION_PROCEED_FAILURE, {
          secondsElapsed: stopwatch.secondsElapsed,
          transactionType: CASH_IN,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });
      }

      this.onProceedFailure();

      this.setState({
        isLoading: false,
        // add this to show pending receipt even for unknown errors
        // processed: true,
        // processPaymentResponse: {}
      });

      flashMessage(null, errorMessage, BLOCKER);

      return;
    }

    logEvent(TRANSACTION_PROCEED_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
      transactionType: CASH_IN,
    });

    logEvent(CASH_IN_PROCEED_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });

    logEvent(PURCHASE, {
      currency: TRANSACTION_CURRENCY,
      value: numeral(this.state.form.amount).value(),
    });

    this.onProceedSuccess();

    this.props.setIsFastRefreshPending(true);

    this.setState({
      isLoading: false,
      processed: true,
      processPaymentResponse: processBillPaymentResponseObj,
    });

    if (this.state.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_CASH_IN_PROCEED_SUCCESS, {
        secondsElapsed: stopwatch.secondsElapsed,
      });
      logEvent(POS_TRANSACTION_PROCEED_SUCCESS, {
        secondsElapsed: stopwatch.secondsElapsed,
        transactionType: CASH_IN,
      });
    }
    this.onProceedSuccess();

    return;
  }

  async processPaycodeCashOutPayment() {
    logEvent(TRANSACTION_PROCEED_CLICK, {
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_PROCEED_CLICK, {
      subCategory: this.subCategory?.name,
    });

    this.setState({
      isLoading: true,
    });

    const {deviceUuid} = await getDeviceDetails();
    const {payment} = this.state;

    stopwatch.start();
    const processBillPaymentResponse =
      await liquidityService.processUssdCashOut(
        {
          ...payment,
          pin: this.formData.pin,
        },
        deviceUuid,
      );
    stopwatch.stop();

    const processBillPaymentResponseStatus = processBillPaymentResponse.status;
    const processBillPaymentResponseObj = processBillPaymentResponse.response;
    const processBillPaymentResponseCode = processBillPaymentResponse.code;

    if (processBillPaymentResponseCode === HTTP_FORBIDDEN) {
      this.setState({
        isLoading: false,
        processed: true,
        processPaymentResponse: {},
      });

      flashMessage(
        null,
        await handleErrorResponse(processBillPaymentResponseObj),
        CASUAL,
      );

      logEvent(TRANSACTION_PROCEED_FAILURE, {
        transactionType: WITHDRAW,
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      logEvent(WITHDRAW_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      this.onProceedFailure();

      return;
    } else if (processBillPaymentResponseStatus === ERROR_STATUS) {
      const errorMessage = await handleErrorResponse(
        processBillPaymentResponseObj,
      );

      if (errorMessage === DEFAULT_API_ERROR_MESSAGE) {
        this.setState({
          isLoading: false,
          processed: true,
          processPaymentResponse: {},
        });

        flashMessage(null, DEFAULT_MESSAGE_FOR_PENDING_TRANSACTIONS, CASUAL);

        logEvent(TRANSACTION_PROCEED_FAILURE, {
          transactionType: WITHDRAW,
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });

        logEvent(WITHDRAW_PROCEED_FAILURE, {
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });

        this.onProceedFailure();

        return;
      }

      logEvent(TRANSACTION_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        transactionType: WITHDRAW,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      logEvent(WITHDRAW_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      this.onProceedFailure();

      this.setState({
        isLoading: false,
        // add this to show pending receipt even for unknown errors
        // processed: true,
        // processPaymentResponse: {}
      });

      flashMessage(null, errorMessage, BLOCKER);

      return;
    }

    logEvent(TRANSACTION_PROCEED_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_PROCEED_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });

    logEvent(PURCHASE, {
      currency: TRANSACTION_CURRENCY,
      value: numeral(this.state.form.amount).value(),
    });

    this.setState({
      isLoading: false,
      processed: true,
      processPaymentResponse: processBillPaymentResponseObj,
    });

    this.props.setIsFastRefreshPending(true);

    this.onProceedSuccess();

    return;
  }

  async processUssdCashOutPayment() {
    logEvent(TRANSACTION_PROCEED_CLICK, {
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_PROCEED_CLICK);

    this.setState({
      isLoading: true,
    });

    const {deviceUuid} = await getDeviceDetails();
    const {payment} = this.state;

    stopwatch.start();
    const processFunction = {
      nip: () => this.transaction.processNipTransfer(payment, deviceUuid),
      quickteller: () => this.transaction.processTransfer(payment, deviceUuid),
    };
    const processBillPaymentResponse = await processFunction[this.option]();
    stopwatch.stop();

    const processBillPaymentResponseStatus = processBillPaymentResponse.status;
    const processBillPaymentResponseObj = processBillPaymentResponse.response;
    const processBillPaymentResponseCode = processBillPaymentResponse.code;

    if (processBillPaymentResponseCode === HTTP_FORBIDDEN) {
      if (USE_MOCK_FOR_WITHDRAW) {
        this.props.setIsFastRefreshPending(true);

        this.setState({
          isLoading: false,
          processed: true,
          processPaymentResponse: MOCK_PROCEED_WITHDRAW_RESPONSE,
        });

        return;
      }

      this.setState({
        isLoading: false,
        processed: true,
        processPaymentResponse: {},
      });

      flashMessage(
        null,
        await handleErrorResponse(processBillPaymentResponseObj),
        CASUAL,
      );

      logEvent(TRANSACTION_PROCEED_FAILURE, {
        transactionType: WITHDRAW,
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      logEvent(WITHDRAW_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      this.onProceedFailure();

      return;
    } else if (processBillPaymentResponseStatus === ERROR_STATUS) {
      if (USE_MOCK_FOR_WITHDRAW) {
        this.props.setIsFastRefreshPending(true);

        this.setState({
          isLoading: false,
          processed: true,
          processPaymentResponse: MOCK_PROCEED_WITHDRAW_RESPONSE,
        });

        return;
      }

      const errorMessage = await handleErrorResponse(
        processBillPaymentResponseObj,
      );

      if (errorMessage === DEFAULT_API_ERROR_MESSAGE) {
        this.setState({
          isLoading: false,
          processed: true,
          processPaymentResponse: {},
        });

        flashMessage(null, DEFAULT_MESSAGE_FOR_PENDING_TRANSACTIONS, CASUAL);

        logEvent(TRANSACTION_PROCEED_FAILURE, {
          transactionType: WITHDRAW,
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });

        logEvent(WITHDRAW_PROCEED_FAILURE, {
          secondsElapsed: stopwatch.secondsElapsed,
          errorCode: processBillPaymentResponse.code,
          errorSource: processBillPaymentResponse.errorSource,
        });

        this.onProceedFailure();

        return;
      }

      logEvent(TRANSACTION_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        transactionType: WITHDRAW,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      logEvent(WITHDRAW_PROCEED_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: processBillPaymentResponse.code,
        errorSource: processBillPaymentResponse.errorSource,
      });

      this.onProceedFailure();

      this.setState({
        isLoading: false,
        // add this to show pending receipt even for unknown errors
        // processed: true,
        // processPaymentResponse: {}
      });

      flashMessage(null, errorMessage, BLOCKER);

      return;
    }

    logEvent(TRANSACTION_PROCEED_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
      transactionType: WITHDRAW,
    });

    logEvent(WITHDRAW_PROCEED_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });

    logEvent(PURCHASE, {
      currency: TRANSACTION_CURRENCY,
      value: numeral(this.state.form.amount).value(),
    });

    this.setState({
      isLoading: false,
      processed: true,
      processPaymentResponse: processBillPaymentResponseObj,
    });

    this.onProceedSuccess();

    this.props.setIsFastRefreshPending(true);

    return;
  }

  cancelConfirmation() {
    this.confirmationBottomSheet.close();
  }

  cancelReceipt() {
    this.serviceType.resetFormField();
    this.receiptBottomSheet.close();
  }

  onCancelConfirmation() {
    this.confirmationBottomSheet.close();
  }

  onCloseBottomSheet() {
    this.setState({
      bottomSheet: null,
      payment: null,
      processed: false,
      selectedSubOption: null,
    });
    // return;
  }

  shouldShowConfirmationTab() {
    return (
      Boolean(this.state.payment) &&
      !Boolean(this.state.processed) &&
      !this.shouldShowSubOptions()
    );
  }

  showConfirmationTab() {
    this.bottomSheet.close();
    this.cartMenuSheet.close();

    this.setState({
      confirmationFields: this.serviceType.getConfirmationFields(),
    });

    setTimeout(() => this.confirmationBottomSheet.open(), 100);
  }

  showForm() {
    return !Boolean(this.state.payment);
  }

  shouldShowReceipt() {
    return Boolean(this.state.processed);
  }

  showReceipt() {
    this.setState({
      receiptFields: this.serviceType.getReceiptFields(),
    });

    this.confirmationBottomSheet.close();
    this.receiptBottomSheet.open();
  }

  shouldShowSubOptions() {
    return (
      Boolean(this.props.subOptions) && !Boolean(this.props.selectedSubOption)
    );
  }

  showSubOptions() {
    this.bottomSheet.open();
  }

  updatePaymentRequestField(payment, fieldName, value) {
    let requestField = {};
    let paymentRequestFieldName = null;

    REQUEST_FIELDS.forEach(item => {
      if (payment[item]) {
        paymentRequestFieldName = item;
        requestField = payment[item];
      }
    });

    const result = {
      ...payment,
      [paymentRequestFieldName]: {
        ...requestField,
        [fieldName]: value,
      },
    };

    return result;
  }

  render_() {
    const {category, option, product, subCategory} =
      this.props.route?.params || {};

    return <View />;
  }

  render() {
    if (!this.state.animationsDone) {
      return <ActivityIndicator />;
    }

    const {category, option, product, subCategory, defaultFormValues} =
      this.props.route?.params || {};

    const {isLoading, meta, payment, processed} = this.state;
    const {subOptionData, subOptions} = this.props;

    this.category = category;
    this.option = option;
    this.product = product;
    this.subCategory = subCategory;

    const subOptionsView = subOptions ? (
      <SubOptionsView
        subOptionData={subOptionData}
        subOptions={subOptions}
        onDismiss={this.onCancelConfirmation}
        onSelect={accountNo => {
          this.serviceType.onSelectSubOption(accountNo);
        }}
      />
    ) : (
      <React.Fragment />
    );

    if (this.option) {
      form = form[this.option];
    }

    return (
      <View style={{flex: 1}}>
        {Boolean(Object.entries(this.state.confirmationFields).length) && (
          <ConfirmationBottomSheet
            category={category}
            form={this.state.form}
            isLoading={isLoading}
            meta={meta}
            onClose={this.onCloseBottomSheet}
            requestClose={this.cancelConfirmation}
            onHome={this.cancelConfirmation}
            onSubmit={() => this.serviceType.proceed()}
            payment={payment}
            processed={processed}
            product={product}
            serviceType={this.serviceType}
            sheetRef={sheet => (this.confirmationBottomSheet = sheet)}
            subCategory={subCategory}
            fields={this.state.confirmationFields}
          />
        )}

        <ReceiptBottomSheet
          icon={product?.imageUrl}
          iconPath={this.state.iconPath}
          fields={this.state.receiptFields}
          onClose={() => {
            this.onCloseBottomSheet();
          }}
          requestClose={this.cancelReceipt}
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
        />

        <RBSheet
          animationType="fade"
          closeOnPressBack={false}
          closeOnPressMask={false}
          closeOnDragDown={true}
          dragFromTopOnly={true}
          duration={250}
          height={windowHeight * 0.8}
          // onClose={this.onCloseBottomSheet}
          ref={sheet => (this.bottomSheet = sheet)}>
          {this.shouldShowSubOptions() && subOptionsView}
        </RBSheet>

        <CartMenuBottomSheet
          isLoading={this.props.isLoading}
          onAddAnotherItem={() => {
            this.serviceType.form.clear();
            this.cartMenuSheet.close();
          }}
          onSubmit={() => this.serviceType.initiate()}
          onOpen={() =>
            console.log('OPENING CART MENU SHEET:', this.serviceType)
          }
          onRemoveItem={title => this.serviceType.removeItemFromCart(title)}
          onClose={() => this.cartMenuSheet.close()}
          ref_={sheet => (this.cartMenuSheet = sheet)}
        />

        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
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
          title={this.headerTitle}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <View
          style={{
            //backgroundColor: "#F3F3F4",
            backgroundColor: COLOUR_WHITE,
            flex: 1,
          }}>
          <ScrollView contentContainerStyle={{marginBottom: 40}}>
            <View style={{backgroundColor: COLOUR_WHITE, padding: 20}}>
              {Boolean(this.subCategory?.guide) && (
                <FeatureBanner
                  guide={this.subCategory.guide}
                  style={{marginBottom: 20}}
                  uid={`${category}-${this.subCategory?.name}-feature-banner`}
                />
              )}
              {this.serviceType.renderForm({
                defaultFormValues,
                navigation: this.props.navigation,
                product,
                propagateFormErrors: this.state.propagateFormErrors,
                subCategory,
              })}
            </View>
          </ScrollView>
        </View>

        {/* {!this.showForm() && this.bottomSheet.open()} */}

        <View
          style={{
            elevation: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
          }}>
          <Button
            loading={this.state.isLoading || this.props.isLoading}
            containerStyle={{
              width: this.shouldShowConfirmationTab()
                ? '60%'
                : this.state.cart.length > 0
                ? '45%'
                : '100%',
            }}
            title={
              this.state.payment
                ? this.state.processed
                  ? 'OK'
                  : 'PROCEED'
                : this.serviceType.usesCart
                ? 'ADD'
                : 'CONTINUE'
            }
            // (this.subCategory?.name === 'Distribute' ? 'ADD' : 'CONTINUE')}
            // onPressOut={this.onSubmit}
            onPressOut={() => {
              this.serviceType.usesCart
                ? this.serviceType.addItemToCart()
                : this.serviceType.initiate();
            }}
          />

          {this.state.cart.length > 0 && (
            <Button
              loading={this.state.isLoading}
              containerStyle={{width: '55%'}}
              title={`CONTINUE (${this.state.cart.length})`}
              titleStyle={{
                color: COLOUR_RED,
              }}
              transparent
              onPressOut={() => this.cartMenuSheet.open()}
            />
          )}

          {this.shouldShowConfirmationTab() && (
            <Button
              containerStyle={{width: '30%'}}
              loading={this.state.isLoading}
              onPressOut={this.onCancelConfirmation}
              title="CANCEL"
              titleStyle={{
                color: COLOUR_PRIMARY,
              }}
              transparent
            />
          )}
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    cart: state.transactions.cart,
    force_send_sell_data_as_bill_payment:
      state.tunnel.remoteConfig.force_send_sell_data_as_bill_payment,
    initiateResponse: state.transactions.initiateResponse,
    isLoading: state.tunnel.isLoading,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    proceedResponse: state.transactions.proceedResponse,
    selectedSubOption: state.transactions.selectedSubOption,
    show_status_animation_before_transaction_receipt:
      state.tunnel.remoteConfig
        .show_status_animation_before_transaction_receipt,
    subOptionsName: state.transactions.subOptionsName,
    subOptionData: state.transactions.subOptionData,
    subOptions: state.transactions.subOptions,
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setPropagateFormErrors: value => dispatch(setPropagateFormErrors(value)),
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    setSelectedSubOption: value => dispatch(setSelectedSubOption(value)),
    showNavigator: () => dispatch(showNavigator()),
  };
}

ProductPaymentScene.propTypes = {
  cart: PropTypes.array,
  force_send_sell_data_as_bill_payment: PropTypes.bool,
  initiateResponse: PropTypes.object,
  isLoading: PropTypes.bool,
  hideNavigator: PropTypes.func,
  navigation: PropTypes.object,
  proceedResponse: PropTypes.object,
  selectedSubOption: PropTypes.any,
  setIsFastRefreshPending: PropTypes.func,
  setPropagateFormErrors: PropTypes.func,
  showNavigator: PropTypes.func,
  subOptions: PropTypes.array,
  subOptionData: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductPaymentScene);
