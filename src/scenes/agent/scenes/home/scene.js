import React from 'react';
import {InteractionManager} from 'react-native';
import Routes from './routes';

export default class HomeScreen extends React.Component {
  state = {};

  persistenceKey = 'homeScreen';

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  render() {
    return <Routes />;
  }
}
