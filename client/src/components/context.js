import { createContext, useContext } from "react"
import { createStore } from "redux";
import { Provider } from 'react-redux';
import rootReducers from '../store/reducer/index';

const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
}

const store = createStore(rootReducers);

export const AppContextProvider = ({children, value}) => {
    return <AppContext.Provider context={AppContext} value={value} store={store}>
        {children}
    </AppContext.Provider>;
}