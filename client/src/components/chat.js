import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppContext } from "./context";

// import { to_decrypt, to_encrypt } from './aes.js';

export const ChatPage = ({ socket }) => {

    const { user, emit, messages, setMessages } = useAppContext();

    const sendMessage = () => {
        emit('new message', message)
        setMessage('');
    }

    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        socket.on('new message', (message) => {
            console.log('received new message', message);
            setMessages([...messages, message]);
        });
    }, [socket]);

    useEffect(() => {
        if (typing) {
            emit('typing');
        } else {
            emit('stop typing');
        }
    }, [typing]);

    useEffect(() => {
        let timer = setTimeout(() => setTyping(false), 500);

        if (message) {
            setTyping(true);
        }

        return (() => clearTimeout(timer));
    }, [message]);

    return (<div className="chat">
        Hello, {user}
        <ul className='messages'>
            {messages && messages.map(m => {
                const rawTimestamp = m.id.split('-')[1];
                const createdOn = new Date(+rawTimestamp);
                const time = `${createdOn.toLocaleDateString()} - ${createdOn.toLocaleTimeString()}`;
                // debugger;
                const header = `${m.user} (${time}):`;
                return (<li key={m.id}>
                    <div className="message-header">{header}</div>
                    <div className="message-body">{m.message}</div>
                </li>)
            })}    
        </ul>
        <div className='footer'>
            <input
                maxLength={100}
                onChange={(e) => setMessage(e.target.value)}
                value={message} 
                placeholder='Type Message here...'/>
            <button onClick={() => sendMessage()}>Send</button>
        </div>
    </div>);
}
