'use strict';

import React from 'react';
import { configure, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';

import ClickableListItem from './clickable-list-item';
import { TouchableOpacity } from 'react-native';

configure({
  adapter: new Adapter()
});

it('renders correctly', () => {
  const tree = renderer
    .create(<ClickableListItem />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('onPressOut functions as expected', () => {
  const onPressEvent = jest.fn();
  onPressEvent.mockReturnValue('Link on press invoked');
  const wrapper = shallow(<ClickableListItem
    onPressOut={ onPressEvent } 
  />);
  wrapper.find(TouchableOpacity).first().props().onPress();
  expect(onPressEvent.mock.calls.length).toBe(1);
})

it('onPress functions as expected', () => {
  const onPressEvent = jest.fn();
  onPressEvent.mockReturnValue('Link on press invoked');
  const wrapper = shallow(<ClickableListItem
    onPress={ onPressEvent } 
  />);
  wrapper.find(TouchableOpacity).first().props().onPress();
  expect(onPressEvent.mock.calls.length).toBe(1);
})

it('TouchableOpacity onPressOut has no effect', () => {
  const onPressEvent = jest.fn();
  onPressEvent.mockReturnValue('Link on press invoked');
  const wrapper = shallow(<ClickableListItem
    onPress={ onPressEvent } 
  />);
  wrapper.find(TouchableOpacity).first().props().onPressOut();
  expect(onPressEvent.mock.calls.length).toBe(0);
})
