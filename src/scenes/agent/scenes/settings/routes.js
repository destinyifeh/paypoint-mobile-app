import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import DeveloperSettings from './developer-settings';
import DefaultScene from './scene';
import SelectLanguageScene from './select-language';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="DefaultScene" component={DefaultScene} />
    <Stack.Screen name="DeveloperSettings" component={DeveloperSettings} />
    <Stack.Screen name="SelectLanguage" component={SelectLanguageScene} />
  </Stack.Navigator>
);

export default AppNavigator;
