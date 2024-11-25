import { DO_REFRESH_VIEW_USERS, REFRESHING_VIEW_USERS } from "../../../constants/action-types/users-scene";

const initialState = {
  doRefreshViewUsers: false,
};

export default function usersSceneReducer(state = initialState, action) {
  switch(action.type) {
    case DO_REFRESH_VIEW_USERS:
      return {
        ...state,
        doRefreshViewUsers: true
      }

    case REFRESHING_VIEW_USERS: 
      return {
        ...state,
        doRefreshViewUsers: false
      };

    default: 
      return state;
  }
};
