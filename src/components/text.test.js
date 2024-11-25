'use strict';

import React from 'react';
import { configure } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';

import Text from './text';

configure({
  adapter: new Adapter()
});

it('Bold text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      bold
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Failed status text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      isFailedStatus
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Pending status text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      isPendingStatus
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Success status text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      isSuccessStatus
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Status text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      isStatus
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Black text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      black
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Big text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      big
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Bigger text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      bigger
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Center text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      center
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Green text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      green
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Small text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      small
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Red text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      red
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Right-aligned text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      right
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Title text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      title
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Uppercase text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      uppercase
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('White text renders correctly', () => {
  const tree = renderer
    .create(<Text 
      white
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
