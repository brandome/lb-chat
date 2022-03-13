import React, { useReducer, useState, useEffect } from "react";
import { io } from "socket.io-client";

const ip = process.env.REACT_APP_IP || 'localhost';
const port = process.env.PORT || '8080';
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
    CLEAR_SHAPES: "CLEAR_SHAPES"
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
        default:
            return state;
    }
}


export const SocketContext = React.createContext();

export const useSocketContext = () => {
    return React.useContext(SocketContext);
};

export const SocketContextProvider = ({children}) => {

    const handleShape = (shape) => {
        console.log("HANDLE SHAPE");
        dispatch({type: actions.ADD_SHAPE, payload: shape});
    }

    useEffect(() => {
        
        console.log('attach shape listener');
        socket.on('shape', handleShape);

        return (() => {
            console.log('detach shape listener');
            socket.off('shape', handleShape);
        })
    }, []);

    const [ state, dispatch ] = useReducer(reducer, initialState);

    const value = {
        socket: socket,
        shapes: state.shapes,
        data: state.data,
        addMessage: (message) =>
            dispatch({type: actions.ADD_MESSAGE, payload: message}),
        clearMessages: () =>
            dispatch({type: actions.CLEAR_MESSAGES}),

        createShape: (shape) => {
            console.log('CLIENT: create shape');
            socket.emit('createShape', shape);
        },
        clearShapes: () => 
            dispatch({type: actions.CLEAR_SHAPES})
    };

    return (<SocketContext.Provider value={ value }>
        {children}
    </SocketContext.Provider>);
};