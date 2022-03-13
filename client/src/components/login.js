import { useEffect, useState } from "react";
import { useAppContext } from "./context";

const LoginPage = ({ socket }) => {


    const { emit } = useAppContext();

    const [userName, setUserName] = useState('');

    const { login } = useAppContext();
    const tryLogin = () => {
        emit('add user', userName);
    };

    useEffect(() => {
        socket.on('login', (data) => {
            login(data.username);
        })
    }, [socket]);

    return (<div className='form'>
        <h2>Login Form</h2>
        <label htmlFor='form-user'>User Name:</label>
        <input 
            className='formInput'
            type={'text'}
            maxLength='20'
            onChange={e => setUserName(e.target.value)}
            placeholder="And who are you?"
            value={userName}
        />
        <button disabled={userName.length < 3} className='formButton' onClick={() => tryLogin()}>Let me in!</button>    
    </div>);

}

export default LoginPage;