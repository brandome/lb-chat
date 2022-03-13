import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocketContext } from '../contexts/socket.js';
import { Hexagon, Star } from './Shapes.js';

const Canvas = () => {

    const canvasRef = useRef();
    const [ dimensions, setDimensions ] = useState();

    const { shapes, createShape, socket } = useSocketContext();

    // position canvas
    useEffect(() => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            setDimensions({
                width: rect.width - 48 - 16,
                height: rect.height - 96
            });
        }

        return (() => {
            setDimensions(null);
        })
    }, [canvasRef]);


    const addRect = useCallback((e) => {
        console.log('click callback');
        const rect = {
            x: e.clientX - 36,
            y: e.clientY - 36
        };
        createShape(rect);
    }, [socket, createShape]);


    return ( <div ref={canvasRef} className="canvas">
        <div className="canvas-content">
            Hallo
            { dimensions && <svg onClick={addRect}
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="canvas-body"
            /> }
            { shapes && dimensions && shapes.map(s => {
                return <svg key={s.id}
                    width={24}
                    height={28}
                    viewBox={`0 0 24 28`}
                    className="canvas-shapes"
                    style={{
                        transform: `translate(${s.x}px, ${s.y}px)`,
                        stroke: `rgba(0,0,0, 1)`,
                        strokeWidth: 2,        
                    }}
                ><Star /></svg>
            })}
        </div>
    </div> );
}
 
export default Canvas;