'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const SocketIoServer = require('socket.io');
const ClientController = require('./clientController');
const imageListModel = require('./imageListModel');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const httpServer = http.createServer(app);
const socketIoServer = new SocketIoServer(httpServer);
const clientController = new ClientController(socketIoServer, imageListModel); // eslint-disable-line no-unused-vars

httpServer.listen(process.env.PORT || 3000);


