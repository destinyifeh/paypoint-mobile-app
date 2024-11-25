import {
  NIP_API_BASE_URL,
  TRANSACTION_API_BASE_URL,
} from "../../../constants/api-resources";
import Requester from "../finch-requester";

const API_BASE_URL = TRANSACTION_API_BASE_URL;
const NIP_BASE_URL = NIP_API_BASE_URL;

export default class Transaction {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester ||
        new Requester({
          apiBaseUrl: API_BASE_URL,
        }): new Requester({
          apiBaseUrl: API_BASE_URL,
        });
    this.nipRequester = props ? props.nipRequester ||
        new Requester({
          apiBaseUrl: NIP_BASE_URL,
        }) : new Requester({
          apiBaseUrl: NIP_BASE_URL,
        });
  }

  doAccountInquiry(bankCode, accountNumber, deviceUuid) {
    return this.apiRequester.get({
      endpoint: `enquiry/banks/${bankCode}/accounts/${accountNumber}`,
      headers: {
        deviceUuid,
      },
    });
  }

  doCustomerInquiry(customerId, paymentCode) {
    return this.apiRequester.get({
      endpoint: "enquiry/customers",
      args: {
        customerId,
        paymentCode,
      },
    });
  }

  ping() {
    return this.apiRequester.get({
      endpoint: "actuator/health",
    });
  }

  getLinkedReversal(transactionReference) {
    return this.apiRequester.get({
      endpoint: `system/reversals/${transactionReference}`,
    });
  }

  getWalletBalance() {
    return this.apiRequester.getIgnore401({
      endpoint: "wallet/balance",
    });
  }

  getWalletBalanceByPost(data) {
    return this.apiRequester.post({
      endpoint: "wallet/balance",
      body: data,
    });
  }

  getPaymentMethods(businessPhoneNumber) {
    return this.apiRequester.get({
      endpoint: `wallet/cards/${businessPhoneNumber}`,
    });
  }

  addPaymentMethod(body) {
    return this.apiRequester.post({
      endpoint: "wallet/addCard",
      body,
    });
  }

  initiateBillPayment(billsPaymentRequest, checksum, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/initialize",
      body: {
        transactionType: "bills",
        billsPaymentRequest,
        checksum,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  processBillPayment(paymentRequest, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/proceed",
      body: paymentRequest,
      headers: {
        deviceUuid,
      },
    });
  }

  initiateCashInPayment(billsPaymentRequest, checksum, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/initialize",
      body: {
        transactionType: "CASH_IN",
        billsPaymentRequest,
        checksum,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  processCashInPayment(paymentRequest, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/proceed",
      body: paymentRequest,
      headers: {
        deviceUuid,
      },
    });
  }

  initiateRecharge(rechargeRequest, checksum, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/initialize",
      body: {
        transactionType: "recharge",
        rechargeRequest,
        checksum,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  processRecharge(paymentRequest, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/proceed",
      body: paymentRequest,
      headers: {
        deviceUuid,
      },
    });
  }

  initiateTransfer(transferRequest, checksum, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/initialize",
      body: {
        checksum,
        transactionType: "transfer",
        transferRequest,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  processNipTransfer(transferRequest, deviceUuid) {
    return this.nipRequester.post({
      endpoint: "payments/proceed",
      body: transferRequest,
      headers: {
        deviceUuid,
      },
    });
  }

  processTransfer(transferRequest, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/proceed",
      body: transferRequest,
      headers: {
        deviceUuid,
      },
    });
  }

  initiateTransferToAgent(w2wRequest, checksum, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/initialize",
      body: {
        checksum,
        transactionType: "W2W",
        w2wRequest,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  processTransferToAgent(transferRequest, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "payments/proceed",
      body: transferRequest,
      headers: {
        deviceUuid,
      },
    });
  }

  initiateTransaction(
    checksum,
    transactionType,
    payload,
    unifiedTransferRequest,
    deviceUuid
  ) {
    return this.apiRequester.post({
      endpoint: "payments/initialize",
      body: {
        checksum,
        transactionType,
        [unifiedTransferRequest]: payload,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  initiateCacRegistration(
    checksum,
    transactionType,
    cacInitiateRequest,
    deviceUuid
  ) {
    return this.apiRequester.post({
      endpoint: "cac-registration/initialize",
      body: {
        checksum,
        transactionType,
        cacInitiateRequest
      },
      headers: {
        deviceUuid,
      },
    });
  }

  processTransaction(
    transactionReference,
    transactionType,
    paymentRequest,
    transactionPayloadName,
    deviceUuid
  ) {
    return this.apiRequester.post({
      endpoint: "payments/proceed",
      body: {
        transactionReference,
        transactionType,
        ...paymentRequest,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  unloadCommission(amount) {
    return this.apiRequester.post({
      endpoint: "wallet/commissions/unload",
      body: {
        amount,
      },
    });
  }
}
