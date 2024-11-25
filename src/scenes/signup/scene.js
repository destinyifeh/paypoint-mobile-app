import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
import React from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {stopwatch} from '../../../App';
import AlertStrip from '../../components/alert-strip';
import ClickableListItem from '../../components/clickable-list-item';
import H1 from '../../components/h1';
import Header from '../../components/header';
import Hyperlink from '../../components/hyperlink';
import Text from '../../components/text';
import {
  AGENT_TYPE_ID,
  APPLICATION,
  PENDING_SIGNUP,
  USER,
} from '../../constants';
import {
  LOGIN_AFTER_SIGNUP_FAILURE,
  LOGIN_AFTER_SIGNUP_START,
  LOGIN_AFTER_SIGNUP_SUCCESS,
  SIGNUP_CLICK,
  SIGNUP_FAILURE,
  SIGNUP_SUCCESS,
} from '../../constants/analytics';
import {ERROR_STATUS, HTTP_CONFLICT} from '../../constants/api';
import {ENVIRONMENT, UAT} from '../../constants/api-resources';
import {BLOCKER} from '../../constants/dialog-priorities';
import {
  APPLICATION_SELF_ONBOARDING_PERSONAL_DETAILS,
  COLOUR_BLUE,
  COLOUR_LIGHT_GREY,
  COLOUR_WHITE,
} from '../../constants/styles';
import {logEvent} from '../../core/logger';
import PrivacyPolicy from '../../fragments/privacy-policy';
import TermsAndConditions from '../../fragments/terms-and-conditions';
import ApiGateway from '../../services/api/resources/api-gateway';
import Onboarding from '../../services/api/resources/onboarding';
import Passport from '../../services/api/resources/passport';
import Platform from '../../services/api/resources/platform';
import UserManagement from '../../services/api/resources/user-management';
import OnboardingSerializers from '../../services/api/serializers/onboarding';
import {
  onNewSessionBegin,
  refreshAuthToken,
  saveAuthToken,
  saveRefreshToken,
} from '../../utils/auth';
import {getDeviceDetails} from '../../utils/device';
import {flashMessage} from '../../utils/dialog';
import handleErrorResponse from '../../utils/error-handlers/api';
import {deleteData, loadData, saveData} from '../../utils/storage';
import BaseScene from '../base-scene';
import DisabledScene from '../misc/disabled-scene';
import styles from './styles';

const windowDimensions = Dimensions.get('window');
const windowHeight = windowDimensions.height;

export default class SignupScene extends BaseScene {
  screen_name = 'Signup';

  apiGateway = new ApiGateway();
  onboarding = new Onboarding();
  onboardingSerializers = new OnboardingSerializers();
  passport = new Passport();
  userManagement = new UserManagement();
  platform = new Platform();

  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      propagateFormErrors: false,
      description: null,
      message: null,
      isLoading: false,
      user: null,
    };

    this.callSignup = this.callSignup.bind(this);
    this.onSignupButtonPress = this.onSignupButtonPress.bind(this);
    this.onSuccessfulSignup = this.onSuccessfulSignup.bind(this);
    this.validateFailedBvn = this.validateFailedBvn.bind(this);
  }

  componentDidMount() {
    try {
      this.loadData();
    } catch {}
  }

  async loadData() {
    AsyncStorage.removeItem(APPLICATION_SELF_ONBOARDING_PERSONAL_DETAILS);

    const agentData = JSON.parse(await loadData('agentSignupData'));

    this.setState({
      user: agentData,
    });
  }
  async validateFailedBvn() {
    const token = await refreshAuthToken();

    const formData = this.form.serializeFormData();

    const {
      firstName,
      lastName,
      mobileNo,
      bvn,
      dateOfBirth,
      email,
      howYouHeardAboutUs,
    } = formData;
    const agentData = {
      bvnFirstName: firstName,
      bvnLastName: lastName,
      bvnPhoneNumber: mobileNo,
      agentPhoneNumber: mobileNo,
      bvnNumber: bvn,
      bvnDateOfBirth: Moment(dateOfBirth, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    };

    const saveAsDraftResponse = await this.platform.verifyFailedBvn(
      agentData,
      token,
    );
    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;
    console.log(saveAsDraftResponse, 'bvn res');
    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      if (saveAsDraftResponseObj.error === 'invalid_token') {
        flashMessage(
          'BVN Validation Failed',
          'Please login with your registered phone number and password to continue.',
          BLOCKER,
        );

        return;
      }

      this.setState({
        description: saveAsDraftResponseObj.description,
        message: saveAsDraftResponseObj.message,
        isLoading: false,
      });
      flashMessage(
        'BVN Validation Failed',
        saveAsDraftResponseObj
          ? this.state.message || this.state.description
          : '',
        BLOCKER,
      );
      return;
    } else if (
      saveAsDraftResponseObj.validationStatus !== 'VERIFIED' &&
      saveAsDraftResponseObj.validationStatus !== 'VERIFIED_PARTIALLY'
    ) {
      this.setState({
        message: saveAsDraftResponseObj.message,
        isLoading: false,
      });
      flashMessage('BVN Validation Failed', this.state.message);
      return;
    } else if (
      saveAsDraftResponseObj.validationStatus === 'VERIFIED_PARTIALLY'
    ) {
      this.setState({
        isLoading: true,
      });
      flashMessage(
        'Your BVN Data Is Partially Verified',
        saveAsDraftResponseObj.message,
        BLOCKER,
      );
      const {code, response, status} =
        await this.onboarding.createApplicationForFailedBvn(
          {
            agentTypeId: AGENT_TYPE_ID,
            applicantDetails: {
              firstName: firstName,
              surname: lastName,
              phoneNumber: mobileNo,
              emailAddress: email,
              bvnVerificationStatus: saveAsDraftResponseObj.validationStatus,
              bvn: bvn,
            },

            howYouHeardAboutUs: howYouHeardAboutUs,
          },
          token,
        );

      console.warn('CREATE APPLICATION', {
        code,
        response,
        status,
      });
      this.setState({
        isLoading: true,
      });

      if (code === HTTP_CONFLICT) {
        return true;
      } else if (status === ERROR_STATUS) {
        flashMessage(null, await handleErrorResponse(response), BLOCKER);

        return null;
      }

      await saveData(APPLICATION, response);

      const getApplicationResponse = await this.onboarding.getApplicationById(
        response?.applicationId,
      );
      let previouslySavedData = getApplicationResponse.response;
      const updatedApplicationForm = previouslySavedData;
      updatedApplicationForm.applicantDetails = {
        ...previouslySavedData.applicantDetails,
        dob: Moment(dateOfBirth, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      };
      const res = await this.onboarding.saveApplication(updatedApplicationForm);
      await saveData(APPLICATION, res.response);
      await deleteData('agentSignupData');
      this.props.navigation.replace('Agent');

      return response;
    } else {
      const {code, response, status} =
        await this.onboarding.createApplicationForFailedBvn(
          {
            agentTypeId: AGENT_TYPE_ID,
            applicantDetails: {
              firstName: firstName,
              surname: lastName,
              phoneNumber: mobileNo,
              emailAddress: email,
              bvnVerificationStatus: saveAsDraftResponseObj.validationStatus,
              bvn: bvn,
            },

            howYouHeardAboutUs: howYouHeardAboutUs,
          },
          token,
        );
      console.warn('CREATE APPLICATION', {
        code,
        response,
        status,
      });
      console.log(response, 'create res');
      this.setState({
        isLoading: true,
      });

      if (code === HTTP_CONFLICT) {
        return true;
      } else if (status === ERROR_STATUS) {
        flashMessage(null, await handleErrorResponse(response), BLOCKER);

        return null;
      }

      await saveData(APPLICATION, response);

      //Get newly created application id //

      const getApplicationResponse = await this.onboarding.getApplicationById(
        response?.applicationId,
      );
      let previouslySavedData = getApplicationResponse.response;
      const updatedApplicationForm = previouslySavedData;
      updatedApplicationForm.applicantDetails = {
        ...previouslySavedData.applicantDetails,
        dob: Moment(dateOfBirth, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      };
      const res = await this.onboarding.saveApplication(updatedApplicationForm);
      await saveData(APPLICATION, res.response);
      await deleteData('agentSignupData');
      this.props.navigation.replace('Agent');

      return response;
    }
  }
  async callSignup() {
    const formData = this.form.serializeFormData();
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }
    stopwatch.start();
    const signupResponse = await this.userManagement.signupNewUser(
      formData,
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

    this.props.navigation.replace('VerifyPhone', {
      user: formData,
      isExistingUser: false,
    });
  }

  async onSuccessfulSignup() {
    logEvent(LOGIN_AFTER_SIGNUP_START);

    stopwatch.start();
    const deviceDetails = await getDeviceDetails();

    const loginResponse = await this.userManagement.login(
      {
        username: this.form.state.form.email,
        password: this.form.state.form.password,
        device: {
          deviceUuid: deviceDetails.deviceUuid?.toString(),
          deviceName: deviceDetails.deviceName?.toString(),
          deviceOs: deviceDetails.deviceOs?.toString(),
          deviceModel: deviceDetails.deviceModel?.toString(),
          channel: deviceDetails.channel?.toString(),
        },
      },
      null,
      {
        env: ENVIRONMENT === UAT ? 'TEST' : '',
      },
    );
    stopwatch.stop();

    const loginResponseStatus = loginResponse.status;
    const loginResponseObj = loginResponse.response;

    console.log('LOGIN RESPONSE: ', loginResponseObj);

    if (loginResponseStatus === ERROR_STATUS) {
      this.setState({
        errorMessage: await handleErrorResponse(loginResponseObj),
        isLoading: false,
      });
      logEvent(LOGIN_AFTER_SIGNUP_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
        errorCode: loginResponse.code,
        errorSource: loginResponse.errorSource,
      });
      return;
    }

    logEvent(LOGIN_AFTER_SIGNUP_SUCCESS, {
      secondsElapsed: stopwatch.secondsElapsed,
    });

    this.setState({
      isLoading: false,
    });

    await saveAuthToken(loginResponseObj.data.access_token);
    await saveRefreshToken(loginResponseObj.data.refresh_token);
    await saveData(USER, loginResponseObj.data.user);

    onNewSessionBegin();

    this.props.navigation.replace('Application');
  }

  async onSignupButtonPress() {
    logEvent(SIGNUP_CLICK);
    console.log('SIGNUP BUTTON PRESSED');
    const formData = this.form.serializeFormData();

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    console.log({
      formIsComplete,
      formIsValid,
    });

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    if (
      this.state.user !== null &&
      this.state.user?.mobileNo === formData.mobileNo
    ) {
      this.validateFailedBvn();
      return;
    }
    console.log('ABOUT TO SAVE >> ', this.form.serializeFormData());

    await saveData(PENDING_SIGNUP, this.form.serializeFormData());

    this.callSignup();
  }

  render() {
    const {enable_signup, navigation} = this.props;

    return enable_signup === false ? (
      <DisabledScene
        navigation={navigation}
        sceneName="Onboarding features"
        withBackButton
      />
    ) : (
      <ScrollView
        style={{backgroundColor: 'white'}}
        contentContainerStyle={styles.signupScrollView}>
        <View style={{height: 70, marginBottom: 25}}>
          <Header paypointLogo />
        </View>

        <RBSheet
          animationType="fade"
          ref={ref => {
            this.termsAndConditionsSheet = ref;
          }}
          height={400}
          duration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}>
          <TermsAndConditions />
        </RBSheet>

        <RBSheet
          animationType="fade"
          ref={ref => {
            this.privacyPolicySheet = ref;
          }}
          height={0.8 * windowHeight}
          duration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}>
          <PrivacyPolicy />
        </RBSheet>

        <View style={styles.signupFormContainer}>
          <H1 style={styles.signupFormHeader} underline>
            SIGN UP
          </H1>

          {this.state.errorMessage && (
            <AlertStrip
              variant={ERROR_STATUS}
              content={this.state.errorMessage}
            />
          )}

          <Text big style={styles.licenseAgreementText}>
            Welcome to QuickTeller Paypoint. Choose which best describes you
          </Text>

          <ClickableListItem
            onPressOut={() =>
              this.props.navigation.navigate('SelfOnboardingPreSetupAgent')
            }
            style={{
              backgroundColor: COLOUR_WHITE,
              paddingHorizontal: 20,
              paddingVertical: 30,
              borderWidth: 1,
              borderColor: COLOUR_BLUE,
              borderRadius: 8,
              marginBottom: 15,
            }}>
            <Text bold style={styles.signupCardText}>
              Sign up as an Agent
            </Text>
            <Text>Sole proprietor, SMEs</Text>
          </ClickableListItem>
          <View
            // onPressOut={() => this.props.navigation.navigate('PosRequestDetailsScene')}
            style={{
              // alignItems: "center",
              backgroundColor: COLOUR_LIGHT_GREY,
              opacity: 0.3,
              paddingHorizontal: 20,
              paddingVertical: 30,
              borderWidth: 1,
              borderColor: COLOUR_BLUE,
              borderRadius: 8,
              marginBottom: 15,
            }}>
            <Text bold style={styles.signupCardText}>
              Sign up as a Corporate/Aggregator
            </Text>
            <Text>Sole proprietor, SMEs</Text>
          </View>

          <View style={styles.bottomSectionContainer}>
            <Text style={styles.haveAnAccountText}>
              Have an account already?{' '}
              <Hyperlink href="Login">Sign in</Hyperlink>
            </Text>
            <Text style={styles.licenseAgreementTextBottom}>
              By signing up, you agree to our{' '}
              <Hyperlink onPress={() => this.termsAndConditionsSheet.open()}>
                Terms of Use
              </Hyperlink>{' '}
              and{' '}
              <Hyperlink onPress={() => this.privacyPolicySheet.open()}>
                Privacy Policy.
              </Hyperlink>
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
