import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {CommonActions} from '@react-navigation/native';
import {AGENT, APPLICATION} from '../../constants';
import {userManagementService} from '../../setup/api';
import {deleteAuthToken, onSessionEnd} from '../../utils/auth';
import {deleteData} from '../../utils/storage';

export default class LogoutScene extends React.Component {
  async componentDidMount() {
    AsyncStorage.getAllKeys().then(content =>
      content.map(item => {
        if (item.includes('cache__') && item.includes('/agents/search')) {
          deleteData(item);
        }
      }),
    );

    deleteData('theLoggedInAgent', {});
    deleteData(AGENT, {});

    deleteData(APPLICATION, {});

    deleteData('accountScenePersistenceKey');
    deleteData('agentMainScenePersistenceKey');
    deleteData('fipMainScenePersistenceKey');
    deleteData('homeScreen');
    deleteData('persistenceKey');
    deleteData('defaultScenePersistenceKey');
    deleteData('reportsScenePersistenceKey');
    deleteData('servicesScenePersistenceKey');
    deleteData('settingsScenePersistenceKey');

    onSessionEnd();

    // Delete authentication token
    await deleteAuthToken();

    // Navigate to the Login screen and reset the navigation stack
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Login', // Updated for modern navigation
            params: {
              didSessionExpire: this.props.route.params?.didSessionExpire, // Access params via route
              navigatedFromLogout: true,
            },
          },
        ],
      }),
    );

    await userManagementService.logout();

    userManagementService.apiRequester.cancelRequests();
  }

  render() {
    return <React.Fragment />;
  }
}
