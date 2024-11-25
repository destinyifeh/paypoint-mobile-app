import React from 'react';
import BaseScene from '../../../base-scene';
import Routes from './routes';

export default class ServicesScene extends BaseScene {
  screen_name = 'Services';
  persistenceKey = 'servicesScenePersistenceKey';

  state = {};

  render() {
    return <Routes />;
  }
}
