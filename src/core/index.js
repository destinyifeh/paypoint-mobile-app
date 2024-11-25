import AsyncStorage from '@react-native-async-storage/async-storage';
import {IDLE_TIMEOUT_IN_SECONDS} from '../constants/api-resources';
import {updateAppState} from '../services/redux/actions/tunnel';
import store from '../services/redux/store';
import {
  isAuthTokenExpired,
  onAppSessionExpire,
  onNewSessionBegin,
  retrieveAuthToken,
} from '../utils/auth';

export const APP_STATES = {
  ACTIVATING: 'ACTIVATING',
  ACTIVE: 'ACTIVE',
  SUSPENDING: 'SUSPENDING',
  SUSPENDED: 'SUSPENDED',
};
const PERSISTENCE_KEY = 'persistenceKey';

let appPauseTime = null;

function checkIdleSessionValidity() {
  const currentTime = new Date().valueOf();
  const appSuspenseDurationInSeconds = (currentTime - appPauseTime) / 1000;

  console.log({appSuspenseDurationInSeconds});

  return appSuspenseDurationInSeconds < IDLE_TIMEOUT_IN_SECONDS;
}

async function checkThatSessionsAreStillValid() {
  const {authToken} = await retrieveAuthToken();
  const sessionIsStillActive = authToken !== null;

  if (!sessionIsStillActive) {
    return;
  }

  if (appPauseTime) {
    const isAppSessionValid = checkIdleSessionValidity();
    if (!isAppSessionValid) {
      console.log('IDLE TIMEOUT');
      onAppSessionExpire('IDLE');
      console.log('ON APP SESSION EXPIRE FINISHED');
      return;
    }
  }

  const hasAuthTokenExpired = await isAuthTokenExpired();
  if (hasAuthTokenExpired) {
    const navigationStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
    const navigationState = JSON.parse(navigationStateString);

    const currentScreen =
      navigationState.routes[navigationState.index].routeName;
    if (
      currentScreen === 'Login' ||
      currentScreen === 'Welcome' ||
      currentScreen === 'ForgotPassword' ||
      currentScreen === 'Signup' ||
      currentScreen === 'Landing' ||
      currentScreen === 'Logout'
    ) {
      console.log('CURRENT SCREEN IS NO AUTH, SO NOT BOTHERING TO LOGOUT');
      return;
    }

    console.log('AUTH TOKEN TIMEOUT!');
    onAppSessionExpire('TOKEN');
  } else if (hasAuthTokenExpired === false && !appPauseTime) {
    onNewSessionBegin();
  }
}

export function onAppPause() {
  store.dispatch(updateAppState(APP_STATES.SUSPENDING));

  appPauseTime = new Date().valueOf();

  store.dispatch(updateAppState(APP_STATES.SUSPENDED));
}

export async function onAppResume() {
  store.dispatch(updateAppState(APP_STATES.ACTIVATING));

  console.log('ON APP RESUME');

  await checkThatSessionsAreStillValid();

  store.dispatch(updateAppState(APP_STATES.ACTIVE));
}

export function onAppStart() {
  store.dispatch(updateAppState(APP_STATES.ACTIVATING));

  console.log('ON APP START');

  checkThatSessionsAreStillValid();

  store.dispatch(updateAppState(APP_STATES.ACTIVE));
}
