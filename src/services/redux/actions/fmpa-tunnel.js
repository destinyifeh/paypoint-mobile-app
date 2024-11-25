import {
  RESET_APPLICATION, 
  UPDATE_APPLICATION,
} from '../../../constants/action-types/fmpa-tunnel'
import { flashMessage } from '../../../utils/dialog';
import { BLOCKER } from '../../../constants/dialog-priorities';

export function resetApplication() {
  return {
    type: RESET_APPLICATION
  }
}

export function updateApplication(application) {
  const { declineReason } = application;

  return {
    type: UPDATE_APPLICATION,
    application
  }
}
