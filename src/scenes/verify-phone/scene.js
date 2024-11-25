import {CommonActions} from '@react-navigation/native';
import Moment from 'moment';
import React from 'react';
import {Alert, ScrollView, View} from 'react-native';
import Button from '../../components/button';
import H1 from '../../components/h1';
import Header from '../../components/header';
import Hyperlink from '../../components/hyperlink';
import Text from '../../components/text';
import {
  AGENT_TYPE_ID,
  APPLICATION,
  DEFAULT_DOMAIN_CODE,
  LOGIN_DETAILS,
  PENDING_SIGNUP,
  USER,
} from '../../constants';
import {ERROR_STATUS, HTTP_CONFLICT} from '../../constants/api';
import {ENVIRONMENT, UAT} from '../../constants/api-resources';
import {BLOCKER, CASUAL} from '../../constants/dialog-priorities';
import Onboarding from '../../services/api/resources/onboarding';
import Passport from '../../services/api/resources/passport';
import Platform from '../../services/api/resources/platform';
import UserManagement from '../../services/api/resources/user-management';
import {
  onNewSessionBegin,
  saveAuthToken,
  saveRefreshToken,
} from '../../utils/auth';
import {getDeviceDetails} from '../../utils/device';
import {flashMessage} from '../../utils/dialog';
import handleErrorResponse from '../../utils/error-handlers/api';
import navigationService from '../../utils/navigation-service';
import {deleteData, loadData, saveData} from '../../utils/storage';
import {VerifyPhoneForm} from './form';
import styles from './styles';
export default class VerifyPhoneScene extends React.Component {
  onboarding = new Onboarding();
  passport = new Passport();
  userManagement = new UserManagement();
  platform = new Platform();

  constructor() {
    super();

    this.state = {
      isLoading: false,
      wasSignupSuccessful: null,
      description: null,
      message: null,
      accept: false,
    };

    this.callSignup = this.callSignup.bind(this);
    this.checkFormValidity = this.checkFormValidity.bind(this);
    this.createApplication = this.createApplication.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.login = this.login.bind(this);
    this.onSuccessfulSignup = this.onSuccessfulSignup.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
  }

  async doLogin() {
    const {mobileNo, password} = this.props.route?.params?.user || {};
    const deviceDetails = await getDeviceDetails();

    const loginResponse = await this.userManagement.login(
      {
        mobileNo,
        password,
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
        // env: ENVIRONMENT === IFIS_K3 ? 'TEST' : ''
      },
    );
    const loginResponseStatus = loginResponse.status;
    const loginResponseObj = loginResponse.response;

    if (loginResponseStatus === ERROR_STATUS) {
      flashMessage('Login', errorMessage, BLOCKER);

      return;
    }

    await saveAuthToken(loginResponseObj.data.access_token);
    await saveRefreshToken(loginResponseObj.data.refresh_token);
    await saveData(USER, loginResponseObj.data.user);

    onNewSessionBegin();

    // this.props.navigation.reset(
    //   [
    //     NavigationActions.navigate({
    //       routeName: "Agent",
    //     }),
    //   ],
    //   0
    // );

    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Agent',
          },
        ],
      }),
    );
    // this.props.navigation.replace('Agent');
  }
  async callSignup() {
    if (this.state.wasSignupSuccessful) {
      this.onSuccessfulSignup();
      return;
    }

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {user, isExistingUser} = this.props.route?.params || {};

    console.log({user});

    let {code, response, status} = {
      code: null,
      response: null,
      status: null,
    };

    if (!Boolean(user.email)) {
      user.email = null;
    }

    if (isExistingUser === true) {
      const apiResponse = await this.userManagement.signupExistingUser(
        {
          ...user,
          domainCode: DEFAULT_DOMAIN_CODE,
          otp: this.form.state.form.otp,
        },
        (sendOtp = false),
        (verifyOtp = true),
        null,
        (args = {
          env: ENVIRONMENT === UAT ? 'TEST' : '',
        }),
      );

      code = apiResponse.code;
      response = apiResponse.response;
      status = apiResponse.status;
    } else if (isExistingUser === false) {
      const apiResponse = await this.userManagement.signupNewUser(
        {
          ...user,
          otp: this.form.state.form.otp,
        },
        (sendOtp = false),
        (verifyOtp = true),
        null,
        (args = {
          env: ENVIRONMENT === UAT ? 'TEST' : '',
        }),
      );

      code = apiResponse.code;
      response = apiResponse.response;
      status = apiResponse.status;
    } else if (isExistingUser === null) {
      const apiResponse = await this.userManagement.verifyOtp(
        {
          mobileNo: user.username,
          otp: this.form.state.form.otp,
        },
        null,
        (args = {
          env: ENVIRONMENT === UAT ? 'TEST' : '',
        }),
      );

      code = apiResponse.code;
      response = apiResponse.response;
      status = apiResponse.status;

      if (status === ERROR_STATUS) {
        const errorMessage = await handleErrorResponse(response);

        flashMessage(null, errorMessage, BLOCKER);

        this.setState({
          isLoading: false,
        });

        return;
      }

      if (await this.login()) {
        // this.props.navigation.reset(
        //   [
        //     NavigationActions.navigate({
        //       routeName: 'Agent',
        //     }),
        //   ],
        //   0,
        // );

        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Agent',
              },
            ],
          }),
        );
        // this.props.navigation.navigate('Agent');
        return;
      }
    }

    console.warn({code, response, status});

    if (status === ERROR_STATUS) {
      const errorMessage = await handleErrorResponse(response);

      flashMessage(null, errorMessage, BLOCKER);

      this.setState({
        isLoading: false,
      });

      return;
    }

    this.setState({
      wasSignupSuccessful: true,
    });

    this.signupResponse = response;

    this.onSuccessfulSignup();
  } //ending be

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    return true;
  }

  extractUsernameFromFormData(formData) {
    return formData.mobileNo || formData.username || formData.email;
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'GO Back',
          onPress: () => navigationService.replace('Signup'),
        },
        {
          text: 'Try Again',
          onPress: () => navigationService.replace('Signup'),
          //style: "cancel",
        },
      ],

      {cancelable: false},
    );
  }

  async createApplication() {
    this.setState({
      isLoading: true,
    });

    const {
      firstName,
      lastName,
      mobileNo,
      email,
      howYouHeardAboutUs,
      bvnVerificationStatus,
      bvn,
      dateOfBirth,
    } = this.props.route.params.user;

    const agentData = {
      bvnFirstName: firstName,
      bvnLastName: lastName,
      bvnPhoneNumber: mobileNo,
      agentPhoneNumber: mobileNo,
      bvnNumber: bvn,
      bvnDateOfBirth: Moment(dateOfBirth, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    };
    const {user} = this.props.route?.params?.user || {};

    await saveData('agentSignupData', user);
    const saveAsDraftResponse = await this.platform.verifyBvn(agentData);
    const saveAsDraftResponseStatus = saveAsDraftResponse.status;
    const saveAsDraftResponseObj = saveAsDraftResponse.response;
    console.log(saveAsDraftResponse, 'bvn res');
    if (saveAsDraftResponseStatus === ERROR_STATUS) {
      this.setState({
        description: saveAsDraftResponseObj.description,
        message: saveAsDraftResponseObj.message,
        isLoading: false,
      });
      this.showAlert(
        'BVN Validation Failed',
        saveAsDraftResponseObj
          ? this.state.message || this.state.description
          : '',
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
      this.showAlert('BVN Validation Failed', this.state.message);
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

      const {code, response, status} = await this.onboarding.createApplication({
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
      });
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

      return response;
    } else {
      const {code, response, status} = await this.onboarding.createApplication({
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
      });
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

      return response;
    }
  }

  async fetchApplication() {
    this.setState({
      isLoading: true,
    });

    const {isExistingUser} = this.props.route?.params || {};

    let formData = null;
    if (isExistingUser === true || isExistingUser === null) {
      formData = JSON.parse(await loadData(LOGIN_DETAILS));
    } else if (isExistingUser === false) {
      formData = JSON.parse(await loadData(PENDING_SIGNUP));
    }

    const {code, response, status} = await this.onboarding.getApplicationById(
      this.extractUsernameFromFormData(formData),
    );

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      return null;
    }

    return response;
  }

  async login(signupResponse) {
    console.log({signupResponse});
    this.setState({
      isLoading: true,
    });

    const {isExistingUser} = this.props.route?.params || {};

    let formData = null;
    if (isExistingUser === true) {
      formData = JSON.parse(await loadData(LOGIN_DETAILS));
    } else if (isExistingUser === false || isExistingUser === null) {
      formData = JSON.parse(await loadData(PENDING_SIGNUP));
    }

    console.warn({formData});
    const deviceDetails = await getDeviceDetails();

    const {code, response, status} = await this.userManagement.login(
      {
        username: this.extractUsernameFromFormData(formData),
        domainTypeId: signupResponse.data.domainTypeId,
        device: {
          deviceUuid: deviceDetails.deviceUuid?.toString(),
          deviceName: deviceDetails.deviceName?.toString(),
          deviceOs: deviceDetails.deviceOs?.toString(),
          deviceModel: deviceDetails.deviceModel?.toString(),
          channel: deviceDetails.channel?.toString(),
        },
        password: formData.password,
      },
      null,
      {
        env: ENVIRONMENT === UAT ? 'TEST' : '',
      },
    );

    console.warn({code, response, status});

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashMessage('Login', await handleErrorResponse(response), BLOCKER);

      return false;
    }

    console.warn('VERIFY PHONE NUMBER', response);

    const {access_token, refresh_token, user} = response.data;
    await saveAuthToken(access_token);
    await saveRefreshToken(refresh_token);
    await saveData(USER, user);
    await saveData(LOGIN_DETAILS, {
      username: this.extractUsernameFromFormData(formData),
      password: formData.password,
    });
    onNewSessionBegin();

    this.setState({
      wasLoginSuccessful: true,
    });

    return true;
  }

  async onSuccessfulSignup() {
    signupResponse = this.signupResponse;

    this.setState({
      isLoading: true,
    });

    if (this.state.wasLoginSuccessful) {
      // TODO: TEST EXPERIMENTAL CODE
      const application = await this.fetchApplication();
      if (application) {
        // this.props.navigation.reset(
        //   [
        //     NavigationActions.navigate({
        //       routeName: 'Agent',
        //     }),
        //   ],
        //   0,
        // );

        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Agent',
              },
            ],
          }),
        );
        // this.props.navigation.replace('Agent');
        return;
      }

      const newApplication = await this.createApplication();
      if (newApplication) {
        // this.props.navigation.reset(
        //   [
        //     NavigationActions.navigate({
        //       routeName: 'Agent',
        //     }),
        //   ],
        //   0,
        // );
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Agent',
              },
            ],
          }),
        );
        return;
      }
    }

    if (await this.login(signupResponse)) {
      const application = await this.fetchApplication();
      if (application) {
        // this.props.navigation.reset(
        //   [
        //     NavigationActions.navigate({
        //       routeName: 'Agent',
        //     }),
        //   ],
        //   0,
        // );
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Agent',
              },
            ],
          }),
        );
        return;
      }

      const newApplication = await this.createApplication();
      if (newApplication) {
        // this.props.navigation.reset(
        //   [
        //     NavigationActions.navigate({
        //       routeName: 'Agent',
        //     }),
        //   ],
        //   0,
        // );
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Agent',
              },
            ],
          }),
        );
        return;
      }
    }
  }

  async resendOtp() {
    const {isExistingUser, user} = this.props.route?.params || {};

    let {code, response, status} = {
      code: null,
      response: null,
      status: null,
    };

    flashMessage(null, 'Resending OTP...', CASUAL);

    if (isExistingUser) {
      const apiResponse = await this.userManagement.signupExistingUser(
        {
          ...user,
          domainCode: DEFAULT_DOMAIN_CODE,
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
    } else {
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
    }

    console.warn({code, response, status});

    if (status === ERROR_STATUS) {
      const errorMessage = await handleErrorResponse(response);

      flashMessage(null, errorMessage, BLOCKER);

      this.setState({
        isLoading: false,
      });

      return;
    }

    flashMessage(null, 'OTP successfully resent!', CASUAL);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.view}>
        <View style={{height: 70, marginBottom: 25}}>
          <Header paypointLogo />
        </View>

        <View
          style={{
            marginTop: 16,
            padding: 24,
          }}>
          <H1
            style={{
              marginBottom: 20,
              marginTop: 30,
              textAlign: 'center',
            }}
            underline>
            VERIFY YOUR PHONE NUMBER
          </H1>

          <Text
            center
            style={{
              marginBottom: 20,
            }}
            title>
            An OTP has been sent to your phone number.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginTop: 40,
            }}>
            <VerifyPhoneForm
              isDisabled={this.state.isLoading}
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.form = form)}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                width: '100%',
              }}>
              <Hyperlink onPress={this.resendOtp}>Resend OTP</Hyperlink>
              <Hyperlink onPress={() => this.props.navigation.goBack()}>
                Go Back
              </Hyperlink>
            </View>

            <Button
              containerStyle={{
                marginBottom: 20,
                marginTop: 20,
                width: '100%',
              }}
              loading={this.state.isLoading}
              onPress={this.callSignup}
              title="CONTINUE"
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
