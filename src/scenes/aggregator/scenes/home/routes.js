import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Easing} from 'react-native';

import AllApplicationsScene from '../all-applications';
import ApplicationScene from '../application';
import ApplicationPreview from '../application-preview';
import RequestConfirmationScene from '../complete-setup/request-confirmation';
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

const screenInterpolator = props => {
  const {layout, position, scene} = props;
  const {index} = scene;
  const height = layout.initHeight;
  const width = layout.initWidth;

  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 3],
    outputRange: [width, 0, -width],
  });

  return {transform: [{translateX}]};
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        transitionSpec: {
          open: config,
          close: config,
        },
        cardStyleInterpolator: screenInterpolator,
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
