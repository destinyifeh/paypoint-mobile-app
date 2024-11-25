import React from "react";

import {
  CASHIN,
  FUND_TRANSFER_UNIFIED,
  SEND_MONEY,
  TRANSFER,
} from "../../../../../constants";
import {
  POS_TRANSFER_TO_ACCOUNT_INITIATE_CLICK,
  POS_TRANSFER_TO_ACCOUNT_INITIATE_FAILURE,
  POS_TRANSFER_TO_ACCOUNT_INITIATE_SUCCESS,
  POS_TRANSFER_TO_ACCOUNT_PROCEED_CLICK,
  POS_TRANSFER_TO_ACCOUNT_PROCEED_FAILURE,
  POS_TRANSFER_TO_ACCOUNT_PROCEED_SUCCESS,
  POS_TRANSFER_TO_AGENT_INITIATE_CLICK,
  POS_TRANSFER_TO_AGENT_INITIATE_FAILURE,
  POS_TRANSFER_TO_AGENT_INITIATE_SUCCESS,
  POS_TRANSFER_TO_AGENT_PROCEED_CLICK,
  POS_TRANSFER_TO_AGENT_PROCEED_FAILURE,
  POS_TRANSFER_TO_AGENT_PROCEED_SUCCESS,
  TRANSFER_TO_ACCOUNT_INITIATE_CLICK,
  TRANSFER_TO_ACCOUNT_INITIATE_FAILURE,
  TRANSFER_TO_ACCOUNT_INITIATE_SUCCESS,
  TRANSFER_TO_ACCOUNT_PROCEED_CLICK,
  TRANSFER_TO_ACCOUNT_PROCEED_FAILURE,
  TRANSFER_TO_ACCOUNT_PROCEED_SUCCESS,
  TRANSFER_TO_AGENT_INITIATE_CLICK,
  TRANSFER_TO_AGENT_INITIATE_FAILURE,
  TRANSFER_TO_AGENT_INITIATE_SUCCESS,
  TRANSFER_TO_AGENT_PROCEED_CLICK,
  TRANSFER_TO_AGENT_PROCEED_FAILURE,
  TRANSFER_TO_AGENT_PROCEED_SUCCESS,
} from "../../../../../constants/analytics";
import {
  CASHIN_PAYMENT_ITEM_CODE,
  DISTRIBUTE_PAYMENT_ITEM_CODE,
  QUICKTELLER_API_TERMINAL_ID,
  QUICKTELLER_CHANNEL,
  TRANSFER_TO_ACCOUNT_NIP_PAYMENT_ITEM_CODE,
  TRANSFER_TO_AGENT_PAYMENT_ITEM_CODE,
} from "../../../../../constants/api-resources";
import { NGN } from "../../../../../constants/currencies";
import Services from "../../../../../fixtures/services";
import amountField from "../../../../../fragments/amount-field";
import { TransactionReceiptSerializer } from "../../../../../serializers/resources/receipt";
import { TransactionConfirmationSerializer } from "../../../../../serializers/resources/transaction-confirmation";
import {
  replaceCart,
  replaceDisabledPrimaryChoices,
} from "../../../../../services/redux/actions/transactions";
import store from "../../../../../services/redux/store";
import {
  liquidityService,
  nipService,
  transactionService,
} from "../../../../../setup/api";
import { convertNgnToNgk } from "../../../../../utils/converters/currencies";
import { generateChecksum, generateMac } from "../../../../../utils/helpers";
import sanitizePhoneNumber from "../../../../../utils/sanitizers/phone-number";
import { parseBeneficiaryName } from "../../../../../utils/sanitizers/transaction";
import PayBillForm from "../forms/pay-bill-form";
import {
  DistributeForm,
  NipTransferToAccountForm,
  TransferToAccountForm,
  TransferToAgentForm,
} from "../forms/send-money-form";
import BaseTransactionType from "./base";

const receiptSerializer = new TransactionReceiptSerializer();
const transactionConfirmationSerializer = new TransactionConfirmationSerializer();

class Distribute extends BaseTransactionType {
  constructor() {
    super();

    this.disabledOptions = [];
  }

  addItemToCart() {
    console.log("ADD DISTRIBUTE RECIPIENT");

    const {
      cart,
      disabledPrimaryChoices,
    } = this.transactionStateFromReduxStore;

    console.log({ cart, disabledPrimaryChoices });

    const isFormValid = this.checkFormValidity();
    console.log({ isFormValid });

    if (!isFormValid) {
      return;
    }

    const formState = this.form.state;
    this.formData = formState.form;

    const agentPhoneNumber = this.user.businessMobileNo;
    const amount = convertNgnToNgk(this.formData.amount);
    const beneficiaryPhone = `${sanitizePhoneNumber(
      this.formData.beneficiaryPhone,
      formState.countryShortCode
    )}`;
    const channel = "7";
    const gender = this.formData.gender;
    const paymentItemCode = DISTRIBUTE_PAYMENT_ITEM_CODE;
    const terminalId = QUICKTELLER_API_TERMINAL_ID;
    const terminalType = "WEB";
    const beneficiaryAccountNo = this.formData.beneficiaryAccountNo;
    const beneficiaryAgentCode = this.formData.beneficiaryAgentCode;
    const beneficiaryEmail = this.formData.beneficiaryEmail;
    const beneficiaryFirstName = this.formData.beneficiaryFirstName;
    const beneficiaryLastName = this.formData.beneficiaryLastName;
    const beneficiaryName = this.formData.beneficiaryName;

    store.dispatch(
      replaceCart([
        ...cart.filter((item) => item.beneficiaryPhone !== beneficiaryPhone), // remove previous record of beneficiary
        {
          amount,
          beneficiaryAccountNo,
          beneficiaryAgentCode,
          beneficiaryEmail,
          beneficiaryFirstName,
          beneficiaryLastName,
          beneficiaryName,
          beneficiaryPhone,
          channel,
          gender,
          paymentItemCode,
          terminalType,
          terminalId,
          customerMsisdn: agentPhoneNumber,
          paymentInstrumentType: "CASH",
          narration: "Distribute Transaction",
          title: beneficiaryName,
          description: beneficiaryPhone,
          uid: beneficiaryPhone,
        },
      ])
    );

    store.dispatch(
      replaceDisabledPrimaryChoices([
        ...disabledPrimaryChoices,
        beneficiaryPhone,
      ])
    );

    // console.log('OPENING CART SHEET');
    // this.cartMenuSheet.open();
  }

  get analyticsEvents() {
    return {
      beforeInitiate: TRANSFER_TO_AGENT_INITIATE_CLICK,
      beforeInitiatePos: POS_TRANSFER_TO_AGENT_INITIATE_CLICK,
      beforeProceed: TRANSFER_TO_AGENT_PROCEED_CLICK,
      beforeProceedPos: POS_TRANSFER_TO_AGENT_PROCEED_CLICK,
      initiateFailure: TRANSFER_TO_AGENT_INITIATE_FAILURE,
      initiateFailurePos: POS_TRANSFER_TO_AGENT_INITIATE_FAILURE,
      initiateSuccess: TRANSFER_TO_AGENT_INITIATE_SUCCESS,
      initiateSuccessPos: POS_TRANSFER_TO_AGENT_INITIATE_SUCCESS,
      proceedFailure: TRANSFER_TO_AGENT_PROCEED_FAILURE,
      proceedFailurePos: POS_TRANSFER_TO_AGENT_PROCEED_FAILURE,
      proceedSuccess: TRANSFER_TO_AGENT_PROCEED_SUCCESS,
      proceedSuccessPos: POS_TRANSFER_TO_AGENT_PROCEED_SUCCESS,
    };
  }

  get customerIdField() {
    return "Phone Number";
  }

  get codename() {
    return TRANSFER;
  }

  get requestFieldName() {
    return "w2WRequest";
  }

  get proceedButtonTitle() {
    return `Distribute ${amountField(NGN, this.formData.amount)}`;
  }

  getConfirmationFields() {
    return transactionConfirmationSerializer.getConfirmationFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj?.response,
      product: this.product,
      selectedSubOption: this.selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName: this.subOptionsName,
    });
  }

  getReceiptFields() {
    const formData = [...this.form, this.form.bank];
    return receiptSerializer.getReceiptFields({
      category: this.codename,
      form: formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj.response,
      product: this.product,
      selectedSubOption: this.selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName: this.subOptionsName,
    });
  }

  resetFormField() {
    this.form.resetFormField();
  }

  async initiate() {
    const { cart } = this.transactionStateFromReduxStore;
    this.beforeInitiate();

    const isFormValid = this.checkFormValidity();

    if (isFormValid !== true) {
      return;
    }

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;

    console.log({ deviceId });

    this.initiateResponseObj = await liquidityService.initiateDistribute(
      cart,
      deviceId
    );

    console.log({ initiateResponseObj: this.initiateResponseObj });

    this.afterInitiate();
  }

  async proceed() {
    this.beforeProceed();

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const requestPayload = this.initiateResponseObj.response[
      this.requestFieldName
    ];
    requestPayload.transactionReference = this.initiateResponseObj.response.transactionReference;

    this.proceedResponseObj = await liquidityService.processDistribute(
      requestPayload,
      deviceId
    );
    this.proceedResponseObj = JSON.parse(this.proceedResponseObj);
    console.log({ proceedResponseObj: this.proceedResponseObj });

    this.afterProceed();
    return;
  }

  removeItemFromCart(title) {
    const {
      cart,
      disabledPrimaryChoices,
    } = this.transactionStateFromReduxStore;

    const cartItem = cart.find((item) => item.title === title);

    const newDisabledPrimaryChoices = disabledPrimaryChoices.filter(
      (item) => item !== cartItem.beneficiaryPhone
    );

    const newCart = cart.filter((item) => item.title !== title);

    store.dispatch(replaceCart(newCart));

    store.dispatch(replaceDisabledPrimaryChoices(newDisabledPrimaryChoices));

    // this.cart.length === 0 && setTimeout(
    //     () => this.cartMenuSheet.close(),
    //     1000,
    // );
  }

  renderForm(props) {
    return <DistributeForm {...props} ref={(form) => (this.form = form)} />;
  }

  get usesCart() {
    return true;
  }
}

class InterswitchTransfer extends BaseTransactionType {
  get analyticsEvents() {
    return {
      beforeInitiate: TRANSFER_TO_ACCOUNT_INITIATE_CLICK,
      beforeInitiatePos: POS_TRANSFER_TO_ACCOUNT_INITIATE_CLICK,
      beforeProceed: TRANSFER_TO_ACCOUNT_PROCEED_CLICK,
      beforeProceedPos: POS_TRANSFER_TO_ACCOUNT_PROCEED_CLICK,
      initiateFailure: TRANSFER_TO_ACCOUNT_INITIATE_FAILURE,
      initiateFailurePos: POS_TRANSFER_TO_ACCOUNT_INITIATE_FAILURE,
      initiateSuccess: TRANSFER_TO_ACCOUNT_INITIATE_SUCCESS,
      initiateSuccessPos: POS_TRANSFER_TO_ACCOUNT_INITIATE_SUCCESS,
      proceedFailure: TRANSFER_TO_ACCOUNT_PROCEED_FAILURE,
      proceedFailurePos: POS_TRANSFER_TO_ACCOUNT_PROCEED_FAILURE,
      proceedSuccess: TRANSFER_TO_ACCOUNT_PROCEED_SUCCESS,
      proceedSuccessPos: POS_TRANSFER_TO_ACCOUNT_PROCEED_SUCCESS,
    };
  }

  get customerIdField() {
    return "Phone Number";
  }

  get codename() {
    return FUND_TRANSFER_UNIFIED;
  }

  get proceedButtonTitle() {
    return `Send ${amountField(NGN, this.formData.amount)}`;
  }

  get requestFieldName() {
    return "unifiedTransferRequest";
  }

  getConfirmationFields() {
    return transactionConfirmationSerializer.getConfirmationFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj?.response,
      product: this.product,
      selectedSubOption: this.selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName: this.subOptionsName,
    });
  }

  getReceiptFields() {
    return receiptSerializer.getReceiptFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj.response,
      product: this.product,
      selectedSubOption: this.selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName: this.subOptionsName,
    });
  }

  async initiate() {
    this.beforeInitiate();

    const isFormValid = this.checkFormValidity();

    if (isFormValid !== true) {
      return;
    }
    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const { selectedBillerOption } = this.form.state;
    this.formData = this.form.state.form;

    console.log({
      deviceId,
      selectedBillerOption,
      formData: this.formData,
    });

    const accountNumber = this.formData.accountNumber;
    const accountType = this.formData.accountType;
    const amount = convertNgnToNgk(this.formData.amount);
    const bankCode = this.formData.bankCode;
    const bankName = this.formData.bankName;
    const shortBankName = this.formData.bank.shortBankName;
    const institutionCode = this.formData.bank.nipCode;
    const beneficiaryName = this.formData.beneficiaryName;
    const beneficiaryPhone = this.formData.beneficiaryPhone;
    const channel = "7";
    const httpMethod = "POST";
    const initiationCurrencyCode = "NGN";
    const initiationPaymentCode = "CA";
    const paymentCode = "FUT2023";
    const remark = this.formData.remark;
    const terminationAmount = amount;
    const terminationCountryCode = "NG";
    const terminationCurrencyCode = "NGN";
    const terminationPaymentMethod = "AC";
    const username = this.user.username;
    const terminalType = "MOBILE";

    const beneficiaryNameParsed = parseBeneficiaryName(beneficiaryName);
    try {
      this.initiateResponseObj = await transactionService.initiateTransaction(
        generateChecksum(
          `${username}${httpMethod}${amount}${httpMethod}${paymentCode}` +
            `${httpMethod}${deviceId}`
        ),
        this.codename,
        {
          accountNumber,
          accountType,
          amount,
          bankCode,
          bankName,
          shortBankName,
          institutionCode,
          terminalType,
          beneficiary: {
            firstName: beneficiaryNameParsed.firstName,
            lastName: beneficiaryNameParsed.lastName,
            otherNames: beneficiaryNameParsed.otherNames,
            mobileNumber: beneficiaryPhone
              ? sanitizePhoneNumber(
                  beneficiaryPhone,
                  this.formData.countryShortCode
                )
              : "",
          },
          channel,
          currencyCode: initiationCurrencyCode,
          remark,
          customerMsisdn: username,
          customerId: this.formData.customerId,
          gender: this.formData.gender,
          paymentItemCode: paymentCode,
          paymentInstrumentType: "CASH",
          terminalId: QUICKTELLER_API_TERMINAL_ID,
          mac: generateMac(
            `${amount}${initiationCurrencyCode}${initiationPaymentCode}` +
              `${terminationAmount}${terminationCurrencyCode}` +
              `${terminationPaymentMethod}${terminationCountryCode}`
          ),
        },
        this.requestFieldName,
        deviceId
      );
      console.log({ initiateResponseObj: this.initiateResponseObj });
    } catch (err) {
      console.log(err, "the error");
    }
    this.afterInitiate();
  }
  async proceed() {
    this.beforeProceed();

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;

    const requestPayload = this.initiateResponseObj.response;
    const username = this.user.username;
    requestPayload.customerMsisdn = username;

    this.proceedResponseObj = await transactionService.processTransaction(
      this.initiateResponseObj.response.transactionReference,
      requestPayload.transactionType,
      requestPayload,
      this.requestFieldName,
      deviceId
    );

    console.log({ proceedResponseObj: this.proceedResponseObj });

    this.afterProceed();
    return;
  }

  renderForm(props) {
    return (
      <TransferToAccountForm {...props} ref={(form) => (this.form = form)} />
    );
  }
}

class Cashin extends InterswitchTransfer {
  get codename() {
    return CASHIN;
  }

  async initiate() {
    this.beforeInitiate();

    const isFormValid = this.checkFormValidity();

    if (isFormValid !== true) {
      return;
    }

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    this.formData = this.form.state.form;

    const accountNumber = this.formData.accountNumber;
    const accountType = this.formData.accountType;
    const amount = convertNgnToNgk(this.formData.amount);
    const bankCode = this.formData.bankCode;
    const bankName = this.formData.bankName;
    const beneficiaryName = this.formData.beneficiaryName;
    const beneficiaryPhone = this.formData.beneficiaryPhone;
    const channel = "7";
    const httpMethod = "POST";
    const initiationCurrencyCode = 566;
    const initiationPaymentCode = "CA";
    const paymentCode = CASHIN_PAYMENT_ITEM_CODE;
    const remark = this.formData.remark;
    const terminationAmount = amount;
    const terminationCountryCode = "NG";
    const terminationCurrencyCode = 566;
    const terminationPaymentMethod = "AC";
    const username = this.user.username;

    const beneficiaryNameParsed = parseBeneficiaryName(beneficiaryName);

    this.initiateResponseObj = await transactionService.initiateTransaction(
      generateChecksum(
        `${username}${httpMethod}${amount}${httpMethod}${paymentCode}` +
          `${httpMethod}${deviceId}`
      ),
      this.codename,
      {
        accountNumber,
        accountType,
        amount,
        bankCode,
        bankName,
        beneficiary: {
          firstName: beneficiaryNameParsed.firstName,
          lastName: beneficiaryNameParsed.lastName,
          otherNames: beneficiaryNameParsed.otherNames,
          mobileNumber: sanitizePhoneNumber(
            beneficiaryPhone,
            this.formData.countryShortCode
          ),
        },
        channel,
        currencyCode: initiationCurrencyCode,
        remark,
        customerMsisdn: username,
        customerId: this.formData.customerId,
        gender: this.formData.gender,
        paymentItemCode: paymentCode,
        paymentInstrumentType: "CASH",
        terminalId: QUICKTELLER_API_TERMINAL_ID,
        mac: generateMac(
          `${amount}${initiationCurrencyCode}${initiationPaymentCode}` +
            `${terminationAmount}${terminationCurrencyCode}` +
            `${terminationPaymentMethod}${terminationCountryCode}`
        ),
      },
      this.requestFieldName,
      deviceId
    );
    console.log({ initiateResponseObj: this.initiateResponseObj });

    this.afterInitiate();
  }

  async proceed() {
    this.beforeProceed();

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const requestPayload = this.initiateResponseObj.response[
      this.requestFieldName
    ];
    const username = this.user.username;
    requestPayload.customerMsisdn = username;

    this.proceedResponseObj = await transactionService.processTransaction(
      this.initiateResponseObj.response.transactionReference,
      this.codename,
      requestPayload,
      this.requestFieldName,
      deviceId
    );
    console.log({ proceedResponseObj: this.proceedResponseObj });

    this.afterProceed();
    return;
  }
}

export class MMOTransfer extends BaseTransactionType {
  get analyticsEvents() {
    return {
      beforeInitiate: BILL_PAYMENT_INITIATE_CLICK,
      beforeInitiatePos: POS_BILL_PAYMENT_INITIATE_CLICK,
      beforeProceed: BILL_PAYMENT_PROCEED_CLICK,
      beforeProceedPos: POS_BILL_PAYMENT_PROCEED_CLICK,
      initiateFailure: BILL_PAYMENT_INITIATE_FAILURE,
      initiateFailurePos: POS_BILL_PAYMENT_INITIATE_FAILURE,
      initiateSuccess: BILL_PAYMENT_INITIATE_SUCCESS,
      initiateSuccessPos: POS_BILL_PAYMENT_INITIATE_SUCCESS,
      proceedFailure: BILL_PAYMENT_PROCEED_FAILURE,
      proceedFailurePos: POS_BILL_PAYMENT_PROCEED_FAILURE,
      proceedSuccess: BILL_PAYMENT_PROCEED_SUCCESS,
      proceedSuccessPos: POS_BILL_PAYMENT_PROCEED_SUCCESS,
    };
  }

  get customerIdField() {
    return "Customer ID";
  }

  get codename() {
    return mmoCodename;
  }

  get friendlyName() {
    return "MMOs";
  }

  get proceedButtonTitle() {
    return `Send ${amountField(NGN, this.formData.amount)}`;
  }

  get requestFieldName() {
    return "billsPaymentRequest";
  }

  getConfirmationFields() {
    const {
      selectedSubOption,
      subOptionsName,
    } = this.transactionStateFromReduxStore;

    return transactionConfirmationSerializer.getConfirmationFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj?.response,
      product: this.product,
      selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName,
    });
  }

  getReceiptFields() {
    const {
      selectedSubOption,
      subOptionsName,
    } = this.transactionStateFromReduxStore;

    return receiptSerializer.getReceiptFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj.response,
      product: this.product,
      selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName,
    });
  }

  async initiate() {
    this.beforeInitiate();

    const isFormValid = this.checkFormValidity();

    if (isFormValid !== true) {
      return;
    }

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const { selectedBillerOption } = this.form.state;
    this.formData = this.form.state.form;

    const { name, paymentCode, serviceName } = selectedBillerOption;
    const amount = convertNgnToNgk(this.formData.amount);
    const channel = QUICKTELLER_CHANNEL;
    const httpMethod = "POST";
    const username = this.user.username;

    this.initiateResponseObj = await transactionService.initiateTransaction(
      generateChecksum(
        `${username}${httpMethod}${amount}${httpMethod}${paymentCode.trim()}` +
          `${httpMethod}${deviceId}`
      ),
      this.codename,
      {
        amount,
        paymentInstrumentType: "CASH",
        channel,
        customerMsisdn: sanitizePhoneNumber(
          this.formData.phone,
          this.formData.countryShortCode
        ),
        customerId: this.formData.customerId,
        gender: this.formData.gender,
        narration: `${serviceName} (${name})`,
        paymentItemCode: paymentCode,
        terminalId: QUICKTELLER_API_TERMINAL_ID,
      },
      this.requestFieldName,
      deviceId
    );

    console.log({ initiateResponseObj: this.initiateResponseObj });

    this.afterInitiate();
  }

  async proceed() {
    this.beforeProceed();

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const requestPayload = this.initiateResponseObj.response[
      this.requestFieldName
    ];

    this.proceedResponseObj = await transactionService.processTransaction(
      requestPayload.transactionRef,
      this.codename,
      requestPayload,
      this.requestFieldName,
      deviceId
    );
    console.log({ proceedResponseObj: this.proceedResponseObj });

    this.afterProceed();
    return;
  }

  renderForm(props) {
    return <PayBillForm {...props} ref={(form) => (this.form = form)} />;
  }
}

class NIPTransfer extends BaseTransactionType {
  get analyticsEvents() {
    return {
      beforeInitiate: TRANSFER_TO_ACCOUNT_INITIATE_CLICK,
      beforeInitiatePos: POS_TRANSFER_TO_ACCOUNT_INITIATE_CLICK,
      beforeProceed: TRANSFER_TO_ACCOUNT_PROCEED_CLICK,
      beforeProceedPos: POS_TRANSFER_TO_ACCOUNT_PROCEED_CLICK,
      initiateFailure: TRANSFER_TO_ACCOUNT_INITIATE_FAILURE,
      initiateFailurePos: POS_TRANSFER_TO_ACCOUNT_INITIATE_FAILURE,
      initiateSuccess: TRANSFER_TO_ACCOUNT_INITIATE_SUCCESS,
      initiateSuccessPos: POS_TRANSFER_TO_ACCOUNT_INITIATE_SUCCESS,
      proceedFailure: TRANSFER_TO_ACCOUNT_PROCEED_FAILURE,
      proceedFailurePos: POS_TRANSFER_TO_ACCOUNT_PROCEED_FAILURE,
      proceedSuccess: TRANSFER_TO_ACCOUNT_PROCEED_SUCCESS,
      proceedSuccessPos: POS_TRANSFER_TO_ACCOUNT_PROCEED_SUCCESS,
    };
  }

  get customerIdField() {
    return "Phone Number";
  }

  get codename() {
    return "NIP";
  }

  get friendlyName() {
    return "Cash In";
  }

  get name() {
    return "Cash In";
  }

  get proceedButtonTitle() {
    return `Send ${amountField(NGN, this.formData.amount)}`;
  }

  get requestFieldName() {
    return "nipTransferRequest";
  }

  getConfirmationFields() {
    return transactionConfirmationSerializer.getConfirmationFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj?.response,
      product: this.product,
      selectedSubOption: this.selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName: this.subOptionsName,
    });
  }

  getReceiptFields() {
    return receiptSerializer.getReceiptFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj.response,
      product: this.product,
      selectedSubOption: this.selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName: this.subOptionsName,
    });
  }

  async initiate() {
    this.beforeInitiate();

    const isFormValid = this.checkFormValidity();
    console.log({ isFormValid });

    if (!isFormValid) {
      return;
    }

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const formData = this.form.state.form;
    this.formData = formData;

    const accountNumber = formData.accountNumber;
    const accountType = formData.accountType;
    const amount = convertNgnToNgk(formData.amount);
    const bankName = formData.bankName;
    const beneficiaryEmail = formData.beneficiaryEmail || " ";
    // const beneficiaryName = formData.beneficiaryName;
    const beneficiaryPhone = formData.beneficiaryPhone;
    const channel = QUICKTELLER_CHANNEL;
    const httpMethod = "POST";
    const initiationCurrencyCode = "NGN";
    const initiationPaymentCode = "CA";
    const institutionCode = formData.institutionCode;
    const paymentCode = TRANSFER_TO_ACCOUNT_NIP_PAYMENT_ITEM_CODE;
    const remark = formData.remark;
    const terminationAmount = amount;
    const terminationCountryCode = "NG";
    const terminationCurrencyCode = 566;
    const terminationPaymentMethod = "AC";
    const username = this.user.username;

    this.stopwatch.start();

    this.initiateResponseObj = await nipService.initiate(
      generateChecksum(
        `${username}${httpMethod}${amount}${httpMethod}` +
          `${paymentCode}${httpMethod}${deviceId}`
      ),
      this.codename,
      {
        accountNumber,
        accountType,
        amount,
        institutionCode,
        bankName,
        nipBeneficiary: {
          email: beneficiaryEmail,
          phoneNumber: sanitizePhoneNumber(
            beneficiaryPhone,
            formData.countryShortCode
          ),
        },
        channel,
        channelCode: channel,
        currencyCode: initiationCurrencyCode,
        narration: remark,
        customerMsisdn: username,
        customerId: formData.customerId,
        gender: formData.gender,
        paymentItemCode: paymentCode,
        paymentInstrumentType: "CASH",
        terminalId: QUICKTELLER_API_TERMINAL_ID,
        mac: generateMac(
          `${amount}${initiationCurrencyCode}${initiationPaymentCode}` +
            `${terminationAmount}${terminationCurrencyCode}` +
            `${terminationPaymentMethod}${terminationCountryCode}`
        ),
      },
      this.requestFieldName,
      deviceId
    );

    console.log({ initiateResponseObj: this.initiateResponseObj });

    this.afterInitiate();
  }

  async proceed() {
    this.beforeProceed();

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const requestPayload = this.initiateResponseObj.response[
      this.requestFieldName
    ];

    const username = this.user.username;
    requestPayload.customerMsisdn = username;

    this.proceedResponseObj = await nipService.proceed(
      this.initiateResponseObj.response.transactionReference,
      this.codename,
      requestPayload,
      this.requestFieldName,
      deviceId
    );
    console.log({ proceedResponseObj: this.proceedResponseObj });

    this.afterProceed();
    return;
  }

  renderForm(props) {
    return (
      <NipTransferToAccountForm {...props} ref={(form) => (this.form = form)} />
    );
  }
}

class TransferToAgent extends BaseTransactionType {
  get analyticsEvents() {
    return {
      beforeInitiate: TRANSFER_TO_AGENT_INITIATE_CLICK,
      beforeInitiatePos: POS_TRANSFER_TO_AGENT_INITIATE_CLICK,
      beforeProceed: TRANSFER_TO_AGENT_PROCEED_CLICK,
      beforeProceedPos: POS_TRANSFER_TO_AGENT_PROCEED_CLICK,
      initiateFailure: TRANSFER_TO_AGENT_INITIATE_FAILURE,
      initiateFailurePos: POS_TRANSFER_TO_AGENT_INITIATE_FAILURE,
      initiateSuccess: TRANSFER_TO_AGENT_INITIATE_SUCCESS,
      initiateSuccessPos: POS_TRANSFER_TO_AGENT_INITIATE_SUCCESS,
      proceedFailure: TRANSFER_TO_AGENT_PROCEED_FAILURE,
      proceedFailurePos: POS_TRANSFER_TO_AGENT_PROCEED_FAILURE,
      proceedSuccess: TRANSFER_TO_AGENT_PROCEED_SUCCESS,
      proceedSuccessPos: POS_TRANSFER_TO_AGENT_PROCEED_SUCCESS,
    };
  }

  get customerIdField() {
    return "Phone Number";
  }

  get codename() {
    return TRANSFER;
  }

  get proceedButtonTitle() {
    return `Send ${amountField(NGN, this.formData.amount)}`;
  }

  get requestFieldName() {
    return "w2WRequest";
  }

  getConfirmationFields() {
    return transactionConfirmationSerializer.getConfirmationFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj?.response,
      product: this.product,
      selectedSubOption: this.selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName: this.subOptionsName,
    });
  }

  getReceiptFields() {
    return receiptSerializer.getReceiptFields({
      category: this.codename,
      form: this.formData,
      meta: this.form.state,
      payment: this.initiateResponseObj.response,
      processPaymentResponse: this.proceedResponseObj.response,
      product: this.product,
      selectedSubOption: this.selectedSubOption,
      subCategory: this.subCategory,
      subOptionsName: this.subOptionsName,
    });
  }

  async initiate() {
    this.beforeInitiate();

    const isFormValid = this.checkFormValidity();

    if (isFormValid !== true) {
      return;
    }

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const { countryShortCode, selectedBillerOption } = this.form.state;
    this.formData = this.form.state.form;

    console.log({
      deviceId,
      selectedBillerOption,
      formData: this.formData,
    });

    const agentPhoneNumber = this.user.businessMobileNo;
    const amount = convertNgnToNgk(this.formData.amount);
    const beneficiaryPhone = `${sanitizePhoneNumber(
      this.formData.beneficiaryPhone,
      countryShortCode
    )}`;
    const channel = QUICKTELLER_CHANNEL;
    const gender = this.formData.gender;
    const httpMethod = "POST";
    const paymentItemCode = TRANSFER_TO_AGENT_PAYMENT_ITEM_CODE;
    const terminalId = QUICKTELLER_API_TERMINAL_ID;
    const terminalType = "WEB";
    const username = this.user.username;

    this.initiateResponseObj = await liquidityService.initiateTransferToAgent(
      {
        beneficiaryPhone,
        amount,
        channel,
        gender,
        paymentItemCode,
        terminalType,
        terminalId,
        customerMsisdn: agentPhoneNumber,
        paymentInstrumentType: "CASH",
      },
      generateChecksum(
        `${username}${httpMethod}${amount}${httpMethod}${paymentItemCode}` +
          `${httpMethod}${deviceId}`
      ),
      deviceId
    );
    console.log({ initiateResponseObj: this.initiateResponseObj });

    this.afterInitiate();
  }

  async proceed() {
    this.beforeProceed();

    const {
      deviceDetails: { deviceUuid: deviceId },
    } = this;
    const requestPayload = this.initiateResponseObj.response;
    requestPayload.transactionReference = this.initiateResponseObj.response.transactionRef;

    this.proceedResponseObj = await liquidityService.processTransferToAgent(
      requestPayload,
      deviceId
    );
    console.log({ proceedResponseObj: this.proceedResponseObj });
    this.afterProceed();
    return;
  }

  renderForm(props) {
    return (
      <TransferToAgentForm {...props} ref={(form) => (this.form = form)} />
    );
  }
}

export function SendMoney(props) {
  if (props?.subCategory) {
    return new {
      Distribute: Distribute,
      "Transfer to Account": InterswitchTransfer,
      "Transfer to Agents": TransferToAgent,
      "Transfer to Bank": InterswitchTransfer,
      "Cash In": Cashin,
      "Transfer to Bank / MMO": NIPTransfer,
      "Transfer to MMO": MMOTransfer,
      "Funds Transfer": InterswitchTransfer,
    }[props.subCategory.name](props);
  }
}

Object.assign(SendMoney.prototype, {
  friendlyName: "Send Money",
  subCategories: Services[SEND_MONEY],
});
