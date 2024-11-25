'use strict';

import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Hyperlink from './hyperlink';

jest.mock('react-navigation', () => ({ withNavigation: component => component}));

const mockProps = {
  navigation: {
    navigate: jest.fn(),
    replace: jest.fn()
  },
  loginSuccess: jest.fn(),
  isSubmitting: true
}

configure({
  adapter: new Adapter()
});

it('renders correctly', () => {
  const tree = renderer
    .create(<Hyperlink />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('onPressOut functions as expected', () => {
  const onPressEvent = jest.fn();
  onPressEvent.mockReturnValue('Link on press invoked');
  const wrapper = shallow(<Hyperlink
    {...mockProps}
    onPress={ onPressEvent } 
  />);
  wrapper.find(Text).first().props().onPress();
  expect(onPressEvent.mock.calls.length).toBe(1);
})

it('replace as false functions as expected', () => {
  const onPressEvent = jest.fn();
  onPressEvent.mockReturnValue('Link on press invoked');
  const wrapper = shallow(<Hyperlink
    {...mockProps}
  />);
  wrapper.find(Text).first().props().onPress();
  const instance = wrapper.instance();

  expect(instance.hasNavigated).toBe(true);
})

it('replace as true functions as expected', () => {
  const onPressEvent = jest.fn();
  onPressEvent.mockReturnValue('Link on press invoked');
  const wrapper = shallow(<Hyperlink
    replace
    {...mockProps}
  />);
  wrapper.find(Text).first().props().onPress();
  const instance = wrapper.instance();

  expect(instance.hasReplaced).toBe(true);
})
