
import { randomUUID } from 'crypto';
import { createShapeMessage } from '../utils/Messages.js';

const shapes = {};

const shapeHandler = (io) => {

    // shapes
    io.on("connection", (socket) => {

        console.log(`new drawing connection from ${socket.id}`);

        const createShape = (message) => {

            // switch message.type
            console.log('received shape data: ', message);
    
            if (!message.id) {
                message.id = randomUUID();
            }
        
            if (!shapes[message.id]) {
                shapes[message.id] = message;
                
                console.log('return shape: ', message);
                socket.emit('shape', message);
                socket.broadcast.emit('shape', message);
                socket.emit('message', createShapeMessage('Lukas', `created shape at (${message.x}|${message.y})`));
            }
        };
    

        socket.on('createShape', createShape);

        socket.on('disconnect', () => {
            console.log('disconnect drawing server!');
            socket.off('createShape', createShape);
            // clean up
        })

    });
}
 
export default shapeHandler;