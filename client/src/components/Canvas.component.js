import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocketContext } from '../contexts/socket.js';
import { Hexagon, Star } from './Shapes.js';

import useWindowDimensions from '../utils/windowDimensions';

const Canvas = () => {

    const { width, height } = useWindowDimensions();

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
    }, [canvasRef, width, height]);


    const addRect = useCallback((e) => {
        console.log('click callback');

        const canvasRect = e.target.getBoundingClientRect();
        const clicked = [e.clientX - canvasRect.x, e.clientY - canvasRect.y];
        const rect = {
            type: e.metaKey ? "star" : "hexagon",
            x: clicked[0] / dimensions.width * 800,
            y: clicked[1] / dimensions.height * 600
        };

        createShape(rect);
    }, [socket, createShape, dimensions]);


    return ( <div ref={canvasRef} className="canvas">
        <div className="canvas-content">
            <em>Click to place a shape, use your modifier key to place a different shape.</em>
            { dimensions && <svg onClick={addRect}
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className="canvas-body"
            /> }
            { shapes && dimensions && shapes.map(s => {

                let shape;
                switch (s.type) {
                    case "star": shape = <Star />; break;
                    case "hexagon": shape = <Hexagon blur={0} />; break;
                }

                if (!shape) {
                    return null;
                }

                return <svg key={s.id}
                    width={24}
                    height={24}
                    viewBox={`0 0 24 24`}
                    className="canvas-shapes"
                    style={{
                        transform: `translate(${s.x/800*dimensions.width - 12}px, ${s.y/600*dimensions.height + 24}px)`,
                        stroke: `rgba(0,0,0, 1)`,
                        strokeWidth: 2,        
                    }}
                >{ shape }</svg>
            })}
        </div>
    </div> );
}
 
export default Canvas;