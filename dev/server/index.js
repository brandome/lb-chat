
import http from 'http';
import { Server } from 'socket.io';

// postgres module loading hack
import * as pg from "pg";
const { Pool } = pg.default;

// use postgres as event emitter to reach other socket servers
import { createAdapter } from "@socket.io/postgres-adapter";
import { Emitter } from "@socket.io/postgres-emitter";
import { initDB } from './utils/DB.js';

// __filename should be globally available but isn't?
import path from "path";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// split functionality into modules
import chatHandler from './socket/chatHandler.js';
import shapeHandler from './socket/boardHandler.js';

// load and use .env file at runtime
import dotenv from 'dotenv';
dotenv.config();
const env = process.env;

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

// db connection
const pool = new Pool({
    user: env.POSTGRES_USER,
    host: env.POSTGRES_HOST || 'localhost',
    database: env.POSTGRES_DB,
    password: env.POSTGRESS_PWD,
    port: env.POSTGRESS_PORT
})

const emitter = new Emitter(pool);

initDB(pool);

io.adapter(createAdapter(pool));
// needed?
io.listen(env.DB_SOCKET);

// TODO add proper logger
io.on("status", (s) => console.log('Log: ', s));

// serve static build under PORT
const port = env.PORT || 8080;
httpServer.listen(port, () => {
    emitter.serverSideEmit("status", "HTTP server is up");
});

// TODO routing: use build path from react app
app.use(express.static(path.join(__dirname, '../../client/build')));
emitter.serverSideEmit("status", "HTTP static serve build");

chatHandler(io, pool, emitter);
shapeHandler(io, pool, emitter);