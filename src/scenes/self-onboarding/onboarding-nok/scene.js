import React from 'react';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import Button from '../../../components/button';
import Header from '../../../components/header';
import Text from '../../../components/text';
import {AGENT_TYPE_ID} from '../../../constants';
import {ERROR_STATUS} from '../../../constants/api';
import {
  APPLICATION_SELF_ONBOARDING,
  COLOUR_BLUE,
  COLOUR_LIGHT_GREY,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../constants/styles';
import Onboarding from '../../../services/api/resources/onboarding';
import Platform from '../../../services/api/resources/platform';
import {
  resetApplication,
  updateApplication,
} from '../../../services/redux/actions/fmpa-tunnel';
import {
  hideNavigator,
  showNavigator,
} from '../../../services/redux/actions/navigation';
import {setIsFastRefreshPending} from '../../../services/redux/actions/tunnel';
import {flashMessage} from '../../../utils/dialog';
import handleErrorResponse from '../../../utils/error-handlers/api';
// import ProgressBar from "../../components/progress-bar";
import ProgressBar from '../../aggregator/components/progress-bar';
import PreSetupNOKForm from './forms/self-onboarding-form';

class SelfOnboardingNOKScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      application: {
        agentTypeId: AGENT_TYPE_ID,
        applicantDetails: {
          nextOfKin: {},
        },
      },
      isValid: false,
      invalidFields: ['firstName', 'address', 'phoneNumber', 'relationship'],
      isReady: false,
      isLoading: false,
      onPreviewButtonPress: false,
      isFromDashboard: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const {isFromDashboard} = this.props.route?.params || {};

    if (isFromDashboard) {
      const {resumeApplicationDetails} = this.props.route?.params || {};

      console.log(resumeApplicationDetails, 'NUGAGEE IS FROM DASHBOARD');
      this.setState({
        isFromDashboard,
        application: resumeApplicationDetails,
        isReady: true,
      });
    } else {
      this.getApplicatId();
    }
  }

  getApplicatId = async () => {
    const application = await AsyncStorage.getItem(APPLICATION_SELF_ONBOARDING);
    this.setState({
      application: JSON.parse(application),
      isReady: true,
    });
  };

  evaluateInvalidField = (fieldObject, count = 1) => {
    const fieldLabel = Object.keys(fieldObject)[0];
    fieldValue = fieldObject[fieldLabel];
    if (!fieldValue || fieldValue.length < count) {
      this.addInvalidField(fieldLabel);
    } else {
      this.removeInvalidField(fieldLabel);
    }
  };

  addInvalidField(fieldName) {
    if (this.state.invalidFields?.includes(fieldName)) return;
    const newInvalidFields = [...this.state.invalidFields, fieldName];

    this.setState({
      invalidFields: newInvalidFields,
      isValid: newInvalidFields.length === 0,
    });
  }

  removeInvalidField(fieldName) {
    const invalidFieldsLength = this.state.invalidFields.length;
    const newInvalidFields = this.state.invalidFields.filter(
      value => value !== fieldName,
    );

    if (newInvalidFields.length === invalidFieldsLength) return;
    this.setState({
      invalidFields: newInvalidFields,
      isValid: newInvalidFields.length === 0,
    });
  }

  async createApplication(application) {
    this.setState({
      ...this.state,
      isLoading: true,
    });

    const {code, response, status} = await this.onboarding.putApplication(
      application,
      this.state.application.applicationId,
    );

    this.setState({
      isLoading: false,
    });
    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response));

      return;
    }

    const applicationClon = JSON.parse(JSON.stringify(this.state.application));
    applicationClon.nextOfKin = application.nextOfKin;
    await AsyncStorage.setItem(
      APPLICATION_SELF_ONBOARDING,
      JSON.stringify(applicationClon),
    );

    // if (this.state.onPreviewButtonPress == true) {
    this.props.navigation.replace('SelfOnboardingApplicationPreview', {
      selfOnboarding: true,
    });
    // } else if(this.state.isFromDashboard == true) {
    //   this.props.navigation.replace("ServiceLevelAgreement", {
    //     isFromDashboard: true,
    //     selfOnboarding: false,
    //   });
    // } else {
    //   this.props.navigation.replace("ServiceLevelAgreement", {
    //     selfOnboarding: true,
    //     isFromDashboard: false,
    //   });
    // }
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
    });

    this.setState({
      isLoading: true,
    });

    const application = {
      nextOfKin: {
        emailAddress: this.form.state.form.emailAddress,
        firstName: this.form.state.form.firstName,
        address: this.form.state.form.address,
        middleName: '',
        phoneNumber: `234${this.form.state.form.phoneNumber.slice(-10)}`,
        relationship: this.form.state.form.relationship,
        surname: '',
      },
    };
    this.createApplication(application);
  }

  render() {
    if (!this.state.isReady) {
      return <ActivityIndicator />;
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
              onPress={() =>
                this.props.navigation.replace('SelfOnboardingBusinessScene', {
                  isFromDashboard: false,
                  selfOnboarding: false,
                  isBackButton: true,
                })
              }
            />
          }
          navigationIconColor={COLOUR_WHITE}
          // rightComponent={skipButton}
          // rightComponent={this.toShowSkipButton ? skipButton : null}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Sign up"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ProgressBar step="4" />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Text bold black>
            Next of Kin Details{'\n'}
          </Text>
          <ScrollView>
            <PreSetupNOKForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              application={this.state.application}
              evaluateInvalidField={this.evaluateInvalidField}
            />
          </ScrollView>

          {/* <Button
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
              marginVertical: 10
            }}
            loading={this.state.isLoading}
            isDisabled={!this.state.isValid}
            onPress={() => {
              this.setState({
                onPreviewButtonPress: true,
              });
              this.onSubmit();
            }}
            title="Preview"
          /> */}
          <Button
            containerStyle={{
              backgroundColor: this.state.isValid
                ? COLOUR_BLUE
                : COLOUR_LIGHT_GREY,
            }}
            loading={this.state.isLoading}
            isDisabled={!this.state.isValid}
            onPress={this.onSubmit}
            title="Submit"
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
)(SelfOnboardingNOKScene);
