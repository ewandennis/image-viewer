"use strict";

const fs = require("fs").promises;
const path = require("path");
const tmp = require("tmp-promise");

const config = require("./config");

const isImageFilename = filename => config.acceptedFileTypes.indexOf(path.extname(filename).toLowerCase()) >= 0;

class ImageListModel {
  listImages() {
    return fs.readdir(config.imageStore).then(filenames => {
      const acceptable = filenames.filter(isImageFilename);
      return Promise.all(
        acceptable.map(filename =>
          fs.readFile(path.join(config.imageStore, filename)).then(fileContent => ({
            filename,
            image: fileContent.toString("base64")
          }))
        )
      );
    });
  }

  addImage({ filename, image }) {
    const imageBytes = Buffer.from(image, "base64");
    return this.writeImage(imageBytes, path.extname(filename));
  }

  //

  writeImage(image, extension) {
    const filename = tmp.tmpNameSync({ dir: config.imageStore, postfix: extension, keep: true });
    return fs
      .writeFile(filename, image)
      .then(() => filename);
  }
}

module.exports = new ImageListModel();
