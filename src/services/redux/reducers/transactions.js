import {
  REPLACE_CART,
  REPLACE_DISABLED_PRIMARY_CHOICES,
  SET_INITIATE_RESPONSE,
  SET_PROCEED_RESPONSE,
  SET_SELECTED_SUB_OPTION,
  SET_SUB_OPTION_DATA,
  SET_SUB_OPTIONS,
  SET_SUB_OPTIONS_NAME,
} from '../../../constants/action-types/transactions';


const initialState = {
  cart: [],
  disabledPrimaryChoices: [],
  initiateResponse: null,
  proceedResponse: null,
  propagateFormErrors: false,
  selectedSubOption: null,
  subOptionData: null,
  subOptions: null,
  subOptionsName: null,
};


export default function transactionsReducer(state = initialState, action) {
  switch (action.type) {
    case REPLACE_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case REPLACE_DISABLED_PRIMARY_CHOICES:
      return {
        ...state,
        disabledPrimaryChoices: action.payload,
      };
    case SET_INITIATE_RESPONSE:
      return {
        ...state,
        initiateResponse: action.payload,
      };
    case SET_PROCEED_RESPONSE:
      return {
        ...state,
        proceedResponse: action.payload,
      };
    case SET_SELECTED_SUB_OPTION:
      return {
        ...state,
        selectedSubOption: action.payload,
      };
    case SET_SUB_OPTIONS:
      return {
        ...state,
        subOptions: action.payload,
      };
    case SET_SUB_OPTION_DATA:
      return {
        ...state,
        subOptionData: action.payload,
      };
    case SET_SUB_OPTIONS_NAME:
      return {
        ...state,
        subOptionsName: action.payload,
      };
    default:
      return state;
  }
};
