import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Easing} from 'react-native';

import AllApplicationsScene from '../all-applications';
import ApplicationScene from '../application';
import ApplicationPreview from '../application-preview';
import RequestConfirmationScene from '../complete-setup/request-confirmation';
import FipAgentBusinessInformationScene from '../fip-new/onboarding/scenes/business-details';
import FipAgentBvnVerification from '../fip-new/onboarding/scenes/government-compliance/bvn-verification';
import FipAgentFacialVerification from '../fip-new/onboarding/scenes/government-compliance/facial-verification';
import FipAgentTinAndCacVerification from '../fip-new/onboarding/scenes/government-compliance/tin-cac-verification';
import FipAgentNextOfKinInformationScene from '../fip-new/onboarding/scenes/next-of-kin';
import FipAgentPersonalDetailsScene from '../fip-new/onboarding/scenes/personal-details';

import FipAgentApplicationPreviewScene from '../fip-new/onboarding/scenes/application-preview';
import {FipAgentSubmitApplicationSuccessScene} from '../fip-new/onboarding/scenes/application-preview/submit-success';
import FipAgentAuthorizationLetter from '../fip-new/onboarding/scenes/government-biller/authorization-letter';
import FipAgentFacialVerificationConfirmation from '../fip-new/onboarding/scenes/government-compliance/facial-verification-confirmation';
import {FipAgentFailedVerification} from '../fip-new/onboarding/scenes/government-compliance/fail-verification';
import FipAgentNinVerification from '../fip-new/onboarding/scenes/government-compliance/nin-verfication';
import FipAgentOtpVerification from '../fip-new/onboarding/scenes/government-compliance/otp';
import FipAgentFaceVerificatiobWebViewScreen from '../fip-new/onboarding/scenes/government-compliance/web-view';
import FipAgentResidentialInformationScene from '../fip-new/onboarding/scenes/residential-address';
import PreSetupAgentScene from '../pre-setup-agent';
import SearchApplicationScene from '../search-application';
import CompleteSetupScene from './scenes/complete-setup';
import ViewAllRequestsScene from './scenes/complete-setup/view-all-requests';
import DefaultScene from './scenes/default-scene';
import FilterViewAllAgentsScene from './scenes/monitoring-and-support/filter-view-all-agents';
import QuestionnaireObjectivesScene from './scenes/monitoring-and-support/questionnaire/objectives';
import QuestionnaireQuestionsScene from './scenes/monitoring-and-support/questionnaire/questions';
import ViewAgentDetailsScene from './scenes/monitoring-and-support/view-agent-details';
import ViewAllAgentsScene from './scenes/monitoring-and-support/view-all-agents';
import NotificationsScene from './scenes/notifications';
import SearchScene from './scenes/search';

const Stack = createStackNavigator();

const config = {
  animation: 'timing',
  config: {
    duration: 450,
    easing: Easing.out(Easing.exp),
  },
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
        transitionSpec: {
          open: config,
          close: config,
        },
        cardStyleInterpolator: ({current, layouts}) => {
          const translateX = current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          });

          return {
            cardStyle: {
              transform: [{translateX}],
            },
          };
        },
      }}>
      <Stack.Screen name="Application" component={ApplicationScene} />
      <Stack.Screen name="AllApplications" component={AllApplicationsScene} />
      <Stack.Screen name="ApplicationPreview" component={ApplicationPreview} />
      <Stack.Screen name="CompleteSetup" component={CompleteSetupScene} />
      <Stack.Screen
        name="FilterViewAllAgents"
        component={FilterViewAllAgentsScene}
      />
      <Stack.Screen name="HomeTabs" component={DefaultScene} />
      <Stack.Screen name="Notifications" component={NotificationsScene} />
      <Stack.Screen name="PreSetupAgent" component={PreSetupAgentScene} />
      <Stack.Screen
        name="QuestionnaireObjectives"
        component={QuestionnaireObjectivesScene}
      />
      <Stack.Screen
        name="QuestionnaireQuestions"
        component={QuestionnaireQuestionsScene}
      />
      <Stack.Screen
        name="RequestConfirmation"
        component={RequestConfirmationScene}
      />
      <Stack.Screen name="Search" component={SearchScene} />
      <Stack.Screen
        name="SearchApplication"
        component={SearchApplicationScene}
      />
      <Stack.Screen name="ViewAllAgents" component={ViewAllAgentsScene} />
      <Stack.Screen name="ViewAgentDetails" component={ViewAgentDetailsScene} />
      <Stack.Screen name="ViewAllRequests" component={ViewAllRequestsScene} />
      <Stack.Screen
        name="FipAgentFailedVerification"
        component={FipAgentFailedVerification}
      />
      <Stack.Screen
        name="FipAgentAuthorizationLetter"
        component={FipAgentAuthorizationLetter}
      />
      <Stack.Screen
        name="FipAgentSubmitApplicationSuccess"
        component={FipAgentSubmitApplicationSuccessScene}
      />
      <Stack.Screen
        name="FipAgentWebViewFacialVerification"
        component={FipAgentFaceVerificatiobWebViewScreen}
      />
      <Stack.Screen
        name="FipAgentApplicationPreview"
        component={FipAgentApplicationPreviewScene}
      />
      <Stack.Screen
        name="FipAgentResidentialInformation"
        component={FipAgentResidentialInformationScene}
      />
      <Stack.Screen
        name="FipAgentBusinessInformation"
        component={FipAgentBusinessInformationScene}
      />
      <Stack.Screen
        name="FipAgentPersonalInformation"
        component={FipAgentPersonalDetailsScene}
      />
      <Stack.Screen
        name="FipAgentNextOfKinInformation"
        component={FipAgentNextOfKinInformationScene}
      />
      <Stack.Screen
        name="FipAgentFacialVerificationConfirmation"
        component={FipAgentFacialVerificationConfirmation}
      />
      <Stack.Screen
        name="FipAgentOtpVerification"
        component={FipAgentOtpVerification}
      />
      <Stack.Screen
        name="FipAgentNinVerification"
        component={FipAgentNinVerification}
      />
      <Stack.Screen
        name="FipAgentTinVerification"
        component={FipAgentTinAndCacVerification}
      />
      <Stack.Screen
        name="FipAgentFacialVerification"
        component={FipAgentFacialVerification}
      />
      <Stack.Screen
        name="FipAgentBvnVerification"
        component={FipAgentBvnVerification}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
