import React from 'react';

import BaseTransactionType from './base';
import { convertNgnToNgk } from '../../../../../utils/converters/currencies';
import {
  QUICKTELLER_API_TERMINAL_ID,
  QUICKTELLER_CHANNEL,
  TRANSFER_TO_ACCOUNT_NIP_PAYMENT_ITEM_CODE,
} from '../../../../../constants/api-resources';
import { transactionService } from '../../../../../setup/api';
import {
  POS_TRANSFER_TO_ACCOUNT_INITIATE_CLICK,
  POS_TRANSFER_TO_ACCOUNT_INITIATE_FAILURE,
  POS_TRANSFER_TO_ACCOUNT_INITIATE_SUCCESS,
  POS_TRANSFER_TO_ACCOUNT_PROCEED_CLICK,
  POS_TRANSFER_TO_ACCOUNT_PROCEED_FAILURE,
  POS_TRANSFER_TO_ACCOUNT_PROCEED_SUCCESS,
  TRANSFER_TO_ACCOUNT_INITIATE_CLICK,
  TRANSFER_TO_ACCOUNT_INITIATE_FAILURE,
  TRANSFER_TO_ACCOUNT_INITIATE_SUCCESS,
  TRANSFER_TO_ACCOUNT_PROCEED_CLICK,
  TRANSFER_TO_ACCOUNT_PROCEED_FAILURE,
  TRANSFER_TO_ACCOUNT_PROCEED_SUCCESS,
} from '../../../../../constants/analytics';
import { generateChecksum, generateMac } from '../../../../../utils/helpers';
import sanitizePhoneNumber from '../../../../../utils/sanitizers/phone-number';
import {
  TransactionConfirmationSerializer,
} from '../../../../../serializers/resources/transaction-confirmation';
import {
  TransactionReceiptSerializer,
} from '../../../../../serializers/resources/receipt';
import {
  NipTransferToAccountForm,
} from '../forms/send-money-form';
import {
  parseBeneficiaryName,
} from '../../../../../utils/sanitizers/transaction';


const receiptSerializer = new TransactionReceiptSerializer();
const transactionConfirmationSerializer = (
  new TransactionConfirmationSerializer()
);


export class CashIn extends BaseTransactionType {
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
    return 'Phone Number';
  }

  get codename() {
    return 'NIP';
  }

  get friendlyName() {
    return 'Cash In';
  }

  get name() {
    return 'Cash In';
  }

  get proceedButtonTitle() {
    return `Deposit ${amountField(
        NGN,
        this.formData.amount
    )}`
  }

  get requestFieldName() {
    return 'nipTransferRequest';
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
    console.log({isFormValid});

    if (!isFormValid) {
      return;
    };

    const { deviceDetails: { deviceUuid: deviceId } } = this;
    const formData = this.form.state.form;
    this.formData = formData;

    const accountNumber = formData.accountNumber;
    const accountType = formData.accountType;
    const amount = convertNgnToNgk(formData.amount);
    const bankName = formData.bankName;
    const beneficiaryEmail = formData.beneficiaryEmail || ' ';
    // const beneficiaryName = formData.beneficiaryName;
    const beneficiaryPhone = formData.beneficiaryPhone;
    const channel = QUICKTELLER_CHANNEL;
    const httpMethod = 'POST';
    const initiationCurrencyCode = 'NGN';
    const initiationPaymentCode = 'CA';
    const institutionCode = formData.institutionCode;
    const paymentCode = TRANSFER_TO_ACCOUNT_NIP_PAYMENT_ITEM_CODE;
    const remark = formData.remark;
    const terminationAmount = amount;
    const terminationCountryCode = 'NG';
    const terminationCurrencyCode = 566;
    const terminationPaymentMethod = 'AC';
    const username = this.user.username;

    this.stopwatch.start();

    this.initiateResponseObj = await transactionService.initiateTransaction(
        generateChecksum(
            `${username}${httpMethod}${amount}${httpMethod}` +
            `${paymentCode}${httpMethod}${deviceId}`,
        ),
        this.codename,
        {
          accountNumber,
          accountType,
          amount,
          institutionCode,
          bankName,
          'nipBeneficiary': {
            email: beneficiaryEmail,
            phoneNumber: sanitizePhoneNumber(
                beneficiaryPhone,
                formData.countryShortCode,
            ),
          },
          channel,
          'channelCode': channel,
          'currencyCode': initiationCurrencyCode,
          'narration': remark,
          'customerId': formData.customerId,
          'gender': formData.gender,
          'paymentItemCode': paymentCode,
          'paymentInstrumentType': 'CASH',
          'terminalId': QUICKTELLER_API_TERMINAL_ID,
          'mac': generateMac(
              `${amount}${initiationCurrencyCode}${initiationPaymentCode}` +
              `${terminationAmount}${terminationCurrencyCode}` +
              `${terminationPaymentMethod}${terminationCountryCode}`,
          ),
        },
        this.requestFieldName,
        deviceId,
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
          this.initiateResponseObj.response.transactionReference,
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
      <NipTransferToAccountForm
        {...props}
        ref={(form) => this.form = form}
      />
    );
  }
}
