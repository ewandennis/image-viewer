import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

jest.mock('socket.io-client');

describe('Image Viewer', () => {
  it('renders', () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });
});
