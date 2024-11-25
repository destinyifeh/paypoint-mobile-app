import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

import {AGENT, USER} from '../constants';
import {SET_CLEAR_SESSION} from '../constants/action-types/tunnel';
import {SUCCESS_STATUS} from '../constants/api';
import {
  CHECK_TOKEN_EXPIRY_DATE,
  TIME_TO_REFRESH_TOKEN_IN_MILLISECONDS,
} from '../constants/api-resources';
import {BLOCKER} from '../constants/dialog-priorities';
import {setUserProperties} from '../core/logger';
import AgentSerializer from '../serializers/resources/agent';
import UserManagement from '../services/api/resources/user-management';
import store from '../services/redux/store';
import {setupMessaging} from '../setup/background-tasks';
import {flashMessage} from './dialog';
import NavigationService from './navigation-service';
import {loadData} from './storage';

const AUTH_TOKEN = 'auth_token';
const AUTH_TOKEN_EXPIRY = 'auth_token_expiry';
const REFRESH_TOKEN = 'refresh_token';

function currentTimestampInMilliSeconds() {
  const currentDate = new Date();
  const currentTimestamp = currentDate.valueOf();
  return currentTimestamp;
}

function decodeToken(token) {
  const decodedToken = jwt_decode(token);
  return decodedToken;
}

export async function refreshAuthToken() {
  const refreshToken = await retrieveRefreshToken();

  const user = JSON.parse(await loadData(USER));
  const userMobileNo = user.mobileNo;

  const userManagement = new UserManagement();
  const {status, response} = await userManagement.refreshAuthToken(
    refreshToken,
    userMobileNo,
  );

  if (status === SUCCESS_STATUS) {
    await saveAuthToken(response.data);
    return response.data;
  } else {
    userManagement.apiRequester.forceLogout();
    return;
  }
}

export async function calculateTimeToRefreshToken() {
  const authTokenExpiry = parseInt(
    await AsyncStorage.getItem(AUTH_TOKEN_EXPIRY),
  );
  const timeToRefreshToken = TIME_TO_REFRESH_TOKEN_IN_MILLISECONDS;

  return (
    authTokenExpiry - timeToRefreshToken - currentTimestampInMilliSeconds()
  );
}

export async function deleteAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN);
  await AsyncStorage.removeItem(AUTH_TOKEN_EXPIRY);
}

export async function isAuthTokenExpired() {
  const rawAuthTokenExpiry = await AsyncStorage.getItem(AUTH_TOKEN_EXPIRY);

  if (rawAuthTokenExpiry === null) {
    return null;
  }

  const authTokenExpiry = parseInt(rawAuthTokenExpiry);
  if (authTokenExpiry && currentTimestampInMilliSeconds() <= authTokenExpiry) {
    return false;
  }

  return true;
}

export async function shouldCallRefressToken() {
  const checkTokenExpiryDate = await AsyncStorage.getItem(
    CHECK_TOKEN_EXPIRY_DATE,
  );
  const currentTimestamp = currentTimestampInMilliSeconds();
  if (!checkTokenExpiryDate || currentTimestamp - checkTokenExpiryDate > 2000) {
    await AsyncStorage.setItem(CHECK_TOKEN_EXPIRY_DATE, currentTimestamp + '');
    const rawAuthTokenExpiry = await AsyncStorage.getItem(AUTH_TOKEN_EXPIRY);
    if (rawAuthTokenExpiry === null) {
      return false;
    }

    const authTokenExpiry = parseInt(rawAuthTokenExpiry);

    if (authTokenExpiry) {
      const diff = authTokenExpiry - currentTimestamp;
      if (diff <= TIME_TO_REFRESH_TOKEN_IN_MILLISECONDS && diff > 2000) {
        return true;
      }
    }
  }
  return false;
}

export function isSessionActive() {
  return SyncStorage.get(AUTH_TOKEN) !== null;
}

export async function retrieveAuthToken() {
  const authToken = await AsyncStorage.getItem(AUTH_TOKEN);
  const authTokenExpiry = await AsyncStorage.getItem(AUTH_TOKEN_EXPIRY);

  return {
    authToken,
    authTokenExpiry,
  };
}

export async function onNewSessionBegin() {
  store.dispatch({
    type: SET_CLEAR_SESSION,
    payload: false,
  });

  const rawAgentData = JSON.parse(await loadData(AGENT));
  let currentAgent = {};
  if (rawAgentData && Object.keys(rawAgentData).length) {
    const agentSerializer = new AgentSerializer(rawAgentData);
    currentAgent = agentSerializer.asJson();
  }

  const currentUser = JSON.parse(await loadData(USER));

  setUserProperties({...currentUser, ...currentAgent});

  setupMessaging();
}

export function onSessionEnd() {
  store.dispatch({
    type: SET_CLEAR_SESSION,
    payload: true,
  });
}

export async function retrieveRefreshToken() {
  return await AsyncStorage.getItem(REFRESH_TOKEN);
}

export async function saveAuthToken(token) {
  const {exp: tokenExpiry} = decodeToken(token);

  await AsyncStorage.setItem(AUTH_TOKEN, token);
  await AsyncStorage.setItem(
    AUTH_TOKEN_EXPIRY,
    JSON.stringify(tokenExpiry * 1000),
  );
}

export async function saveRefreshToken(token) {
  await AsyncStorage.setItem(REFRESH_TOKEN, token);
}

export function onAppSessionExpire(reason) {
  NavigationService.navigate('Logout');

  if (reason === 'IDLE') {
    flashMessage(
      'Logout',
      'Your session timed out! Please, login again.',
      BLOCKER,
    );
  } else if (reason === 'TOKEN') {
    flashMessage(
      'Logout',
      'Your session has expired! Please, login again.',
      BLOCKER,
    );
  }

  store.dispatch({
    type: SET_CLEAR_SESSION,
    payload: true,
  });
}
