import React from 'react';
import {View} from 'react-native';

import ActivityIndicator from '../../components/activity-indicator';
import Text from '../../components/text';
import Onboarding from '../../services/api/resources/onboarding';
import Platform from '../../services/api/resources/platform';
import UserManagement from '../../services/api/resources/user-management';
import Landing from '../aggregator/scenes/landing';
import LogoutScene from '../logout';
import DisabledScene from '../misc/disabled-scene';
import ErrorOccurred from '../misc/error-occurred';
import PrinterSetup from '../printer-setup';
import OverlaySwitch from './components/overlay-switch';
import UnderlayNavigator from './components/underlay-navigator';
import AccountScene from './scenes/account';
import POSManagementScene from './scenes/account/pos-management';
import AgentManagement from './scenes/agent-management';
import ApplicationsManagement from './scenes/applications-management';
import HomeScene from './scenes/home';
import ReportsScene from './scenes/reports';
import ServicesScene from './scenes/services';
import SettingsScene from './scenes/settings';
import StaffManagement from './scenes/staff-management';

class OverlaySwitchClone extends React.Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          height: '50%',
          opacity: 0.3,
          top: '25%',
          left: 290,
          position: 'absolute',
          width: '50%',
        }}></View>
    );
  }
}

export default class MainScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();
  userManagement = new UserManagement();

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    // this.checkForActiveUserSession();
    // this.loadData();
    // setInterval(async () => {
    //   const authTokenExpired = await this.checkSessionIsExpired();
    //   if (authTokenExpired) {
    //     this.props.navigation.replace('Logout')
    //   }
    // }, 10000);
    // Moved to App.js
    // appSessionTimer.initialize({
    //   onEnd: () => {
    //     flashMessage(
    //       'Session Expired',
    //       'Your session has expired! Please, login again.',
    //       BLOCKER
    //     )
    //     this.props.navigation.replace('Logout')
    //   },
    //   timeout: parseInt(IDLE_TIMEOUT)
    // })
    // appSessionTimer.start();
  }

  // async checkSessionIsExpired() {
  //   const { authTokenExpiry } = await retrieveAuthToken();
  //   const currentDate = new Date();
  //   return (currentDate.valueOf() / 1000) > JSON.parse(authTokenExpiry);
  // }

  // async checkForActiveUserSession() {
  //   const { authToken } = await retrieveAuthToken();
  //   if (!authToken) {
  //     flashMessage(
  //       APP_NAME,
  //       EXPIRED_SESSION_MESSAGE,
  //       BLOCKER
  //     );
  //     this.props.navigation.replace('Login');
  //     return
  //   }
  // }

  // async loadAgent() {
  //   const currentAgentResponse = await this.platform.getCurrentAgent();
  //   const currentAgentResponseStatus = currentAgentResponse.status;
  //   const currentAgentResponseObj = currentAgentResponse.response;

  //   console.log({ });

  //   if (currentAgentResponseStatus === ERROR_STATUS) {
  //     flashMessage(
  //       null,
  //       await handleErrorResponse(currentAgentResponseObj),
  //       BLOCKER
  //     );

  //     this.props.navigation.replace('Logout')

  //     return {}

  //     // return JSON.parse(await loadData(AGENT));
  //   }

  //   await saveData(AGENT, currentAgentResponseObj);
  // }

  // async loadApplication(currentUser) {
  //   const currentApplicationResponse = await this.onboarding.getApplicationByEmailOrPhone(currentUser.mobileNo);
  //   const currentApplicationResponseStatus = currentApplicationResponse.status;
  //   const currentApplicationResponseObj = currentApplicationResponse.response;

  //   console.log('GET APPLICATION RESPONSE agent/scene.js', currentApplicationResponse);

  //   if (currentApplicationResponseStatus === ERROR_STATUS) {
  //     flashMessage(
  //       null,
  //       await handleErrorResponse(currentApplicationResponseObj),
  //       BLOCKER
  //     );

  //     this.props.navigation.replace('Logout')

  //     return {}

  //     return JSON.parse(await loadData(APPLICATION));
  //   }

  //   await saveData(APPLICATION, currentApplicationResponseObj);
  // }

  // async loadUser() {
  //   return JSON.parse(await loadData(USER));

  //   const currentUserResponse = await this.platform.getCurrentUser();
  //   const currentUserResponseStatus = currentUserResponse.status;
  //   const currentUserResponseObj = currentUserResponse.response;

  //   console.log(currentUserResponse);

  //   if (currentUserResponseStatus === ERROR_STATUS) {
  //     flashMessage(
  //       null,
  //       await handleErrorResponse(currentUserResponseObj),
  //       BLOCKER
  //     );

  //     this.props.navigation.replace('Logout')

  //     return {}
  //   }

  //   await saveData(USER, currentUserResponseObj);

  //   return currentUserResponseObj;
  // }

  // async loadData() {
  //   this.setState({
  //     isLoading: true
  //   })

  //   const currentUser = await this.loadUser();

  //   const serializedUser = new UserSerializer(currentUser);
  //   if (serializedUser.isAgent) {
  //     await this.loadAgent();
  //     // return
  //   } else if (serializedUser.isApplicant) {
  //     await this.loadApplication(currentUser);
  //     // return
  //   }

  //   this.setState({
  //     isLoading: false
  //   })

  // }

  render() {
    const {enable_agent} = this.props.remoteConfig;
    const {clear} = this.props.route.params || {};
    const routes = {
      Home: <HomeScene />,
      Account: <AccountScene />,
      POSManagement: <POSManagementScene />,
      Reports: <ReportsScene />,
      Services: <ServicesScene />,
      Settings: <SettingsScene />,
      'Agent Management': <AgentManagement />,
      Applications: <ApplicationsManagement />,
      AggregatorLanding: <Landing navigation={this.props.navigation} />,
      'Staff Management': <StaffManagement />,
      'Setup Printer': <PrinterSetup />,
      Logout: <LogoutScene navigation={this.props.navigation} />,
    };

    if (this.state.isLoading) {
      return (
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}>
          <ActivityIndicator
            containerStyle={{
              flex: 0.25,
            }}
          />
          <Text big center>
            We are setting up for you.. Please, wait!
          </Text>
        </View>
      );
    }

    if (this.state.errorOccured) {
      return <ErrorOccurred onRetry={() => this.loadData()} />;
    }

    return enable_agent === false ? (
      <DisabledScene sceneName="Agent features" />
    ) : (
      <View
        style={{
          height: '100%',
          position: 'absolute',
          width: '100%',
        }}>
        <UnderlayNavigator clear={clear} navigation={this.props.navigation} />
        <OverlaySwitchClone />
        <OverlaySwitch routes={routes} />
      </View>
    );
  }
}
