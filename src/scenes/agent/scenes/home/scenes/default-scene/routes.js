import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Easing} from 'react-native';
import {Icon} from 'react-native-elements';

import {COLOUR_BLUE} from '../../../../../../constants/styles';
import HomeTab from './tabs/home-tab';
import ProfileTab from './tabs/profile-tab';
import ReportsTab from './tabs/reports-tab';

const Tab = createBottomTabNavigator();

// Transition configuration
const config = {
  animation: 'timing',
  config: {
    duration: 450,
    easing: Easing.out(Easing.exp),
  },
};

// Screen interpolator for transitions
const screenInterpolator = ({current, layouts}) => {
  const translateX = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.width, 0],
  });

  return {
    cardStyle: {
      transform: [{translateX}],
    },
  };
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarStyle: {
          borderTopColor: 'white',
          elevation: 10,
          height: 65,
          padding: 5,
        },
        tabBarActiveTintColor: COLOUR_BLUE,
        tabBarInactiveTintColor: '#B3B6BF',
        headerShown: false,

        gestureEnabled: true,
        transitionSpec: {
          open: config,
          close: config,
        },
        cardStyleInterpolator: screenInterpolator,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={HomeTab}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({color, size}) => (
            <Icon name="grid" type="feather" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsTab}
        options={{
          title: 'Services Reports',

          tabBarIcon: ({color, size}) => (
            <Icon name="bar-chart-2" type="feather" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          title: 'My Profile',
          tabBarIcon: ({color, size}) => (
            <Icon name="user" type="feather" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
