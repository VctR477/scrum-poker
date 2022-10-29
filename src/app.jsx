import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { Page } from './components/page';
import { reducer } from './reducer';
import './app.css';

const App = () => {
    const store = createStore(reducer, applyMiddleware(thunk));
    return (
        <Provider store={store}>
            <div className="app">
                <Page />
            </div>
        </Provider>
    );
};

export default App;
