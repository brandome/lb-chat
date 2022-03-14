import { useCallback } from "react";



export const Hexagon = ({ blur = 0 }) => {


    return (<path 
        style={{
            transform: `translate(-3px,-6px)`
        }}
        filter={`blur(${blur}px)`}
        d="M 18 13 l 3 5 l -3 5 l -6 0 l -3 -5 l 3 -5 Z"
    />);
}

export const Star = ({ blur = 0, onDragEnd }) => {
    return (<path
        style={{
            transform: `translate(1px, 4px)`
        }}
        transform='scale(1)'
        filter={`blur(${blur}px)`}
        d="M 11 1 l 1 6 l 6 1 l -6 1 l -1 6 l -1 -6 l -6 -1 l 6 -1 Z"
    />);
};
