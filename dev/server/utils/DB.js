// load and use .env file at runtime
import dotenv from 'dotenv';
dotenv.config();
const env = process.env;

export const initDB = (pool) => {
    pool.query(`
    --DROP TABLE socket_io_drawing_boards CASCADE;
    --DROP TABLE ${env.SHAPES_DB} CASCADE;

    CREATE TABLE IF NOT EXISTS socket_io_drawing_boards (
        id          int GENERATED ALWAYS AS IDENTITY,
        name        varchar(255),
        createdAt   timestamp DEFAULT NOW(),
        payload     bytea,
        PRIMARY KEY(id)
    );
    
    CREATE TABLE IF NOT EXISTS ${env.SHAPES_DB} (
        id          int GENERATED ALWAYS AS IDENTITY,
        board       int,
        createdAt   timestamp DEFAULT NOW(),
        type        varchar(10),
        position    point,
        PRIMARY KEY(id)--,
        --CONSTRAINT fk_board
        --    FOREIGN KEY(id)
        --        REFERENCES socket_io_drawing_boards(id)
    );

    INSERT INTO socket_io_drawing_boards(name)
    VALUES('my board');

    --INSERT INTO ${env.SHAPES_DB}(board, type, position)
    --VALUES(1, 'star', POINT(100, 100)), (1, 'star', POINT(200,200));
`);
}
