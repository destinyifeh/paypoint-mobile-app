import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {BackHandler} from 'react-native';
import {SCREEN_VIEW} from '../constants/analytics';
import {logEvent} from '../core/logger';

export default class BaseScene extends Component {
  componentDidCatch() {
    console.reportErrorsAsExceptions = false;
  }

  componentWillMount() {
    logEvent(SCREEN_VIEW, {
      screen_name: `${this.screen_name} Screen`,
    });
  }

  componentWillReceiveProps() {
    console.log(this.props.navigation?.state);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    console.log(this.props.navigation?.state);
    this.props.navigation.goBack();
    return true;
  }

  persistNavigationState = async navState => {
    try {
      await AsyncStorage.setItem(this.persistenceKey, JSON.stringify(navState));
    } catch (err) {
      // handle the error according to your needs
    }
  };

  loadNavigationState = async () => {
    const jsonString = await AsyncStorage.getItem(this.persistenceKey);
    return JSON.parse(jsonString);
  };

  render() {
    return <React.Fragment></React.Fragment>;
  }
}
