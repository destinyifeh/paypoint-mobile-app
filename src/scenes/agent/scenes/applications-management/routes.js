import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ErrorBoundary from '../../../../components/error-boundary';
import AgentPersonalInformation from '../../../aggregator/scenes/home/scenes/pre-setup-agent/tabs/personal-information';
import AggregatorLanding from '../../../aggregator/scenes/landing';
import PreSetupAgent from '../../../aggregator/scenes/pre-setup-agent';
import AgentApplicationPreview from '../../../aggregator/scenes/pre-setup-agent/agentApplicationPreview';
import BusinessDetailsScene from '../../../aggregator/scenes/pre-setup-agent/business-details';
import KycInformationScene from '../../../aggregator/scenes/pre-setup-agent/kyc-information';
import NextOfKinDetailsScene from '../../../aggregator/scenes/pre-setup-agent/next-of-kin-details';
import ApplicantsFilterScene from './applicants-filter/scene';
import ViewApplicantDetails from './scenes/details';
import ViewApplicants from './scenes/view-applicants';

const withErrorBoundary = Component => props =>
  (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ViewApplicants" component={ViewApplicants} />
    <Stack.Screen
      name="ViewApplicantDetails"
      component={ViewApplicantDetails}
    />
    <Stack.Screen name="ApplicantsFilter" component={ApplicantsFilterScene} />
    <Stack.Screen name="AggregatorLanding" component={AggregatorLanding} />
    <Stack.Screen
      name="PreSetupAgent"
      component={withErrorBoundary(PreSetupAgent)}
    />
    <Stack.Screen name="BusinessDetails" component={BusinessDetailsScene} />
    <Stack.Screen name="NextOfKinDetails" component={NextOfKinDetailsScene} />
    <Stack.Screen name="KycInformation" component={KycInformationScene} />
    <Stack.Screen
      name="AgentPersonalDetails"
      component={AgentPersonalInformation}
    />
    <Stack.Screen
      name="AgentApplicationPreview"
      component={AgentApplicationPreview}
    />
  </Stack.Navigator>
);

export default AppNavigator;
