import Requester from '../finch-requester';
import { SETTLEMENT_API_BASE_URL } from '../../../constants/api-resources';

const API_BASE_URL = SETTLEMENT_API_BASE_URL;

export default class Settlement {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    })
  }

  getWalletUnsettledBalanceByRef(agentPhoneNo) {
    return this.apiRequester.get({
      endpoint: 'commissions/unsettled',
      args: {
        agentPhoneNo
      }
    })
  }

  getWalletUnsettledBalance(agentPhoneNo) {
    return this.apiRequester.get({
      endpoint: 'commissions/unsettled',
      args: {
        agentPhoneNo
      }
    })
  }

  getReports(agentId) {
    return this.apiRequester.get({
      endpoint: 'commissions/getReport',
      args: {
        agentId,
      }
    })
  }
}