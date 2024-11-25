import React from 'react';

import { CASH_OUT } from '../../../../../constants';
import {
  POS_WITHDRAW_INITIATE_CLICK,
  POS_WITHDRAW_INITIATE_FAILURE,
  POS_WITHDRAW_INITIATE_SUCCESS,
  POS_WITHDRAW_PROCEED_CLICK,
  POS_WITHDRAW_PROCEED_FAILURE,
  POS_WITHDRAW_PROCEED_SUCCESS,
  WITHDRAW_INITIATE_CLICK,
  WITHDRAW_INITIATE_FAILURE,
  WITHDRAW_INITIATE_SUCCESS,
  WITHDRAW_PROCEED_CLICK,
  WITHDRAW_PROCEED_FAILURE,
  WITHDRAW_PROCEED_SUCCESS
} from '../../../../../constants/analytics';
import {
  WITHDRAW_PAYMENT_ITEM_CODE
} from '../../../../../constants/api-resources';
import { NGN } from '../../../../../constants/currencies';
import Services from '../../../../../fixtures/services';
import amountField from '../../../../../fragments/amount-field';
import {
  TransactionReceiptSerializer
} from '../../../../../serializers/resources/receipt';
import {
  TransactionConfirmationSerializer
} from '../../../../../serializers/resources/transaction-confirmation';
import { liquidityService } from '../../../../../setup/api';
import { convertNgnToNgk } from '../../../../../utils/converters/currencies';
import { generateChecksum } from '../../../../../utils/helpers';
import sanitizePhoneNumber from '../../../../../utils/sanitizers/phone-number';
import {
  PaycodeWithdrawalForm,
  USSDWithdrawalForm
} from '../forms/withdrawal-form';
import BaseTransactionType from './base';


const receiptSerializer = new TransactionReceiptSerializer();
const transactionConfirmationSerializer = (
  new TransactionConfirmationSerializer()
);


class Paycode extends BaseTransactionType {
  get analyticsEvents() {
    return {
      beforeInitiate: WITHDRAW_INITIATE_CLICK,
      beforeInitiatePos: POS_WITHDRAW_INITIATE_CLICK,
      beforeProceed: WITHDRAW_PROCEED_CLICK,
      beforeProceedPos: POS_WITHDRAW_PROCEED_CLICK,
      initiateFailure: WITHDRAW_INITIATE_FAILURE,
      initiateFailurePos: POS_WITHDRAW_INITIATE_FAILURE,
      initiateSuccess: WITHDRAW_INITIATE_SUCCESS,
      initiateSuccessPos: POS_WITHDRAW_INITIATE_SUCCESS,
      proceedFailure: WITHDRAW_PROCEED_FAILURE,
      proceedFailurePos: POS_WITHDRAW_PROCEED_FAILURE,
      proceedSuccess: WITHDRAW_PROCEED_SUCCESS,
      proceedSuccessPos: POS_WITHDRAW_PROCEED_SUCCESS,
    };
  }

  get customerIdField() {
    return 'Phone Number';
  }

  get codename() {
    return CASH_OUT;
  }

  get proceedButtonTitle() {
    return `Cash Out ${amountField(
        NGN,
        this.formData.amount
    )}`
  }

  get confirmationTabMessage() {
    return (
      'Your Quickteller Paypoint wallet will be ' +
      'credited with the cash-out amount after the transaction is complete.'
    );
  }

  get requestFieldName() {
    return null;
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
    };

    const { deviceDetails: { deviceUuid } } = this;
    const formData = this.form.state.form;
    this.formData = formData;

    const amount = convertNgnToNgk(formData.amount);
    const paycode = formData.paycode;
    const customerName = formData.customerName;
    const subscriberId = formData.subscriberId;
    const customerPhoneNo = formData.customerPhoneNo;
    const customerEmail = formData.customerEmail;
    const customerGender = formData.gender;
    const username = this.user.username;

    const [
      customerFirstName,
      customerLastName,
    ] = customerName ? customerName.split(' ') : [undefined, undefined];

    const httpMethod = 'POST';

    this.initiateResponseObj = (
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
      )
    );

    this.afterInitiate();
  }

  async proceed() {
    this.beforeProceed();

    const { deviceDetails: { deviceUuid: deviceId } } = this;
    const requestPayload = (
      this.initiateResponseObj.response
    );

    this.proceedResponseObj = (
      await liquidityService.processPaycodeCashOut(
          {
            ...requestPayload,
            pin: this.formData.pin,
          },
          deviceId,
      )
    );

    this.afterProceed();
    return;
  }

  renderForm(props) {
    return (
      <PaycodeWithdrawalForm
        {...props}
        ref={(form) => this.form = form}
      />
    );
  }
}


class USSD extends BaseTransactionType {
  get analyticsEvents() {
    return {
      beforeInitiate: WITHDRAW_INITIATE_CLICK,
      beforeInitiatePos: POS_WITHDRAW_INITIATE_CLICK,
      beforeProceed: WITHDRAW_PROCEED_CLICK,
      beforeProceedPos: POS_WITHDRAW_PROCEED_CLICK,
      initiateFailure: WITHDRAW_INITIATE_FAILURE,
      initiateFailurePos: POS_WITHDRAW_INITIATE_FAILURE,
      initiateSuccess: WITHDRAW_INITIATE_SUCCESS,
      initiateSuccessPos: POS_WITHDRAW_INITIATE_SUCCESS,
      proceedFailure: WITHDRAW_PROCEED_FAILURE,
      proceedFailurePos: POS_WITHDRAW_PROCEED_FAILURE,
      proceedSuccess: WITHDRAW_PROCEED_SUCCESS,
      proceedSuccessPos: POS_WITHDRAW_PROCEED_SUCCESS,
    };
  }

  get customerIdField() {
    return 'Phone Number';
  }

  get codename() {
    return CASH_OUT;
  }

  get requestFieldName() {
    return null;
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
    };

    const { deviceDetails: { deviceUuid } } = this;
    const formData = this.form.state.form;
    this.formData = formData;

    const amount = convertNgnToNgk(formData.amount);
    const bankCode = formData.bankCode;
    const phone = formData.phone;
    const username = this.user.username;
    const paymentItemCode = WITHDRAW_PAYMENT_ITEM_CODE;
    const httpMethod = 'POST';

    this.initiateResponseObj = (
      await liquidityService.initiateUssdCashOut(
          amount,
          bankCode,
          generateChecksum(
              `${username}${httpMethod}${amount}${httpMethod}${deviceUuid}`,
          ),
          phone,
          deviceUuid,
          paymentItemCode,
      )
    );

    this.afterInitiate();
  }

  async proceed() {
    this.beforeProceed();

    const { deviceDetails: { deviceUuid: deviceId } } = this;
    const requestPayload = this.initiateResponseObj.response;

    this.proceedResponseObj = (
      await liquidityService.processUssdCashOut(
          requestPayload,
          deviceId,
      )
    );

    this.afterProceed();
    return;
  }

  renderForm(props) {
    return (
      <USSDWithdrawalForm
        {...props}
        ref={(form) => this.form = form}
      />
    );
  }
}


export function Withdraw(props) {
  if (props?.subCategory) {
    return new {
      'Via Paycode': Paycode,
      'Via USSD': USSD,
    }[props.subCategory.name](props);
  }
}

Object.assign(
    Withdraw.prototype,
    {
      friendlyName: 'Cardless Cash Out',
      subCategories: Services[CASH_OUT],
    },
);
