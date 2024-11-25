import React from 'react';
import Routes from './routes';

export default class SettingsScene extends React.Component {
  persistenceKey = 'settingsScenePersistenceKey';

  state = {};

  render() {
    return <Routes />;
  }
}
