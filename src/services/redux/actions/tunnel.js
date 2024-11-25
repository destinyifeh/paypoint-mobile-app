import { 
  ADD_REQUERIED_TRANSACTION,
  DISMISS_ERROR_MESSAGE, 
  DISMISS_SUCCESS_MESSAGE, 
  FLASH_ERROR_MESSAGE, 
  FLASH_SUCCESS_MESSAGE,
  SET_IS_FAST_REFRESH_PENDING, 
  SET_IS_UPDATE_AVAILABLE,
  SET_QUICK_ACTION,
  SET_SCREEN_AFTER_LOGIN,
  ON_SCREEN_CHANGE,
  UPDATE_APP_STATE,
  UPDATE_LOADING,
  UPDATE_NETWORK_STATUS,
  UPDATE_REMOTE_CONFIG,
} from '../../../constants/action-types/tunnel';


export function addRequeriedTransaction(transaction) {
  return {
    type: ADD_REQUERIED_TRANSACTION,
    payload: transaction
  }
}

export function dismissErrorMessage() {
  return {
    type: DISMISS_ERROR_MESSAGE
  }
}

export function dismissSuccessMessage() {
  return {
    type: DISMISS_SUCCESS_MESSAGE
  }
}

export function flashErrorMessage(payload) {
  return {
    type: FLASH_ERROR_MESSAGE,
    payload
  }
}

export function flashSuccessMessage(payload) {
  return {
    type: FLASH_SUCCESS_MESSAGE,
    payload
  }
}

export function onScreenChange(navigationState) {
  return {
    type: ON_SCREEN_CHANGE,
    payload: navigationState
  }
}

export function setIsFastRefreshPending(payload) {
  return {
    type: SET_IS_FAST_REFRESH_PENDING,
    payload
  }
}

export function setIsUpdateAvailable(payload) {
  return { 
    type: SET_IS_UPDATE_AVAILABLE,
    payload
  }
};

export function setQuickAction(payload) {
  return { 
    type: SET_QUICK_ACTION,
    payload
  }
};

export function setScreenAfterLogin(payload) {
  return { 
    type: SET_SCREEN_AFTER_LOGIN,
    payload
  }
};

// Update app state to one of "suspended", "suspending", "activating", "active"
export function updateAppState(payload) {
  return {
    type: UPDATE_APP_STATE,
    payload,
  };
}

export function updateLoading(payload) {
  return { 
    type: UPDATE_LOADING,
    payload
  }
};

export function updateNetworkStatus(payload) {
  return {
    type: UPDATE_NETWORK_STATUS,
    payload
  }
}

export function updateOtp(payload) {
  return {
    type: UPDATE_OTP,
    payload
  }
}

export function updateRemoteConfig(payload) {
  return { 
    type: UPDATE_REMOTE_CONFIG,
    payload
  }
};
