'use strict';

const path = require('path');

module.exports = {
  imageStore: path.join(__dirname, 'store'),
  acceptedFileTypes: [".png", ".jpg", ".gif", ".svg"]
};
