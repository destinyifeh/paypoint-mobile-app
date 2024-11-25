import axios from "axios";
import {
  DELETE_METHOD,
  GET_METHOD,
  POST_METHOD,
  PUT_METHOD,
} from "../../constants/api";
import {
  deleteAuthToken,
  refreshAuthToken,
  retrieveAuthToken,
  shouldCallRefressToken,
} from "../../utils/auth";

const CLIENT = "CLIENT";
const SERVER = "SERVER";

export default class Requester {
  constructor(props) {
    const { apiBaseUrl } = props;
    this.apiBaseUrl = apiBaseUrl;
    this.cancelToken = axios.CancelToken.source();
  }

  _getErrorSource(error) {
    if (error.response) {
      if (error.response.status >= 400 && error.response.status <= 499) {
        return CLIENT;
      } else if (error.response.status >= 500 && error.response.status <= 599) {
        return SERVER;
      }
    }

    return null;
  }

  _fetchDataFromCache(url, args) {
    return;
  }

  _getFullUrl(endpoint) {
    return endpoint.length
      ? `${this.apiBaseUrl}/${endpoint}`
      : `${this.apiBaseUrl}`;
  }

  _handleError(error, auth) {
    if (
      error &&
      error.response &&
      [401].includes(error.response.status) &&
      auth !== false
    ) {
      this._handle401Error();
    }
    

    return error.response ? error.response.data : {};
  }

  _handleErrorIgnore401(error, auth) {
    return error.response ? error.response.data : {};
  }

  _handle401Error() {
    return;
  }

  _handleResponse(response) {
    return response.data.responseData || response.data;
  }

  _saveDataToCache(url, args, data, expiry) {
    return;
  }

  async _makeHttpRequest(params) {
    console.log("CANCEL TOKEN", this.cancelToken.token);

    // check if auth token has expired, refresh token if necessary
    let { url, method, headers, args, body, auth } = params;
    let { authToken } = await retrieveAuthToken();
    const callRefreshToken = await shouldCallRefressToken();
    const doesRequestRequireAuthentication = auth !== false;

    console.log("IS TOKEN ABOUT TO EXPIRE?", callRefreshToken);

    // if auth is required and there's no auth token
    if (authToken === null && doesRequestRequireAuthentication) {
      this.cancelRequests();
    }

    if (callRefreshToken && doesRequestRequireAuthentication) {
      console.log(
        "IN REQUESTER, auth token is about to expire. Now refreshing token"
      );
      await deleteAuthToken();
      await refreshAuthToken();
      authTokenObj = await retrieveAuthToken();
      authToken = authTokenObj.authToken;
    }

    if (headers && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    } else if (!headers) {
      headers = { "Content-Type": "application/json" };
    }

    if (authToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    if (auth === false) {
      delete headers["Authorization"];
    }

    console.log(
      "OUTGOING REQUEST",
      JSON.stringify({
        url,
        method,
        headers,
        params: args,
        data: body,
        mode: "no-cors",
      })
    );

    return axios({
      url,
      method,
      headers,
      params: args,
      data: body,
      mode: "no-cors",
      timeout: 15000,
      cancelToken: this.cancelToken ? this.cancelToken.token : undefined,
    });
  }

  async post(params) {
    const {
      endpoint,
      headers,
      body,
      args,
      auth,
      cache,
      cacheDuration,
    } = params;
    const url = this._getFullUrl(endpoint);

    try {
      const response = await this._makeHttpRequest({
        url,
        method: POST_METHOD,
        headers,
        auth,
        body: body,
        args: args,
        cache,
      });
      
      console.log(
        "OUTGOING RESPONSE",
        JSON.stringify({
         response
        })
      );

      const result = {
        status: "SUCCESS",
        response: this._handleResponse(response),
        code: response.status,
      };

      if (cache) {
        await this._saveDataToCache(url, args, result, cacheDuration);
      }

      return result;
    } catch (error) {
      if (cache) {
        const cachedData = await this._fetchDataFromCache(url);
        console.log({ cachedData });
        if (cachedData) {
          return cachedData;
        }
      }

      return {
        status: "ERROR",
        response: this._handleError(error, auth),
        code: error.response ? error.response.status : null,
        errorSource: this._getErrorSource(error),
      };
    }
  }

  async get(params) {
    const { endpoint, headers, args, auth, cache, cacheDuration } = params;
    const url = this._getFullUrl(endpoint);

    console.log("GET REQUEST STARTED");

    if (cache) {
      const cachedData = await this._fetchDataFromCache(url, args);
      console.log({ cachedData });
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await this._makeHttpRequest({
        url,
        method: GET_METHOD,
        headers: headers,
        args: args,
        body: null,
        auth,
        cache,
      });
      
      
      console.log(
        "OUTGOING RESPONSE",
        JSON.stringify({
         response
        })
      );

      const result = {
        status: "SUCCESS",
        response: this._handleResponse(response),
        code: response.status,
      };

      if (cache) {
        await this._saveDataToCache(url, args, result, cacheDuration);
      }

      return result;
    } catch (error) {
      return {
        status: "ERROR",
        response: this._handleError(error),
        code: error.response ? error.response.status : null,
        errorSource: this._getErrorSource(error),
      };
    }
  }

  async put(params) {
    const { endpoint, headers, body, args, auth, cache } = params;

    try {
      const response = await this._makeHttpRequest({
        url: this._getFullUrl(endpoint),
        method: PUT_METHOD,
        headers: headers,
        args: args,
        body: body,
        auth,
        cache,
      });

      
      console.log(
        "OUTGOING RESPONSE",
        JSON.stringify({
         response
        })
      );

      return {
        status: "SUCCESS",
        response: this._handleResponse(response),
        code: response.status,
      };
    } catch (error) {
      return {
        status: "ERROR",
        response: this._handleError(error),
        code: error.response ? error.response.status : null,
        errorSource: this._getErrorSource(error),
      };
    }
  }

  async delete(params) {
    const { endpoint, headers, body, args, auth, cache } = params;

    try {
      const response = await this._makeHttpRequest({
        url: this._getFullUrl(endpoint),
        method: DELETE_METHOD,
        headers: headers,
        args: args,
        body: body,
        auth,
        cache,
      });

      
      console.log(
        "OUTGOING RESPONSE",
        JSON.stringify({
         response
        })
      );

      return {
        status: "SUCCESS",
        response: this._handleResponse(response),
        code: response.status,
      };
    } catch (error) {
      return {
        status: "ERROR",
        response: this._handleError(error),
        code: error.response ? error.response.status : null,
        errorSource: this._getErrorSource(error),
      };
    }
  }

  async postIgnore401(params) {
    const {
      endpoint,
      headers,
      body,
      args,
      auth,
      cache,
      cacheDuration,
    } = params;
    const url = this._getFullUrl(endpoint);
    console.log("POST");

    try {
      const response = await this._makeHttpRequest({
        url,
        method: POST_METHOD,
        headers,
        auth,
        body: body,
        args: args,
        cache,
      });
      
      console.log(
        "OUTGOING RESPONSE",
        JSON.stringify({
         response
        })
      );

      const result = {
        status: "SUCCESS",
        response: this._handleResponse(response),
        code: response.status,
      };

      if (cache) {
        await this._saveDataToCache(url, args, result, cacheDuration);
      }

      return result;
    } catch (error) {
      if (cache) {
        const cachedData = await this._fetchDataFromCache(url);
        console.log({ cachedData });
        if (cachedData) {
          return cachedData;
        }
      }

      return {
        status: "ERROR",
        response: this._handleErrorIgnore401(error, auth),
        code: error.response ? error.response.status : null,
        errorSource: this._getErrorSource(error),
      };
    }
  }

  async getIgnore401(params) {
    const { endpoint, headers, args, auth, cache, cacheDuration } = params;
    const url = this._getFullUrl(endpoint);

    console.log("GET REQUEST IGNORE STARTED");

    if (cache) {
      const cachedData = await this._fetchDataFromCache(url, args);
      console.log({ cachedData });
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await this._makeHttpRequest({
        url,
        method: GET_METHOD,
        headers: headers,
        args: args,
        body: null,
        auth,
        cache,
      });

      
      console.log(
        "OUTGOING RESPONSE",
        JSON.stringify({
         response
        })
      );

      const result = {
        status: "SUCCESS",
        response: this._handleResponse(response),
        code: response.status,
      };

      if (cache) {
        await this._saveDataToCache(url, args, result, cacheDuration);
      }

      return result;
    } catch (error) {
      return {
        status: "ERROR",
        response: this._handleErrorIgnore401(error),
        code: error.response ? error.response.status : null,
        errorSource: this._getErrorSource(error),
      };
    }
  }

  async putIgnore401(params) {
    const { endpoint, headers, body, args, auth, cache } = params;

    try {
      const response = await this._makeHttpRequest({
        url: this._getFullUrl(endpoint),
        method: PUT_METHOD,
        headers: headers,
        args: args,
        body: body,
        auth,
        cache,
      });

      
      console.log(
        "OUTGOING RESPONSE",
        JSON.stringify({
         response
        })
      );

      return {
        status: "SUCCESS",
        response: this._handleResponse(response),
        code: response.status,
      };
    } catch (error) {
      return {
        status: "ERROR",
        response: this._handleErrorIgnore401(error),
        code: error.response ? error.response.status : null,
        errorSource: this._getErrorSource(error),
      };
    }
  }

  async deleteIgnore401(params) {
    const { endpoint, headers, body, args, auth, cache } = params;

    try {
      const response = await this._makeHttpRequest({
        url: this._getFullUrl(endpoint),
        method: DELETE_METHOD,
        headers: headers,
        args: args,
        body: body,
        auth,
        cache,
      });

      
      console.log(
        "OUTGOING RESPONSE",
        JSON.stringify({
         response
        })
      );

      return {
        status: "SUCCESS",
        response: this._handleResponse(response),
        code: response.status,
      };
    } catch (error) {
      return {
        status: "ERROR",
        response: this._handleErrorIgnore401(error),
        code: error.response ? error.response.status : null,
        errorSource: this._getErrorSource(error),
      };
    }
  }

  cancelRequests() {
    console.log("CANCELLING ALL REQUESTS");
    this.cancelToken.cancel();

    this.cancelToken = axios.CancelToken.source();
  }
}
