import React from 'react';

import { BILLS } from '../../../../../constants';
import {
  BILL_PAYMENT_INITIATE_CLICK,
  BILL_PAYMENT_INITIATE_FAILURE,
  BILL_PAYMENT_INITIATE_SUCCESS,
  BILL_PAYMENT_PROCEED_CLICK,
  BILL_PAYMENT_PROCEED_FAILURE,
  BILL_PAYMENT_PROCEED_SUCCESS,
  POS_BILL_PAYMENT_INITIATE_CLICK,
  POS_BILL_PAYMENT_INITIATE_FAILURE,
  POS_BILL_PAYMENT_INITIATE_SUCCESS,
  POS_BILL_PAYMENT_PROCEED_CLICK,
  POS_BILL_PAYMENT_PROCEED_FAILURE,
  POS_BILL_PAYMENT_PROCEED_SUCCESS
} from '../../../../../constants/analytics';
import {
  QUICKTELLER_API_TERMINAL_ID,
  QUICKTELLER_CHANNEL
} from '../../../../../constants/api-resources';
import { NGN } from '../../../../../constants/currencies';
import amountField from '../../../../../fragments/amount-field';
import {
  TransactionReceiptSerializer
} from '../../../../../serializers/resources/receipt';
import {
  TransactionConfirmationSerializer
} from '../../../../../serializers/resources/transaction-confirmation';
import { transactionService } from '../../../../../setup/api';
import { convertNgnToNgk } from '../../../../../utils/converters/currencies';
import { generateChecksum } from '../../../../../utils/helpers';
import sanitizePhoneNumber from '../../../../../utils/sanitizers/phone-number';
import PayBillForm from '../forms/pay-bill-form';
import BaseTransactionType from './base';


const receiptSerializer = (
  new TransactionReceiptSerializer()
);
const transactionConfirmationSerializer = (
  new TransactionConfirmationSerializer()
);


export class MMO extends BaseTransactionType {
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
    return 'Customer ID';
  }

  get codename() {
    return BILLS;
  }

  get friendlyName() {
    return 'MMOs';
  }

  get proceedButtonTitle() {
    return `Send ${amountField(
        NGN,
        this.formData.amount
    )}`
  }

  get requestFieldName() {
    return 'billsPaymentRequest';
  }

  getConfirmationFields() {
    const { selectedSubOption, subOptionsName } = (
      this.transactionStateFromReduxStore
    );

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
    const { selectedSubOption, subOptionsName } = (
      this.transactionStateFromReduxStore
    );

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

  resetFormField() {
    this.form.resetFormField();
  }
  
  async initiate() {
    this.beforeInitiate();

    const isFormValid = this.checkFormValidity();

    if (isFormValid !== true) {
      return;
    };

    const { deviceDetails: { deviceUuid: deviceId } } = this;
    const { selectedBillerOption } = this.form.state;
    this.formData = this.form.state.form;

    // console.log({
    //   deviceId, selectedBillerOption, formData: this.formData,
    // });

    const {
      name,
      paymentCode,
      serviceName,
    } = selectedBillerOption;
    const amount = convertNgnToNgk(this.formData.amount);
    const channel = QUICKTELLER_CHANNEL;
    const httpMethod = 'POST';
    const username = this.user.username;

    console.log({
      amount,
      'paymentInstrumentType': 'CASH',
      channel,
      'customerMsisdn': sanitizePhoneNumber(this.formData.phone),
      'customerId': this.formData.customerId,
      'gender': this.formData.gender,
      'narration': `${serviceName} (${name})`,
      'paymentItemCode': paymentCode,
      'terminalId': QUICKTELLER_API_TERMINAL_ID,
    });

    this.initiateResponseObj = (
      await transactionService.initiateTransaction(
          generateChecksum(
              `${username}${httpMethod}${amount}${httpMethod}${paymentCode.trim()}` +
              `${httpMethod}${deviceId}`,
          ),
          this.codename,
          {
            amount,
            'paymentInstrumentType': 'CASH',
            channel,
            'customerMsisdn': sanitizePhoneNumber(
                this.formData.phone,
                this.formData.countryShortCode,
            ),
            'customerId': this.formData.customerId,
            'gender': this.formData.gender,
            'narration': `${serviceName} (${name})`,
            'paymentItemCode': paymentCode,
            'terminalId': QUICKTELLER_API_TERMINAL_ID,
          },
          this.requestFieldName,
          deviceId,
      )
    );

    console.log({initiateResponseObj: this.initiateResponseObj});

    this.afterInitiate();
  }

  async proceed() {
    this.beforeProceed();

    const { deviceDetails: { deviceUuid: deviceId } } = this;
    const requestPayload = (
      this.initiateResponseObj.response[this.requestFieldName]
    );

    this.proceedResponseObj = (
      await transactionService.processTransaction(
          requestPayload.transactionRef,
          this.codename,
          requestPayload,
          this.requestFieldName,
          deviceId,
      )
    );
    console.log({proceedResponseObj: this.proceedResponseObj});

    this.afterProceed();
    return;
  }

  renderForm(props) {
    return (
      <PayBillForm
        {...props}
        ref={(form) => this.form = form}
      />
    );
  }
}
