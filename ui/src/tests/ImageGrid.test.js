import React from 'react';
import { shallow } from 'enzyme';
import path from 'path';
import ImageGrid from '../ImageGrid';
import Loading from '../Loading';
import FileUpload from "../FileUpload";
import useImageService from '../useImageService';
import readFile from '../readFile';

import { mockImageList } from './mockImageList';

jest.mock('socket.io-client');
jest.mock('../useImageService');
jest.mock('../readFile');


describe('ImageGrid', () => {
  const subject = () => shallow(<ImageGrid />);

  it('renders', () => {
    useImageService.mockReturnValue({ images: mockImageList, uploadImage: jest.fn() });
    expect(subject()).toMatchSnapshot();
  });

  it('renders while loading', () => {
    useImageService.mockReturnValue({ images: null, uploadImage: jest.fn() });
    expect(subject().find(Loading)).toExist();
  })

  it('renders an empty image list', () => {
    useImageService.mockReturnValueOnce({ images: [], uploadImage: jest.fn() });
    const wrapper = subject();
    expect(wrapper.find(Loading)).not.toExist();
    expect(wrapper.find('img')).not.toExist();
  });

  it('renders images', () => {
    useImageService.mockReturnValueOnce({ images: mockImageList, uploadImage: jest.fn() });
    const wrapper = subject();
    expect(wrapper.find(Loading)).not.toExist();
    expect(wrapper.find('img')).toHaveLength(mockImageList.length);
  });

  it('correctly uses image extension', () => {
    useImageService.mockReturnValueOnce({ images: mockImageList, uploadImage: jest.fn() });
    const wrapper = subject();
    expect(wrapper.find(Loading)).not.toExist();
    const images = wrapper.find('img');
    images.forEach((image, imageIdx) => {
      const expectedExtension = path.extname(mockImageList[imageIdx].filename).slice(1);
      const regExStr = `^data:image\/${expectedExtension}`;
      expect(image.prop('src')).toMatch(new RegExp(regExStr));
    });
  });

  it('accepts uploads', () => {
    const uploadImage = jest.fn();
    const file = { name: 'readmeplz.png' };
    const fileContents = { name: file.name, content: 'binary-image-bits-here' };
    useImageService.mockReturnValueOnce({ images: [], uploadImage });
    readFile.mockResolvedValue(fileContents);
    const wrapper = subject();
    return wrapper.find(FileUpload).prop('onUploadFile')(file)
    .then(() => {
      expect(uploadImage).toHaveBeenCalledTimes(1);
      expect(uploadImage).toHaveBeenCalledWith({ filename: file.name, image: btoa(fileContents.content) });
    });
  });
});
