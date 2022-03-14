
import { randomUUID } from 'crypto';
import { createMessage, createShapeMessage } from '../utils/Messages.js';

const shapes = {};

const shapeHandler = (io, pool, emitter) => {

    // shapes
    io.on("connection", (socket) => {

        emitter.serverSideEmit('status', `new Drawing board connection from ${socket.id}`);
        
        const createShape = (message) => {
            
            
            if (!message.type || !~['star', 'hexagon'].indexOf(message.type)) {
                return;
            }
            
            const query = `
            INSERT INTO ${process.env.SHAPES_DB}(type,position,board)
            VALUES ($1,POINT($2,$3),$4) RETURNING id,type,position,board;`;

            pool.query(query
            , [message.type, message.x, message.y, message.board], (err, res) => {
                if (err) {
                    emitter.emit('message', createMessage('error', 'Lukas', err)); // createErrorMessage
                } else {
                    emitter.serverSideEmit("status", `Shape: created ${message.id}`);
                    emitter.emit('shape', res.rows[0]);
                }
            });
        };

        const moveShape = (message) => {

            let query = `UPDATE socket_io_shapes SET position = $1 WHERE id = $2;`;

            pool.query(query, [`(${message.position.x},${message.position.y})`, message.id], (err, res) => {
                if (err) throw err;
                emitter.serverSideEmit("status", `Shape: moved ${message.id}`);
                emitter.emit('updatedShape', message);
            })
            // TODO update
        }

        const deleteShape = (message) => {
            // TODO delete

            const shapeId = message.id;
            let query = `DELETE FROM socket_io_shapes WHERE id = $1;`;

            pool.query(query, [shapeId], (err, res) => {
                if (err) throw err;
                emitter.serverSideEmit("status", `Shape: deleted ${shapeId}`);
                emitter.emit('deletedShape', shapeId);
            })
        }
    
        pool.on('shape', (shape) => {
            emitter.serverSideEmit("status", `POOL: distribute shape ${shape.id}`);
            socket.emit('shape', shape);
        })

        socket.on('createShape', createShape);

        socket.on('moveShape', moveShape);
        socket.on('deleteShape', deleteShape);

        socket.on('disconnect', () => {
            emitter.serverSideEmit("status", "Shape handler disconnected");
            socket.off('createShape', createShape);
            // clean up
        })

        socket.on("getAllShapes", (request) => {

            
            let query = `select id,type,position from ${process.env.SHAPES_DB} WHERE board=$1`;
            query += 'ORDER BY id ASC ';
            
            query += ";";

            pool.query(query, [request], (err, res) => {
                if (err) throw err;
                emitter.serverSideEmit("status", `Shape: seeded shapes for board ${request}: ${socket.id}`);
                emitter.emit("allShapes", res.rows);
            })
        })

    });
}
 
export default shapeHandler;