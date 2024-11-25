import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {COLOUR_BLUE} from '../../../../../../constants/styles';
import HomeTab from './home-tab';
import ProfileTab from './tabs/profile-tab';
import ReportsTab from './tabs/reports-tab';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          borderTopColor: 'white',
          elevation: 10,
          height: 65,
          padding: 5,
        },
        tabBarActiveTintColor: COLOUR_BLUE,
        tabBarInactiveTintColor: '#B3B6BF',
      }}>
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="Reports" component={ReportsTab} />
      <Tab.Screen name="Profile" component={ProfileTab} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
