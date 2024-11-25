import { TRANSACTION_API_BASE_URL_V1 } from "../../../constants/api-resources";
import Requester from "../finch-requester";

const API_BASE_URL = TRANSACTION_API_BASE_URL_V1;

export default class TransactionV1 {
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

  getBanks() {
    return this.apiRequester.get({
      endpoint: `union/banks`,
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

  cacRegistrationProceed(
    proceedPayload,
    deviceUuid
  ) {
    return this.apiRequester.post({
      endpoint: "cac-registration/proceed",
      body: proceedPayload,
      headers: {
        deviceUuid,
      },
    });
  }
}
