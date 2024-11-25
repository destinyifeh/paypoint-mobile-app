import React from 'react';
import Routes from './routes';

export default class HomeScreen extends React.Component {
  state = {};

  persistenceKey = 'fipHomeScreen';

  render() {
    return <Routes />;
  }
}
