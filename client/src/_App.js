import { useState } from 'react';
import style from './App.css';

import LoginPage from './components/login';
import { ChatPage } from './components/chat';

import { AppContextProvider } from './components/context';

import { io } from 'socket.io-client';

const ip = process.env.REACT_APP_IP || 'localhost';
const port = process.env.PORT || '8080';
const socket = io(`ws://${ip}:${port}`);

function App() {
  
  const [ messages, setMessages ] = useState([]);
  const [user, setUser] = useState();


  socket.on('disconnect', (data) => {
    setUser();
  })

  // socket.on('login', (message) => {
  //   console.log('logged in users: ', message.numUsers)
  // })

  socket.on('typing', (m) => {console.log("someone is typing", m.username)})

  const login = (user) => {
    setUser(user);
  }

  const emit = (event, payload) => {
    socket.emit(event, payload||{});
  }

  return (<>
      <AppContextProvider value={{user, login, emit, messages, setMessages}}>
        <div className='page' key={user}>
          {!user ? <LoginPage socket={socket} /> :  <>
            <ChatPage socket={socket}/>
            {/* <Process />   */}
          </>}
        </div>
      </AppContextProvider>
  </>
  );
}

export default App;
