"use strict";

class ClientController {
  constructor(socketIoServer, imageListModel) {
    this.server = socketIoServer;
    this.imageListModel = imageListModel;
    this.clients = [];
    this.connectListeners = [];
    this.onClientConnected = this.onClientConnected.bind(this);
    this.onClientDisconnected = this.onClientDisconnected.bind(this);
    this.recvListImages = this.recvListImages.bind(this);
    this.recvUploadImage = this.recvUploadImage.bind(this);

    this.server.on("connection", this.onClientConnected);

    this.addConnectListener(socket => {
      socket.on("uploadImage", image => this.recvUploadImage(socket, image));
    });

    this.addConnectListener(socket => {
      socket.on("listImages", () => this.recvListImages(socket));
    });
  }

  addConnectListener(listener) {
    this.connectListeners.push(listener);
  }

  notifyListeners(socket) {
    this.connectListeners.forEach(listener => listener(socket));
  }

  onClientConnected(socket) {
    socket.on("disconnect", this.onClientDisconnected);
    this.clients.push(socket);
    this.notifyListeners(socket);
    this.sendImageList(socket);
  }

  onClientDisconnected(leavingSocket) {
    this.clients = this.clients.filter(socket => socket !== leavingSocket);
  }

  recvUploadImage(socket, image) {
    // TODO validate msg
    this.imageListModel
      .addImage(image)
      .then(filename => {
        this.broadcastImageAdded({ filename, image: image.image });
      })
      .catch(err => {
        console.error(err);
        socket.emit("uploadError", err.toString());
      });
  }

  recvListImages(socket) {
    this.sendImageList(socket);
  }

  sendImageList(socket) {
    this.imageListModel.listImages().then(imageList => {
      socket.emit("imageList", imageList);
    });
  }

  broadcastImageAdded(image) {
    this.server.emit("imageAdded", image);
  }
}

module.exports = ClientController;
