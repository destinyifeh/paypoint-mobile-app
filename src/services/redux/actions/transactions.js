import {
  REPLACE_CART,
  REPLACE_DISABLED_PRIMARY_CHOICES,
  SET_INITIATE_RESPONSE,
  SET_PROCEED_RESPONSE,
  SET_SELECTED_SUB_OPTION,
  SET_SUB_OPTIONS,
  SET_SUB_OPTIONS_NAME,
  SET_SUB_OPTION_DATA,
} from '../../../constants/action-types/transactions';


export function replaceCart(newCart) {
  return {
    type: REPLACE_CART,
    payload: newCart,
  };
}


export function replaceDisabledPrimaryChoices(newDisabledPrimaryChoices) {
  return {
    type: REPLACE_DISABLED_PRIMARY_CHOICES,
    payload: newDisabledPrimaryChoices,
  };
}

export function setInitiateResponse(payload) {
  return {
    type: SET_INITIATE_RESPONSE,
    payload,
  };
}


export function setProceedResponse(payload) {
  return {
    type: SET_PROCEED_RESPONSE,
    payload,
  };
}


export function setSelectedSubOption(payload) {
  return {
    type: SET_SELECTED_SUB_OPTION,
    payload,
  };
}


export function setSubOptionData(payload) {
  return {
    type: SET_SUB_OPTION_DATA,
    payload,
  };
}


export function setSubOptions(payload) {
  return {
    type: SET_SUB_OPTIONS,
    payload,
  };
}


export function setSubOptionsName(payload) {
  return {
    type: SET_SUB_OPTIONS_NAME,
    payload,
  };
}
