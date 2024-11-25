import React from 'react';
import {InteractionManager, View} from 'react-native';
import ActivityIndicator from '../../../../components/activity-indicator';
import {COLOUR_BLUE} from '../../../../constants/styles';
import Routes from './routes';

export default class SettingsScene extends React.Component {
  persistenceKey = 'settingsScenePersistenceKey';

  state = {};

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  render() {
    if (!this.state.animationsDone) {
      return (
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={COLOUR_BLUE} />
        </View>
      );
    }

    return <Routes />;
  }
}
