import { useCallback } from "react";
import { useSocketContext } from "../contexts/socket";
import Spacer from './Spacer.component';

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
    </>);
}
 
export default TestControls;