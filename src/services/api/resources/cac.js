import Requester from "../finch-requester";

import { CAC_API_BASE_URL } from "../../../constants/api-resources";

const API_BASE_URL = CAC_API_BASE_URL;

export default class CacService {
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

  getCacReports(pageSize, pageNumber, agentId) {
    return this.apiRequester.get({
      endpoint: `reports?pageSize=${pageSize}&pageNum=${pageNumber}&requesterId=${agentId}`,
    });
  }

  requeryCacRegistrationReport(reference) {
    return this.apiRequester.get({
      endpoint: `status?reference=${reference}`,
    });
  }
  updateCacRegistrationReport(payload) {
    return this.apiRequester.put({
      endpoint: `register`,
      body: payload,
    });
  }

  getCacRegistrationReportByReference(reference, requesterId) {
    return this.apiRequester.get({
      endpoint: `reports?reference=${reference}&requesterId=${requesterId}`,
    });
  }
}
