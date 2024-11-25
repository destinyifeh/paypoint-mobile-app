import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Easing} from 'react-native';

import DefaultScene from './scene';
import SelectLanguageScene from './select-language';

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
    outputRange: [layouts.screen.height, 0], // From bottom to top
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
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        transitionSpec: {
          open: config,
          close: config,
        },
        cardStyleInterpolator: screenInterpolator,
      }}>
      <Stack.Screen name="DefaultScene" component={DefaultScene} />
      <Stack.Screen name="SelectLanguage" component={SelectLanguageScene} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
