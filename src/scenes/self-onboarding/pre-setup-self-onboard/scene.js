import React from 'react';
import {ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import {stopwatch} from '../../../../App';
import Button from '../../../components/button';
import Header from '../../../components/header';
import {AGENT_TYPE_ID} from '../../../constants';
import {SIGNUP_FAILURE, SIGNUP_SUCCESS} from '../../../constants/analytics';
import {ERROR_STATUS, HTTP_CONFLICT} from '../../../constants/api';
import {ENVIRONMENT, UAT} from '../../../constants/api-resources';
import {BLOCKER} from '../../../constants/dialog-priorities';
import {
  APPLICATION_SELF_ONBOARDING_PERSONAL_DETAILS,
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../constants/styles';
import {logEvent} from '../../../core/logger';
import Onboarding from '../../../services/api/resources/onboarding';
import Platform from '../../../services/api/resources/platform';
import UserManagement from '../../../services/api/resources/user-management';
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
import PersonalOnboardingForm from './forms/personal-details-form';
class SelfOnboardingPreSetupAgent extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();
  userManagement = new UserManagement();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      isValid: false,
      invalidFields: [
        'bvn',
        'phone',
        'email',
        'gender',
        'dateOfBirth',
        'password',
        'confirmPassword',
      ],
      application: {
        agentTypeId: AGENT_TYPE_ID,
        applicantDetails: {
          nextOfKin: {},
        },
        businessDetails: {},
        howYouHeardAboutUs: 'Referred by an Agent',
      },
      isLoading: false,
      showSuccessModal: false,
      slide: 'PERSONAL INFORMATION',
    };

    this.onSubmit = this.onSubmit.bind(this);
    // this.onSuccessfulSignup = this.onSuccessfulSignup.bind(this);
    this.addInvalidField = this.addInvalidField.bind(this);
    this.removeInvalidField = this.removeInvalidField.bind(this);
  }

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    //   this.setState({
    //     animationsDone: true,
    //   });
    // });
  }

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

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    console.log({formIsComplete, formIsValid});

    if (!formIsComplete) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    return true;
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
    });

    if (
      !this.form.state.form ||
      !this.form.state.form.phone ||
      !this.form.state.form.email ||
      !this.form.state.form.password ||
      !this.form.state.form.confirmPassword ||
      !this.form.state.form.dateOfBirth
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

    console.log(serializedForm, 'NUGAGEE 3');

    await AsyncStorage.setItem(
      APPLICATION_SELF_ONBOARDING_PERSONAL_DETAILS,
      JSON.stringify(serializedForm),
    );

    const signupResponse = await this.userManagement.signupNewUser(
      serializedForm,
      true,
      false,
      null,
      {
        env: ENVIRONMENT === UAT ? 'TEST' : '',
      },
    );
    stopwatch.stop();

    console.log({signupResponse});
    const signupResponseStatus = signupResponse.status;
    const signupResponseObj = signupResponse.response;
    const signupResponseCode = signupResponse.code;

    this.setState({
      isLoading: false,
    });

    console.log('SIGN-UP RESPONSE: ', signupResponse);
    if (signupResponseStatus === ERROR_STATUS) {
      logEvent(SIGNUP_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: signupResponse.code,
        errorSource: signupResponse.errorSource,
      });

      if (signupResponseCode === HTTP_CONFLICT) {
        flashMessage(
          null,
          'User already exists. Login with your existing credentials.',
          BLOCKER,
        );

        this.setState({
          isLoading: false,
        });

        return;
      }

      flashMessage(null, await handleErrorResponse(signupResponseObj), BLOCKER);

      return;
    }

    logEvent(SIGNUP_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });
    this.props.navigation.replace('SelfOnboardingOTPScene', {
      user: serializedForm,
    });
  }

  render() {
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
              onPress={() => this.props.navigation.replace('Login')}
              // onPress={() => this.props.navigation.goBack()}
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

        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <ScrollView>
            <PersonalOnboardingForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              addInvalidField={this.addInvalidField}
              removeInvalidField={this.removeInvalidField}
            />
          </ScrollView>

          <Button
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
            }}
            disabled={!this.state.isValid}
            loading={this.state.isLoading}
            onPress={this.onSubmit}
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
    // pendingUrl: state.navigation.pendingUrl
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
)(SelfOnboardingPreSetupAgent);
