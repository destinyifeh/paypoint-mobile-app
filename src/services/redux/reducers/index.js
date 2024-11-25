import { combineReducers } from 'redux';

import fmpaTunnelReducer from './fmpa-tunnel';
import formsReducer from './forms';
import navigationReducer from './navigation';
import rolesSceneReducer from './roles-scene';
import tempReducer from './temp';
import transactionsReducer from './transactions';
import tunnelReducer from './tunnel';
import usersSceneReducer from './users-scene';

export default combineReducers({
  fmpaTunnel: fmpaTunnelReducer, 
  forms: formsReducer,
  navigation: navigationReducer,
  rolesScene: rolesSceneReducer,
  temp: tempReducer,
  transactions: transactionsReducer,
  tunnel: tunnelReducer,
  usersScene: usersSceneReducer
});
