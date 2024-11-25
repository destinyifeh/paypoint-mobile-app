import { 
  DO_REFRESH_VIEW_ROLES, 
  REFRESHING_VIEW_ROLES
} from "../../../constants/action-types/roles-scene";

const initialState = {
  doRefreshViewRoles: false,
};

export default function rolesSceneReducer(state = initialState, action) {
  switch(action.type) {
    case DO_REFRESH_VIEW_ROLES:
      return {
        ...state,
        doRefreshViewRoles: true
      }

    case REFRESHING_VIEW_ROLES: 
      return {
        ...state,
        doRefreshViewRoles: false
      };

    default: 
      return state;
  }
};
