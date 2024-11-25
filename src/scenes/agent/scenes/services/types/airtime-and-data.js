import React from "react";

import { RECHARGE } from "../../../../../constants";
import {
  BUY_AIRTIME_INITIATE_CLICK,
  BUY_AIRTIME_INITIATE_FAILURE,
  BUY_AIRTIME_INITIATE_SUCCESS,
  BUY_AIRTIME_PROCEED_CLICK,
  BUY_AIRTIME_PROCEED_FAILURE,
  BUY_AIRTIME_PROCEED_SUCCESS,
  POS_BUY_AIRTIME_INITIATE_CLICK,
  POS_BUY_AIRTIME_INITIATE_FAILURE,
  POS_BUY_AIRTIME_INITIATE_SUCCESS,
  POS_BUY_AIRTIME_PROCEED_CLICK,
  POS_BUY_AIRTIME_PROCEED_FAILURE,
  POS_BUY_AIRTIME_PROCEED_SUCCESS,
} from "../../../../../constants/analytics";
import { QUICKTELLER_API_TERMINAL_ID } from "../../../../../constants/api-resources";
import { NGN } from "../../../../../constants/currencies";
import Services from "../../../../../fixtures/services";
import amountField from "../../../../../fragments/amount-field";
import { TransactionReceiptSerializer } from "../../../../../serializers/resources/receipt";
import { TransactionConfirmationSerializer } from "../../../../../serializers/resources/transaction-confirmation";
import { transactionService } from "../../../../../setup/api";
import { convertNgnToNgk } from "../../../../../utils/converters/currencies";
import { generateChecksum } from "../../../../../utils/helpers";
import sanitizePhoneNumber from "../../../../../utils/sanitizers/phone-number";
import AirtimeAndDataForm from "../forms/airtime-and-data-form";
import BaseTransactionType from "./base";

const receiptSerializer = new TransactionReceiptSerializer();
const transactionConfirmationSerializer = new TransactionConfirmationSerializer();

export class AirtimeAndData extends BaseTransactionType {
  get analyticsEvents() {
    return {
      beforeInitiate: BUY_AIRTIME_INITIATE_CLICK,
      beforeInitiatePos: POS_BUY_AIRTIME_INITIATE_CLICK,
      beforeProceed: BUY_AIRTIME_PROCEED_CLICK,
      beforeProceedPos: POS_BUY_AIRTIME_PROCEED_CLICK,
      initiateFailure: BUY_AIRTIME_INITIATE_FAILURE,
      initiateFailurePos: POS_BUY_AIRTIME_INITIATE_FAILURE,
      initiateSuccess: BUY_AIRTIME_INITIATE_SUCCESS,
      initiateSuccessPos: POS_BUY_AIRTIME_INITIATE_SUCCESS,
      proceedFailure: BUY_AIRTIME_PROCEED_FAILURE,
      proceedFailurePos: POS_BUY_AIRTIME_PROCEED_FAILURE,
      proceedSuccess: BUY_AIRTIME_PROCEED_SUCCESS,
      proceedSuccessPos: POS_BUY_AIRTIME_PROCEED_SUCCESS,
    };
  }

  get customerIdField() {
    return "Phone Number";
  }

  get codename() {
    return RECHARGE;
  }

  get friendlyName() {
    return "Airtime & Data";
  }

  get proceedButtonTitle() {
    const isData = Boolean(
      Object.keys(this.formState.selectedBillerOption).length
    );
    const purchaseType = isData ? "Data" : "Airtime";

    return `Sell ${amountField(NGN, this.formData.amount)} ${purchaseType}`;
  }

  get requestFieldName() {
    return "rechargeRequest";
  }

  get subCategories() {
    return Services[this.codename];
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
  resetFormField() {
    this.form.resetFormField();
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
    this.formState = this.form.state;
    const { selectedBillerOption } = this.formState;
    this.formData = this.formState.form;

    console.log({
      deviceId,
      selectedBillerOption,
      formData: this.formData,
    });

    const amount = Math.round(convertNgnToNgk(this.formData.amount));
    const httpMethod = "POST";
    const paymentCode = this.formData.paymentItemCode.trim();
    const username = this.user.username;
    const serviceName = this.formData.serviceName;
    this.initiateResponseObj = await transactionService.initiateTransaction(
      generateChecksum(
        `${username}${httpMethod}${amount}${httpMethod}${paymentCode}` +
          `${httpMethod}${deviceId}`
      ),
      this.codename,
      {
        amount,
        paymentInstrumentType: "CASH",
        channel: this.channel,
        customerMsisdn: sanitizePhoneNumber(
          this.formData.phone,
          this.formData.countryShortCode
        ),
        customerId: this.formData.customerId,
        gender: this.formData.gender,
        narration: serviceName,
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
      this.initiateResponseObj.response.transactionReference,
      this.codename,
      requestPayload,
      this.requestFieldName,
      deviceId
    );

    this.afterProceed();
    return;
  }

  renderForm(props) {
    return <AirtimeAndDataForm {...props} ref={(form) => (this.form = form)} />;
  }
}
