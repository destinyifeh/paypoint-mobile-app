import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';

import { AppState } from 'react-native';
import { USER } from '../constants';
import { SUCCESS_STATUS } from '../constants/api';
import {
  ENVIRONMENT,
  INTERNET_CONNECTION_ERROR,
  INTERNET_CONNECTION_NO,
  INTERNET_CONNECTION_POOR
} from '../constants/api-resources';
import { CASUAL } from '../constants/dialog-priorities';
import { onAppPause, onAppResume, onAppStart } from '../core';
import { flashMessage } from '../utils/dialog';
import { loadData, saveData } from '../utils/storage';
import { messagingService } from './api';

const poorInternetConnections = ['2g'];
const SUBSCRIBED_TOKENS = 'SUBSCRIBED_TOKEN2';
const TOKEN_DATE_SUBSCRIBED = 'TOKEN_DATE_SUBSCRIBED';
const currentDate = new Date().getTime();


export const handleConnectionStatusWrapper = (connectionState) => {
  const isMobileNetworkWeak = connectionState.details.cellularGeneration ?
    poorInternetConnections.includes(
        connectionState.details.cellularGeneration,
    ) : false;

  const isUserConnectedToTheInternet = connectionState.isInternetReachable;
  const isWifiNetworkWeak = (
      connectionState.details.strength ?
        connectionState.details.strength < 3 : false
  );

  const isUserNetworkWeak = isMobileNetworkWeak || isWifiNetworkWeak;

  if (!isUserConnectedToTheInternet || !connectionState.details || isUserNetworkWeak) {
    return INTERNET_CONNECTION_ERROR;
  }
  return "";
};

const handleConnectionStatus = (connectionState) => {
  const isMobileNetworkWeak = connectionState.details.cellularGeneration ?
    poorInternetConnections.includes(
        connectionState.details.cellularGeneration,
    ) : false;

  const isUserConnectedToTheInternet = connectionState.isInternetReachable;
  const isWifiNetworkWeak = (
      connectionState.details.strength ?
        connectionState.details.strength < 3 : false
  );

  // check if mobilenetwork is undefined and wifi network is undefined
  // if(connectionState.details.cellularGeneration )
  const isUserNetworkWeak = isMobileNetworkWeak || isWifiNetworkWeak;

  if (!isUserConnectedToTheInternet || !connectionState.details) {
    flashMessage(
        null,
        INTERNET_CONNECTION_NO,
        CASUAL,
    );
  } else if (isUserNetworkWeak) {
    flashMessage(
        null,
        INTERNET_CONNECTION_POOR,
        CASUAL,
    );
  }
};


NetInfo.addEventListener(handleConnectionStatus);


NetInfo.fetch()
    .then(handleConnectionStatus)
    .catch();


// TODO move to messaging.js


messaging().subscribeToTopic('general');
messaging().subscribeToTopic(ENVIRONMENT);

retrieveToken = async ()=>{
  
  const currentUser = JSON.parse(
    await loadData(USER),
  );

  const { response } = await messagingService.retrieveTokens(currentUser.mobileNo);
  
  return response
}

async function processToken (subscribedTokens, fcmToken, oldToken) {
  const currentUser = JSON.parse(
    await loadData(USER),
  );

  if (subscribedTokens !== fcmToken) {
    const { status } = await messagingService.subscribe(
        fcmToken,
        currentUser.mobileNo
    );
    if (status === SUCCESS_STATUS) {
      const { response } = await messagingService.retrieveTokens(currentUser.mobileNo);
      
      if (response.includes(fcmToken)) {
        subscribedTokens = fcmToken;
        saveData(SUBSCRIBED_TOKENS, subscribedTokens);
        saveData(TOKEN_DATE_SUBSCRIBED, currentDate);
      }
      if (oldToken != "" && oldToken != fcmToken) {
        messagingService.unsubscribe(
          oldToken, currentUser.mobileNo
        );
      }
    }
  }
}

export async function setupMessaging() {
  const subscribedTokens = await loadData(SUBSCRIBED_TOKENS);
  const dateVal = await loadData(TOKEN_DATE_SUBSCRIBED);
  if (subscribedTokens == null) {
    const fcmToken = await messaging().getToken();
    processToken(subscribedTokens, fcmToken, "");
  } else {
    const diffDays = daydifference(currentDate, dateVal);
    if (parseInt(diffDays)>2) {
      const oldToken = await messaging().getToken();
      await messaging().deleteToken();
      const fcmToken = await messaging().getToken();
      processToken(subscribedTokens, fcmToken, oldToken);
    }
  }
}


function daydifference(dt2, dt1) {
  const day2 = dt2;
  const day1 = dt1;

  return Math.abs((day2-day1) / (1000 * 3600 * 24));
 }

// when notification opens app from quitted state
messaging().getInitialNotification().then(
    (remoteMessage) => {
      console.log({remoteMessage});
    },
);

// when notification opens app from paused state
messaging().onNotificationOpenedApp(
    (remoteMessage) => {
      console.log({remoteMessage});
    },
);

let hasAppBeenPaused = false;
AppState.addEventListener('change', () => {
  switch (AppState.currentState) {
    case 'active':
      hasAppBeenPaused ?
        onAppResume() :
        onAppStart();
      break;
    case 'background':
      hasAppBeenPaused = true;
      onAppPause();
      break;
    default:
      return null;
  }
});
