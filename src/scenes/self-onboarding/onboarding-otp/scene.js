import React from 'react';
import {InteractionManager, ScrollView, View} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from 'react-native-elements';
import Button from '../../../components/button';
import Header from '../../../components/header';
import Text from '../../../components/text';
import {AGENT_TYPE_ID, LOGIN_DETAILS, USER} from '../../../constants';
import {ERROR_STATUS, HTTP_CONFLICT} from '../../../constants/api';
import {
  APPLICATION_SELF_ONBOARDING,
  COLOUR_BLUE,
  COLOUR_LINK_BLUE,
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
// import ProgressBar from "../../signup/aggregator/components/progress-bar";
import {stopwatch} from '../../../../App';
import ClickableListItem from '../../../components/clickable-list-item';
import Hyperlink from '../../../components/hyperlink';
import {
  LOGIN_CLICK,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_SUCCESS,
} from '../../../constants/analytics';
import {ENVIRONMENT, UAT} from '../../../constants/api-resources';
import {BLOCKER, CASUAL} from '../../../constants/dialog-priorities';
import {logEvent} from '../../../core/logger';
import UserManagement from '../../../services/api/resources/user-management';
import {saveAuthToken, saveRefreshToken} from '../../../utils/auth';
import {getDeviceDetails} from '../../../utils/device';
import {saveData} from '../../../utils/storage';
import ProgressBar from '../../aggregator/components/progress-bar';
import PreSetupSelfOnboardingOtpForm from '../pre-setup-self-onboard/forms/agent-otp-form';

class SelfOnboardingOTPScene extends React.Component {
  onboarding = new Onboarding();
  platform = new Platform();
  userManagement = new UserManagement();

  constructor() {
    super();

    this.state = {
      accept: false,
      animationsDone: false,
      isValid: false,
      invalidFields: ['otp'],
      application: {
        agentTypeId: AGENT_TYPE_ID,
        applicantDetails: {
          nextOfKin: {},
        },
        businessDetails: {},
        howYouHeardAboutUs: 'Referred by an Agent',
      },
      isLoading: false,
      slide: 'PERSONAL INFORMATION',
      superAgents: [],
      serializedForm: {},
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
    this.addInvalidField = this.addInvalidField.bind(this);
    this.removeInvalidField = this.removeInvalidField.bind(this);
  }

  componentDidMount() {
    const userData = this.props.route?.params?.user || {};

    this.setState({
      serializedForm: userData,
    });
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
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

  async createApplication(application) {
    console.log(application, 'NUGAGEE APLICATION PROPS');
    this.setState({
      isLoading: true,
    });
    const payload = {
      applicantDetails: {
        phoneNumber: application.applicantDetails.mobileNo,
        emailAddress: application.applicantDetails.email,
        bvn: application.applicantDetails.bvn,
        dob: application.applicantDetails.dob,
        // gender: "male",
        gender:
          application.applicantDetails.gender == 'male' ? 'male' : 'female',
      },
    };

    const {response, status} =
      await this.onboarding.createPersonalDetailsAggregator(payload);

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response));
      console.log(response, 'NUGAGEE ERROR RESPONSE');

      return;
    }

    console.log(response, 'CALLING NUGAGEE CREATE APPLICATION RESPONSE');

    await AsyncStorage.setItem(
      APPLICATION_SELF_ONBOARDING,
      JSON.stringify(response),
    );
    this.props.navigation.replace('SelfOnboardingKYCScene', {
      user: application,
      applicantDetails: response,
      selfOnboarding: true,
      isFromDashboard: false,
      isBackButton: false,
    });
  }

  async onSubmit() {
    this.setState({
      errorMessage: null,
    });

    if (!this.form.state.form || !this.form.state.form.otp) {
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
    console.log(serializedForm, 'NUGAGEE SERIALIZED FORM');
    const signupResponse = await this.userManagement.signupNewUser(
      serializedForm,
      false,
      true,
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
      isLoading: true,
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
      this.setState({
        isLoading: false,
      });

      flashMessage(null, await handleErrorResponse(signupResponseObj), BLOCKER);

      return;
    }

    logEvent(SIGNUP_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });

    this.doLogin(signupResponse, serializedForm);
  }

  async doLogin(signupResponse, serializedForm) {
    this.setState({
      isLoading: true,
    });
    console.log(signupResponse, 'SIGN UP RESPONSE IN LOGIN');
    console.log(serializedForm, 'SERIALIZED FORM IN LOGIN');
    logEvent(LOGIN_CLICK);

    const username = serializedForm.mobileNo;
    const password = serializedForm.password;
    const domainTypeId = parseInt(signupResponse.response.data.domainTypeId);

    stopwatch.start();

    const deviceDetails = await getDeviceDetails();

    const loginResponse = await this.userManagement.login(
      {
        username,
        password,
        device: {
          deviceUuid: deviceDetails.deviceUuid?.toString(),
          deviceName: deviceDetails.deviceName?.toString(),
          deviceOs: deviceDetails.deviceOs?.toString(),
          deviceModel: deviceDetails.deviceModel?.toString(),
          channel: deviceDetails.channel?.toString(),
        },
        domainTypeId,
      },
      null,
      {},
    );
    stopwatch.stop();

    console.log(loginResponse, 'NUGAGEE LOGIN RESPONSE ON OTP PAGE');

    const loginResponseStatus = loginResponse.status;
    const loginResponseObj = loginResponse.response;

    if (loginResponseStatus === ERROR_STATUS) {
      const errorMessage = await handleErrorResponse(loginResponseObj);

      this.setState({
        errorMessage,
        isLoading: false,
      });

      flashMessage('Login', errorMessage, BLOCKER);

      logEvent(LOGIN_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: loginResponse.code,
        errorSource: loginResponse.errorSource,
      });

      return;
    }

    logEvent(LOGIN_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });

    await saveData(LOGIN_DETAILS, {
      username,
      password,
    });

    if (loginResponse.code === 202) {
      this.setState({
        accessToken: loginResponseObj.data.access_token,
        doDeviceAuth: true,
        isLoading: true,
        registerDeviceDescription: loginResponseObj?.description,
        showRegisterDeviceCheckmark:
          loginResponseObj.code !== '20204' &&
          loginResponseObj.code !== '20205',
        tokenId: loginResponseObj.data?.tokenId,
      });

      return;
    }

    await saveAuthToken(loginResponseObj.data.access_token);
    await saveRefreshToken(loginResponseObj.data.refresh_token);
    await saveData(USER, loginResponseObj.data.user);

    const application = {
      applicantDetails: serializedForm,
    };
    this.createApplication(application);
  }

  async resendOtp() {
    const user = this.props.route?.params?.user || {};
    const isExistingUser = this.props.route?.params?.isExistingUser;

    this.setState({
      isSendingOtp: true,
    });

    let {code, response, status} = {
      code: null,
      response: null,
      status: null,
    };

    flashMessage(null, 'Resending OTP...', CASUAL);

    const apiResponse = await this.userManagement.signupNewUser(
      {
        ...user,
        otp: this.form.state.form.otp,
      },
      (sendOtp = true),
      (verifyOtp = false),
      null,
      (args = {
        env: ENVIRONMENT === UAT ? 'TEST' : '',
      }),
    );

    code = apiResponse.code;
    response = apiResponse.response;
    status = apiResponse.status;

    console.warn({code, response, status});
    console.log({code, response, status}, 'NUGAGEE RESEND OTP RESPONSE');

    if (status === ERROR_STATUS) {
      const errorMessage = await handleErrorResponse(response);
      this.setState({
        isSendingOtp: false,
      });

      flashMessage(null, errorMessage, BLOCKER);

      this.setState({
        isLoading: false,
      });

      return;
    }
    this.setState({
      isSendingOtp: false,
    });

    flashMessage(null, 'OTP successfully resent!', CASUAL);
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
              onPress={() => this.props.navigation.replace('OnboardingLanding')}
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

        <ProgressBar step="1" />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Text big bold black>
            Verify OTP{'\n'}
          </Text>
          <Text big bold black>
            Hello, Queen Elizabeth.{'\n'}
          </Text>
          <Text mbig black>
            Please enter the 6-digit code that has been sent to your phone
            number{'\n'}
          </Text>
          <ScrollView>
            <PreSetupSelfOnboardingOtpForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
              addInvalidField={this.addInvalidField}
              removeInvalidField={this.removeInvalidField}
              personalData={this.state.serializedForm}
            />
            <ClickableListItem
              // onPressOut={() => this.props.navigation.navigate('OnboardingLanding', {
              //   selfOnboarding: true,
              // })}
              style={{
                flexDirection: 'row',
                color: COLOUR_BLUE,
                paddingHorizontal: 5,
                // justifyContent: "space-between",
              }}>
              {this.state.isSendingOtp ? (
                <Hyperlink>Sending...</Hyperlink>
              ) : (
                <>
                  <Icon
                    color={COLOUR_LINK_BLUE}
                    underlayColor="transparent"
                    name="refresh"
                    size={20}
                    type="material"
                  />

                  <Hyperlink onPress={this.resendOtp}>Resend OTP</Hyperlink>
                </>
              )}
            </ClickableListItem>
          </ScrollView>

          <Button
            loading={this.state.isLoading}
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
            }}
            // isDisabled={!this.state.form?.otp}
            onPress={this.onSubmit}
            title="Verify OTP"
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
)(SelfOnboardingOTPScene);
