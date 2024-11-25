import analytics from '@react-native-firebase/analytics';
import {StackActions} from '@react-navigation/native';
import {Animated, Easing} from 'react-native';
import {onScreenChange} from '../services/redux/actions/tunnel';
import store from '../services/redux/store';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function goBack() {
  _navigator.goBack();
}

function navigate(routeName, params) {
  _navigator.navigate(routeName, params);
}

function replace(routeName, params) {
  _navigator.dispatch(StackActions.replace(routeName, params));
}

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.Name;
}

function onNavigationStateChange(previousRouteName, currentRouteName) {
  console.log({previousRouteName, currentRouteName});

  store.dispatch(
    onScreenChange({
      currentScreen: currentRouteName,
      previousScreen: previousRouteName,
    }),
  );

  if (previousRouteName !== currentRouteName) {
    analytics().logScreenView({
      screen_class: currentRouteName,
      screen_name: currentRouteName,
    });
    // analytics().setCurrentScreen(currentRouteName, currentRouteName);
  }
}

function screenTransitionConfig() {
  return {
    transitionSpec: {
      duration: 450,
      easing: Easing.out(Easing.exp),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const {layout, position, scene} = sceneProps;
      const {index} = scene;

      const width = layout.initWidth;
      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 3],
        outputRange: [width, 0, -width],
      });

      return {
        transform: [{translateX}],
      };
    },
  };
}

function expScreenTransitionConfig() {
  return {
    transitionSpec: {
      duration: 485,
      // duration: 450,
      easing: Easing.out(Easing.exp),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const {
        layout,
        position,
        scene: {index},
      } = sceneProps;

      const width = layout.initWidth;
      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 3],
        outputRange: [width, 0, -width * 1.3],
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0, 1, 0],
      });

      const rotate = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: ['3deg', '0deg', '0deg'],
      });

      const scale = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0.92, 1],
      });

      return {
        transform: [
          {translateX},
          // { rotate },
          {scale},
        ],
      };
    },
  };
}

// add other navigation functions that you need and export them

export default {
  expScreenTransitionConfig,
  getActiveRouteName,
  goBack,
  navigate,
  onNavigationStateChange,
  replace,
  screenTransitionConfig,
  setTopLevelNavigator,
};
