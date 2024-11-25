import { 
  ADD_REQUERIED_TRANSACTION,
  DISMISS_ERROR_MESSAGE, 
  DISMISS_SUCCESS_MESSAGE, 
  FLASH_ERROR_MESSAGE, 
  FLASH_SUCCESS_MESSAGE, 
  ON_SCREEN_CHANGE,
  SET_CLEAR_SESSION,
  SET_IS_FAST_REFRESH_PENDING,
  SET_IS_UPDATE_AVAILABLE,
  SET_QUICK_ACTION,
  SET_SCREEN_AFTER_LOGIN,
  UPDATE_LOADING,
  UPDATE_NETWORK_STATUS,
  UPDATE_OTP,
  UPDATE_REMOTE_CONFIG,
  REFRESH_DASHBOARD,
  UPDATE_APP_STATE,
} from '../../../constants/action-types/tunnel';
import { DEFAULT_REMOTE_CONFIG_VALUES } from '../../../constants/api-resources';

const initialState = {
  appState: null,
  errorMessage: null,
  isFastRefreshPending: false,
  isLoading: false,
  loadingPercentage: 66,
  otp: null,
  navigationState: {
    currentRouteName: null,
    previousRouteName: null,
  },
  networkStatus: null,
  requeryTransactionBucket: {},
  remoteConfig: DEFAULT_REMOTE_CONFIG_VALUES,
};

export default function tunnelReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_REQUERIED_TRANSACTION:
      const { requeryTransactionBucket } = state;
      requeryTransactionBucket[action.payload.transactionRef] = action.payload;

      return {
        ...state,
        requeryTransactionBucket
      }

    case SET_CLEAR_SESSION: 
      console.log('DISMISS ERROR MESSAGE CALLD')
      return {
        ...state,
        clearSession: action.payload,
      }

    case DISMISS_ERROR_MESSAGE: 
      console.log('DISMISS ERROR MESSAGE CALLD')
      return {
        ...state,
        errorMessage: null
      }

    case DISMISS_SUCCESS_MESSAGE: 
      console.log('DISMISS SUCCESS MESSAGE CALLD')
      return {
        ...state,
        successMessage: null
      }

    case FLASH_ERROR_MESSAGE:
      console.log('FLASH ERROR MESSAGE CALLD')
      return {
        ...state,
        errorMessage: action.payload
      }

    case FLASH_SUCCESS_MESSAGE:
      console.log('FLASH SUCCESS MESSAGE CALLD')
      return {
        ...state,
        successMessage: action.payload
      }

    case ON_SCREEN_CHANGE:
      return {
        ...state,
        navigationState: action.payload,
      }

    case REFRESH_DASHBOARD:
      return {
        ...state,
        refreshDashboard: action.payload
      };

    case SET_IS_FAST_REFRESH_PENDING:
      return {
        ...state,
        isFastRefreshPending: action.payload
      }

    case SET_IS_UPDATE_AVAILABLE:
      return {
        ...state,
        isUpdateAvailable: action.payload
      }

    case SET_QUICK_ACTION:
      console.log('SETTING QUICK ACTION!!!!', action.payload)
      return {
        ...state,
        quickAction: action.payload,
      }

    case SET_SCREEN_AFTER_LOGIN:
      return {
        ...state,
        screenAfterLogin: action.payload,
      }

    case UPDATE_APP_STATE:
      console.log('UPDATING APP STATE', action.payload)
      return {
        ...state,
        appState: action.payload,
      }

    case UPDATE_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading !== undefined ? action.payload.isLoading : action.payload,
        loadingPercentage: action.payload.percentage || 66
      }

    case UPDATE_NETWORK_STATUS:
      return {
        ...state,
        networkStatus: action.payload,
      }

    case UPDATE_OTP:
      return {
        ...state,
        otp: action.payload,
      }

    case UPDATE_REMOTE_CONFIG:
      return {
        ...state,
        remoteConfig: action.payload
      }
      
    default: 
      return state;
  }
};
