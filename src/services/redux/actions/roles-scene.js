import {
  DO_REFRESH_VIEW_ROLES,
  REFRESHING_VIEW_ROLES
} from '../../../constants/action-types/roles-scene';

export function doRefreshViewRoles() {
  return {
    type: DO_REFRESH_VIEW_ROLES
  }
}

export function refreshingViewRoles() {
  return {
    type: REFRESHING_VIEW_ROLES
  }
}
