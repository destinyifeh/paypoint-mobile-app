import { ADD_ARTICLE } from '../../../constants/action-types/temp';

const initialState = {
  articles: []
};

export default function tempReducer(state = initialState, action) {
  switch(action.type) {
    case ADD_ARTICLE:
      
      return {
        ...state,
        articles: action.payload
      }

    default: 
      return state;
  }
};
