import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Path} from 'react-native-svg';
import {connect} from 'react-redux';

import Button from '../../../components/button';
import ClickableListItem from '../../../components/clickable-list-item';
import {USER} from '../../../constants';
import {
  COLOUR_BLUE,
  COLOUR_CBN_BLUE,
  COLOUR_WHITE,
} from '../../../constants/styles';
import FeatureFlag from '../../../fragments/feature-flag';
import HelpOptionsMenu from '../../../fragments/help-options-menu';
import UserSerializer from '../../../serializers/resources/user';
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

  persistenceKey = 'agentMainScenePersistenceKey';
  scenes = {
    Account: 'account',
    Home: 'home',
    Services: 'my-services',
    Reports: 'my-reports',
    Settings: 'my-settings',
    'Agent Management': 'agent-management',
    'Staff Management': 'staff-management',
    'Setup Printer': 'setup-printer',
  };

  constructor(props) {
    super(props);

    this.onAccountButtonPress = this.onAccountButtonPress.bind(this);
    this.onAgentManagementButtonPress =
      this.onAgentManagementButtonPress.bind(this);
    this.onAgentSetupAgentButtonPress =
      this.onAgentSetupAgentButtonPress.bind(this);
    this.onHelpButtonPress = this.onHelpButtonPress.bind(this);
    this.onHomeButtonPress = this.onHomeButtonPress.bind(this);
    this.onLogoutButtonPress = this.onLogoutButtonPress.bind(this);
    this.onReportsButtonPress = this.onReportsButtonPress.bind(this);
    this.onServicesButtonPress = this.onServicesButtonPress.bind(this);
    this.onSettingsButtonPress = this.onSettingsButtonPress.bind(this);
    this.onSetupPrinterPress = this.onSetupPrinterPress.bind(this);
    this.onStaffManagementButtonPress =
      this.onStaffManagementButtonPress.bind(this);
  }

  componentDidMount() {
    if (this.props.clear) {
      this.props.navigateTo('Home');
      this.setState({
        active: this.scenes['Home'],
        expandAgent: false,
      });
    }

    loadData(USER).then(response =>
      this.setState({
        user: new UserSerializer(JSON.parse(response)),
      }),
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.clearSession !== this.props.clearSession &&
      this.props.clearSession
    ) {
      this.props.navigateTo('Home');
      this.setState({
        active: this.scenes['Home'],
      });
    }
  }

  onAccountButtonPress() {
    this.props.navigateTo('Account');
    this.onNavigate('Account');
    this.setState({
      active: 'my-account',
    });
  }

  onHelpButtonPress() {
    this.helpOptionsMenu.open();
  }

  onHomeButtonPress() {
    this.props.navigateTo('Home');
    this.onNavigate('Home');
    this.setState({
      active: 'home',
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

  onLogoutButtonPress() {
    this.onNavigate('Home');
    this.setState({
      active: 'home',
    });

    this.props.navigateTo('Logout');

    setTimeout(() => this.props.navigateTo('Home'), 1000);
    // this.props.navigateTo('Home')
  }

  onReportsButtonPress() {
    this.props.navigateTo('Reports');
    this.onNavigate('Reports');
    this.setState({
      active: 'my-reports',
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
      active: 'my-settings',
    });
  }

  onAgentSetupAgentButtonPress(link) {
    this.props.navigation.navigate(link);
    this.onNavigate(link);
    this.setState({
      active: 'agent-management' + link,
    });
  }

  onAgentManagementButtonPress(link) {
    this.props.navigateTo(link);
    this.onNavigate(link);
    this.setState({
      active: 'agent-management' + link,
    });
  }

  onStaffManagementButtonPress() {
    this.props.navigateTo('Staff Management');
    this.onNavigate('Staff Management');
    this.setState({
      active: 'staff-management',
    });
  }

  onSetupPrinterPress() {
    this.props.navigateTo('Setup Printer');
    this.onNavigate('Setup Printer');
    this.setState({
      active: 'setup-printer',
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
        <HelpOptionsMenu
          onSetupPrinterPress={this.onSetupPrinterPress}
          ref_={component => (this.helpOptionsMenu = component)}
          requestClose={() => this.helpOptionsMenu.close()}
        />

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
            margin: 30,
            marginTop: 50,
          }}>
          <Text
            style={{
              color: COLOUR_WHITE,
            }}>
            Hello, {`\n`}
            <Text bold white>
              {this.state.user.businessName}
            </Text>
          </Text>

          <View
            style={{
              flex: 0.7,
              justifyContent: 'space-evenly',
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
              isDisabled={this.state.user.isDisabled}
              icon={
                <Icon
                  containerStyle={{
                    marginRight: 20,
                  }}
                  name="credit-card"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, ${
                    this.state.active === 'my-services' ? 1 : 0.6
                  })`}
                />
              }
              title="My Services"
              titleStyle={{
                opacity: this.state.active === 'my-services' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onServicesButtonPress}
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
                  name="bar-chart-2"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, ${
                    this.state.active === 'my-reports' ? 1 : 0.6
                  })`}
                />
              }
              title="My Reports"
              titleStyle={{
                opacity: this.state.active === 'my-reports' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onReportsButtonPress}
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
                opacity: this.state.active === 'my-account' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onAccountButtonPress}
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
                  name="settings"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, ${
                    this.state.active === 'my-settings' ? 1 : 0.6
                  })`}
                />
              }
              title="My Settings"
              titleStyle={{
                opacity: this.state.active === 'my-settings' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onSettingsButtonPress}
            />

            <FeatureFlag
              requiredPermission="GET_ALL_AGENTS"
              uid="agent-management-nav-menu-item">
              {props => (
                <View
                  style={{
                    flex: 0.7,
                    justifyContent: 'flex-start',
                    marginTop: 20,
                  }}>
                  <ClickableListItem
                    onPress={() => {
                      this.setState({
                        expandAgent: !this.state.expandAgent,
                      });
                    }}
                    style={{
                      flexDirection: 'row',
                    }}>
                    <>
                      <Icon
                        containerStyle={{
                          marginRight: 20,
                        }}
                        name="users"
                        size={24}
                        type="feather"
                        color={`rgba(255, 255, 255, ${
                          this.state.active === 'agent-management' ? 1 : 0.6
                        })`}
                      />

                      <Text
                        title
                        style={{
                          verticalAlign: 'bottom',
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: `rgba(255, 255, 255, ${
                            this.state.active === 'agent-management' ? 1 : 0.6
                          })`,
                        }}>
                        Agents
                      </Text>
                      <Icon
                        name={`${
                          this.state.expandAgent
                            ? 'chevron-down'
                            : 'chevron-right'
                        }`}
                        type="feather"
                        color="white"
                        containerStyle={{
                          marginLeft: 20,
                        }}
                      />
                    </>
                  </ClickableListItem>
                  {this.state.expandAgent && (
                    <>
                      <Button
                        buttonStyle={{
                          justifyContent: 'flex-start',
                          paddingLeft: 0,
                          marginLeft: 60,
                        }}
                        isDisabled={this.state.user.isDisabled}
                        title="Setup New Agent"
                        titleStyle={{
                          opacity:
                            this.state.active ===
                            'agent-managementAggregatorLanding'
                              ? 1
                              : 0.6,
                          textTransform: null,
                        }}
                        transparent
                        onPress={() =>
                          this.onAgentSetupAgentButtonPress('AggregatorLanding')
                        }
                        {...props}
                      />
                      <Button
                        buttonStyle={{
                          justifyContent: 'flex-start',
                          paddingLeft: 0,
                          marginLeft: 60,
                        }}
                        isDisabled={this.state.user.isDisabled}
                        title="Applications"
                        titleStyle={{
                          opacity:
                            this.state.active === 'agent-managementApplications'
                              ? 1
                              : 0.6,
                          textTransform: null,
                        }}
                        transparent
                        onPress={() =>
                          this.onAgentManagementButtonPress('Applications')
                        }
                        {...props}
                      />
                      <Button
                        buttonStyle={{
                          justifyContent: 'flex-start',
                          paddingLeft: 0,
                          marginLeft: 60,
                        }}
                        isDisabled={this.state.user.isDisabled}
                        title="My Agents"
                        titleStyle={{
                          opacity:
                            this.state.active ===
                            'agent-managementAgent Management'
                              ? 1
                              : 0.6,
                          textTransform: null,
                        }}
                        transparent
                        onPress={() =>
                          this.onAgentManagementButtonPress('Agent Management')
                        }
                        {...props}
                      />
                    </>
                  )}
                </View>
              )}
            </FeatureFlag>

            <Button
              buttonStyle={{
                justifyContent: 'flex-start',
                paddingLeft: 0,
              }}
              hidden
              isDisabled={this.state.user.isDisabled}
              icon={
                <Icon
                  containerStyle={{
                    marginRight: 20,
                  }}
                  name="users"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, ${
                    this.state.active === 'staff-management' ? 1 : 0.6
                  })`}
                />
              }
              title="Staff Management"
              titleStyle={{
                opacity: this.state.active === 'staff-management' ? 1 : 0.6,
                textTransform: null,
              }}
              transparent
              onPress={this.onStaffManagementButtonPress}
            />
          </View>

          <View
            style={{
              alignItems: 'flex-start',
              flex: 0.3,
              justifyContent: 'flex-end',
            }}>
            <Button
              buttonStyle={{
                justifyContent: 'flex-start',
                paddingLeft: 0,
              }}
              icon={
                <Icon
                  containerStyle={{
                    marginRight: 10,
                  }}
                  name="help-circle"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, .6)`}
                />
              }
              onPress={this.onHelpButtonPress}
              title="Help"
              titleStyle={{
                opacity: 0.6,
                textTransform: null,
              }}
              transparent
            />

            <Button
              buttonStyle={{
                justifyContent: 'flex-start',
                paddingLeft: 0,
              }}
              icon={
                <Icon
                  containerStyle={{
                    marginRight: 10,
                  }}
                  name="log-out"
                  size={24}
                  type="feather"
                  color={`rgba(255, 255, 255, .6)`}
                />
              }
              onPress={this.onLogoutButtonPress}
              title="Log out"
              titleStyle={{
                opacity: 0.6,
                textTransform: null,
              }}
              transparent
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 20,
                //paddingVertical: 20,
                color: COLOUR_WHITE,
                backgroundColor: COLOUR_CBN_BLUE, // fontSize: process.env.REACT_APP_SMALL_FONT_SIZE,
                marginTop: 50,
                width: '100%',
                height: 70,
              }}>
              <View style={{marginRight: 8, width: '15%'}}>
                <Image
                  source={require('./cbn.png')}
                  style={{
                    resizeMode: 'center',
                    width: '90%',
                    // height: "100%",
                  }}
                />
              </View>
              <View style={{width: '85%'}}>
                <Text big bold style={{color: COLOUR_WHITE}}>
                  Interswitch Financial Inclusion Services Limited is licensed
                  by the Central Bank of Nigeria
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
}

function mapStateToProps(state) {
  return {
    clearSession: state.tunnel.clearSession,
    // isLoading: state.tunnel.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    navigateTo: pendingScene => dispatch(navigateTo(pendingScene)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnderlayNavigator);
