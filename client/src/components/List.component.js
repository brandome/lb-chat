import { useCallback, useEffect, memo } from "react";
import { useSocketContext } from "../contexts/socket";
import TestControls from "../components/TestControls.component";

const ListComponent = memo(() => {

    const { socket, data, addMessage } = useSocketContext();

    const handleMessage = useCallback((message) => {
        if (message && message.type) {
            console.log('received message of type: ', message.type);
            addMessage(message);
        }
    }, []);

    useEffect(() => {

        if (!socket) {
            return;
        }

        socket.on('message', handleMessage);

        return (() => { // disconnect
            socket.off('message', handleMessage);
        });

    }, [socket, handleMessage]);


    return (<div className="debug-container">
    <TestControls title="Message Log" />
    <ul className='debug-list'>
        { data && data.map(d => {
            return <li key={d.id}>
                {d.message}
            </li>
        }) }
    </ul>
    </div>);
});
 
export default ListComponent;