'use strict';

import React from 'react';
import { configure } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';

import FilePreview from './file-preview';

configure({
  adapter: new Adapter()
});

it('FilePreview With placeholder renders correctly', () => {
  const tree = renderer
    .create(<FilePreview 
      attachment={Object}
      name="File X"
      placeholder="File Placeholder"
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('FilePreview Without placeholder renders correctly', () => {
  const tree = renderer
    .create(<FilePreview 
      attachment={Object}
      name="File Y"
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly', () => {
  const tree = renderer
    .create(<FilePreview 
      attachment={Object}
      placeholder="File Placeholder"
    />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
