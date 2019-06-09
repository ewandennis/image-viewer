import React from 'react';
import { shallow } from 'enzyme';
import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  const subject = (props = {}) => shallow(<FileUpload {...props} />);

  it('renders', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('calls onUploadFile', () => {
    const onUploadFileMock = jest.fn();
    const wrapper = subject({ onUploadFile: onUploadFileMock });
    const file = { name: 'iamafile.png' };
    wrapper.prop('onChange')([ file ]);
    expect(onUploadFileMock).toHaveBeenCalledTimes(1);
    expect(onUploadFileMock).toHaveBeenCalledWith(file);
  });
});
