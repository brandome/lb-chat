import style from './App.css';

import TestPage from './pages/testPage';

import { SocketContextProvider } from './contexts/socket';

const App = () => {

    return (<SocketContextProvider>
        <TestPage />
    </SocketContextProvider>)

}

export default App;