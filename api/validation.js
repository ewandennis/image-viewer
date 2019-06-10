'use strict';

const path = require('path');
const imageType = require('image-type');
const config = require('./config');
const protocol = require('./protocol');

const requireImage = payload =>
  typeof payload === 'object' &&
  Object.prototype.hasOwnProperty.call(payload, 'filename') &&
  Object.prototype.hasOwnProperty.call(payload, 'image');

const isImageFilename = filename => config.acceptedFileTypes.indexOf(path.extname(filename).toLowerCase()) >= 0;

const validateUploadImageMsg = payload => {
  return new Promise((resolve, reject) => {
    if (!requireImage(payload)) {
      console.warn(`Attempt to upload unacceptable file`);
      return reject(new Error(`Not an acceptable image. Try one of ${config.acceptedFileTypes.join(',')}`));
    }

    const { filename, image } = payload;

    if (!isImageFilename(filename)) {
      return reject(new Error(`${protocol.UPLOAD_IMAGE} expects { filename, image }`));
    }

    const imageBytes = Buffer.from(image, 'base64');

    const detectedType = imageType(imageBytes);
    if (!detectedType || detectedType.ext !== path.extname(filename).slice(1)) {
      console.warn(
        `Attempt to upload image with incorrect or invalid format: ${filename}.`
      );
      return reject(new Error(`Invalid format. Image content must match its file extension.`));
    }

    return resolve({ filename, image });
  });
};

module.exports = {
  validateUploadImageMsg,
  isImageFilename
};
