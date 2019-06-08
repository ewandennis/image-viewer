"use strict";

const fs = require("fs").promises;
const path = require("path");
const tmp = require("tmp-promise");

const config = require("./config");

const isImageFilename = filename => config.acceptedFileTypes.indexOf(path.extname(filename).toLowerCase()) >= 0;

class ImageListModel {
  listImages() {
    return fs.readdir(config.imageStore).then(filenames => {
      console.log(`Found ${filenames.length} files. Filtering...`);
      const acceptable = filenames.filter(isImageFilename);
      console.log(`Found ${acceptable.length} images. Loading...`);
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
    if (!isImageFilename(filename)) {
      return Promise.reject(new Error(`Not an acceptable image. Try one of ${config.acceptedFileTypes.join(",")}`));
    }
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
