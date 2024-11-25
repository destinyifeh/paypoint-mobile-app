import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import {connect} from 'react-redux';
import Button from '../../../components/button';
import {USER} from '../../../constants';
import {COLOUR_BLUE, COLOUR_WHITE} from '../../../constants/styles';
import {resetApplication} from '../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  navigateTo,
} from '../../../services/redux/actions/navigation';
import {loadData} from '../../../utils/storage';

class UnderlayNavigator extends React.Component {
  state = {
    active: 'home',
    user: {},
  };

  persistenceKey = 'fipMainScenePersistenceKey';
  scenes = {
    'Complete Setup': 'complete-setup',
    Home: 'home',
    'Monitoring And Support': 'monitoring-and-support',
    Settings: 'my-settings',
    'Pre-Setup Agent': 'pre-setup-agent',
    'Sync Data': 'sync-data',
    Account: 'my-account',
  };

  constructor(props) {
    super(props);

    this.onAccountButtonPress = this.onAccountButtonPress.bind(this);
    this.onCompleteSetupButtonPress =
      this.onCompleteSetupButtonPress.bind(this);
    this.onHomeButtonPress = this.onHomeButtonPress.bind(this);
    this.onLogoutButtonPress = this.onLogoutButtonPress.bind(this);
    this.onMonitoringAndSupportButtonPress =
      this.onMonitoringAndSupportButtonPress.bind(this);
    this.onPreSetupAgentButtonPress =
      this.onPreSetupAgentButtonPress.bind(this);
    this.onSettingsButtonPress = this.onSettingsButtonPress.bind(this);
    this.onSyncDataButtonPress = this.onSyncDataButtonPress.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem(this.persistenceKey).then(response => {
      this.props.navigateTo(response);
      this.setState({
        active: this.scenes[response || 'Home'],
      });
    });

    loadData(USER).then(response => {
      this.setState({
        user: JSON.parse(response),
      });
    });
  }

  onAccountButtonPress() {
    this.props.navigateTo('Account');
    this.onNavigate('Account');
    this.setState({
      active: 'my-account',
    });
  }

  onCompleteSetupButtonPress() {
    this.props.navigateTo('Complete Setup');
    this.onNavigate('Complete Setup');
    this.setState({
      active: 'complete-setup',
    });
  }

  onHomeButtonPress() {
    this.props.navigateTo('Home');
    this.onNavigate('Home');
    this.setState({
      active: 'home',
    });
  }

  onLogoutButtonPress() {
    this.onNavigate('Home');
    this.setState({
      active: 'home',
    });

    this.props.navigateTo('Logout');

    setTimeout(() => this.props.navigateTo('Home'), 1000);
  }

  onMonitoringAndSupportButtonPress() {
    this.props.navigateTo('Monitoring And Support');
    this.onNavigate('Monitoring And Support');
    this.setState({
      active: 'monitoring-and-support',
    });
  }

  async onNavigate(scene) {
    this.props.hideNavigator();
    try {
      await AsyncStorage.setItem(this.persistenceKey, scene);
    } catch (err) {
      // handle the error according to your needs
    }
  }

  onPreSetupAgentButtonPress() {
    this.props.resetApplication();

    this.props.navigateTo('Home');
    this.onNavigate('Pre-Setup Agent');
    this.setState({
      active: 'pre-setup-agent',
    });
  }

  onServicesButtonPress() {
    this.props.navigateTo('Services');
    this.onNavigate('Services');
    this.setState({
      active: 'my-services',
    });
  }

  onSettingsButtonPress() {
    this.props.navigateTo('Settings');
    this.onNavigate('Settings');
    this.setState({
      active: 'settings',
    });
  }

  onSyncDataButtonPress() {
    this.props.navigateTo('Sync Data');
    this.onNavigate('Sync Data');
    this.setState({
      active: 'sync-data',
    });
  }

  render() {
    return (
      <LinearGradient
        colors={['#00324F', '#00425F']}
        style={{
          backgroundColor: COLOUR_BLUE,
          flex: 1,
          height: '100%',
          position: 'absolute',
          width: '100%',
          zIndex: 0,
        }}>
        <Svg
          style={{position: 'absolute', top: 0, left: 0}}
          width="145"
          height="89"
          viewBox="0 0 145 89"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <Path
            opacity="0.063399"
            d="M36 56C77.9736 56 112 21.9736 112 -20C112 -61.9736 77.9736 -96 36 -96C-5.97364 -96 -40 -61.9736 -40 -20C-40 21.9736 -5.97364 56 36 56Z"
            stroke="white"
            strokeWidth="65"
          />
        </Svg>

        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            // alignItems: 'stretch',
            // alignItems: 'space-between',
            margin: 30,
            marginTop: 50,
          }}>
          <Text
            style={{
              color: COLOUR_WHITE,
            }}>
            Hello, {`\n`}
            <Text
              style={{
                fontWeight: 'bold',
              }}>
              {this.state.user.businessName}
            </Text>
          </Text>

          <View
            style={{
              flex: 0.4,
              justifyContent: 'space-between',
            }}>
            <Button
              buttonStyle={{
                justifyContent: 'flex-start',
                paddingLeft: 0,
              }}
              icon={
                <Icon
                  containerStyle={{
                    marginRight: 20,
                  }}
                  name="home"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, ${
                    this.state.active === 'home' ? 1 : 0.6
                  })`}
                />
              }
              title="Home"
              titleStyle={{
                fontWeight: 'bold',
                opacity: this.state.active === 'home' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onHomeButtonPress}
            />

            <Button
              buttonStyle={{
                justifyContent: 'flex-start',
                paddingLeft: 0,
              }}
              icon={
                <Icon
                  containerStyle={{
                    marginRight: 20,
                  }}
                  name="user-plus"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, ${
                    this.state.active === 'pre-setup-agent' ? 1 : 0.6
                  })`}
                />
              }
              title="Pre-Setup Agent"
              titleStyle={{
                fontWeight: 'bold',
                opacity: this.state.active === 'pre-setup-agent' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onPreSetupAgentButtonPress}
            />

            <Button
              buttonStyle={{
                justifyContent: 'flex-start',
                paddingLeft: 0,
              }}
              icon={
                <Icon
                  containerStyle={{
                    marginRight: 20,
                  }}
                  name="user-check"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, ${
                    this.state.active === 'complete-setup' ? 1 : 0.6
                  })`}
                />
              }
              title="Complete Setup"
              titleStyle={{
                fontWeight: 'bold',
                opacity: this.state.active === 'complete-setup' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onCompleteSetupButtonPress}
            />

            <Button
              buttonStyle={{
                justifyContent: 'flex-start',
                paddingLeft: 0,
              }}
              isDisabled={this.state.user.isDisabled}
              icon={
                <Icon
                  containerStyle={{
                    marginRight: 20,
                  }}
                  name="user"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, ${
                    this.state.active === 'my-account' ? 1 : 0.6
                  })`}
                />
              }
              title="My Account"
              titleStyle={{
                fontWeight: 'bold',
                opacity: this.state.active === 'my-account' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onAccountButtonPress}
            />

            {/* <Button 
            buttonStyle={{
              justifyContent: 'flex-start',
              paddingLeft: 0
            }}
            icon={<Icon
              containerStyle={{
                marginRight: 20
              }} 
              name="message-circle" 
              size={24}
              type="feather"
              color={`rgba(255, 255, 255, ${this.state.active === 'monitoring-and-support' ? 1 : .6})`} />}
            title="Monitoring & Support" 
            titleStyle={{
              fontWeight: 'bold',
              opacity: this.state.active === 'monitoring-and-support' ? 1 : .6,
              textTransform: null
            }} 
            transparent
            onPress={this.onMonitoringAndSupportButtonPress} /> */}

            {/* <Button 
            buttonStyle={{
              justifyContent: 'flex-start',
              paddingLeft: 0
            }}
            icon={<Icon
              containerStyle={{
                marginRight: 20
              }} 
              name="download-cloud" 
              size={24}
              type="feather"
              color={`rgba(255, 255, 255, ${this.state.active === 'sync-data' ? 1 : .6})`} />}
            title="Sync Data" 
            titleStyle={{
              fontWeight: 'bold',
              opacity: this.state.active === 'sync-data' ? 1 : .6,
              textTransform: null
            }} 
            transparent
            onPress={this.onSyncDataButtonPress} /> */}
          </View>

          <Button
            buttonStyle={{
              justifyContent: 'flex-start',
              paddingLeft: 0,
            }}
            icon={
              <Icon
                containerStyle={{
                  marginRight: 5,
                }}
                name="log-out"
                size={24}
                type="feather"
                color={`rgba(255, 255, 255, .6)`}
              />
            }
            onPress={() => this.onLogoutButtonPress()}
            title="Log out"
            titleStyle={{
              opacity: 0.6,
              textTransform: null,
            }}
            transparent
          />
        </View>
      </LinearGradient>
    );
  }
}

function mapStateToProps(state) {
  return {
    // isLoading: state.tunnel.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    navigateTo: pendingScene => dispatch(navigateTo(pendingScene)),
    resetApplication: () => dispatch(resetApplication()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnderlayNavigator);
