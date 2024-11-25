import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Easing} from 'react-native';

import ApplicationScene from '../application';
import RequestConfirmationScene from './request-confirmation';
import ViewAgentDetailsScene from './view-agent-details';
import ViewAllRequestsScene from './view-all-requests';

const Stack = createStackNavigator();

const config = {
  animation: 'timing',
  config: {
    duration: 300,
    easing: Easing.inOut(Easing.poly(4)),
  },
};

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

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ViewAllRequests"
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
      <Stack.Screen
        name="RequestConfirmation"
        component={RequestConfirmationScene}
      />
      <Stack.Screen name="ViewAgentDetails" component={ViewAgentDetailsScene} />
      <Stack.Screen name="ViewAllRequests" component={ViewAllRequestsScene} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
