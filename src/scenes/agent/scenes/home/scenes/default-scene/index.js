import React from 'react';
import {InteractionManager} from 'react-native';

import Routes from './routes';

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
    return <Routes />;
  }
}
