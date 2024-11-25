import { saveData, loadData } from './storage';
import { USER } from '../constants';


const DEFAULT_SETTINGS_NOTIFICATION = true;
const DEFAULT_SETTINGS_BIOMETRIC_LOGIN = false;

const SETTINGS_NOTIFICATION = 'settings_notification';
const SETTINGS_BIOMETRIC_LOGIN = 'settings_biometric_login';
const BIOMETRIC_LOGIN_BLACKLIST = 'biometric_login_blacklist';


export default class Settings {
  set notifications(value) {
    saveData(SETTINGS_NOTIFICATION, value);
  }

  async getNotifications() {
    const settingsNotification = JSON.parse(await loadData(SETTINGS_NOTIFICATION));
    return settingsNotification === null ? DEFAULT_SETTINGS_NOTIFICATION : settingsNotification;
  }

  set biometricLogin(value) {
    saveData(SETTINGS_BIOMETRIC_LOGIN, value);
  }

  async blacklistCurrentUserFromBiometricLogin() {
    const { username } = JSON.parse(await loadData(USER));
    const currentBiometricLoginBlacklist = JSON.parse(
      await loadData(BIOMETRIC_LOGIN_BLACKLIST) || "[]"
    );

    if (!currentBiometricLoginBlacklist.includes(username)) {
      await saveData(
        BIOMETRIC_LOGIN_BLACKLIST,
        [
          ...currentBiometricLoginBlacklist,
          username
        ]
      );
    }
  }

  async checkIfCurrentUserIsBlacklistedFromBiometricLogin() {
    const { username } = JSON.parse(await loadData(USER));
    const currentBiometricLoginBlacklist = JSON.parse(
      await loadData(BIOMETRIC_LOGIN_BLACKLIST) || "[]"
    );

    const resp = currentBiometricLoginBlacklist.includes(username);

    console.log({ currentBiometricLoginBlacklist, username, resp})

    return currentBiometricLoginBlacklist.includes(username);
  }

  async checkIfCurrentUserHasSelectedBiometricLogin() {
    const settingsBiometricLogin = JSON.parse(await loadData(SETTINGS_BIOMETRIC_LOGIN));
    return settingsBiometricLogin !== null;
  }

  async getBiometricLogin() {
    const settingsBiometricLogin = JSON.parse(await loadData(SETTINGS_BIOMETRIC_LOGIN));
    return settingsBiometricLogin === null ? DEFAULT_SETTINGS_BIOMETRIC_LOGIN : settingsBiometricLogin;
  }
}
