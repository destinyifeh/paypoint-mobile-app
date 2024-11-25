import { BANK_MONITORING_API_BASE_URL } from "../../../constants/api-resources";
import Requester from "../finch-requester";

const API_BASE_URL = BANK_MONITORING_API_BASE_URL;

export default class BankMonitoring {
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

  getBanksNetwork() {
    return this.apiRequester.get({
      endpoint: `v1/getBankRateByHour?type=by_brand`,
    });
  }
}
