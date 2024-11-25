import remoteConfig from '@react-native-firebase/remote-config';
import { APP_VERSION } from '../constants/api-resources';


function getRemoteConfigValue(key) {
  return remoteConfig().getValue(key);
}

const latestAppVersion = getRemoteConfigValue('latest_app_version');
console.log({latestAppVersion});

export const isUpdateAvailable = APP_VERSION !== latestAppVersion;
export const updateUrl = getRemoteConfigValue('latest_app_url');
