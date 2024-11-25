import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Easing} from 'react-native';

// Import scenes
import FilterViewAllAgents from './scenes/filter-view-all-agents';
import QuestionnaireObjectivesScene from './scenes/questionnaire/objectives';
import QuestionnaireQuestionsScene from './scenes/questionnaire/questions';
import ViewAgentDetailsScene from './scenes/view-agent-details';
import ViewAllAgentsScene from './scenes/view-all-agents';

const Stack = createStackNavigator();

// Transition configuration
const config = {
  animation: 'timing',
  config: {
    duration: 300,
    easing: Easing.inOut(Easing.poly(4)),
  },
};

// Screen interpolator using the new API
const screenInterpolator = ({current, layouts}) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.height, 0],
  });

  const opacity = current.progress.interpolate({
    inputRange: [0, 0.99, 1],
    outputRange: [0, 1, 1],
  });

  return {
    cardStyle: {
      opacity,
      transform: [{translateX}],
    },
  };
};

// Main navigation stack
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ViewAllAgents"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        transitionSpec: {
          open: config,
          close: config,
        },
        cardStyleInterpolator: screenInterpolator,
      }}>
      <Stack.Screen
        name="FilterViewAllAgents"
        component={FilterViewAllAgents}
      />
      <Stack.Screen
        name="QuestionnaireObjectives"
        component={QuestionnaireObjectivesScene}
      />
      <Stack.Screen
        name="QuestionnaireQuestions"
        component={QuestionnaireQuestionsScene}
      />
      <Stack.Screen name="ViewAgentDetails" component={ViewAgentDetailsScene} />
      <Stack.Screen name="ViewAllAgents" component={ViewAllAgentsScene} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
