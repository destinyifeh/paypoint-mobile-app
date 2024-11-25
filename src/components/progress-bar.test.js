'use strict';

import React from 'react';
import { configure } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';

import ProgressBar from './progress-bar';

configure({
  adapter: new Adapter()
});

it('renders correctly', () => {
  const tree = renderer
    .create(<ProgressBar />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
