

import { createMessage } from '../utils/Messages.js';

const chatHandler = (io) => {
    // chat
    let numUsers = 0, interval;
    io.on("connection", (socket) => {

        console.log(`new chat connection from ${socket.id}`);


        const handleMessage = (message) => {
            console.log('received message', message);
            // socket.broadcast.emit('message', message);
            const outMessage = createMessage('chat', 'username', 'received message: ' + message, Date.now());
            socket.emit('message', outMessage);
        };

        socket.on('message', handleMessage);


        socket.on('disconnect', () => {
            console.log('disconnect chat server!');
            socket.off("message", handleMessage);
            // clearInterval(interval);
            // clean up
        })

    });
}
 
export default chatHandler;