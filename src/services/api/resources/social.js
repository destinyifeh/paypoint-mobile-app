import Requester from '../finch-requester'
import Axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL 

export class Facebook {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    })
  }

  createPage(payload) {
    return this.apiRequester.post({
      endpoint: 'social/facebook/pages',
      body: payload
    })
  }

  getFacebookAccessToken(code) {
    return Axios.get(
      "https://graph.facebook.com/v4.0/oauth/access_token", {
        params: {
          "client_id": process.env.REACT_APP_FACEBOOK_APP_ID,
          "redirect_uri": encodeURI("http://localhost:3000/social/facebook/login-callback"),
          "client_secret": process.env.REACT_APP_FACEBOOK_CLIENT_SECRET, 
          "code": code,
          "scope": "public_profile,email"
        }
      }
    )
  }

  getFacebookUser(accessToken) {
    return Axios.get(
      "https://graph.facebook.com/v4.0/me?fields=id,name,email,picture", {
        params: {
          "access_token": accessToken
        }
      }
    )
  }

  retrievePages() {
    return this.apiRequester.get({
      endpoint: 'social/facebook/pages'
    })
  }

  updatePage(uid, payload) {
    return this.apiRequester.patch({
      endpoint: `social/facebook/pages/${uid}`,
      body: payload
    })
  }

  deletePage(uid) {
    return this.apiRequester.delete({
      endpoint: `social/facebook/pages/${uid}`
    })
  }

}
