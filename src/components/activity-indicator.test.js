'use strict';

import React from 'react';
import { configure, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';

import ActivityIndicator from './activity-indicator';

configure({
  adapter: new Adapter()
});

it('renders correctly', () => {
  const tree = renderer
    .create(<ActivityIndicator />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
