'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';

import Header from './header';

configure({
  adapter: new Adapter()
});

const mockStore = configureStore([]);

describe('Header test', () => {
  let store;
  let component;
  let componentWithNavigator;
  let componentWithNavigateBackIcon;
  let componentWithoutVisibleNavigator;
  let componentWithVisibleNavigator;

  const hideNavigationMenu = jest.fn();
  const showNavigationMenu = jest.fn();

  beforeEach(() => {
    store = mockStore({
      navigation: {
        isNavigatorVisible: true
      }
    });

    component = renderer.create(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    componentWithNavigator = renderer.create(
      <Provider store={store}>
        <Header 
          withNavigator
        />
      </Provider>
    );

    componentWithNavigateBackIcon = renderer.create(
      <Provider store={store}>
        <Header 
          withNavigateBackIcon
        />
      </Provider>
    );

    componentWithoutVisibleNavigator = shallow(
      <Provider store={store}>
        <Header 
          hideNavigationMenu={hideNavigationMenu}
          showNavigationMenu={showNavigationMenu}
          isNavigatorVisible={false}
          withNavigateBackIcon
        />
      </Provider>
    ).dive()

    componentWithVisibleNavigator = shallow(
      <Provider store={store}>
        <Header 
          hideNavigationMenu={hideNavigationMenu}
          showNavigationMenu={showNavigationMenu}
          isNavigatorVisible={true}
          withNavigateBackIcon
        />
      </Provider>
    ).dive()

  })
  
  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('with navigator remains the same', () => {
    expect(componentWithNavigator.toJSON()).toMatchSnapshot();
  });

  it('with navigate back remains the same', () => {
    expect(componentWithNavigateBackIcon).toMatchSnapshot();
  });

  it('with visible navigator remains the same', () => {
    expect(componentWithVisibleNavigator).toMatchSnapshot();
  });

  it('without visible navigator remains the same', () => {
    expect(componentWithoutVisibleNavigator).toMatchSnapshot();
  });

  it('without visible navigator onPress shows navigator', () => {
    componentWithoutVisibleNavigator.find(TouchableOpacity).first().props().onPress();
    expect(showNavigationMenu.mock.calls.length).toBe(1);
  });

  // it('with navigator remains the same', () => {
  //   const tree = renderer
  //     .create(<Header
  //       withNavigateBackIcon
  //     />)
  //     .toJSON();
  //   expect(tree).toMatchSnapshot();
  // });git chce

})
