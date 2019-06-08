'use strict';

const express = require('express');
const http = require('http');
const SocketIoServer = require('socket.io');
const ClientController = require('./clientController');
const imageListModel = require('./imageListModel');

const app = express();
const httpServer = http.createServer(app);
const socketIoServer = new SocketIoServer(httpServer);
const clientController = new ClientController(socketIoServer, imageListModel); // eslint-disable-line no-unused-vars

httpServer.listen(process.env.PORT || 3000);


