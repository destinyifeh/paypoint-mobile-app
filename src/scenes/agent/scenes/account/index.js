import React from 'react';
import Routes from './routes';

export default class AccountScene extends React.Component {
  state = {};

  persistenceKey = 'accountScenePersistenceKey';

  render() {
    return <Routes />;
  }
}
