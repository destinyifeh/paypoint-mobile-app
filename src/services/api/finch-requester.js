import Requester from "./requester";
import NavigationService from '../../utils/navigation-service';
import { 
  CACHE_LIFESPAN_IN_MILLISECONDS, 
  FORCE_LOGOUT_ON_401_RESPONSE
} from "../../constants/api-resources";
import { BLOCKER } from "../../constants/dialog-priorities";
import { isAuthTokenExpired, retrieveAuthToken } from "../../utils/auth";
import { flashMessage } from "../../utils/dialog";
import { deleteData, loadData, saveData } from "../../utils/storage";
import { getCurrentTime } from "../../utils/time";
import store from "../redux/store";
import { NO_AUTH_SCREENS } from "../../constants";


const defaultExpiryTime = new Date(new Date().setHours(24, 0, 0, 0)).valueOf();


export default class FinchRequester extends Requester {
  forceLogout() {
    if (store.getState().tunnel.navigationState.currentScreen !== 'Logout') {
      NavigationService.replace('Logout', {
        didSessionExpire: true,
      });
    }
  }

  async _handle401Error() {
    console.log('HANDLING 401 ERROR');
    const reduxStore = store.getState();
    const { 
      tunnel: { 
        navigationState: { currentScreen } 
      } 
    } = reduxStore;
    console.log( {reduxStore});
    console.log('YOU ARE IN', currentScreen, {NO_AUTH_SCREENS});

    // axiosSource.cancel();

    // Log the user out based on token expiry.
    // isAuthTokenExpired().then(
    //   hasAuthExpired => {
    //     const isSessionActive = (
    //       hasAuthExpired === null ? null : !hasAuthExpired
    //     );

    //     if (
    //       isSessionActive === true &&
    //       FORCE_LOGOUT_ON_401_RESPONSE &&
    //       !NO_AUTH_SCREENS.includes(currentScreen)
    //     ) {
    //       this.forceLogout();
    //     }
    //   }
    // );

    if (
      FORCE_LOGOUT_ON_401_RESPONSE &&
      !NO_AUTH_SCREENS.includes(currentScreen)
    ) {
      this.forceLogout();
    }
  }

  _cacheKey(url, args) {
    if (!args) {
      return `cache__${url}`;
    }

    const urlEncoded = new URLSearchParams(args);
    return `cache__${url}?${urlEncoded.toString()}`;
  }

  _extractResponseDataFromCachedData(data) {
    console.log('EXTRACTING FROM CACHE', data)
    return data;
  }

  async _fetchDataFromCache(url, args) {
    const readFromCache = store.getState().tunnel.remoteConfig.read_from_cache;
    if (!readFromCache) {
      return null;
    }

    const cacheKey = this._cacheKey(url, args);
    const cachedData = await loadData(cacheKey);
    if (!cachedData) {
      return null;
    }

    const cachedDataJson = JSON.parse(cachedData);
    if (this._hasCachedDataExpired(cachedDataJson)) {
      await deleteData(cacheKey);
      return null;
    }

    return this._extractResponseDataFromCachedData(cachedDataJson);
  }

  _hasCachedDataExpired({expiry}) {
    return getCurrentTime() >= expiry;
  }

  _packageResponseDataAsCachedData(data, expiry) {
    return {
      ...data,
      expiry,
    }
  }

  async _saveDataToCache(url, args, data, expiry) {
    const cacheKey = this._cacheKey(url, args);
    cacheExpiry = expiry 
      ? new Date((new Date().valueOf() / 1000 + expiry) * 1000).valueOf()
      : defaultExpiryTime;

    console.log(cacheKey, 'expiring in', cacheExpiry)
    await saveData(cacheKey, this._packageResponseDataAsCachedData(data, cacheExpiry));
  }
}
