'use strict';

import React from 'react';
import { configure, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';

import AlertStrip from './alert-strip';
import { ERROR_STATUS, SUCCESS_STATUS } from '../constants/api';

configure({
  adapter: new Adapter()
});

it('Error AlertStrip renders correctly', () => {
  const tree = renderer
    .create(<AlertStrip 
      variant={ERROR_STATUS} 
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Success AlertStrip renders correctly', () => {
  const tree = renderer
    .create(<AlertStrip 
      variant={SUCCESS_STATUS} 
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
