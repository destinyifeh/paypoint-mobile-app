'use strict';

import React from 'react';
import H1 from './h1';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<H1 />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('underlined h1 remains the same', () => {
  const tree = renderer
    .create(<H1
      underline
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
