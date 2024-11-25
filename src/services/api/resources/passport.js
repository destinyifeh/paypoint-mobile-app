import Requester from '../finch-requester'
import { PASSPORT_API_BASE_URL } from '../../../constants/api-resources';

const API_BASE_URL = PASSPORT_API_BASE_URL

export default class Passport {
  constructor (props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    })
  }

  clientAuth(clientBasicAuth, scope='profile', grantType='client_credentials') {
    const payload = {
      scope,
      grant_type: grantType,
    };
    var formBody = [];
    for (var property in payload) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(payload[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&")

    return this.apiRequester.post({
      endpoint: 'passport/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: `Basic ${clientBasicAuth}`
      },
      encodeBody: true,
      body: formBody,
    })
  }

  login (payload) {
    var formBody = [];
    for (var property in payload) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(payload[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&")

    return this.apiRequester.post({
      endpoint: 'passport/oauth/token',
      body: formBody,
      encodeBody: true,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': `Basic ${process.env.REACT_APP_LOGIN_BASIC_AUTH}`,
      },
    });
  }

}
