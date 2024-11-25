import { NIP_API_BASE_URL } from "../../../constants/api-resources";
import Requester from "../finch-requester";

const API_BASE_URL = NIP_API_BASE_URL;

export default class Nip {
  constructor(props) {
    this.apiRequester = props
      ? props.apiRequester ||
        new Requester({
          apiBaseUrl: API_BASE_URL,
        })
      : new Requester({
          apiBaseUrl: API_BASE_URL,
        });
  }

  getAccountName(accountNumber, institutionCode, deviceUuid) {
    return this.apiRequester.post({
      endpoint: "v3/finch-nip/payments/validate",
      body: {
        accountNumber,
        channelCode: "4",
        currencyCode: "NGN",
        institutionCode,
        channel: "NIP",
      },
      headers: {
        deviceUuid,
      },
    });
  }

  getBanks(deviceUuid) {
    return this.apiRequester.getIgnore401({
      endpoint: "v2/finch-nip/payments/v2/alias",
      headers: {
        deviceUuid,
      },
    });
  }

  initiate(
    checksum,
    transactionType,
    payload,
    transactionPayloadName,
    deviceUuid
  ) {
    return this.apiRequester.post({
      endpoint: "v2/finch-nip/payments/initialize",
      body: {
        checksum,
        transactionType,
        [transactionPayloadName]: payload,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  proceed(
    transactionReference,
    transactionType,
    paymentRequest,
    transactionPayloadName,
    deviceUuid
  ) {
    return this.apiRequester.post({
      endpoint: "v2/finch-nip/payments/proceed",
      body: {
        transactionReference,
        transactionType,
        [transactionPayloadName]: paymentRequest,
      },
      headers: {
        deviceUuid,
      },
    });
  }
}
