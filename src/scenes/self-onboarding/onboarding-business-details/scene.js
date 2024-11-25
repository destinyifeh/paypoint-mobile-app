import React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import Button from '../../../components/button';
import Header from '../../../components/header';
import Text from '../../../components/text';
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
import navigationService from '../../../utils/navigation-service';
import ProgressBar from '../../aggregator/components/progress-bar';
import SelfOnboardBusinessInformationForm from './forms/self-onboarding-form';

class SelfOnboardingBusinessScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: true,
      applicationId: 11,
      application: {
        businessDetails: {},
      },
      isLoading: false,
      isReady: false,
      isValid: false,
      invalidFields: ['localGovernmentArea', 'address', 'businessName'],
      isFromDashboard: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const isFromDashboard = this.props.route?.params?.isFromDashboard || null;

    if (isFromDashboard) {
      const resumeApplicationDetails =
        this.props.route?.params?.resumeApplicationDetails || null;

      console.log(
        resumeApplicationDetails,
        'NUGAGEE IS FROM DASHBOARD ON BUSINESS PAGE',
      );
      this.setState({
        isFromDashboard,
        application: resumeApplicationDetails,
        isReady: true,
      });
    } else {
      this.getApplicatId();
    }
  }

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

  getApplicatId = async () => {
    const application = await AsyncStorage.getItem(APPLICATION_SELF_ONBOARDING);
    console.log({application}, 'NUGAGEE BUSSINESS PAGE GETTING APPLICATION');
    this.setState({
      application: JSON.parse(application),
      isReady: true,
    });
  };

  async createApplication(application) {
    this.setState({
      ...this.state,
      isLoading: true,
    });

    const {response, status} = await this.onboarding.putApplication(
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
    applicationClon.businessDetails = application.businessDetails;
    await AsyncStorage.setItem(
      APPLICATION_SELF_ONBOARDING,
      JSON.stringify(applicationClon),
    );

    // if(applicationClon.nextOfKin){
    //   this.props.navigation.replace("AgentApplicationPreview");
    //   return;
    // }

    this.props.navigation.replace('SelfOnboardingNOKScene', {
      isFromDashboard: false,
    });
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Logout',
          onPress: () => navigationService.replace('Logout'),
        },
        {
          text: 'Try Again',
          onPress: () => {},
          style: 'cancel',
        },
      ],

      {cancelable: false},
    );
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
    });

    if (
      !this.form.state.form ||
      !this.form.state.form.address ||
      !this.form.state.form.businessName ||
      !this.form.state.form.localGovernmentArea ||
      !this.form.state.form.state
    ) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });
      return;
    }

    this.setState({
      isLoading: true,
    });

    const serializedForm = this.form.serializeFormData();

    const application = {
      businessDetails: {
        state: serializedForm.state,
        address: serializedForm.address,
        businessName: serializedForm.businessName,
        localGovernmentArea: serializedForm.localGovernmentArea,
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
                this.props.navigation.replace('SelfOnboardingKYCScene', {
                  isFromDashboard: false,
                  selfOnboarding: false,
                  isBackButton: true,
                  resumeApplicationDetails: this.state.application,
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

        <ProgressBar step="3" />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Text bold black>
            Business Details{'\n'}
          </Text>
          <ScrollView>
            <SelfOnboardBusinessInformationForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              application={this.state.application}
              evaluateInvalidField={this.evaluateInvalidField}
            />
          </ScrollView>

          <Button
            containerStyle={{
              backgroundColor: this.state.isValid
                ? COLOUR_BLUE
                : COLOUR_LIGHT_GREY,
            }}
            loading={this.state.isLoading}
            onPress={this.onSubmit}
            isDisabled={!this.state.isValid}
            title="Next"
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
)(SelfOnboardingBusinessScene);
