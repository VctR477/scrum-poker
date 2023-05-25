import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import { Page } from './components/page';
import { Satisfaction } from './components/satisfaction';
import { Highlevel } from './components/highlevel';
import { reducer } from './reducers';
import './app.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Page />,
    },
    {
        path: '/admin',
        element: <Page />,
    },
    {
        path: '/satisfaction',
        element: <Satisfaction />,
    },
    {
        path: '/satisfaction/admin',
        element: <Satisfaction />,
    },
    {
        path: '/highlevel',
        element: <Highlevel />,
    },
    {
        path: '/highlevel/admin',
        element: <Highlevel />,
    }
]);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const App = () => {
    const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
    return (
        <Provider store={store}>
            <div className="app">
                <RouterProvider router={router} />
            </div>
        </Provider>
    );
};

export default App;
