'use strict';

const validation = require('../validation');
const { mockImageBase64 } = require('./mockImage')

describe('Validation', () => {
  describe('isImageFilename', () => {
    it('accepts file with configured extensions', () => {
      expect(validation.isImageFilename('howtopronounce.gif')).toBeTruthy();
    });

    it('does not accept files with unexpected extensions', () => {
      expect(validation.isImageFilename('hownottopronounce.jif')).toBeFalsy();
    });
  });

  describe.each(
    [
      [ 'non-object payloads', []],
      [ 'objects without the correct fields', { notFilename: 'woops.jpg', image: mockImageBase64 } ],
      [ 'non-image filenames', { filename: 'actuallyapng.txt', image: mockImageBase64 } ],
      [ 'images whose type does not match their filename', { filename: 'noimapng.jpg', image: mockImageBase64 } ]
    ]
  )('validateUploadImageMsg %s', (name, payload) => {
    it('rejects', () => {
      jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
      return expect(validation.validateUploadImageMsg(payload)).toReject();
    });
  });
  
  it('accepts valid payloads', () => {
    return expect(validation.validateUploadImageMsg({ filename: '1x1.png', image: mockImageBase64 })).toResolve();
  });
});
