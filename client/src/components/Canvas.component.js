import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocketContext } from '../contexts/socket.js';
import { Hexagon, Star } from './Shapes.js';

import useWindowDimensions from '../utils/windowDimensions';
import { useParams } from "react-router-dom";

const Canvas = () => {

    const { canvasId } = useParams();
    const { width, height } = useWindowDimensions();

    const canvasRef = useRef();
    const canvasBodyRef = useRef();

    const [ dimensions, setDimensions ] = useState();

    const { shapes, createShape, moveShape, deleteShape, socket } = useSocketContext();

    const [ dragListener, setDragListener ] = useState();
    const [ dropListener, setDropListener ] = useState();
    const [ cancelDrag, setCancelDrag ] = useState();

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

    useEffect(() => {
        
        const handleMouseMove = (e) => {

            const targetBox = canvasBodyRef.current.getBoundingClientRect();
            const movingBox = e.target.parentNode.getBoundingClientRect();
            const p = {
                x: e.x - targetBox.x - 12,
                y: e.y - targetBox.y + 24
            };

            dragListener(p);
        }

        if (canvasRef.current && dragListener) {

            canvasRef.current.addEventListener('mousemove', handleMouseMove, false);
            canvasRef.current.addEventListener('mouseup', handleMouseUp, false);
            canvasRef.current.addEventListener('mouseleave', cancelDrag, false);
        }

        return (() => {
            if (canvasRef.current && handleMouseMove) {
                canvasRef.current.removeEventListener('mousemove', handleMouseMove);
                canvasRef.current.removeEventListener('mouseup', handleMouseUp);
                canvasRef.current.removeEventListener('mouseleave', cancelDrag);
            }
        });
    }, [canvasRef, dragListener]);


    
    const addRect = useCallback((e) => {
        
        const canvasRect = e.target.getBoundingClientRect();
        const clicked = [e.clientX - canvasRect.x, e.clientY - canvasRect.y];
        const rect = {
            type: e.metaKey ? "star" : "hexagon",
            x: clicked[0] / dimensions.width * 800,
            y: clicked[1] / dimensions.height * 600,
            board: canvasId
        };

        createShape(rect);
    }, [socket, createShape, dimensions, canvasId]);

    useEffect(() => {
        socket.emit('getAllShapes', canvasId);
    }, [socket, canvasId]);


    const handleMouseDown = (e, s) => {

        if (e.button === 2) {
            e.preventDefault();
            deleteShape(s);
            return;
        }

        const canvasRect = canvasBodyRef.current.getBoundingClientRect();
        let startPosition = {
            x: e.clientX - canvasRect.x,
            y: e.clientY - canvasRect.y
        };


        setDragListener(() => (position) => {
            updateShapePosition(e.target.parentNode, position);
        });

        setDropListener(() => (position) => {

            const newPosition = {
                x: position.x / dimensions.width * 800,
                y: position.y / dimensions.height * 600
            };

            moveShape({...s, position: newPosition});
            setDragListener(null);
        });

        setCancelDrag(() => () => {
            updateShapePosition(e.target.parentNode, startPosition);
            setDragListener(null);
        });

        return false;
    };
    
    const handleMouseUp = useCallback((e) => {

        if (!dropListener) { // not dragging, but i.e. rightclicking
            return;
        }
        const canvasRect = canvasBodyRef.current.getBoundingClientRect();
        let pos = {
            x: e.clientX - canvasRect.x,
            y: e.clientY - canvasRect.y
        };
        dropListener(pos);
    }, [canvasBodyRef, dropListener]);
    
    const updateShapePosition = useCallback((element, position) => {
        element.style.transform = `translate(${position.x}px,${position.y}px)`;
    }, [shapes]);

    const reject = useCallback((e) => {e.preventDefault()}, []);

    return ( <div ref={canvasRef} className="canvas">
        <div className="canvas-content" >
            <em>Click to place a shape, use your modifier key to place a different shape. Right-click to delete</em>
            { dimensions && <svg onClick={addRect} ref={canvasBodyRef}
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
                    onContextMenu={reject}
                    onMouseDown={(e) => handleMouseDown(e, s)}
                    onMouseUp={(e) => handleMouseUp(e, s)}
                    style={{
                        transform: `translate(${
                            s.position.x/800*dimensions.width - 12
                        }px, ${
                            s.position.y/600*dimensions.height + 24
                        }px)`,
                        stroke: `rgba(0,0,0, 1)`,
                        strokeWidth: 2,        
                    }}
                >{ shape }</svg>
            })}
        </div>
    </div> );
}
 
export default Canvas;