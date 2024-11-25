'use strict';

import React from 'react';
import Button from './button';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Button />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('transparent button remains the same', () => {
  const tree = renderer
    .create(<Button
      transparent
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('disabled button remains the same', () => {
  const tree = renderer
    .create(<Button
      isDisabled
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('hidden button remains the same', () => {
  const tree = renderer
    .create(<Button
      hidden
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('loading button remains the same', () => {
  const tree = renderer
    .create(<Button
      loading
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
