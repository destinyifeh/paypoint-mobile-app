import {
  SET_IS_LOADING,
  SET_PROPAGATE_FORM_ERRORS,
} from '../../../constants/action-types/forms';


const initialState = {
  propagateFormErrors: false,
};


export default function formsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_PROPAGATE_FORM_ERRORS:
      return {
        ...state,
        propagateFormErrors: action.payload,
      };

    default:
      return state;
  }
};
