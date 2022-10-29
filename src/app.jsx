import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Page } from './components/page';
import { reducer } from './reducer';
import './app.css';

const App = () => {
    const store = createStore(reducer);
    return (
        <Provider store={store}>
            <div className="app">
                <Page />
            </div>
        </Provider>
    );
};

export default App;
