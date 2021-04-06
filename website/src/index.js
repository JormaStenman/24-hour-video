import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import {Router} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
import {createHashHistory as createHistory} from "history";

const history = createHistory();

const onRedirectCallback = appState => {
    history.replace((appState && appState.returnTo) || window.location.pathname);
};

ReactDOM.render(
    // <React.StrictMode>
    <Router history={history}>
        <Auth0Provider
            domain="dev-kk-pm4fd.eu.auth0.com"
            clientId="p7J0yqTvGO21THopTrTr7oaTyFHglUGn"
            redirectUri={window.location.origin + '/24-hour-video'}
            audience="https://dev-kk-pm4fd.eu.auth0.com/api/v2/"
            scope="read:current_user update:current_user_metadata"
            onRedirectCallback={onRedirectCallback}
        >
            <Provider store={store}>
                <App/>
            </Provider>
        </Auth0Provider>
    </Router>
    // </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();