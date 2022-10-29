import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { Page } from './components/page';
import { reducer } from './reducer';
import './app.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const App = () => {
    const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
    return (
        <Provider store={store}>
            <div className="app">
                <Page />
            </div>
        </Provider>
    );
};

export default App;
