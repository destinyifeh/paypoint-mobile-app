import Requester from '../finch-requester';
import { IFIS_ARCHIVES_API_BASE_URL } from '../../../constants/api-resources';

const API_BASE_URL = IFIS_ARCHIVES_API_BASE_URL;

export default class IfisArchives {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    });
  }

  retrieveHistoricalData(agentPhone, pageNumber, pageSize, startDate, endDate, transactionType, gmppRef) {
    return this.apiRequester.get({
      endpoint: 'api/v2/finch-historical-data-service/archives/transactions',
      args: {
        agentPhone,
        page: pageNumber,
        pageSize,
        startDate,
        endDate,
        transType: transactionType,
        gmppRef,
      }
    });
  }
}
