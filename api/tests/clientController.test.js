"use strict";

const ClientController = require("../clientController");
const protocol = require("../protocol");

const { mockImageBase64 } = require('./mockImage');

const mockSocketIo = () => ({
  on: jest.fn(),
  emit: jest.fn()
});

const mockSocket = () => ({
  on: jest.fn(),
  emit: jest.fn()
});

const mockImage = "still-not-very-base64-encoded";
const mockImageFilename = "rando-pic.jpg";
const mockImageList = [{ filename: "pic.jpg", image: mockImage }, { filename: "photo.gif", image: mockImage }];
const mockImageListModel = () => ({
  listImages: jest.fn().mockResolvedValue(mockImageList),

  addImage: jest.fn().mockResolvedValue(mockImageFilename)
});

// eslint-disable-next-line no-unused-vars
const findEventListener = (listeners, eventName) => listeners.find(([name, _]) => name === eventName)[1];

describe("Client controller", () => {
  let mockServer;
  let mockModel;
  let ctrl;

  beforeEach(() => {
    mockServer = mockSocketIo();
    mockModel = mockImageListModel();
    ctrl = new ClientController(mockServer, mockModel);
  });

  it("listens for socket.io connections", () => {
    expect(mockServer.on).toHaveBeenCalledWith("connection", expect.anything());
  });

  describe("with client connection", () => {
    const filename = "splango.png";
    let connectListener;
    let socket;
    let onClientConnect;

    beforeEach(() => {
      connectListener = jest.fn();
      socket = mockSocket();
      ctrl.addConnectListener(connectListener);
      // eslint-disable-next-line prefer-destructuring
      onClientConnect = findEventListener(mockServer.on.mock.calls, "connection");
      onClientConnect(socket);
    });

    it("notifies listeners when a client connects", () => {
      expect(connectListener).toHaveBeenCalledTimes(1);
      expect(connectListener).toHaveBeenCalledWith(socket);
    });

    it("sends each connecting client an image list", () => {
      expect(socket.emit).toHaveBeenCalledTimes(1);
      expect(socket.emit).toHaveBeenCalledWith(protocol.IMAGE_LIST, mockImageList);
    });

    it("sends an image list on client request", () => {
      const onListImages = findEventListener(socket.on.mock.calls, protocol.LIST_IMAGES);
      onListImages(socket);
      expect(socket.emit).toHaveBeenCalledTimes(1);
      expect(socket.emit).toHaveBeenCalledWith(protocol.IMAGE_LIST, mockImageList);
    });

    it("forwards uploaded images to the model", () => {
      const onUploadImage = findEventListener(socket.on.mock.calls, protocol.UPLOAD_IMAGE);
      return expect(onUploadImage({ filename, image: mockImageBase64 })).toResolve()
      .then(() => {
        expect(mockModel.addImage).toHaveBeenCalledTimes(1);
        expect(mockModel.addImage).toHaveBeenCalledWith({ filename, image: mockImageBase64 });
      }); 
    });

    it("broadcasts new images after storage", () => {
      const onUploadImage = findEventListener(socket.on.mock.calls, protocol.UPLOAD_IMAGE);
      return expect(onUploadImage({ filename, image: mockImageBase64 })).toResolve().then(() => {
        expect(mockServer.emit).toHaveBeenCalledWith(protocol.IMAGE_ADDED, {
          filename: mockImageFilename,
          image: mockImageBase64
        });
      });
    });

    describe("Upload errors", () => {
      const err = new Error("E_POORLY_FRAMED_SHOT");
      let onUploadImage;

      beforeEach(() => {
        mockModel.addImage.mockRejectedValueOnce(err);
        onUploadImage = findEventListener(socket.on.mock.calls, protocol.UPLOAD_IMAGE);

        // Wheesht on warn/error
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
      });

      it("does not broadcast failed image uploads", () => {
        return onUploadImage({ filename, image: mockImageBase64 }).then(() => {
          expect(mockServer.emit).not.toHaveBeenCalledWith(protocol.IMAGE_ADDED, err.toString());
        });
      });

      it("translates exceptions writing an image into upload error messages", () => {
        return onUploadImage({ filename, image: mockImageBase64 }).then(() => {
          expect(socket.emit).toHaveBeenCalledWith(protocol.UPLOAD_ERROR, expect.any(String));
        });
      });
    });
  });
});
