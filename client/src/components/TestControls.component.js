import { useCallback } from "react";
import { useSocketContext } from "../contexts/socket";
import Spacer from './Spacer.control';
import { Link } from "react-router-dom";

const TestControls = ({ title }) => {

    const { clearMessages } = useSocketContext();

    const clear = useCallback(() => {
        clearMessages();
    }, []);

    return (<>
        <div className="toolbar top">
            {title && <>
                <h2>{title}</h2>
                <Spacer />
            </>}
            <button onClick={clear}>Clear Log</button>
        </div>
        <Link to="/">Home</Link>
        <Link to="/shapes">Shapes</Link>
        <Link to="/about">About</Link>

    </>);
}
 
export default TestControls;