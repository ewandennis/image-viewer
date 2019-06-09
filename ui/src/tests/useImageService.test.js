import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import useImageService from '../useImageService';
import protocol from '../protocol';

import { mockImage, mockImageList } from './mockImageList';

const mockSocketIoClient = () => ({
  on: jest.fn(),
  emit: jest.fn(),
  removeEventListener: jest.fn()
});

const Null = () => <></>;

const HookTestComponent = ({ mockClient }) => {
  const { images, uploadImage } = useImageService(mockClient);
  return <Null mockClient={mockClient} images={images} uploadImage={uploadImage} />;
};

describe('useImageService', () => {
  let image;
  const subject = (props, mockClient = mockSocketIoClient()) => {
    let wrapper;
    act(() => {
      wrapper = mount(<HookTestComponent mockClient={mockClient} {...props} />);
    });
    return wrapper;
  };
  
  beforeEach(() => {
    image = { filename: 'afile.png', image: mockImage };
  });

  const getMockClient = wrapper => wrapper.prop('mockClient');
  const getTestProp = (wrapper, propName) => wrapper.find(Null).prop(propName);
  const findEventHandler = (wrapper, eventName) =>
    getMockClient(wrapper).on.mock.calls.find(([name, _]) => name === eventName)[1]; //eslint-disable-line no-unused-vars

  it('returns a null image list on init', () => {
    expect(getTestProp(subject(), 'images')).toBeNull();
  });

  it('requests an image list on init', () => {
    subject();
    expect(getMockClient(subject()).emit).toHaveBeenCalledWith(protocol.LIST_IMAGES);
  });

  it.skip('updates image list on receiving IMAGE_LIST', () => {
    let wrapper = subject();
    getMockClient(wrapper).on.mockReturnValue(mockImageList);

    act(() => {
      findEventHandler(wrapper, protocol.IMAGE_LIST)(mockImageList);
    });

    expect(getTestProp(wrapper, 'images')).toEqual(mockImageList);
  });

  it.skip('updates image list on receiving IMAGE_ADDED', () => {
    let wrapper = subject();
    getMockClient(wrapper).on.mockReturnValue(mockImageList);
    act(() => {
      findEventHandler(wrapper, protocol.IMAGE_LIST)(mockImageList);
      findEventHandler(wrapper, protocol.IMAGE_Added)(image);
    });
  });

  it('sends UPLOAD_IMAGE on calls to uploadImage', () => {
    const wrapper = subject();
    getTestProp(wrapper, 'uploadImage')(image);
    expect(getMockClient(wrapper).emit).toHaveBeenCalledWith(protocol.UPLOAD_IMAGE, image);
  });
});
