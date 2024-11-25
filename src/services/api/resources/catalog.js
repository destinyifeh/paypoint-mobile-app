import { CATALOG_API_BASE_URL } from '../../../constants/api-resources'
import Requester from '../finch-requester'

const API_BASE_URL = CATALOG_API_BASE_URL

export default class Catalog {
  constructor (props) {
    this.apiRequester = props ? props.apiRequester : new Requester({
      apiBaseUrl: API_BASE_URL
    })
  }

  accountInquiry(accountNumber, bankCode, terminalId) {
    return this.apiRequester.get({
      endpoint: `services/inquiries/banks/${bankCode}/accounts`,
      headers: {
        accountNumber,
        terminalId,
      },
      auth: false,
    })
  }

  authenticate(username, password) {
    return this.apiRequester.post({
      endpoint: `security/authenticate`,
      body: {
        username,
      },
      headers: {
        secret: password
      }
    })
  }

  getOptions (serviceId, terminalId) {
    return this.apiRequester.get({
      endpoint: `services/${serviceId}`,
      args: {
        'withOptions': true,
      },
      headers: {
        terminalId
      },
      auth: false,
      // cache: true
    })
  }

  getServices (categoryId, terminalId) {
    return this.apiRequester.get({
      endpoint: `services/categories/${categoryId}`,
      args: {
        'withservices': true
      },
      auth: false,
      headers: {
        terminalId
      },
      cache: true,
    })
  }

  searchForBiller(searchTerm, terminalId) {
    return this.apiRequester.get({
      endpoint: `services/search?s=${searchTerm}&countryCode=NG`,
      auth: false,
      headers: {
        terminalId
      }
    })
  }

  getPayableAmount(paymentCode, customerId, terminalId) {
    return this.apiRequester.post({
      endpoint: 'payments/validations/customers',
      auth: false,
      headers: {
        terminalId
      },
      body: {
        paymentCode,
        customerId
      }
    })
  }

}
