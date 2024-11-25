'use strict';

import React from 'react';
import { configure, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';

import Accordion from './accordion';
import ClickableListItem from './clickable-list-item';

configure({
  adapter: new Adapter()
});

it('renders correctly', () => {
  const tree = renderer
    .create(<Accordion />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('expanded accordion remains the same', () => {
  const tree = renderer
    .create(<Accordion
      expanded={true}
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('accordion props.onHeaderPressOut works as expected', () => {
  const onPressEvent = jest.fn();
  onPressEvent.mockReturnValue('Link on press invoked');
  const wrapper = shallow(<Accordion 
    onHeaderPressOut={ onPressEvent } 
  />);
  wrapper.find(ClickableListItem).first().props().onPressOut();
  expect(onPressEvent.mock.calls.length).toBe(1);
})

it('accordion default onHeaderPressOut works as expected', () => {
  const onPressEvent = jest.fn();
  onPressEvent.mockReturnValue('Link on press invoked');
  const wrapper = shallow(<Accordion />);
  const previousExpanded = wrapper.state().expanded;
  wrapper.find(ClickableListItem).first().props().onPressOut();
  expect(wrapper.state().expanded).toBe(!previousExpanded);
})
