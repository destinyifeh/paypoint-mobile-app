import React from 'react';
import {
  Dimensions,
  InteractionManager,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import Moment from 'moment';
import {Divider, Icon} from 'react-native-elements';
import Svg, {Path} from 'react-native-svg';
import {connect} from 'react-redux';

import ActivityIndicator from '../../../../../../components/activity-indicator';
import Button from '../../../../../../components/button';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import Header from '../../../../../../components/header';
import Hyperlink from '../../../../../../components/hyperlink';
import GradientIcon from '../../../../../../components/icons/gradient-icon';
import Text from '../../../../../../components/text';
import {
  APPROVED_APPLICATION_STATUS,
  DECLINED_APPLICATION_STATUS,
} from '../../../../../../constants';
import {ERROR_STATUS} from '../../../../../../constants/api';
import {ALLOW_NEW_FMPA} from '../../../../../../constants/api-resources';
import {
  COLOUR_BLUE,
  COLOUR_DARK_RED,
  COLOUR_GREY,
  COLOUR_OFF_WHITE,
  COLOUR_PRIMARY,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIGGEST,
  FONT_SIZE_MID,
  FONT_SIZE_SMALL,
  LINE_HEIGHT_BIGGEST,
} from '../../../../../../constants/styles';
import NumericField from '../../../../../../fragments/numeric-field';
import Onboarding from '../../../../../../services/api/resources/onboarding';
import Platform from '../../../../../../services/api/resources/platform';
import {
  resetApplication,
  updateApplication,
} from '../../../../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../../services/redux/actions/navigation';
import {setIsFastRefreshPending} from '../../../../../../services/redux/actions/tunnel';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import ApplicationSerializer from '../../../../../../utils/serializers/application';
import {stageNavigationMap} from '../../../fip-new/onboarding/components/application-stages';

const windowWidth = Dimensions.get('window').width;

class BalanceCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {count, didFetchFail, isLoading, retry, timestamp} = this.props;

    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 12,
          elevation: 5,
          height: 190,
          marginRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
          width: 0.8 * windowWidth,
          ...this.props.containerStyle,
        }}>
        {isLoading && (
          <ActivityIndicator
            containerStyle={{position: 'absolute', right: 20, top: 20}}
          />
        )}
        {didFetchFail && !isLoading && (
          <ClickableListItem
            onPress={retry}
            style={{position: 'absolute', right: 18, top: 18}}>
            <Icon color={COLOUR_BLUE} name="refresh" size={42} />
          </ClickableListItem>
        )}
        <Text
          style={{
            color: COLOUR_PRIMARY,
            flex: 0.3,
            fontSize: FONT_SIZE_SMALL,
            textAlignVertical: 'center',
          }}>
          {this.props.title}
        </Text>
        <Text
          style={{
            color: COLOUR_BLUE,
            flex: 0.45,
            fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
            fontSize: FONT_SIZE_BIGGEST,
            // fontWeight: 'bold',
            lineHeight: LINE_HEIGHT_BIGGEST,
          }}>
          {NumericField(count)}
        </Text>
        <Text small>@ {Moment(timestamp).format('MMMM Do, YYYY h:mma')}</Text>
        <Divider
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 10,
            width: 250,
          }}
        />
        {this.props.buttonTitle && (
          <Button
            disabled={this.props.isDisabled}
            buttonStyle={{
              backgroundColor: COLOUR_PRIMARY,
              padding: 10,
              ...this.props.buttonStyle,
            }}
            containerStyle={{
              backgroundColor: 'transparent',
              flex: 0.4,
              padding: 5,
              width: 260,
              ...this.props.buttonContainerStyle,
            }}
            title={this.props.buttonTitle}
            onPressOut={() => this.props.buttonOnPressOut()}
          />
        )}
      </View>
    );
  }
}

class ServiceThumbnail extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('SelectSubCategory', {
            category: this.props.category,
          })
        }
        style={{
          alignItems: 'center',
        }}>
        <GradientIcon
          colors={this.props.colours}
          icon={this.props.icon}
          style={{
            backgroundColor: this.props.colours[0],
            borderRadius: 5,
            height: 60,
            marginBottom: 10,
            width: 60,
          }}
        />
        <Text>{this.props.category}</Text>
      </TouchableOpacity>
    );
  }
}

class RequestRow extends React.Component {
  renderSkeleton() {
    return (
      <View
        style={{
          alignItems: 'center',
          borderBottomColor: COLOUR_OFF_WHITE,
          borderBottomWidth: 5,
          flex: 1,
          flexDirection: 'row',
          height: 90,
          padding: 15,
          paddingTop: 5,
          paddingBottom: 10,
        }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: COLOUR_OFF_WHITE,
            borderRadius: 17,
            height: 35,
            justifyContent: 'center',
            width: 35,
          }}
        />

        <View
          style={{
            flex: 0.8,
            height: '100%',
            justifyContent: 'space-evenly',
            marginVertical: 20,
            marginLeft: 20,
          }}>
          <View
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
          <View
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
          <View
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
        </View>
      </View>
    );
  }

  render() {
    const {isLoading} = this.props;

    if (isLoading) {
      return this.renderSkeleton();
    }

    return (
      <ClickableListItem
        onPressOut={this.props.onPressOut}
        style={{
          alignItems: 'center',
          borderBottomColor: COLOUR_OFF_WHITE,
          borderBottomWidth: 5,
          flex: 1,
          flexDirection: 'row',
          height: 110,
          justifyContent: 'space-between',
          padding: 15,
          paddingTop: 5,
          paddingBottom: 10,
        }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: COLOUR_BLUE,
            borderRadius: 17,
            height: 50,
            justifyContent: 'center',
            width: 35,
          }}>
          <Text white>
            {this.props.firstName ? this.props.firstName[0] : null}
            {this.props.lastName ? this.props.lastName[0] : null}
          </Text>
        </View>

        <View
          style={{
            flex: 0.7,
            height: '100%',
            justifyContent: 'space-evenly',
            marginLeft: 8,
            marginVertical: 30,
          }}>
          <Text>
            {this.props.firstName} {this.props.lastName}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text bold>Phone: </Text>
            <Text>{this.props.application.applicantPhoneNumber}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text bold>Application ID: </Text>
            <Text>{this.props.id}</Text>
          </View>
          <Text
            isFailedStatus={this.props.application.isDeclined}
            isPendingStatus={
              this.props.application.isAwaitingValidation ||
              this.props.application.isAwaitingApproval
            }
            isSuccessStatus={this.props.application.isApproved}
            isStatus
            style={{marginTop: 4}}>
            {this.props.application.cleanApprovalStatus ||
              this.props.application.cleanApplicationType}
          </Text>
        </View>

        <View
          style={{
            alignItems: 'flex-end',
            flex: 0.4,
          }}>
          <Icon color={COLOUR_GREY} name="chevron-right" size={32} />
        </View>
      </ClickableListItem>
    );
  }
}

class HomeTab extends React.PureComponent {
  onboarding = new Onboarding();
  platform = new Platform();

  static navigationOptions = {
    tabBarIcon: ({focused, horizontal, tintColor}) => {
      let IconComponent = Icon;

      return (
        <IconComponent name="home" type="feather" size={25} color={tintColor} />
      );
    },
  };

  constructor() {
    super();

    this.state = {
      agentCount: '0',
      didErrorOccurFetchingAllApplications: null,
      didErrorOccurFetchingApprovedApplications: null,
      didErrorOccurFetchingDeclinedApplications: null,
      isLoadingApprovedAgents: false,
      isLoadingDeclinedAgents: false,
      isLoadingRecentApplications: false,
      isLoadingTotalAgents: false,
      recentApplications: [],
    };

    this.refresh = this.refresh.bind(this);
  }

  refresh() {
    this.loadRecentApplications();
    this.loadAllApplications();
    this.loadApprovedApplications();
    this.loadDeclinedApplications();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });

      this.refresh();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.isFastRefreshPending !== prevProps &&
      this.props.isFastRefreshPending
    ) {
      this.refresh();
      this.props.setIsFastRefreshPending(false);
    }
  }

  async loadAllApplications() {
    this.setState({
      didErrorOccurFetchingAllApplications: null,
      isLoadingTotalAgents: true,
    });

    const {response, status} = await this.onboarding.getMyApplications();

    console.log('GET APPLICATIONS', {response});

    this.setState({
      isLoadingTotalAgents: false,
    });

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccurFetchingAllApplications: true,
      });
      return;
    }

    this.setState({
      agentsCount: response.length,
    });
  }

  async loadApprovedApplications() {
    this.setState({
      didErrorOccurFetchingApprovedApplications: null,
      isLoadingApprovedAgents: true,
    });

    const {response, status} = await this.onboarding.getMyApplications({
      status: APPROVED_APPLICATION_STATUS,
    });

    this.setState({
      isLoadingApprovedAgents: false,
    });

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccurFetchingApprovedApplications: true,
      });
      return;
    }

    this.setState({
      approvedApplicationsCount: response.length,
    });

    console.log('GET APPROVED APPLICATIONS BY APPROVAL STATUS', {response});
  }

  async loadDeclinedApplications() {
    this.setState({
      didErrorOccurFetchingDeclinedApplications: null,
      isLoadingDeclinedAgents: true,
    });

    const {response, status} = await this.onboarding.getMyApplications({
      status: DECLINED_APPLICATION_STATUS,
    });

    this.setState({
      isLoadingDeclinedAgents: false,
    });

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccurFetchingDeclinedApplications: true,
      });
      return;
    }

    this.setState({
      declinedApplicationsCount: response.length,
    });

    console.log('GET DECLINED APPLICATIONS BY APPROVAL STATUS', {response});
  }

  async loadRecentApplications() {
    this.setState({
      didErrorOccurFetchingRecentApplications: null,
      isLoadingRecentApplications: true,
    });

    const {response, status} = await (ALLOW_NEW_FMPA
      ? this.onboarding.searchMyApplications()
      : this.onboarding.getMyApplications());

    this.setState({
      isLoadingRecentApplications: false,
    });

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccurFetchingRecentApplications: true,
        errorFetchingRecentApplications: await handleErrorResponse(response),
      });
      return;
    }

    console.log('ABOUT TO SLICE', response);

    this.setState({
      recentApplications: ALLOW_NEW_FMPA
        ? response.content.slice(0, 10)
        : response.slice(0, 10),
    });

    console.log(
      'RECENT APPLICATIONS',
      ALLOW_NEW_FMPA ? response.content.slice(0, 10) : response.slice(0, 10),
    );
  }

  nextApplicationStage = application => {
    if (application.isDeclined) {
      return this.props.navigation.navigate(stageNavigationMap.PREVIEW);
    }
    const nextScreen = stageNavigationMap[application.applicationStage];

    if (nextScreen) {
      return this.props.navigation.navigate(nextScreen);
    }
    this.props.navigation.navigate('Application');
  };
  get modalContent() {
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 0.5,
          justifyContent: 'space-evenly',
        }}>
        <Text big>Agent has been added.</Text>
        <Text>
          You can <Hyperlink href="">complete setup</Hyperlink> or
        </Text>
      </View>
    );
  }

  errorMessage({message, retry}) {
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 20,
        }}>
        <Text center grey>
          {message}
        </Text>
        <Button
          onPress={retry}
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
          transparent
        />
      </View>
    );
  }

  get searchIcon() {
    return (
      <Icon
        color={COLOUR_WHITE}
        name="search"
        onPress={() => this.props.navigation.navigate('Search')}
      />
    );
  }

  render() {
    if (!this.state.animationsDone) {
      return <ActivityIndicator />;
    }

    const recentRequests = (
      <View>
        <View
          style={{
            backgroundColor: COLOUR_OFF_WHITE,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <Text bold>Recent Applications</Text>
          {this.state.isLoadingRecentApplications ? (
            <ActivityIndicator
              containerStyle={{
                alignItems: 'flex-end',
              }}
              size="small"
            />
          ) : (
            <Hyperlink bold href="AllApplications">
              More
            </Hyperlink>
          )}
        </View>
        {this.state.didErrorOccurFetchingRecentApplications &&
          this.errorMessage({
            message: this.state.errorFetchingRecentApplications,
            retry: this.loadRecentApplications.bind(this),
          })}

        {!this.state.recentApplications.length &&
          !this.state.isLoadingRecentApplications && (
            <Text center style={{padding: 24}}>
              Nothing to display.
            </Text>
          )}

        {this.state.isLoadingRecentApplications ? (
          <React.Fragment>
            <RequestRow isLoading />
            <RequestRow isLoading />
            <RequestRow isLoading />
            <RequestRow isLoading />
            <RequestRow isLoading />
            <RequestRow isLoading />
          </React.Fragment>
        ) : (
          this.state.recentApplications.map(value => {
            const serializedApplication = new ApplicationSerializer(value);
            return (
              <RequestRow
                application={serializedApplication}
                firstName={
                  serializedApplication.applicantDetails
                    ? serializedApplication.applicantDetails.firstName
                    : ''
                }
                lastName={
                  serializedApplication.applicantDetails
                    ? serializedApplication.applicantDetails.surname
                    : ''
                }
                id={serializedApplication.applicationId}
                onPressOut={() => {
                  if (serializedApplication.applicationType === 'DRAFT') {
                    this.props.updateApplication(serializedApplication);
                    ALLOW_NEW_FMPA
                      ? this.nextApplicationStage(serializedApplication)
                      : this.props.navigation.navigate('Application');
                    return;
                  }

                  this.props.navigation.navigate('RequestConfirmation', {
                    application: serializedApplication,
                  });
                }}
              />
            );
          })
        )}
      </View>
    );

    return (
      <View
        style={{
          flex: 1,
        }}
        onTouchEnd={() =>
          this.props.isNavigatorVisible ? this.props.hideNavigator() : null
        }>
        <View
          nativeID=""
          style={{
            backgroundColor: COLOUR_BLUE,
            flex: 1,
            height: '100%',
            position: 'absolute',
            width: '100%',
          }}>
          <Svg height="800" width="400" style={{top: 0}}>
            <Path
              d="M0 0H165C165 0 70.8098 30.7186 62.7442 95.4958C54.6785 160.273 150 257 150 257H0V0Z"
              fill={COLOUR_PRIMARY}
            />
          </Svg>

          <Svg
            fill="none"
            height="110"
            width="130"
            style={{position: 'absolute', top: 0, right: 0}}>
            <Path
              opacity="0.063399"
              d="M109 77C150.974 77 185 42.9736 185 1C185 -40.9736 150.974 -75 109 -75C67.0264 -75 33 -40.9736 33 1C33 42.9736 67.0264 77 109 77Z"
              stroke="white"
              strokeWidth="65"
            />
          </Svg>

          <Svg
            fill="none"
            height="105"
            width="60"
            style={{position: 'absolute', top: 0, left: 0}}>
            <Path
              clipRule="evenodd"
              d="M-10.5 90C20.1518 90 45 65.1518 45 34.5C45 3.8482 20.1518 -21 -10.5 -21C-41.1518 -21 -66 3.8482 -66 34.5C-66 65.1518 -41.1518 90 -10.5 90Z"
              fillRule="evenodd"
              stroke={COLOUR_DARK_RED}
              strokeWidth="30"
            />
          </Svg>

          <Svg
            width="48"
            height="59"
            style={{position: 'absolute', top: 190, left: 0}}
            fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.5 48C28.7173 48 37 39.7173 37 29.5C37 19.2827 28.7173 11 18.5 11C8.28273 11 0 19.2827 0 29.5C0 39.7173 8.28273 48 18.5 48Z"
              stroke="#D81E1E"
              strokeWidth="22"
            />
          </Svg>
        </View>

        <Header
          navigationIconColor={COLOUR_WHITE}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          rightComponent={
            <Icon
              color={COLOUR_WHITE}
              name="search"
              onPress={() =>
                this.props.navigation.navigate('SearchApplication')
              }
              size={24}
              type="material"
              underlayColor="transparent"
            />
          }
          title="Home"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
          withNavigator
        />

        {/* Content */}
        <ScrollView>
          <ClickableListItem
            onPress={this.refresh}
            style={{
              alignItems: 'center',
              backgroundColor: '#ffffff35',
              borderRadius: 4,
              flexDirection: 'row',
              alignSelf: 'flex-end',
              justifyContent: 'center',
              margin: 20,
              marginBottom: 0,
              padding: 20,
              paddingVertical: 5,
              width: 130,
            }}>
            <Icon
              color={COLOUR_WHITE}
              name="refresh"
              size={28}
              containerStyle={{marginRight: 5}}
            />
            <Text bold white title>
              Refresh
            </Text>
          </ClickableListItem>

          {/* Top Section */}
          <View
            style={{
              justifyContent: 'flex-end',
              flex: 0.4,
              marginTop: 110,
              paddingTop: 40,
            }}>
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                backgroundColor: COLOUR_WHITE,
                height: 150,
                // flex: .62,
                flexDirection: 'row',
                padding: 25,
              }}>
              {/* <ServiceThumbnail icon="credit-card" colours={['#9483FA', '#9F4FF5']} category="Pay a Bill" {...this.props} />
              <ServiceThumbnail icon="money" colours={['#FACB83', '#F5834F']} category="Send Money" {...this.props} />
              <ServiceThumbnail icon="tag" colours={['#83F4FA', '#00B8DE']} category="Buy Airtime" {...this.props} />
              <ServiceThumbnail icon="sign-out" colours={['#F9596C', '#EE312A']} category="Cash Out" {...this.props} /> */}
            </View>

            <View
              style={{
                // backgroundColor: COLOUR_RED,
                bottom: 45,
                position: 'absolute',
                height: 245,
                zIndex: 2,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                <Text
                  bold
                  style={{
                    borderLeftWidth: 5,
                    borderColor: 'white',
                    color: COLOUR_WHITE,
                    fontSize: FONT_SIZE_MID,
                    paddingLeft: 15,
                  }}>
                  Prospective Agents
                </Text>
              </View>

              <ScrollView
                persistentScrollbar={true}
                contentContainerStyle={{
                  paddingBottom: 20,
                  paddingLeft: 20,
                  paddingTop: -10,
                }}
                contentOffset={{x: 15}}
                horizontal={true}
                snapToInterval={0.8 * windowWidth}>
                <BalanceCard
                  title="Total Number of Applications"
                  count={this.state.agentsCount}
                  buttonTitle="Pre-Setup Agent"
                  buttonOnPressOut={() => {
                    if (ALLOW_NEW_FMPA) {
                      this.props.navigation.navigate('FipAgentTinVerification');
                      this.props.resetApplication();
                      return;
                    }
                    this.props.navigation.navigate('PreSetupAgent');
                    this.props.resetApplication();
                    return;
                  }}
                  didFetchFail={this.state.didErrorOccurFetchingAllApplications}
                  isLoading={this.state.isLoadingTotalAgents}
                  retry={this.loadAllApplications.bind(this)}
                />
                <BalanceCard
                  title="Number of Approved Agents"
                  count={this.state.approvedApplicationsCount}
                  buttonTitle="Approved Agents"
                  buttonOnPressOut={() => {
                    this.props.navigation.navigate('ViewAllAgents', {
                      category: 'Approved',
                      id: APPROVED_APPLICATION_STATUS,
                    });
                  }}
                  didFetchFail={
                    this.state.didErrorOccurFetchingApprovedApplications
                  }
                  retry={this.loadApprovedApplications.bind(this)}
                  isLoading={this.state.isLoadingApprovedAgents}
                />
                <BalanceCard
                  title="Number of Rejected Agents"
                  count={this.state.declinedApplicationsCount}
                  buttonTitle="Rejected Agents"
                  buttonOnPressOut={() => {
                    this.props.navigation.navigate('ViewAllAgents', {
                      category: 'Rejected',
                      id: DECLINED_APPLICATION_STATUS,
                    });
                  }}
                  didFetchFail={
                    this.state.didErrorOccurFetchingDeclinedApplications
                  }
                  retry={this.loadDeclinedApplications.bind(this)}
                  isLoading={this.state.isLoadingDeclinedAgents}
                />
              </ScrollView>
            </View>
          </View>

          {/* Bottom Section */}
          <View
            style={{
              backgroundColor: 'white',
              flex: 0.4,
            }}>
            {recentRequests}
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFastRefreshPending: state.tunnel.isFastRefreshPending,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    resetApplication: () => dispatch(resetApplication()),
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    showNavigator: () => dispatch(showNavigator()),
    updateApplication: application => dispatch(updateApplication(application)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeTab);
