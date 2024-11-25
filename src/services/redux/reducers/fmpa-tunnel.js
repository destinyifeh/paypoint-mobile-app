import { AGENT_TYPE_ID } from '../../../constants';
import { RESET_APPLICATION, UPDATE_APPLICATION } from '../../../constants/action-types/fmpa-tunnel';

const DEFAULT_APPLICATION = {
  agentTypeId: AGENT_TYPE_ID,
  applicantDetails: {
    nextOfKin: {}
  },
  businessDetails: {},
  howYouHeardAboutUs: 'Referred by an Agent',
};

const initialState = {
  application: DEFAULT_APPLICATION,
};

export default function tunnelReducer(state = initialState, action) {
  switch(action.type) {   
    case UPDATE_APPLICATION: 
      return {
        ...state,
        application: action.application,
      }

    case RESET_APPLICATION: 
      return {
        ...state,
        application: DEFAULT_APPLICATION,
      }

    default: 
      return state;
  }
};
