import {
  DO_REFRESH_VIEW_USERS,
  REFRESHING_VIEW_USERS
} from '../../../constants/action-types/users-scene';

export function doRefreshViewUsers() {
  return {
    type: DO_REFRESH_VIEW_USERS
  }
}

export function refreshingViewUsers() {
  return {
    type: REFRESHING_VIEW_USERS
  }
}
