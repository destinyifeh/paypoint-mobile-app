import numeral from "numeral";

import { APP_NAME, TRANSACTION_CURRENCY, USER } from "../../../../../constants";
import {
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
} from "../../../../../constants/analytics";
import {
  DEFAULT_API_ERROR_MESSAGE,
  ERROR_STATUS,
  HTTP_FORBIDDEN,
  INSUFFICIENT_FUND,
  SUCCESS_STATUS,
} from "../../../../../constants/api";
import {
  DEFAULT_MESSAGE_FOR_PENDING_TRANSACTIONS,
  QUICKTELLER_CHANNEL,
} from "../../../../../constants/api-resources";
import { BLOCKER, CASUAL } from "../../../../../constants/dialog-priorities";
import { logEvent } from "../../../../../core/logger";
import { setPropagateFormErrors } from "../../../../../services/redux/actions/forms";
import {
  setInitiateResponse,
  setProceedResponse,
  setSelectedSubOption,
  setSubOptionData,
  setSubOptions,
  setSubOptionsName,
} from "../../../../../services/redux/actions/transactions";
import {
  setIsFastRefreshPending,
  updateLoading,
} from "../../../../../services/redux/actions/tunnel";
import store from "../../../../../services/redux/store";
import { getDeviceDetails } from "../../../../../utils/device";
import { flashMessage } from "../../../../../utils/dialog";
import handleErrorResponse from "../../../../../utils/error-handlers/api";
import { loadData } from "../../../../../utils/storage";
import { Stopwatch } from "../../../../../utils/time";

const SUB_OPTIONS_FIELDS = [
  {
    fieldName: "customerId",
    path: "billsPaymentRequest.subAccounts",
    name: "Sub Account",
    value: "accNo",
    display: "accountName",
  },
];

export default class BaseTransactionType {
  constructor(props) {
    Object.assign(this, props);

    this.setData();
  }

  addItemToCart() {
    throw new Error("addItemToCart is not defined");
  }

  get codename() {
    throw new Error("codename is not defined");
  }

  get colours() {
    throw new Error("colours are not defined");
  }

  get confirmationTabMessage() {
    return null;
  }

  get friendlyName() {
    throw new Error("friendlyName is not defined");
  }

  get proceedButtonTitle() {
    return "PROCEED";
  }

  get showOnDashboard() {
    return true;
  }

  resetFormField() {
    this.form.resetFormField();
  }

  get showOnServicesList() {
    return true;
  }

  async setData() {
    this.channel = QUICKTELLER_CHANNEL;
    this.stopwatch = new Stopwatch();
    this.user = JSON.parse(await loadData(USER));
    this.deviceDetails = await getDeviceDetails();
  }

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    const result = formIsComplete && formIsValid;
    if (result !== true) {
      store.dispatch(setPropagateFormErrors(true));
      store.dispatch(updateLoading({ isLoading: false }));
    }

    return result;
  }

  get analyticsEvents() {
    throw new Error("analytics events is not defined");
  }

  get codename() {
    throw new Error("codename is not defined");
  }

  get customerIdField() {
    return;
  }

  get name() {
    throw new Error("name is not defined");
  }

  get transactionStateFromReduxStore() {
    return store.getState().transactions;
  }

  getSubOptionsFromPaymentObject(payment) {
    let subOptions = null;
    let subOptionsName = null;
    let subOptionData = null;

    SUB_OPTIONS_FIELDS.forEach((value) => {
      const { path, name } = value;
      const pathSplitted = path.split(".");

      let thisRes = payment;
      pathSplitted.forEach((subField) => {
        if (thisRes) {
          thisRes = thisRes[subField];
        }
      });

      if (Boolean(thisRes) && Boolean(thisRes.length)) {
        subOptions = thisRes;
        subOptionsName = name;
        subOptionData = value;
      }
    });

    return [subOptions, subOptionsName, subOptionData];
  }

  removeItemFromCart() {
    throw new Error("removeItemFromCart is not defined");
  }

  renderForm() {
    throw new Error("renderForm is not defined");
  }

  async onInitiateFailure() {
    const initiateResponseBody = this.initiateResponseObj.response;

    const handledError = await handleErrorResponse(initiateResponseBody, {
      customerId: this.formData.customerId,
      customerIdField: this.customerIdField,
    });

    flashMessage(APP_NAME, handledError, BLOCKER);

    logEvent(TRANSACTION_INITIATE_FAILURE, {
      secondsElapsed: this.stopwatch.secondsElapsed,
      transactionType: this.codename,
      errorCode: this.initiateResponseObj.code,
      errorSource: this.initiateResponseObj.errorSource,
    });

    logEvent(this.analyticsEvents.initiateFailure, {
      secondsElapsed: this.stopwatch.secondsElapsed,
      errorCode: this.initiateResponseObj.code,
      errorSource: this.initiateResponseObj.errorSource,
    });

    if (this.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_TRANSACTION_INITIATE_FAILURE, {
        secondsElapsed: this.stopwatch.secondsElapsed,
        transactionType: this.codename,
        errorCode: this.initiateResponseObj.code,
        errorSource: this.initiateResponseObj.errorSource,
      });
      logEvent(this.analyticsEvents.initiateFailurePos, {
        secondsElapsed: this.stopwatch.secondsElapsed,
        transactionType: this.codename,
        errorCode: this.initiateResponseObj.code,
        errorSource: this.initiateResponseObj.errorSource,
      });
    }
  }

  onInitiateSuccess() {
    const [
      subOptions,
      subOptionsName,
      subOptionData,
    ] = this.getSubOptionsFromPaymentObject(this.initiateResponseObj.response);

    console.log({
      subOptions,
      subOptionsName,
      subOptionData,
    });

    if (subOptions) {
      store.dispatch(setSubOptionData(subOptionData));
      store.dispatch(setSubOptions(subOptions));
      store.dispatch(setSubOptionsName(subOptionsName));
    }

    logEvent(TRANSACTION_INITIATE_SUCCESS, {
      transactionType: this.codename,
      secondsElapsed: this.stopwatch.secondsElapsed,
    });

    logEvent(this.analyticsEvents.initiateSuccess, {
      secondsElapsed: this.stopwatch.secondsElapsed,
    });

    if (this.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_TRANSACTION_INITIATE_SUCCESS, {
        transactionType: this.codename,
        secondsElapsed: this.stopwatch.secondsElapsed,
      });
      logEvent(this.analyticsEvents.initiateSuccessPos, {
        secondsElapsed: this.stopwatch.secondsElapsed,
      });
    }
  }

  async onProceedFailure() {
    const proceedResponseBody = this.proceedResponseObj.response;
    const errorMessage = await handleErrorResponse(proceedResponseBody, {
      customerId: this.formData.customerId,
      customerIdField: this.customerIdField,
    });

    if (errorMessage === DEFAULT_API_ERROR_MESSAGE) {
      flashMessage(null, DEFAULT_MESSAGE_FOR_PENDING_TRANSACTIONS, CASUAL);
    } else {
      flashMessage(APP_NAME, errorMessage, BLOCKER);
    }

    logEvent(TRANSACTION_PROCEED_FAILURE, {
      transactionType: this.codename,
      secondsElapsed: this.stopwatch.secondsElapsed,
      errorCode: this.proceedResponseObj.code,
      errorSource: this.proceedResponseObj.errorSource,
    });

    logEvent(this.analyticsEvents.proceedFailure, {
      secondsElapsed: this.stopwatch.secondsElapsed,
      errorCode: this.proceedResponseObj.code,
      errorSource: this.proceedResponseObj.errorSource,
    });

    if (this.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_TRANSACTION_PROCEED_FAILURE, {
        transactionType: this.codename,
        secondsElapsed: this.stopwatch.secondsElapsed,
        errorCode: this.proceedResponseObj.code,
        errorSource: this.proceedResponseObj.errorSource,
      });
      logEvent(this.analyticsEvents.proceedFailurePos, {
        secondsElapsed: this.stopwatch.secondsElapsed,
        errorCode: this.proceedResponseObj.code,
        errorSource: this.proceedResponseObj.errorSource,
      });
    }

    return;
  }

  onProceedSuccess() {
    logEvent(TRANSACTION_PROCEED_SUCCESS, {
      transactionType: this.codename,
      secondsElapsed: this.stopwatch.secondsElapsed,
    });

    logEvent(this.analyticsEvents.proceedSuccess, {
      secondsElapsed: this.stopwatch.secondsElapsed,
    });

    console.log({
      currency: TRANSACTION_CURRENCY,
      value: parseFloat(this.formData.amount),
    });

    logEvent(PURCHASE, {
      currency: TRANSACTION_CURRENCY,
      value: numeral(this.formData.amount).value(),
    });

    store.dispatch(setIsFastRefreshPending(true));

    if (this.deviceDetails.deviceIsPosTerminal) {
      logEvent(this.analyticsEvents.proceedSuccess, {
        secondsElapsed: this.stopwatch.secondsElapsed,
      });
      logEvent(POS_TRANSACTION_PROCEED_SUCCESS, {
        secondsElapsed: this.stopwatch.secondsElapsed,
        transactionType: this.codename,
      });
    }

    return;
  }

  onSelectSubOption(subOption) {
    const { subOptionData } = this.transactionStateFromReduxStore;

    store.dispatch(setSelectedSubOption(subOption));

    this.updateInitiateResponsePaymentRequestField(
      subOptionData.fieldName,
      subOption
    );

    this.updateInitiateResponsePaymentRequestField(
      "parentCustomerId",
      this.formData.customerId
    );

    return;
  }

  afterInitiate() {
    this.stopwatch.stop();

    const initiateResponseStatus = this.initiateResponseObj.status;

    if (initiateResponseStatus === SUCCESS_STATUS) {
      this.onInitiateSuccess();
      console.log("INITIATE RESPONSE", this.initiateResponseObj);
      store.dispatch(setInitiateResponse(this.initiateResponseObj));
    } else {
      this.onInitiateFailure();
    }

    store.dispatch(updateLoading({ isLoading: false }));
  }

  afterProceed() {
    console.log("INITIATE RESPONSE >>> ", this.initiateResponseObj);
    console.log("PROCEED RESPONSE >>> ", this.proceedResponseObj);

    this.stopwatch.stop();
    if (
      this.proceedResponseObj.code === HTTP_FORBIDDEN ||
      this.proceedResponseObj?.response?.code === INSUFFICIENT_FUND ||
      this.proceedResponseObj.status === ERROR_STATUS
    ) {
      this.onProceedFailure();
      store.dispatch(setInitiateResponse(null));
      store.dispatch(updateLoading({ isLoading: false }));
      return;
    } else {
      this.onProceedSuccess();
      console.log("SETTING PROCEED RESPONSE", this.proceedResponseObj);
      store.dispatch(setProceedResponse(this.proceedResponseObj));
    }

    store.dispatch(updateLoading({ isLoading: false }));
  }

  beforeInitiate() {
    store.dispatch(updateLoading({ isLoading: true }));
    store.dispatch(setInitiateResponse(null));

    logEvent(TRANSACTION_INITIATE_CLICK, {
      transactionType: this.codename,
    });
    logEvent(this.analyticsEvents.beforeInitiate);
    if (this.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_TRANSACTION_INITIATE_CLICK, {
        transactionType: this.codename,
      });
      logEvent(this.analyticsEvents.beforeInitiatePos);
    }

    this.stopwatch.start();
  }

  beforeProceed() {
    store.dispatch(updateLoading({ isLoading: true }));
    store.dispatch(setProceedResponse(null));

    logEvent(TRANSACTION_PROCEED_CLICK, {
      transactionType: this.codename,
    });
    logEvent(this.analyticsEvents.beforeProceed);
    if (this.deviceDetails.deviceIsPosTerminal) {
      logEvent(POS_TRANSACTION_PROCEED_CLICK, {
        transactionType: this.codename,
      });
      logEvent(this.analyticsEvents.beforeProceedPos);
    }

    this.stopwatch.start();
  }

  async initiate() {
    throw new Error("initiate is not defined");
  }

  async proceed() {
    throw new Error("proceed is not defined");
  }

  get usesCart() {
    return false;
  }

  updateInitiateResponsePaymentRequestField(fieldName, value) {
    // let requestField = {};
    // let paymentRequestFieldName = null;

    // REQUEST_FIELDS.forEach((item) => {
    //   if (obj[item]) {
    //     paymentRequestFieldName = item;
    //     requestField = obj[item];
    //   }
    // });

    // const result = {
    //   ...obj,
    //   [paymentRequestFieldName]: {
    //     ...requestField,
    //     [fieldName]: value,
    //   },
    // };

    this.initiateResponseObj = {
      ...this.initiateResponseObj,
      response: {
        ...this.initiateResponseObj.response,
        [this.requestFieldName]: {
          ...this.initiateResponseObj.response[this.requestFieldName],
          [fieldName]: value,
        },
      },
    };

    store.dispatch(setInitiateResponse(this.initiateResponseObj));
  }
}
