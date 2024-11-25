import React from 'react'
import {
  ActivityIndicator,
  InteractionManager,
  Switch,
  View
} from 'react-native'
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import {
  COLOUR_BLUE,
  COLOUR_WHITE, 
  CONTENT_LIGHT
} from '../../../../constants/styles';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import { 
  hideNavigator, 
  showNavigator
} from '../../../../services/redux/actions/navigation'
import ClickableListItem from '../../../../components/clickable-list-item';
import Settings from '../../../../utils/settings';
import { ENVIRONMENT_IS_TEST } from '../../../../constants/api-resources';
import { loadData } from '../../../../utils/storage';
import { USER } from '../../../../constants';


const BIOMETRIC_LOGIN = 'biometric_login';
const NOTIFICATIONS = 'notifications';


class ReportsScene extends React.Component {

  settings = new Settings();

  constructor() {
    super();

    this.state = {

    }

    this.loadData = this.loadData.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      // 2: Component is done animating
      // 3: Start fetching the team
      this.setState({
        animationsDone: true,
      });
    });

    this.loadData();
  }

  async loadData() {
    const { internalAgents } = this.props;

    prevBiometricLoginSetting = await this.settings.getBiometricLogin();
    prevNotificationsSetting = await this.settings.getNotifications();
    const userData_ = JSON.parse(await loadData(USER) || '{}');

    this.setState({
      biometric_login: prevBiometricLoginSetting,
      notifications: prevNotificationsSetting,
    });

    this.setState({
      userIsAnInternalAgent: internalAgents.includes(
        userData_.username
      ),
    })
  }

  onSettingsChange(item, value) {
    switch(item) {
      case NOTIFICATIONS:
        this.settings.notifications = value
        this.setState({
          'notifications': value
        })
        break
      case BIOMETRIC_LOGIN:
        this.settings.biometricLogin = value
        this.setState({
          'biometric_login': value
        })
        break
      default:
        break
    }
  }

  render () {
    const { userIsAnInternalAgent } = this.state;

    if (!this.state.animationsDone) {
      return <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={COLOUR_BLUE} />
      </View>
    }

    return <View 
      onTouchEnd={() => this.props.isNavigatorVisible ? this.props.hideNavigator() : null}
      style={{
        backgroundColor: '#F2F3F3',
        flex: 1
      }}
    >
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        navigationIconColor={COLOUR_WHITE}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="My Settings"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
        withNavigator />

      <ScrollView contentContainerStyle={{
        paddingTop: 30
      }}>
        {/* <ClickableListItem style={{
          alignItems: 'center',
          backgroundColor: COLOUR_WHITE,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 55,
          padding: 10,
          paddingHorizontal: 15,
          marginBottom: 10
        }}
        onPressOut={() => this.props.navigation.navigate('SelectLanguage')}
      >
          <Text black>Language</Text>
          <Text>English</Text>
        </ClickableListItem> */}
        
        {/* <View
          style={{
            alignItems: 'center',
            backgroundColor: COLOUR_WHITE,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 55,
            padding: 10,
            paddingHorizontal: 15,
            marginBottom: 10
          }}
        >
          <Text black>Notifications</Text>
          <Switch 
            value={this.state[NOTIFICATIONS]}
            onValueChange={(value) => this.onSettingsChange(NOTIFICATIONS, value)}
          />
        </View> */}
        
        {(userIsAnInternalAgent || ENVIRONMENT_IS_TEST) && <ClickableListItem
            style={{
              alignItems: 'center',
              backgroundColor: COLOUR_WHITE,
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 55,
              padding: 10,
              paddingHorizontal: 15,
              marginBottom: 10
            }}
            onPressOut={() => this.props.navigation.navigate('DeveloperSettings')}
          >
            <Text black>Developer Settings</Text>
        </ClickableListItem>}
        <View style={{
          alignItems: 'center',
          backgroundColor: COLOUR_WHITE,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 55,
          padding: 10,
          paddingHorizontal: 15,
          marginBottom: 10
        }}>
          <Text black>Use Touch/Face ID</Text>
          <Switch 
            value={this.state[BIOMETRIC_LOGIN]}
            onValueChange={(value) => this.onSettingsChange(BIOMETRIC_LOGIN, value)}
          />
        </View>
      </ScrollView>
        
    </View>
  }
}


function mapStateToProps(state) {
  return {
    internalAgents: state.tunnel.remoteConfig.account_opening_pilot_group,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsScene)
