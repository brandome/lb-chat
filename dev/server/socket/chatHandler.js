

import { createMessage } from '../utils/Messages.js';

const chatHandler = (io, pool, emitter) => {
    // chat
    io.on("connection", (socket) => {

        emitter.serverSideEmit("status", `Chat server is up for ${socket.id}`);

        const handleMessage = (message) => {
            emitter.serverSideEmit("status", "Chat: message received");

            // socket.broadcast.emit('message', message);
            const outMessage = createMessage('chat', 'username', 'received message: ' + message, Date.now());
            socket.emit('message', outMessage);
        };

        socket.on('message', handleMessage);

        socket.on('disconnect', () => {
            emitter.serverSideEmit("status", "Chat server disconnected");
            socket.off("message", handleMessage);
            // clearInterval(interval);
            // clean up
        })

    });
}
 
export default chatHandler;