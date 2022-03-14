import React, { useReducer, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

const ip = process.env.REACT_APP_SOCKET_SERVER || 'localhost';
const port = process.env.REACT_APP_SOCKET_PORT || '8080';
const URL = `ws://${ip}:${port}`;

export const socket = io(URL, {
    transports: ['websocket']
});


const initialState = {
    data: [],
    shapes: []
};

const actions = {
    ADD_MESSAGE: "ADD_MESSAGE",
    CLEAR_MESSAGES: "CLEAR_MESSAGES",

    CREATE_SHAPE: "CREATE_SHAPE",
    ADD_SHAPE: "ADD_SHAPE",
    CLEAR_SHAPES: "CLEAR_SHAPES",
    SEED_SHAPES: "SEED_SHAPES",
    EDIT_SHAPE: "EDIT_SHAPE",
    DELETE_SHAPE: "DELETE_SHAPE"
    // remove
};

const reducer = (state, action) => {
    switch (action.type) {
        case actions.ADD_MESSAGE:
            return {
                ...state,
                data: [...state.data, action.payload]
            };
        case actions.CLEAR_MESSAGES:
            return {
                ...state,
                data: []
            }
        case actions.ADD_SHAPE:
            return {
                ...state,
                shapes: [
                    ...state.shapes,
                    action.payload
                ]
            }
        case actions.SEED_SHAPES:
            return {
                ...state,
                shapes: [
                    ...action.payload
                ]
            }
        case actions.EDIT_SHAPE:
            return {
                ...state,
                shapes: state.shapes.map(s => {
                    if (s.id !== action.payload.id) {
                        return s;
                    }
                    return action.payload;
                })
            };
        case actions.DELETE_SHAPE:
            return {
                ...state,
                shapes: state.shapes.filter(s => s.id !== action.payload)
                
            }
        default:
            return state;
    }
}


export const SocketContext = React.createContext();

export const useSocketContext = () => {
    return React.useContext(SocketContext);
};

export const SocketContextProvider = ({children}) => {
    
    const [ state, dispatch ] = useReducer(reducer, initialState);


    const handleShape = useCallback((shape) => {
        dispatch({type: actions.ADD_SHAPE, payload: shape});
    }, []);

    const handleDeletedShape = useCallback((shapeId) => {
        dispatch({type: actions.DELETE_SHAPE, payload: shapeId});
    }, []);

    const handleInitialLoad = useCallback((shapes) => {
        dispatch({type: actions.SEED_SHAPES, payload: shapes});
    }, []);

    const handleShapeUpdated = useCallback((shape) => {
        dispatch({type: actions.EDIT_SHAPE, payload: shape});
    }, []);

    useEffect(() => {
        
        socket.on('shape', handleShape);
        socket.on('allShapes', handleInitialLoad);
        socket.on('updatedShape', handleShapeUpdated);
        socket.on('deletedShape', handleDeletedShape);

        return (() => {
            socket.off('shape', handleShape);
            socket.off('allShapes', handleInitialLoad);
            socket.off('updatedShape', handleShapeUpdated);
            socket.off('deletedShape', handleDeletedShape);
        });
    }, [socket]);


    const value = {
        socket: socket,
        shapes: state.shapes,
        data: state.data,
        addMessage: (message) =>
            dispatch({type: actions.ADD_MESSAGE, payload: message}),
        clearMessages: () =>
            dispatch({type: actions.CLEAR_MESSAGES}),

        createShape: (shape) => {
            socket.emit('createShape', shape);
        },
        moveShape: (shape) => {
            socket.emit('moveShape', shape);
        },
        deleteShape: (shape) => {
            socket.emit('deleteShape', shape);
        },
        clearShapes: () => 
            dispatch({type: actions.CLEAR_SHAPES})
    };

    return (<SocketContext.Provider value={ value }>
        {children}
    </SocketContext.Provider>);
};