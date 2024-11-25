import Requester from '../finch-requester';
import { AUDIT_TRAIL_SERVICE_API_BASE_URL } from '../../../constants/api-resources';


const API_BASE_URL = AUDIT_TRAIL_SERVICE_API_BASE_URL;


export default class Audit {
  
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    });
  }

  getAuditTrailById(id) {
    return this.apiRequester.get({
      endpoint: 'getById',
      headers: {
        id
      }
    })
  }

  searchAuditTrail(businessName, startDate, pageNumber, pageSize, endDate, deviceId, auditAction) {
    return this.apiRequester.get({
      endpoint: '',
      headers: {
        pageStart: pageNumber,
        pageSize: pageSize,
        queryData: JSON.stringify({
          businessName,
          deviceId,
          'fromDate': startDate,
          'toDate': endDate,
          auditAction
        }),
      },
    })
  }

}
