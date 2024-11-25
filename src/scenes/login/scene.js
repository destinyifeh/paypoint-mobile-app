import React from 'react';

import {
  BackHandler,
  Keyboard,
  Modal,
  NativeModules,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {CheckBox, Icon, Tooltip} from 'react-native-elements';
import TouchID from 'react-native-touch-id';

import {CommonActions} from '@react-navigation/native';
import {stopwatch} from '../../../App';
import ActivityIndicator from '../../components/activity-indicator';
import AlertStrip from '../../components/alert-strip';
import Button from '../../components/button';
import ClickableListItem from '../../components/clickable-list-item';
import H1 from '../../components/h1';
import Header from '../../components/header';
import Hyperlink from '../../components/hyperlink';
import Text from '../../components/text';
import {
  AGENT,
  APPLICATION,
  CANNOT_ACCESS_DASHBOARD,
  LOGIN_CREDENTIALS,
  LOGIN_DETAILS,
  OTP_SUCCESSFULLY_SENT,
  SENDING,
  SUCCESS,
  USER,
  USER_PROFILES,
  WALLET,
} from '../../constants';
import {
  LOGIN_CLICK,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
} from '../../constants/analytics';
import {ERROR_STATUS} from '../../constants/api';
import {RECOVER_PASSWORD_DESTINATION_URL} from '../../constants/api-resources';
import {BLOCKER, CASUAL} from '../../constants/dialog-priorities';
import {
  COLOUR_GREY,
  COLOUR_PRIMARY,
  COLOUR_WHITE,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from '../../constants/styles';
import {logEvent} from '../../core/logger';
import ContactUsOptionsMenu from '../../fragments/contact-us-options-menu';
import SelectRoleMenu, {RoleSerializer} from '../../fragments/select-role-menu';
import UserSerializer from '../../serializers/resources/user';
import {
  apiGatewayService,
  onboardingService,
  passportService,
  platformService,
  userManagementService,
} from '../../setup/api';
import {
  deleteAuthToken,
  onNewSessionBegin,
  saveAuthToken,
  saveRefreshToken,
} from '../../utils/auth';
import {getDeviceDetails} from '../../utils/device';
import {flashMessage} from '../../utils/dialog';
import handleErrorResponse from '../../utils/error-handlers/api';
import {formatPhoneNumberToReadable} from '../../utils/formatters';
import {safeUsername} from '../../utils/helpers';
import Settings from '../../utils/settings';
import {loadData, saveData} from '../../utils/storage';
import BaseScene from '../base-scene';
import {OtpForm, PasswordForm, UsernameForm} from './form';

const {IntentHelper} = NativeModules;
const SELECTED_PROFILE = 'SELECTED_PROFILE';

export default class LoginScene extends BaseScene {
  screen_name = 'Login';

  apiGateway = apiGatewayService;
  onboarding = onboardingService;
  passport = passportService;
  platform = platformService;
  userManagement = userManagementService;
  settings = new Settings();

  constructor() {
    super();

    this.state = {
      deviceAuthSuccessful: null,
      doDeviceAuth: false,
      domainTypeId: null,
      isLoginLoading: false,
      otpForm: {},
      propagateFormErrors: false,
      registerDevice: false,
      showRegisterDeviceCheckmark: true,
      toShowBiometricLoginButton: null,
      userProfiles: null,
      loginCredentials: {},
      isAssistedPasswordPage: false,
      isResumeUsername: '',
      isResumeuserDomains: '',
    };

    this.autofocusPasswordInput = this.autofocusPasswordInput.bind(this);
    this.callDeviceAuth = this.callDeviceAuth.bind(this);
    this.checkBiometricLoginAvailability =
      this.checkBiometricLoginAvailability.bind(this);
    this.doFakeLogin = this.doFakeLogin.bind(this);
    this.doLogin = this.doLogin.bind(this);
    this.doResendOtp = this.doResendOtp.bind(this);
    this.getProfiles = this.getProfiles.bind(this);
    this.onBiometricLoginButtonPressOut =
      this.onBiometricLoginButtonPressOut.bind(this);
    this.onLoginButtonPress = this.onLoginButtonPress.bind(this);
    this.onPasswordFormContinueButtonPress =
      this.onPasswordFormContinueButtonPress.bind(this);
    this.onSelectDomainTypeId = this.onSelectDomainTypeId.bind(this);
    this.onSuccessfulLogin = this.onSuccessfulLogin.bind(this);
    this.onUsernameFormContinueButtonPress =
      this.onUsernameFormContinueButtonPress.bind(this);
    this.toDisableFingerprint = this.toDisableFingerprint.bind(this);
    this.shouldAutoFocus = this.shouldAutoFocus.bind(this);
    this.recoverPasswordForUsername =
      this.recoverPasswordForUsername.bind(this);
  }

  async componentDidMount() {
    const isAssistedPasswordPage =
      this.props.route?.params?.isAssistedPasswordPage;

    if (isAssistedPasswordPage == true) {
      const isResumeUsername = this.props.route?.params?.isResumeUsername;
      const isResumeuserDomains = this.props.route?.params?.isResumeuserDomains;

      console.log(
        {isResumeuserDomains, isAssistedPasswordPage, isResumeuserDomains},
        'Dez log...',
      );

      this.setState({
        isAssistedPasswordPage: isAssistedPasswordPage,
        isResumeUsername: isResumeUsername,
        isResumeuserDomains: isResumeuserDomains,
      });
      return;
    } else {
      this.loadUser();
      this.loadStuff();

      // this.props.navigation.dismiss();
    }

    const backAction = () => {
      if (this.state.doDeviceAuth) {
        this.setState({
          doDeviceAuth: false,
        });
      }
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    deleteAuthToken();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.state.showRegisterDeviceCheckmark &&
      this.state.doDeviceAuth &&
      !prevState.doDeviceAuth
    ) {
      setTimeout(() => this.tooltipRef.toggleTooltip(), 1000);

      setTimeout(() => this.tooltipRef.toggleTooltip(), 8000);
    }
  }

  isOtpRequired(loginResponseObj) {
    return (
      loginResponseObj.data.migratedUser &&
      !loginResponseObj.data.migrationCompleted
    );
  }

  async loadStuff() {
    const {didSessionExpire = false} = this.props.route.params || {};

    const isBiometricLoginAvailableOnDevice =
      await this.checkBiometricLoginAvailability();
    const isBiometricLoginEnabled = await this.settings.getBiometricLogin();
    const toShowBiometricLoginButton =
      isBiometricLoginAvailableOnDevice && isBiometricLoginEnabled;

    if (toShowBiometricLoginButton) {
      this.shouldAutoFocus() &&
        setTimeout(this.onBiometricLoginButtonPressOut, 100);
    }

    if (!toShowBiometricLoginButton && didSessionExpire === true) {
      flashMessage(
        'Session Expired',
        'Your session has expired! Please, login again.',
        BLOCKER,
      );
    }

    this.setState({
      toShowBiometricLoginButton,
    });

    const {domainTypeId, username, password, selectedProfile} = JSON.parse(
      await loadData(LOGIN_CREDENTIALS),
      '{}',
    );
    const newUsername = username || userProfiles[0].username;
    console.log({newUsername}, 'NUGAGEE  NEWUSERNAME');

    const userProfiles = JSON.parse(await loadData(USER_PROFILES), '[]');
    console.log({userProfiles}, 'NUGAGEE USERPROFILES');

    this.setState({
      loginCredentials: {
        username,
        password,
      },
      domainTypeId,
      selectedProfile,
      userProfiles,
    });

    Boolean(username || userProfiles[0].username) &&
      this.getProfiles({newUsername, silent: true});
  }

  async checkBiometricLoginAvailability() {
    return TouchID.isSupported();
  }

  shouldAutoFocus() {
    const {didSessionExpire = null} = this.props.route.params || {};

    const wasLogoutManual = didSessionExpire === false;

    return [true, null].includes(didSessionExpire);
  }

  async fetchUserData() {
    const {response, status} = await this.platform.getCurrentUser();

    if (status === ERROR_STATUS) {
      const errorMessage = await handleErrorResponse(response);

      this.setState({
        errorMessage,
        isLoading: false,
      });

      flashMessage('Login', errorMessage, BLOCKER);

      return null;
    }

    await saveData(USER, response);

    return response;
  }

  async loadUser() {
    const user = JSON.parse(await loadData(USER));
    console.log({user}, 'Nugagee checking user');

    this.setState({
      user,
    });
  }

  async callDeviceAuth() {
    Keyboard.dismiss();
    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const formData = this.otpForm.state.form;
    const formIsComplete = this.otpForm.state.isComplete;
    const formIsValid = this.otpForm.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    let headers = {};
    const deviceDetails = await getDeviceDetails();

    const deviceAuthResponseObj = await this.userManagement.deviceAuth(
      {
        otp: formData.otp,
        tokenId: this.state.tokenId,
        device: {
          deviceUuid: deviceDetails.deviceUuid?.toString(),
          deviceName: deviceDetails.deviceName?.toString(),
          deviceOs: deviceDetails.deviceOs?.toString(),
          deviceModel: deviceDetails.deviceModel?.toString(),
          channel: deviceDetails.channel?.toString(),
        },
        registerDevice: this.state.registerDevice,
      },
      headers,
    );

    const deviceAuthResponseStatus = deviceAuthResponseObj.status;
    const deviceAuthResponseBody = deviceAuthResponseObj.response;

    if (
      deviceAuthResponseStatus === ERROR_STATUS ||
      !deviceAuthResponseBody.data.access_token
    ) {
      this.setState({
        isLoading: false,
      });

      flashMessage(
        null,
        await handleErrorResponse(deviceAuthResponseBody),
        BLOCKER,
      );

      return;
    }

    await saveAuthToken(deviceAuthResponseBody.data.access_token);
    await saveRefreshToken(deviceAuthResponseBody.data.refresh_token);
    await saveData(USER, deviceAuthResponseBody.data.user);

    this.setState({
      accessToken: deviceAuthResponseBody.data.access_token,
      deviceAuthSuccessful: true,
    });

    await this.onSuccessfulLogin(deviceAuthResponseBody);
  }

  async onGuestLogin(responseObj) {
    this.props.navigation.navigate('GuestLogin', {
      loginResponse: responseObj.data,
    });

    this.setState({
      isLoading: false,
    });
  }

  async onSuccessfulLogin(loginResponseObj) {
    const userData = loginResponseObj.data.user;

    const serializedUserData = new UserSerializer(userData);

    this.setState({
      isLoading: false,
    });

    if (!serializedUserData.canAccessDashboard) {
      flashMessage('Login', CANNOT_ACCESS_DASHBOARD, BLOCKER);

      return;
    }

    await saveData(LOGIN_CREDENTIALS, {
      ...this.state.loginCredentials,
      domainTypeId: this.state.domainTypeId,
      selectedProfile: this.state.selectedProfile,
    });

    onNewSessionBegin();

    // this.props.navigation.reset(
    //   [
    //     NavigationActions.navigate({
    //       routeName: serializedUserData.isFip ? "Fip" : "Agent",
    //     }),
    //   ],
    //   0
    // );

    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: serializedUserData.isFip ? 'Fip' : 'Agent',
          },
        ],
      }),
    );
  }

  async onLoginButtonPress() {
    deleteAuthToken();

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const formData = this.form.state.form;
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    this.defaultFormData = formData;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    this.doLogin(formData);
  }

  async doResendOtp() {
    this.setState({
      isSendingOtp: true,
    });

    flashMessage(null, `${SENDING}...`, CASUAL);

    let headers = {};

    const {deviceUuid} = await getDeviceDetails();
    const {tokenId} = this.state;

    const {status, response, code} = await this.userManagement.regenerateToken(
      deviceUuid,
      tokenId,
    );
    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), BLOCKER);

      this.setState({
        isSendingOtp: false,
      });

      return;
    }

    flashMessage(SUCCESS, OTP_SUCCESSFULLY_SENT, BLOCKER);

    this.setState({
      isSendingOtp: false,
    });
  }

  async doFakeLogin() {
    await saveData(APPLICATION, {
      applicationId: 1316,
      approvalStatus: 'APPROVED',
      applicationType: 'SUBMITTED',
      howYouHeardAboutUs: 'Social Media',
      referralCode: 'SA432f98JM17',
      serviceProviderId: 'SPIFIS',
      agentTypeId: 4,
      applicantDetails: {
        firstName: 'Tomisin',
        middleName: 'Ayoola',
        surname: 'Abiodun',
        phoneNumber: '2347085121508',
        bvn: '22197704901',
        emailAddress: 'decave.12357@gmail.com',
        state: '14',
        localGovernmentArea: '126',
        address: '1648C, Oko Awo Rd',
        closestLandMark: 'Eko Hotel and Suites',
        placeOfBirth: 'Lagos',
        nationality: '1',
        mothersMaidenName: 'Mariam',
        gender: 'MALE',
        identificationType: '3',
        identificationNumber: 'BN90122281',
        dob: '2001-09-09',
        nextOfKin: {
          firstName: 'Mary',
          surname: 'Akinbidy',
          phoneNumber: '2348073903201',
          relationship: 'mary',
          gender: 'MALE',
        },
      },
      documentsList: [
        {
          documentId: 199,
          documentType: 'clap.png-BD',
          documentName: '1316_clap.png-BD1569405399690.png',
          documentExtention: 'png',
          documentLink:
            'smb://172.26.40.5/test_nas/public/finch/onboarding/1316_clap.png-BD1569405399690.png',
          dateCreated: '2019-09-25T10:56:40.253+0000',
          dateLastModified: '2019-09-25T10:56:40.253+0000',
        },
        {
          documentId: 200,
          documentType: 'iconfinder_React.js_logo_1174949 (1).png-BD',
          documentName:
            '1316_iconfinder_React.js_logo_1174949_(1).png-BD1569405399843.png',
          documentExtention: 'png',
          documentLink:
            'smb://172.26.40.5/test_nas/public/finch/onboarding/1316_iconfinder_React.js_logo_1174949_(1).png-BD1569405399843.png',
          dateCreated: '2019-09-25T10:56:40.353+0000',
          dateLastModified: '2019-09-25T10:56:40.353+0000',
        },
        {
          documentId: 201,
          documentType: 'iconfinder_React.js_logo_1174949 (1).png-PD',
          documentName:
            '1316_iconfinder_React.js_logo_1174949_(1).png-PD1569405399924.png',
          documentExtention: 'png',
          documentLink:
            'smb://172.26.40.5/test_nas/public/finch/onboarding/1316_iconfinder_React.js_logo_1174949_(1).png-PD1569405399924.png',
          dateCreated: '2019-09-25T10:56:40.430+0000',
          dateLastModified: '2019-09-25T10:56:40.430+0000',
        },
        {
          documentId: 211,
          documentType: 'Group 2 (2).png-PD',
          documentName: '1316_Group_2_(2).png-PD1569586949818.png',
          documentExtention: 'png',
          documentLink:
            'smb://172.26.40.5/test_nas/public/finch/onboarding/1316_Group_2_(2).png-PD1569586949818.png',
          dateCreated: '2019-09-27T13:22:30.417+0000',
          dateLastModified: '2019-09-27T13:22:30.417+0000',
        },
        {
          documentId: 212,
          documentType: 'Group 2 (2).png-PD',
          documentName: '1316_Group_2_(2).png-PD1569586964430.png',
          documentExtention: 'png',
          documentLink:
            'smb://172.26.40.5/test_nas/public/finch/onboarding/1316_Group_2_(2).png-PD1569586964430.png',
          dateCreated: '2019-09-27T13:22:44.797+0000',
          dateLastModified: '2019-09-27T13:22:44.797+0000',
        },
      ],
      businessDetails: {
        businessName: 'Cold Fusion',
        phoneNumber: '2347093892221',
        localGovernmentArea: '223',
        state: '28',
        companyRegistrationNumber: 'BN90291021',
        address: '98, Victoria Island',
        bankName: 'Stanbic IBTC Plc',
        accountNumber: '2210928121',
        businessType: 'Business Center',
      },
      dateCreated: '2019-09-25T10:52:39.333+0000',
      dateLastModified: '2019-09-25T15:56:44.017+0000',
    });
    await saveData(AGENT, {
      id: 400,
      businessName: 'Cold Fusion',
      companyRegNo: 'BN90291021',
      agentMobileNo: '2347085121508',
      businessPhoneNo: '2347093892221',
      agentCode: 'AG221dgUtc',
      businessTypeId: 0,
      businessTypeName: 'Business Center',
      businessEmail: 'decave.12357@gmail.com',
      agentClass: 'Classic',
      agentType: 'Agent',
      agentClassId: 1,
      agentTypeId: 4,
      dateApplied: '2019-09-25',
      dateApplicationApproved: '2019-09-25',
      dateLastUpdated: '2019-09-25',
      enrolledBy: 0,
      applicationValidatedBy: 0,
      applicationApprovedBy: 0,
      createdBy: 0,
      lastUpdatedBy: 0,
      parentId: 'SA432f98JM17',
      serviceProviderId: 'SPIFIS',
      status: 'Active',
      statusId: 2,
      agentBankAccount: {
        accountNo: '2210928121',
        accountName: 'Cold Fusion',
        bankName: 'Stanbic IBTC Plc',
        bvn: '22197704901',
      },
      businessContact: {
        id: 65,
        agentId: 400,
        firstname: 'Tomisin',
        middlename: 'Ayoola',
        lastname: 'Abiodun',
        dob: '2001-09-09',
        gender: 'MALE',
        placeOfBirth: 'Lagos',
        nationality: 'Nigeria',
        motherMadienName: 'Mariam',
        educationLevelId: 0,
        residentialAddress: {
          addressLine1: '1648C, Oko Awo Rd',
          state: 'Enugu',
          lga: 'Udenu',
          country: 'Nigeria',
          landmark: 'Eko Hotel and Suites',
          longitude: 0,
          latitude: 0,
        },
        contactType: 1,
        identityId: 0,
      },
      nextOfKins: [
        {
          id: 66,
          agentId: 400,
          firstname: 'Mary',
          lastname: 'Akinbidy',
          educationLevelId: 0,
          residentialAddress: {
            houseNo: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            landmark: '',
            longitude: 0,
            latitude: 0,
          },
          contactType: 2,
          identityId: 0,
        },
      ],
      directors: [],
      businessLocation: [
        {
          addressLine1: '98, Victoria Island',
          country: 'Nigeria',
          state: 'Ogun',
          lga: 'Egbado North',
          longitude: 0,
          latitude: 0,
          visited: false,
          visitedBy: 0,
        },
      ],
    });
    await saveAuthToken(
      'eyJhbGciOiJSUzI1NiJ9.eyJsYXN0TmFtZSI6IkFiaW9kdW4iLCJmaXJzdExvZ2luIjpmYWxzZSwidXNlcl9uYW1lIjoiZGVjYXZlLjEyMzU3QGdtYWlsLmNvbSIsIm1vYmlsZU5vIjoiMjM0NzA4NTEyMTUwOCIsImNsaWVudF9pZCI6IklLSUE3NzNDNEZGMUQ0NzY5MjM0MzY3Nzg3OUQxQUVBNTdEMUM5NzNCMDc2IiwiZmlyc3ROYW1lIjoiVG9taXNpbiIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJhdWQiOlsiZmluY2gtb25ib2FyZGluZy1zZXJ2aWNlIiwiZmluY2gtcGxhdGZvcm0tc2VydmljZSIsImZpbmNoLXVzZXItbWdtdC1zZXJ2aWNlIiwiaWZpcy10cmFuc2FjdGlvbi1zZXJ2aWNlIiwiaXN3LWNvcmUiLCJwYXNzcG9ydCIsIndhbGxldCJdLCJzY29wZSI6WyJwcm9maWxlIl0sIm1vYmlsZU5vVmVyaWZpZWQiOmZhbHNlLCJqdGkiOiIxZWQ4ZDk2MS0zNmQ3LTRhNWMtYjMxOC1hODMyMzI4OTM5M2UiLCJlbWFpbCI6ImRlY2F2ZS4xMjM1N0BnbWFpbC5jb20iLCJwYXNzcG9ydElkIjoiNTUwNTkzQ0ItMDM0Mi00QkQxLUJEM0MtQTMxNzQzNjI3NTQ4In0.gqHsJtFN8psk5uD8QJf_qJXJ-hncIHpih3Ku-g5bedt9rUsZJ4IxJcclUT1ywImEo94sMUBSxdrarD4RJl3Y0aq-KCkY9vKyro8zeBDLCkSqzhNKysYQLKJlZ-xijSWcOpKRr8FztpQ6380C1AXWSa7H2Dj_Zw_i-cC-Qb5U0rs_xZrTPB7ialzjUqeEKk6_EW0vC1FC09XHCN7WxBKW1y9YvSIJHsHLLs0G9oknr6kC_QabzB74CMAk51u1HQUDK8BJ-w5gyEliAdzyIMuv8rtjZpwumjPGWSlTtTQ_hq2C9CCO66aZBE8tqEp2xg1zivtFwr9OXkSnWcFnrXa4bA',
    );
    await saveRefreshToken(
      'eyJhbGciOiJSUzI1NiJ9.eyJsYXN0TmFtZSI6IkFiaW9kdW4iLCJmaXJzdExvZ2luIjpmYWxzZSwidXNlcl9uYW1lIjoiZGVjYXZlLjEyMzU3QGdtYWlsLmNvbSIsIm1vYmlsZU5vIjoiMjM0NzA4NTEyMTUwOCIsImNsaWVudF9pZCI6IklLSUE3NzNDNEZGMUQ0NzY5MjM0MzY3Nzg3OUQxQUVBNTdEMUM5NzNCMDc2IiwiZmlyc3ROYW1lIjoiVG9taXNpbiIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJhdWQiOlsiZmluY2gtb25ib2FyZGluZy1zZXJ2aWNlIiwiZmluY2gtcGxhdGZvcm0tc2VydmljZSIsImZpbmNoLXVzZXItbWdtdC1zZXJ2aWNlIiwiaWZpcy10cmFuc2FjdGlvbi1zZXJ2aWNlIiwiaXN3LWNvcmUiLCJwYXNzcG9ydCIsIndhbGxldCJdLCJzY29wZSI6WyJwcm9maWxlIl0sIm1vYmlsZU5vVmVyaWZpZWQiOmZhbHNlLCJqdGkiOiIxZWQ4ZDk2MS0zNmQ3LTRhNWMtYjMxOC1hODMyMzI4OTM5M2UiLCJlbWFpbCI6ImRlY2F2ZS4xMjM1N0BnbWFpbC5jb20iLCJwYXNzcG9ydElkIjoiNTUwNTkzQ0ItMDM0Mi00QkQxLUJEM0MtQTMxNzQzNjI3NTQ4In0.gqHsJtFN8psk5uD8QJf_qJXJ-hncIHpih3Ku-g5bedt9rUsZJ4IxJcclUT1ywImEo94sMUBSxdrarD4RJl3Y0aq-KCkY9vKyro8zeBDLCkSqzhNKysYQLKJlZ-xijSWcOpKRr8FztpQ6380C1AXWSa7H2Dj_Zw_i-cC-Qb5U0rs_xZrTPB7ialzjUqeEKk6_EW0vC1FC09XHCN7WxBKW1y9YvSIJHsHLLs0G9oknr6kC_QabzB74CMAk51u1HQUDK8BJ-w5gyEliAdzyIMuv8rtjZpwumjPGWSlTtTQ_hq2C9CCO66aZBE8tqEp2xg1zivtFwr9OXkSnWcFnrXa4bA',
    );
    await saveData(USER, {
      username: 'decave.12357@gmail.com',
      firstName: 'Tomisin',
      lastName: 'Abiodun',
      email: 'decave.12357@gmail.com',
      mobileNo: '2347085121508',
      active: false,
      status: 1,
      domainCode: 'AG501JU2vy',
      domainId: 388,
      roleName: 'SUPER_ADMIN',
      permissions: [
        {name: 'GET_AGENT', id: 7},
        {name: 'GET_ROLES', id: 16},
        {name: 'GET_PERMISSIONS', id: 17},
        {name: 'CREATE_AGENT_USER', id: 18},
        {name: 'GET_AGENT_USERS', id: 23},
        {name: 'VIEW_APPLICATION', id: 59},
        {name: 'VIEW_TRANSACTIONS', id: 61},
        {name: 'VIEW_ALL_TRANSACTIONS', id: 62},
      ],
      domainTypeIds: [4],
    });
    await saveData(WALLET, {
      current_balance: 2764530.68,
      commissions_earned: 5180,
      float_balance: 0,
      unsettled_balance: 0,
    });

    this.props.navigation.navigate('Agent');
  }

  async doLogin(formData) {
    logEvent(LOGIN_CLICK);

    const {
      domainTypeId,
      loginCredentials: {username, password},
    } = this.state;

    stopwatch.start();

    this.setState({
      username,
    });

    const deviceDetails = await getDeviceDetails();

    const loginResponse = await this.userManagement.login(
      {
        username: this.state.isResumeUsername || username,
        password,
        device: {
          deviceUuid: deviceDetails.deviceUuid?.toString(),
          deviceName: deviceDetails.deviceName?.toString(),
          deviceOs: deviceDetails.deviceOs?.toString(),
          deviceModel: deviceDetails.deviceModel?.toString(),
          channel: deviceDetails.channel?.toString(),
        },
        domainTypeId:
          this.state.isResumeuserDomains?.domainTypeId || domainTypeId,
      },
      null,
      {},
    );

    stopwatch.stop();

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

    this.setState({
      isAssistedPasswordPage: false,
    });

    if (loginResponse.code === 202) {
      if (loginResponseObj.code === '20200') {
        this.props.navigation.replace('VerifyPhone', {
          isExistingUser: null,
          user: {
            username,
            password,
          },
        });

        this.setState({
          isLoading: false,
        });

        return;
      }

      if (loginResponseObj.code === '20201') {
        this.props.navigation.replace('ChangePassword', {
          accessToken:
            loginResponseObj.data.access_token || loginResponseObj.data,
          uuid: loginResponseObj.data.uuid,
          username: loginResponseObj?.data?.user?.username,
        });

        this.setState({
          isLoading: false,
        });

        return;
      }

      if (loginResponseObj.code === '20202') {
        this.props.navigation.replace('ResetPassword', {
          accessToken: loginResponseObj.data.access_token,
          isOtpRequired: this.isOtpRequired(loginResponseObj),
          username: loginResponseObj?.data?.user?.username,
          uuid: loginResponseObj.data.uuid,
        });

        this.setState({
          isLoading: false,
        });

        return;
      }

      if (loginResponseObj.code === '20206') {
        const userProfiles = loginResponseObj.data;

        this.setState({
          formData,
          isLoading: false,
          userProfiles,
        });

        this.selectRoleMenu.open();

        return;
      }

      this.setState({
        accessToken: loginResponseObj.data.access_token,
        doDeviceAuth: true,
        isLoading: false,
        registerDeviceDescription: loginResponseObj.description,
        showRegisterDeviceCheckmark:
          loginResponseObj.code !== '20204' &&
          loginResponseObj.code !== '20205',
        tokenId: loginResponseObj.data.tokenId,
      });

      this.selectRoleMenu.close();

      return;
    }

    await saveAuthToken(loginResponseObj.data.access_token);
    await saveRefreshToken(loginResponseObj.data.refresh_token);
    await saveData(USER, loginResponseObj.data.user);

    if (loginResponseObj.data.user.roleName === 'GUEST') {
      await this.onGuestLogin(loginResponseObj);
    } else {
      await this.onSuccessfulLogin(loginResponseObj);
    }
  }

  async onBiometricLoginButtonPressOut() {
    const {didSessionExpire = false} = this.props.route.params || {};

    const userData = JSON.parse(await loadData(LOGIN_DETAILS));

    let title = 'Quickteller Paypoint';
    let description = 'Login using fingerprint.';

    if (didSessionExpire) {
      description = 'Place your finger on your fingerprint sensor to login.';
      title = 'Session Expired';
    }

    await TouchID.authenticate(description, {
      title,
    });

    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    this.doLogin(userData);
  }

  onUsernameFormContinueButtonPress() {
    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const formData = this.usernameForm.state.form;
    const formIsComplete = this.usernameForm.state.isComplete;
    const formIsValid = this.usernameForm.state.isValid;

    this.defaultFormData = formData;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    this.getProfiles(formData);

    if (
      safeUsername(formData?.username) !== this.state.loginCredentials?.username
    ) {
      this.setState({
        toShowBiometricLoginButton: false,
      });
    }
  }

  onPasswordFormContinueButtonPress() {
    const {selectedProfile} = this.state;
    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const formData = this.passwordForm.state.form;
    const formIsComplete = this.passwordForm.state.isComplete;
    const formIsValid = this.passwordForm.state.isValid;

    this.defaultFormData = formData;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    this.setState({
      loginCredentials: {
        ...this.state.loginCredentials,
        password: formData.password,
      },
    });

    setTimeout(this.doLogin, 10);
  }

  async recoverPasswordForUsername(email, userDomains) {
    this.setState({
      errorMessage: null,
    });

    this.email = email;

    this.setState({
      isLoading: true,
    });

    const recoverPasswordResponse = await this.userManagement.recoverPassword(
      email,
      // validateEmail(email) ? email : email,
      RECOVER_PASSWORD_DESTINATION_URL,
      userDomains.authenticatedAs,
    );

    console.log('RECOVER PASSWORD RESPONSE', recoverPasswordResponse);

    const recoverPasswordResponseStatus = recoverPasswordResponse.status;
    const recoverPasswordResponseObj = recoverPasswordResponse.response;

    if (recoverPasswordResponseStatus === ERROR_STATUS) {
      flashMessage(
        'Reset Password',
        await handleErrorResponse(recoverPasswordResponseObj),
        BLOCKER,
      );

      this.setState({
        isLoading: false,
      });

      return;
    }

    this.setState({
      isLoading: false,
      // messageSentSuccessfully: true
    });
    this.props.navigation.replace('ResetPassordAssistedScene', {
      isOtpRequired: true,
      email,
      uuid: recoverPasswordResponseObj.uuid,
      userDomains,
    });

    // if (!validateEmail(email)) {
    //   this.props.navigation.replace('ForgotPasswordOtp', {
    //     email,
    //     uuid: recoverPasswordResponseObj.uuid,
    //   });
    // }
  }

  async getProfiles({silent, username}) {
    console.log({username}, 'NUGAGEE CHECKING IF CALLS GET HERE ON SILENT');

    const {selectedProfile} = this.state;
    this.setState({
      isLoading: silent ? false : true,
    });

    const username_ = safeUsername(username);

    const {response, status} = await this.userManagement.getUserProfiles(
      username_,
    );

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      !silent &&
        flashMessage('Error', await handleErrorResponse(response), BLOCKER);

      this.setState({
        errorMessage: await handleErrorResponse(response),
      });

      return;
    }

    console.log({response}, 'NUGAGEE GETTING USERS PROFILE FIRST TIME LOGIN');

    if (response.data.userDomainTypes[0].shouldResetPassword == true) {
      const userDomains = response.data.userDomainTypes[0];

      this.recoverPasswordForUsername(username_, userDomains);
      return;
    }

    await saveData(USER_PROFILES, response.data.userDomainTypes);

    this.setState({
      userProfiles: response.data.userDomainTypes,
    });

    if (silent) {
      const newDomainTypeIds = response.data.userDomainTypes.map(
        ({domainTypeId}) => domainTypeId,
      );

      if (response.data.userDomainTypes.length === 1) {
        this.onSelectDomainTypeId(
          response.data.userDomainTypes[0].domainTypeId,
        );
      } else if (
        response.data.userDomainTypes.length &&
        !newDomainTypeIds.includes(selectedProfile.domainTypeId)
      ) {
        this.selectRoleMenu.open();
      }
    } else if (response.data.userDomainTypes.length > 1) {
      this.selectRoleMenu.open();
    } else if (response.data.userDomainTypes.length === 1) {
      this.onSelectDomainTypeId(response.data.userDomainTypes[0].domainTypeId);
    } else {
      this.setState({
        selectedProfile: {username},
        loginCredentials: {
          ...this.state.loginCredentials,
          username,
        },
        domainTypeId: 0,
      });
    }
  }

  toDisableFingerprint() {
    if (!this.state.user?.username) {
      return true;
    }

    const isNewUsername =
      formatPhoneNumberToReadable(this.state.user?.username) !==
      this.state.username;

    return isNewUsername;
  }

  get loginFormUsernamePage() {
    return (
      <React.Fragment>
        <UsernameForm
          shouldAutoFocus={this.state.user === null}
          username={this.state.user ? this.state.user.username : null}
          hasUserBeenLoaded={this.state.user !== undefined}
          isDisabled={this.state.isLoading}
          isFingerprintLoginEnabled={this.state.toShowBiometricLoginButton}
          propagateFormErrors={this.state.propagateFormErrors}
          ref={form => (this.usernameForm = form)}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Hyperlink href="ForgotPassword">Reset Password?</Hyperlink>
          <Hyperlink
            onPress={() => {
              this.contactUsOptionsMenu.open();
            }}>
            Contact Support
          </Hyperlink>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Button
            buttonStyle={{
              backgroundColor: COLOUR_PRIMARY,
              borderRadius: 25,
              padding: 12,
            }}
            containerStyle={{
              marginTop: 16,
              width: '100%',
            }}
            loading={this.state.isLoading}
            onPress={this.onUsernameFormContinueButtonPress}
            title="CONTINUE"
          />
        </View>

        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginTop: 20,
            }}>
            New to Quickteller Paypoint?{' '}
            <Hyperlink href="Signup">Sign Up!</Hyperlink>
          </Text>
        </View>
      </React.Fragment>
    );
  }

  get loginFormPasswordPage() {
    return (
      <React.Fragment>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            margin: 0,
            marginBottom: 20,
            width: '100%',
          }}>
          <Text style={{flexGrow: 1, fontSize: FONT_SIZE_TITLE, width: '100%'}}>
            Username:
          </Text>
          <Text black style={{fontSize: FONT_SIZE_TEXT_INPUT}}>
            {this.state.selectedProfile?.username || this.state.user?.username}
          </Text>
          <Hyperlink
            onPress={() =>
              this.setState({
                user: null,
                domainTypeId: null,
                selectedProfile: null,
                isAssistedPasswordPage: false,
              })
            }>
            Edit
          </Hyperlink>
        </View>
        <PasswordForm
          shouldAutoFocus={
            this.shouldAutoFocus() && !this.state.toShowBiometricLoginButton
          }
          username={this.state.user ? this.state.user.username : null}
          hasUserBeenLoaded={this.state.user !== undefined}
          isDisabled={this.state.isLoading}
          isFingerprintLoginEnabled={this.state.toShowBiometricLoginButton}
          propagateFormErrors={this.state.propagateFormErrors}
          ref={form => (this.passwordForm = form)}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Hyperlink href="ForgotPassword">Reset Password?</Hyperlink>
          <Hyperlink
            onPress={() => {
              this.contactUsOptionsMenu.open();
            }}>
            Contact Support
          </Hyperlink>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Button
            buttonStyle={{
              backgroundColor: COLOUR_PRIMARY,
              borderRadius: 25,
              padding: 12,
            }}
            containerStyle={{
              marginTop: 16,
              width: this.state.toShowBiometricLoginButton ? '80%' : '100%',
            }}
            loading={this.state.isLoading}
            onPress={this.onPasswordFormContinueButtonPress}
            title="LOGIN"
          />
          {this.state.toShowBiometricLoginButton && (
            <TouchableOpacity
              disabled={this.state.isLoading}
              onPress={this.onBiometricLoginButtonPressOut}
              style={{
                alignItems: 'center',
                backgroundColor: COLOUR_PRIMARY,
                borderRadius: 26,
                height: 52,
                justifyContent: 'center',
                marginLeft: 0,
                marginTop: 10,
                width: 52,
              }}>
              <Icon color={COLOUR_WHITE} name="fingerprint" size={36} />
            </TouchableOpacity>
          )}
        </View>

        {
          <Hyperlink
            onPress={() =>
              this.setState({
                user: null,
                domainTypeId: null,
                selectedProfile: null,
              })
            }
            style={{
              marginTop: 10,
            }}>
            Login with another account
          </Hyperlink>
        }

        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginTop: 20,
            }}>
            New to Quickteller Paypoint?{' '}
            <Hyperlink href="Signup">Sign Up!</Hyperlink>
          </Text>
        </View>
      </React.Fragment>
    );
  }
  get loginFormAssistedPasswordPage() {
    const email = this.props.route.params.assistedAgentDetails || {};

    return (
      <React.Fragment>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            margin: 0,
            marginBottom: 20,
            width: '100%',
          }}>
          <Text style={{flexGrow: 1, fontSize: FONT_SIZE_TITLE, width: '100%'}}>
            Username:
          </Text>
          <Text black style={{fontSize: FONT_SIZE_TEXT_INPUT}}>
            {email}
          </Text>
          <Hyperlink
            onPress={() =>
              this.setState({
                user: null,
                domainTypeId: null,
                selectedProfile: null,
                isAssistedPasswordPage: false,
              })
            }>
            Edit
          </Hyperlink>
        </View>
        <PasswordForm
          shouldAutoFocus={
            this.shouldAutoFocus() && !this.state.toShowBiometricLoginButton
          }
          username={this.state.user ? this.state.user.username : null}
          hasUserBeenLoaded={this.state.user !== undefined}
          isDisabled={this.state.isLoading}
          isFingerprintLoginEnabled={this.state.toShowBiometricLoginButton}
          propagateFormErrors={this.state.propagateFormErrors}
          ref={form => (this.passwordForm = form)}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Hyperlink href="ForgotPassword">Reset Password?</Hyperlink>
          <Hyperlink
            onPress={() => {
              this.contactUsOptionsMenu.open();
            }}>
            Contact Support
          </Hyperlink>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Button
            buttonStyle={{
              backgroundColor: COLOUR_PRIMARY,
              borderRadius: 25,
              padding: 12,
            }}
            containerStyle={{
              marginTop: 16,
              width: this.state.toShowBiometricLoginButton ? '80%' : '100%',
            }}
            loading={this.state.isLoading}
            onPress={this.onPasswordFormContinueButtonPress}
            title="LOGIN"
          />
          {this.state.toShowBiometricLoginButton && (
            <TouchableOpacity
              disabled={this.state.isLoading}
              onPress={this.onBiometricLoginButtonPressOut}
              style={{
                alignItems: 'center',
                backgroundColor: COLOUR_PRIMARY,
                borderRadius: 26,
                height: 52,
                justifyContent: 'center',
                marginLeft: 0,
                marginTop: 10,
                width: 52,
              }}>
              <Icon color={COLOUR_WHITE} name="fingerprint" size={36} />
            </TouchableOpacity>
          )}
        </View>

        {
          <Hyperlink
            onPress={() =>
              this.setState({
                user: null,
                domainTypeId: null,
                selectedProfile: null,
              })
            }
            style={{
              marginTop: 10,
            }}>
            Login with another account
          </Hyperlink>
        }

        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginTop: 20,
            }}>
            New to Quickteller Paypoint?{' '}
            <Hyperlink href="Signup">Sign Up!</Hyperlink>
          </Text>
        </View>
      </React.Fragment>
    );
  }

  get otpFormPage() {
    return (
      <React.Fragment>
        <OtpForm
          isDisabled={this.state.isLoading}
          propagateFormErrors={this.state.propagateFormErrors}
          ref={form => (this.otpForm = form)}
          showNameField={this.state.registerDevice}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Hyperlink onPress={this.doResendOtp}>
            {this.state.isSendingOtp ? 'Loading...' : 'Resend OTP'}
          </Hyperlink>
          <Hyperlink
            onPress={() =>
              this.setState({
                doDeviceAuth: false,
              })
            }>
            Back to Login
          </Hyperlink>
        </View>

        <View style={{alignItems: 'center'}}>
          <View
            style={{
              alignContent: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button
              containerStyle={{
                marginBottom: 20,
                marginTop: 20,
                width: '100%',
              }}
              loading={this.state.isLoading}
              onPress={this.callDeviceAuth}
              title="CONTINUE"
            />
          </View>

          {this.state.showRegisterDeviceCheckmark ? (
            <Tooltip
              containerStyle={{
                padding: 12,
              }}
              height={54}
              popover={
                <Text white>
                  Do you trust this device? Register to disable OTP.
                </Text>
              }
              ref={comp => (this.tooltipRef = comp)}
              width={300}
              withOverlay={false}>
              <CheckBox
                center
                containerStyle={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  padding: 0,
                }}
                onPress={() =>
                  this.setState({
                    registerDevice: !this.state.registerDevice,
                  })
                }
                textStyle={{
                  color: COLOUR_GREY,
                  fontWeight: 'normal',
                  fontSize: FONT_SIZE_MID,
                }}
                title="Register Device"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={this.state.registerDevice}
              />
            </Tooltip>
          ) : (
            <Text grey right small>
              {this.state.registerDeviceDescription}
            </Text>
          )}
        </View>
      </React.Fragment>
    );
  }

  get loginFormTitle() {
    const {isAssistedPasswordPage} = this.props.route.params || {};

    return this.state.user
      ? 'WELCOME BACK!'
      : this.state.isAssistedPasswordPage == true
      ? 'LOGIN TO YOUR ACCOUNT'
      : 'LOGIN TO YOUR ACCOUNT';
  }

  get otherComponents() {
    const {doDeviceAuth, selectedProfile, userProfiles} = this.state;

    const selectedProfilePreviewComp = () => {
      const serializer = new RoleSerializer(selectedProfile);
      const {domainName, friendlyRoleName} = serializer.data;

      return (
        <ClickableListItem
          onPress={() => {
            this.getProfiles(this.state.loginCredentials);
            this.selectRoleMenu.open();
          }}
          style={{
            alignItems: 'center',
            backgroundColor: 'white',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
            position: 'absolute',
            width: '100%',
            elevation: 10,
          }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}>
            <Text
              blue
              bold
              style={{
                fontSize: 18,
                letterSpacing: 1.7,
                textTransform: 'uppercase',
              }}>
              {friendlyRoleName}
            </Text>
            {domainName !== friendlyRoleName && (
              <Text grey semiBold small>
                {domainName}
              </Text>
            )}
          </View>
          <Icon
            color={COLOUR_GREY}
            name="arrow-drop-up"
            size={36}
            type="material"
            underlayColor="transparent"
          />
        </ClickableListItem>
      );
    };

    return (
      <React.Fragment>
        {selectedProfile &&
          Boolean(userProfiles?.length) &&
          !doDeviceAuth &&
          selectedProfilePreviewComp()}
      </React.Fragment>
    );
  }

  onSelectDomainTypeId(domainTypeId) {
    const {userProfiles} = this.state;
    const selectedProfile = userProfiles.find(
      profile => profile.domainTypeId === domainTypeId,
    );

    this.setState({
      domainTypeId,
      selectedProfile,
      loginCredentials: {
        ...this.state.loginCredentials,
        username: selectedProfile.username,
      },
    });

    this.autofocusPasswordInput();
  }

  autofocusPasswordInput() {
    this.state.toShowBiometricLoginButton
      ? setTimeout(this.onBiometricLoginButtonPressOut, 300)
      : this.passwordForm?.password?.focus &&
        setTimeout(() => this.passwordForm.password.focus(), 300);
  }

  render() {
    const {message, isAssistedPasswordPage} = this.props.route.params || {};

    const {formData, isLoading, userProfiles} = this.state;

    let formPage = this.state.doDeviceAuth
      ? this.otpFormPage
      : this.state.isAssistedPasswordPage == true
      ? this.loginFormAssistedPasswordPage
      : this.loginFormUsernamePage;
    if (this.state.domainTypeId !== null && !this.state.doDeviceAuth) {
      formPage = this.loginFormPasswordPage;
    }

    return (
      <View style={{flex: 1, padding: 0, backgroundColor: 'white'}}>
        <View style={{height: 70, marginBottom: 25}}>
          <Header paypointLogo />
        </View>

        <SelectRoleMenu
          isLoading={isLoading}
          onSelect={domainTypeId => {
            this.onSelectDomainTypeId(domainTypeId);
            this.selectRoleMenu.close();
          }}
          ref_={component => (this.selectRoleMenu = component)}
          requestClose={() => this.selectRoleMenu.close()}
          roles={userProfiles}
        />

        <ContactUsOptionsMenu
          ref_={component => (this.contactUsOptionsMenu = component)}
          requestClose={() => this.contactUsOptionsMenu.close()}
        />

        <ScrollView
          contentContainerStyle={{minHeight: '100%'}}
          style={{padding: 25}}>
          <Modal
            animationType="fade"
            transparent={false}
            visible={this.state.isLoginLoading}
            onRequestClose={() => {
              this.setState({isLoginLoading: false});
            }}>
            <ActivityIndicator />
          </Modal>

          <H1
            style={{
              marginBottom: 20,
              marginTop: 30,
              textAlign: 'center',
            }}
            underline>
            {this.state.doDeviceAuth ? 'ENTER YOUR OTP' : this.loginFormTitle}
          </H1>

          {this.state.doDeviceAuth && (
            <Text center title style={{marginBottom: 20}}>
              An OTP has been sent to your registered phone number.
            </Text>
          )}

          {message && <AlertStrip variant="information" content={message} />}

          {formPage}
        </ScrollView>

        {this.otherComponents}
      </View>
    );
  }
}
