import {
  SET_IS_LOADING,
  SET_PROPAGATE_FORM_ERRORS,
} from '../../../constants/action-types/forms';


export function setIsLoading(isLoading) {
  return {
    type: SET_IS_LOADING,
    payload: isLoading,
  };
}


export function setPropagateFormErrors(propagateFormErrors) {
  console.log('SETTING PROPAGATE FORM ERRORS', {propagateFormErrors});
  return {
    type: SET_PROPAGATE_FORM_ERRORS,
    payload: propagateFormErrors,
  };
}
