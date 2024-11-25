import React from 'react';
import {
  ActivityIndicator,
  InteractionManager,
  ScrollView,
  View,
} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import Button from '../../../../components/button';
import ClickableListItem from '../../../../components/clickable-list-item';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import {ERROR_STATUS} from '../../../../constants/api';
import {
  APPLICATION,
  COLOUR_BLUE,
  COLOUR_GREEN,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../constants/styles';
import Onboarding from '../../../../services/api/resources/onboarding';
import Platform from '../../../../services/api/resources/platform';
import {
  resetApplication,
  updateApplication,
} from '../../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  showNavigator,
} from '../../../../services/redux/actions/navigation';
import {setIsFastRefreshPending} from '../../../../services/redux/actions/tunnel';

const ItemRow = props => {
  return (
    <ClickableListItem
      disabled={props.disabled}
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        opacity: props.disabled ? 0.4 : 1,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#cccccc',
        marginBottom: 15,
      }}
      onPressOut={props.onPressOut}>
      <View style={{flex: 1}}>
        <Text bold>{props.title}</Text>
        <Text>{props.subTitle}</Text>
      </View>
      <Icon
        color={COLOUR_GREEN}
        name={props.completed ? 'check-circle' : 'circle'}
        size={18}
        type="feather"
      />
      <View style={{marginRight: 15}} />
    </ClickableListItem>
  );
};

class AggregatorLandingScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      isLoading: false,
      slide: 'PERSONAL INFORMATION',
      superAgents: [],
      application: {},
    };
  }

  componentDidMount() {
    const applicantDetails = this.props.route?.params?.applicantDetails || {};

    if (applicantDetails !== {} && applicantDetails.applicationId) {
      this.getApplicationDetailsFromApi(applicantDetails.applicationId);
    } else {
      this.getApplicationId();
    }
  }

  getApplicationId = async () => {
    const application = await AsyncStorage.getItem(APPLICATION);
    if (application) {
      this.setState({
        application: JSON.parse(application),
      });
    }
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  };

  getApplicationDetailsFromApi = async applicationId => {
    const {status, response} = await this.onboarding.getApplicationById(
      applicationId,
    );
    if (status !== ERROR_STATUS) {
      await AsyncStorage.setItem(APPLICATION, JSON.stringify(response));

      this.setState({
        application: response,
      });
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  };

  render() {
    nextPage = application => {
      if (!application.applicantDetails) return 'PreSetupAgent';
      if (application.nextOfKin || application?.applicantDetails?.nextOfKin)
        return 'AgentApplicationPreview';
      if (application.businessDetails) return 'NextOfKinDetails';
      if (application.applicantDetails?.identificationType)
        return 'BusinessDetails';
      if (application.applicantDetails) return 'kYCInformation';
    };

    if (!this.state.animationsDone) {
      return (
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={COLOUR_BLUE} />
        </View>
      );
    }

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          navigationIconColor={COLOUR_WHITE}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Setup New Agent"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <ScrollView>
            <View
              style={{
                elevation: 10,
                marginLeft: 20,
                marginRight: 20,
                border: '5px solid red',
                'border-radius': '8px',
              }}>
              <Text style={(margin = 20)}>
                The following details below are required to setup agent
              </Text>
            </View>
            <View
              style={{
                elevation: 10,
                justifyContent: 'space-evenly',
                // height: 35,
                margin: 20,
                border: '5px solid red',
                'border-radius': '8px',
              }}>
              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                style={{
                  marginBottom: 30,
                }}
                title="Personal Details"
                subTitle="Provide agent's personal details"
                completed={this.state.application.applicantDetails}
                onPressOut={() =>
                  this.props.navigation.replace('PreSetupAgent')
                }
              />

              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                style={{
                  marginBottom: 30,
                }}
                title="KYC Information"
                subTitle="Kindly provide agent's documentation"
                disabled={!this.state.application.applicantDetails}
                completed={
                  this.state.application.applicantDetails?.identificationType
                }
                onPressOut={() =>
                  this.props.navigation.replace('kYCInformation')
                }
              />

              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                style={{
                  marginBottom: 30,
                }}
                title="Business Details"
                subTitle="Tell us about agent's business"
                disabled={
                  !this.state.application.applicantDetails?.identificationType
                }
                completed={this.state.application.businessDetails}
                onPressOut={() =>
                  this.props.navigation.replace('BusinessDetails')
                }
              />

              <ItemRow
                colors={['#6FEBF5', '#0BBDE0']}
                style={{
                  marginBottom: 30,
                }}
                title="Next of Kin Details"
                subTitle="Kindly provide agent's next of kin"
                disabled={!this.state.application.businessDetails}
                completed={
                  this.state.application.nextOfKin ||
                  this.state.application?.applicantDetails?.nextOfKin
                }
                onPressOut={() =>
                  this.props.navigation.replace('NextOfKinDetails')
                }
              />
            </View>
          </ScrollView>

          <Button
            loading={this.state.isLoading}
            onPress={() =>
              this.props.navigation.replace(nextPage(this.state.application))
            }
            title="CONTINUE"
          />
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    application: state.fmpaTunnel.application,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    pendingApplication: state.pendingApplication,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    showNavigator: () => dispatch(showNavigator()),
    resetApplication: () => dispatch(resetApplication()),
    updateApplication: application => dispatch(updateApplication(application)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AggregatorLandingScene);
