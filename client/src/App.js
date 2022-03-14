import style from './App.css';

import { BrowserRouter } from 'react-router-dom';
import { Link, Route, Routes } from 'react-router-dom';

import TestPage from './pages/testPage';
import ListComponent from './components/List.component';

import { SocketContextProvider } from './contexts/socket';

const ApiPage = () => {
    return (<>
      <h3>Home Page</h3>
    </>
    );
  };
  
  const AboutPage = () => {
    return (
      <h3>About Page</h3>
    );
  };

  const Lobby = () => {
      return (<h2>Lobby</h2>);
  }

const App = () => {

    return (
    <BrowserRouter>
        <SocketContextProvider>
       
            <Routes>
                <Route path="/shapes" element={<ApiPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/" element={<Lobby />} />
                <Route path="/:canvasId" element={<TestPage />} />
            </Routes>
            {/* <TestPage /> */}
        </SocketContextProvider>
    </BrowserRouter>
)

}

export default App;