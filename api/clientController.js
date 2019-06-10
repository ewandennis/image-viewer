"use strict";

const protocol = require('./protocol');
const { validateUploadImageMsg } = require('./validation');

class ClientController {
  constructor(socketIoServer, imageListModel) {
    this.server = socketIoServer;
    this.imageListModel = imageListModel;
    this.connectListeners = [];
    this.onClientConnected = this.onClientConnected.bind(this);
    this.recvListImages = this.recvListImages.bind(this);
    this.recvUploadImage = this.recvUploadImage.bind(this);

    this.server.on("connection", this.onClientConnected);

    this.addConnectListener(socket => {
      socket.on(protocol.UPLOAD_IMAGE, image => this.recvUploadImage(socket, image));
    });

    this.addConnectListener(socket => {
      socket.on(protocol.LIST_IMAGES, () => this.recvListImages(socket));
    });
  }

  addConnectListener(listener) {
    this.connectListeners.push(listener);
  }

  notifyListeners(socket) {
    this.connectListeners.forEach(listener => listener(socket));
  }

  onClientConnected(socket) {
    this.notifyListeners(socket);
    this.sendImageList(socket);
  }

  recvUploadImage(socket, payload) {
    return validateUploadImageMsg(payload)
      .then(() => this.imageListModel.addImage(payload))
      .then(filename => {
          this.broadcastImageAdded({ filename, image: payload.image });
          return this.imageListModel;
      })
      .catch(err => {
        console.error(err);
        socket.emit(protocol.UPLOAD_ERROR, err.toString());
      });
  }

  recvListImages(socket) {
    return this.sendImageList(socket);
  }

  sendImageList(socket) {
    return this.imageListModel.listImages().then(imageList => {
      socket.emit(protocol.IMAGE_LIST, imageList);
    })
    .catch(err => {
      console.error(err);
      // No image list for you :(
      // Causes UI inconsistency. Client connected but no image list shown.
    });
  }

  broadcastImageAdded(image) {
    this.server.emit(protocol.IMAGE_ADDED, image);
  }
}

module.exports = ClientController;
