"use strict";

const fs = require("fs");
const tmp = require("tmp-promise");

const imageListModel = require("../imageListModel");
const config = require("../config");

describe("Image list model", () => {
  const mockImage = "not-really-image-data";
  const goodFiles = ["pic1.jpg", "img2.png", "1992.gif"];

  beforeEach(() => {
    // :( https://github.com/facebook/jest/issues/7992
    fs.promises.readdir = jest.fn().mockResolvedValue(goodFiles);
    fs.promises.readFile = jest.fn().mockResolvedValue(mockImage);
    fs.promises.writeFile = jest.fn().mockResolvedValue({});
  });

  describe("listImages", () => {
    const expectedResults = files =>
      files.map(filename => ({
        filename,
        image: mockImage.toString("base64")
      }));

    it("returns well-structured results", () => {
      return expect(imageListModel.listImages()).resolves.toEqual(expectedResults(goodFiles));
    });

    it("uses configured storage location", () => {
      return imageListModel.listImages().then(() => {
        expect(fs.promises.readdir).toHaveBeenCalledWith(config.imageStore);
      });
    });

    it("accepts only configured file types", () => {
      const goodAndBadFiles = [...goodFiles, "notgoodatall.exe"];
      fs.promises.readdir.mockResolvedValueOnce(goodAndBadFiles);
      return expect(imageListModel.listImages()).resolves.toEqual(expectedResults(goodFiles));
    });

    it("rejects with fs error", () => {
      const err = new Error("Splodypop!");
      fs.promises.readdir.mockRejectedValue(err);
      return expect(imageListModel.listImages()).rejects.toEqual(err);
    });
  });

  describe("addImage", () => {
    const tmpFilename = "much-randomosity";
    const filename = "splango.jpg";
    const image = mockImage;

    beforeEach(() => {
      jest.spyOn(tmp, "tmpNameSync").mockReturnValue(tmpFilename);
    });

    it("writes to the filesystem", () => {
      return imageListModel.addImage({ filename, image }).then(() => {
        expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
        expect(fs.promises.writeFile).toBeCalledWith(expect.stringMatching(tmpFilename), Buffer.from(image, "base64"));
      });
    });

    it("handle duplicate filenames", () => {
      return Promise.all([
        imageListModel.addImage({ filename, image }),
        imageListModel.addImage({ filename, image })
      ]).then(() => {
        expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
        expect(fs.promises.writeFile.mock.calls[0][0]).not.toEqual(fs.promises.writeFile.mock.calls[0][1]);
      });
    });

    it("preserves file extensions", () => {
      return imageListModel.addImage({ filename, image }).then(() => {
        expect(tmp.tmpNameSync).toBeCalledWith(expect.objectContaining({ postfix: ".jpg" }));
      });
    });

    it("rejects with fs error", () => {
      const err = new Error("Splodypop!");
      fs.promises.writeFile.mockRejectedValue(err);
      return expect(imageListModel.addImage({ filename, image })).rejects.toEqual(err);
    });
  });
});
