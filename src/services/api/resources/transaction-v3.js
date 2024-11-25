import { TRANSACTION_API_BASE_URL_V3 } from '../../../constants/api-resources';
import Requester from '../finch-requester';


const API_BASE_URL = TRANSACTION_API_BASE_URL_V3;

export default class TransactionV3 {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL,
    }) : new Requester({
      apiBaseUrl: API_BASE_URL,
    });
  }

  initiateTransaction(
      checksum, transactionType, payload, transactionPayloadName, deviceUuid,
  ) {
    return this.apiRequester.post({
      endpoint: 'payments/initialize',
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

  processTransaction(
      transactionReference, transactionType, paymentRequest,
      transactionPayloadName, deviceUuid,
  ) {
    return this.apiRequester.post({
      endpoint: 'payments/proceed',
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
