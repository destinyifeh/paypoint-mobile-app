import Requester from '../finch-requester';
import { API_GATEWAY_API_BASE_URL, ENVIRONMENT } from '../../../constants/api-resources';

const API_BASE_URL = API_GATEWAY_API_BASE_URL;

export default class ApiGateway {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL,
    }) : new Requester({
      apiBaseUrl: API_BASE_URL,
    });
  }

  getToken(environment) {
    let username ='tomisin.abiodun@interswitchng.com';
    let password = 'password';
    let scope = 'profile';
    let grantType = 'password';
    const basicAuthContent = 'SUtJQUQyMEJENUI1MkJDMkFBMzMwNTZFNzVDODIzQzAzOTcyRUNFRUFDNDM6OTgxQTZCRkNEOTU3MEFDNkJGODI0ODVCQkNBNTI2NDU5MkQ0MUMxNA==';

    const payload = {
      username,
      password,
      scope,
      grant_type: grantType
    }
  
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
        'Authorization': `Basic ${basicAuthContent}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      args: {
        'env': ENVIRONMENT !== 'production' ? 'TEST' : null
      },
      body: formBody,
      encodeBody: true
    })
  }

  doClientAuthentication(clientBasicAuth) {
    const payload = {
      grant_type: 'client_credentials',
      scope: 'profile'
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
        'Authorization': `Basic ${clientBasicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      args: {
        'env': ENVIRONMENT !== 'production' ? 'TEST' : null
      },
      body: formBody,
      encodeBody: true
    })
  }

}
