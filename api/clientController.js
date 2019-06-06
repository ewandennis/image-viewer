'use strict';

const imageList = ['image1.jpg', 'image2.jpg'];

class ClientController {
  constructor(socketIoServer) {
    this.server = socketIoServer;
    this.clients = [];
    this.connectListeners = [];
    this.onClientConnected = this.onClientConnected.bind(this);
    this.onClientDisconnected = this.onClientDisconnected.bind(this);
    this.recvListImages = this.recvListImages.bind(this);
    this.recvUploadImage = this.recvUploadImage.bind(this);

    this.server.on('connection', this.onClientConnected);

    this.addConnectListener(socket => {
      socket.on('uploadImage', (image) => this.recvUploadImage(image));
    });

    this.addConnectListener(socket => {
      socket.on('listImages', () => this.recvListImages(socket));
    });
  }

  addConnectListener(listener) {
    this.connectListeners.push(listener);
  }

  onClientConnected(socket) {
    socket.on('disconnect', this.onClientDisconnected);
    this.clients.push(socket);
    this.connectListeners.forEach(listener => listener(socket));
    this.sendImageList(socket);
  }

  onClientDisconnected(leavingSocket) {
    this.clients = this.clients.filter(socket => socket !== leavingSocket);
  }

  recvUploadImage(image) {
    // TODO validate msg
    imageList.push(image);
    this.broadcastImageAdded(image);
  }

  recvListImages(socket) {
    this.sendImageList(socket)
  }

  sendImageList(socket) {
    socket.emit('imageList', imageList);
  }

  broadcastImageAdded(image) {
    this.server.emit('imageAdded', image);
  }
}

module.exports = ClientController;
