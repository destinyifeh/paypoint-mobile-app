import React from 'react';
import {InteractionManager} from 'react-native';
import ActivityIndicator from '../../../../components/activity-indicator';
import Routes from './routes';

export default class HomeScreen extends React.Component {
  state = {};

  persistenceKey = 'aggregatorHomeScreen';

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  render() {
    if (!this.state.animationsDone) {
      return <ActivityIndicator />;
    }

    return <Routes />;
  }
}
