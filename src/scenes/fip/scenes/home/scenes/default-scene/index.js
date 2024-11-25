import React from 'react';
import {InteractionManager} from 'react-native';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import HomeTab from './home-tab';

export default class HomeScreen extends React.Component {
  state = {};

  persistenceKey = 'defaultScenePersistenceKey';

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

    return <HomeTab navigation={this.props.navigation} />;
  }
}
