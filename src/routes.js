import React from 'react';
// import {
//   createAppContainer,
//   createStackNavigator,
//   createSwitchNavigator,
// } from "react-navigation";

import {createStackNavigator} from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {Linking} from 'react-native';
import ErrorBoundary from './components/error-boundary';
import {COLOUR_BLUE} from './constants/styles';
import AgentScene from './scenes/agent';
import AgentBvnVerification from './scenes/agent/cbn-requirements/scenes/bvn-verification';
import AgentFacialVerification from './scenes/agent/cbn-requirements/scenes/facial-verification';
import AgentNinVerification from './scenes/agent/cbn-requirements/scenes/nin-verfication';
import AgentTinAndCacVerification from './scenes/agent/cbn-requirements/scenes/tin-cac-verification';
import AggregatorLanding from './scenes/aggregator/scenes/landing';
import BusinessDetailsScene from './scenes/aggregator/scenes/pre-setup-agent/business-details';
import KYCInformationScene from './scenes/aggregator/scenes/pre-setup-agent/kyc-information';
import PreSetupAgentScene from './scenes/aggregator/scenes/pre-setup-agent/scene';
import ApplicationScene from './scenes/application';
import ApplicationPreview from './scenes/application-preview';
import BirthdayCard from './scenes/birthday-card';
import ChangePasswordScene from './scenes/change-password';
import CrashRescueScene from './scenes/crash-rescue';
import FipScene from './scenes/fip';
import ForgotPasswordScene from './scenes/forgot-password';
import ForgotPasswordOtpScene from './scenes/forgot-password-otp';
import GuestLoginScene from './scenes/guest-login';
import LandingScene from './scenes/landing';
import LoginScene from './scenes/login';
import LogoutScene from './scenes/logout';
import BroadcastMessageScene from './scenes/misc/broadcast-message-scene';
import ImportantUpdateAvailable from './scenes/misc/important-update-available';
import PrinterSetupScene from './scenes/printer-setup';
import ReleaseNotesScene from './scenes/release-notes';
import ResetPasswordScene from './scenes/reset-password';
import ResetPassordAssistedScene from './scenes/reset-password-assisted';
import SelectProfileScene from './scenes/select-profile';
import SelfOnboardingApplicationPreview from './scenes/self-onboarding/application-preview';
import SelfOnboardingBusinessScene from './scenes/self-onboarding/onboarding-business-details';
import SelfOnboardingKYCScene from './scenes/self-onboarding/onboarding-kyc';
import SelfOnboardingLandingScene from './scenes/self-onboarding/onboarding-landing';
import SelfOnboardingNOKScene from './scenes/self-onboarding/onboarding-nok';
import SelfOnboardingOTPScene from './scenes/self-onboarding/onboarding-otp';
import SelfOnboardingPreSetupAgent from './scenes/self-onboarding/pre-setup-self-onboard';
import ServiceLevelAgreement from './scenes/service-level-agreement';
import SignupScene from './scenes/signup';
import SplashScene from './scenes/splash';
import VerifyPhoneScene from './scenes/verify-phone';
import WelcomeScene from './scenes/welcome';
import navigationService from './utils/navigation-service';

const withErrorBoundary = Component => props =>
  (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );

const MainStack = createStackNavigator();
const AuthStack = createStackNavigator();

const MainStackNavigator = () => {
  const persistenceKey = 'persistenceKey';

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  const [initialState, setInitialState] = React.useState(null);
  const [isReady, setIsReady] = React.useState(false);
  const [isStateRestored, setIsStateRestored] = React.useState(false);

  const persistNavigationState = async navState => {
    console.log(navState, 'my navstate');
    try {
      await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState));
    } catch (err) {}
  };

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl == null) {
          const savedStateString = await AsyncStorage.getItem(persistenceKey);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;
          console.log(state, 'my boss');
          if (state) {
            setInitialState(state);
          }
        }
      } catch (e) {
        console.error('Error restoring state: ', e);
      } finally {
        setIsStateRestored(true);
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return <SplashScene backgroundColor={COLOUR_BLUE} />;
  }

  return (
    <NavigationContainer
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
      }}
      // initialState={isStateRestored ? initialState : undefined}
      onStateChange={async state => {
        persistNavigationState(state);
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          routeNameRef.current = currentRouteName;
          navigationService.onNavigationStateChange(
            previousRouteName,
            currentRouteName,
          );
        }
      }}
      ref={navigatorRef => {
        console.log('SETTING UP NAVIGATOR REF');
        navigationService.setTopLevelNavigator(navigatorRef);
        navigationRef.current = navigatorRef;
      }}>
      <MainStack.Navigator
        initialRouteName="Welcome"
        screenOptions={{headerShown: false}}>
        <MainStack.Screen
          name="Agent"
          component={withErrorBoundary(AgentScene)}
        />
        <MainStack.Screen
          name="HomeTabs"
          component={withErrorBoundary(AgentScene)}
        />
        <MainStack.Screen
          name="Application"
          component={withErrorBoundary(ApplicationScene)}
        />
        <MainStack.Screen
          name="ApplicationPreview"
          component={withErrorBoundary(ApplicationPreview)}
        />
        <MainStack.Screen
          name="BirthdayCard"
          component={withErrorBoundary(BirthdayCard)}
        />
        <MainStack.Screen
          name="ChangePassword"
          component={withErrorBoundary(ChangePasswordScene)}
        />
        <MainStack.Screen
          name="CrashRescue"
          component={withErrorBoundary(CrashRescueScene)}
        />
        <MainStack.Screen name="Fip" component={withErrorBoundary(FipScene)} />
        <MainStack.Screen
          name="ResetPassordAssistedScene"
          component={withErrorBoundary(ResetPassordAssistedScene)}
        />
        <MainStack.Screen
          name="ForgotPassword"
          component={withErrorBoundary(ForgotPasswordScene)}
        />
        <MainStack.Screen
          name="ForgotPasswordOtp"
          component={withErrorBoundary(ForgotPasswordOtpScene)}
        />
        <MainStack.Screen
          name="GuestLogin"
          component={withErrorBoundary(GuestLoginScene)}
        />
        <MainStack.Screen
          name="ImportantUpdateAvailable"
          component={withErrorBoundary(ImportantUpdateAvailable)}
        />
        <MainStack.Screen
          name="OnboardingLanding"
          component={withErrorBoundary(SelfOnboardingLandingScene)}
        />
        <MainStack.Screen
          name="OnboardingPreSetup"
          component={withErrorBoundary(AggregatorLanding)}
        />
        <MainStack.Screen
          name="AggregatorLanding"
          component={withErrorBoundary(AggregatorLanding)}
        />
        <MainStack.Screen
          name="AgreegatorResumeLandingScene"
          component={withErrorBoundary(AggregatorLanding)}
        />
        <MainStack.Screen
          name="Landing"
          component={withErrorBoundary(LandingScene)}
        />
        <MainStack.Screen
          name="Login"
          component={withErrorBoundary(LoginScene)}
        />
        <MainStack.Screen
          name="Logout"
          component={withErrorBoundary(LogoutScene)}
        />
        <MainStack.Screen
          name="PreSetupAgent"
          component={withErrorBoundary(PreSetupAgentScene)}
        />
        <MainStack.Screen
          name="kYCInformation"
          component={withErrorBoundary(KYCInformationScene)}
        />
        <MainStack.Screen
          name="BusinessDetails"
          component={withErrorBoundary(BusinessDetailsScene)}
        />
        <MainStack.Screen
          name="NextOfKinDetails"
          component={withErrorBoundary(SelfOnboardingNOKScene)}
        />
        <MainStack.Screen
          name="SelfOnboardingPreSetupAgent"
          component={withErrorBoundary(SelfOnboardingPreSetupAgent)}
        />
        <MainStack.Screen
          name="SelfOnboardingOTPScene"
          component={withErrorBoundary(SelfOnboardingOTPScene)}
        />
        <MainStack.Screen
          name="SelfOnboardingKYCScene"
          component={withErrorBoundary(SelfOnboardingKYCScene)}
        />
        <MainStack.Screen
          name="SelfOnboardingBusinessScene"
          component={withErrorBoundary(SelfOnboardingBusinessScene)}
        />
        <MainStack.Screen
          name="SelfOnboardingApplicationPreview"
          component={withErrorBoundary(SelfOnboardingApplicationPreview)}
        />
        <MainStack.Screen
          name="AgentApplicationPreview"
          component={withErrorBoundary(SelfOnboardingApplicationPreview)}
        />
        <MainStack.Screen
          name="ResetPassword"
          component={withErrorBoundary(ResetPasswordScene)}
        />
        <MainStack.Screen
          name="SelectProfileScene"
          component={withErrorBoundary(SelectProfileScene)}
        />
        <MainStack.Screen
          name="ServiceLevelAgreement"
          component={withErrorBoundary(ServiceLevelAgreement)}
        />
        <MainStack.Screen
          name="Signup"
          component={withErrorBoundary(SignupScene)}
        />
        <MainStack.Screen
          name="AgentNinVerification"
          component={withErrorBoundary(AgentNinVerification)}
        />
        <MainStack.Screen
          name="AgentBvnVerification"
          component={withErrorBoundary(AgentBvnVerification)}
        />
        <MainStack.Screen
          name="AgentFacialVerification"
          component={withErrorBoundary(AgentFacialVerification)}
        />
        <MainStack.Screen
          name="AgentTinVerification"
          component={withErrorBoundary(AgentTinAndCacVerification)}
        />
        <MainStack.Screen
          name="VerifyPhone"
          component={withErrorBoundary(VerifyPhoneScene)}
        />
        <MainStack.Screen
          name="Welcome"
          component={withErrorBoundary(WelcomeScene)}
        />
        <MainStack.Screen
          name="BroadcastMessage"
          component={withErrorBoundary(BroadcastMessageScene)}
        />
        <MainStack.Screen
          name="ReleaseNotes"
          component={withErrorBoundary(ReleaseNotesScene)}
        />
        <MainStack.Screen
          name="PrinterSetupScene"
          component={withErrorBoundary(PrinterSetupScene)}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Login" component={withErrorBoundary(LoginScene)} />
  </AuthStack.Navigator>
);

export default MainStackNavigator;
