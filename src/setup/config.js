import remoteConfig from '@react-native-firebase/remote-config';
import { USER } from '../constants';

import { DEFAULT_REMOTE_CONFIG_VALUES, REMOTE_CONFIG_KEYS, REMOTE_CONFIG_REFRESH_INTERVAL_IN_SECONDS } from '../constants/api-resources';
import { updateRemoteConfig } from '../services/redux/actions/tunnel';
import reduxStore from '../services/redux/store';
import { loadData } from '../utils/storage';


const cacheLifespanSeconds = 10;

async function patchRemoteConfigValues(remoteConfig) {
  const data = await loadData(USER) || '{}';
  userData = JSON.parse(data);

  return {
    ...remoteConfig,
    userIsAnInternalAgent: (
      remoteConfig.account_opening_pilot_group.includes(userData.username)
    ),
  };
}

export async function getRemoteConfig() {
  await remoteConfig().fetch(cacheLifespanSeconds);
  await remoteConfig().activate();
  // await remoteConfig().activateFetched();


  const snapshot = await remoteConfig().getAll();


  let config = DEFAULT_REMOTE_CONFIG_VALUES;

  REMOTE_CONFIG_KEYS.map(
      (key) => {
        let value = snapshot[key].asString();

        try {
          value = JSON.parse(value);
        } catch {
          null;
        }

        config[key] = value;
      },
  );

  config = await patchRemoteConfigValues(config);


  reduxStore.dispatch(updateRemoteConfig(config));
}

getRemoteConfig();
setInterval(() => getRemoteConfig(), REMOTE_CONFIG_REFRESH_INTERVAL_IN_SECONDS * 1000);
