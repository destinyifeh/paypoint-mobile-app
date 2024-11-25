import Requester from '../finch-requester'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 

export default class Users {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    })
  }

  retrieveUserByEmail(email) {
    return this.apiRequester.get({
      endpoint: 'users',
      args: {
        email
      }
    })
  }

  signup(payload) {
    return this.apiRequester.post({
      endpoint: 'auth/signup',
      body: payload
    })
  }

  socialLogin(payload, network) {
    return this.apiRequester.post({
      endpoint: `social/${network}/login`,
      body: payload
    })
  }

  socialSignup(payload, network) {
    return this.apiRequester.post({
      endpoint: `social/${network}/signup`,
      body: payload
    })
  }

}
