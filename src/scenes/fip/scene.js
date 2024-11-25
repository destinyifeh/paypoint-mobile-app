import React from 'react';
import {ImageBackground, Text, View} from 'react-native';

import {connect} from 'react-redux';
import Platform from '../../services/api/resources/platform';
import {loadData} from '../../utils/storage';
import AccountScene from '../agent/scenes/account';
import LogoutScene from '../logout';
import DisabledScene from '../misc/disabled-scene';
import OverlaySwitch from './components/overlay-switch';
import UnderlayNavigator from './components/underlay-navigator';
import ApplicationScene from './scenes/application';
import CompleteSetupScene from './scenes/complete-setup';
import HomeScene from './scenes/home';
import MonitoringAndSupportScene from './scenes/monitoring-and-support';
import PreSetupAgentScene from './scenes/pre-setup-agent';
import SettingsScene from './scenes/settings';

class OverlaySwitchClone extends React.Component {
  state = {
    imageUri: null,
  };

  componentDidMount() {
    loadData('lastScreen').then(imageUri => {
      console.log('LAST SCREEN', imageUri);
      this.setState({
        imageUri,
      });
    });
  }

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
        }}>
        <ImageBackground
          source={{uri: this.props.lastSceneCapture}}
          // source={{uri: "https://reactjs.org/logo-og.png"}}
          style={{
            flex: 1,
            justifyContent: 'center',
            resizeMode: 'cover',
          }}
        />

        <Text
          style={{
            color: 'red',
            position: 'absolute',
            left: -30,
          }}></Text>
      </View>
    );
  }
}

class MainScene extends React.Component {
  platform = new Platform();

  constructor(props) {
    super(props);

    this.state = {};
  }

  // componentDidMount() {
  //   console.log('FIP SCREEN HAS BEEN ENTERED');
  //   this.checkForActiveUserSession();
  //   this.loadData();

  //   setInterval(async () => {
  //     const authTokenExpired = await this.checkSessionIsExpired();
  //     if (authTokenExpired) {
  //       this.props.navigation.replace('Logout')
  //     }
  //   }, 10000);
  // }

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
  //     )
  //     this.props.navigation.replace('Login');
  //     return
  //   }
  // }

  // async loadAgent() {
  //   const currentAgentResponse = await this.platform.getCurrentAgent();
  //   const currentAgentResponseStatus = currentAgentResponse.status;
  //   const currentAgentResponseObj = currentAgentResponse.response;

  //   console.log(currentAgentResponse);

  //   if (currentAgentResponseStatus === ERROR_STATUS) {
  //     flashMessage(
  //       null,
  //       await handleErrorResponse(currentAgentResponseObj),
  //       BLOCKER
  //     );

  //     this.props.navigation.replace('Logout')

  //     return {}

  //     return JSON.parse(await loadData(AGENT));
  //   }

  //   await saveData(AGENT, currentAgentResponseObj);
  // }

  // async loadApplication() {
  //   const userData = JSON.parse(await loadData(USER));

  //   const currentApplicationResponse = await this.onboarding.getApplicationByEmailOrPhone(userData.mobileNo);
  //   const currentApplicationResponseStatus = currentApplicationResponse.status;
  //   const currentApplicationResponseObj = currentApplicationResponse.response;

  //   console.log('GET APPLICATION RESPONSE', currentApplicationResponse);

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
  //     // await this.loadApplication();
  //     // return
  //   }

  //   this.setState({
  //     isLoading: false
  //   })

  // }

  render() {
    const {enable_fip} = this.props.remoteConfig;

    const routes = {
      Home: <HomeScene />,
      Account: <AccountScene />,
      Application: <ApplicationScene withNavigator />,
      'Complete Setup': <CompleteSetupScene />,
      'Pre-Setup Agent': <PreSetupAgentScene withNavigator />,
      'Monitoring And Support': <MonitoringAndSupportScene />,
      'Sync Data': <SettingsScene />,
      Settings: <SettingsScene />,
      Logout: <LogoutScene navigation={this.props.navigation} />,
    };

    return enable_fip === false ? (
      <DisabledScene
        sceneName="FIP features"
        includeLogoutButton
        includeStatusBar
      />
    ) : (
      <View
        style={{
          height: '100%',
          position: 'absolute',
          width: '100%',
        }}>
        <UnderlayNavigator />
        <OverlaySwitchClone_ />
        <OverlaySwitch routes={routes} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    lastSceneCapture: state.navigation.lastSceneCapture,
    remoteConfig: state.tunnel.remoteConfig,
  };
}

const OverlaySwitchClone_ = connect(mapStateToProps, null)(OverlaySwitchClone);
export default connect(mapStateToProps, null)(MainScene);
