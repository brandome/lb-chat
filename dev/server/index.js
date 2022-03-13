
import path from "path";
import http from 'http';
import { Server } from 'socket.io';

import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express server
import express from 'express';

const app = express();
const httpServer = http.createServer(app);

// socket server wrapping httpServer
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});


const port = process.env.PORT || 8080;

// listen on server, not on app
httpServer.listen(port, () => {
    console.log(`Server open on port ${port}, awaiting connection`);
});


// TODO routing: use build path from react app
app.use(express.static(path.join(__dirname, '../../client/build')));

import chatHandler from './socket/chat.js';
import shapeHandler from './socket/shapes.js';

chatHandler(io);
shapeHandler(io);