import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";

ReactDOM.render(
    // <React.StrictMode>
    <BrowserRouter>
        <Provider store={store}>
            <Auth0Provider
                domain="dev-kk-pm4fd.eu.auth0.com"
                clientId="p7J0yqTvGO21THopTrTr7oaTyFHglUGn"
                redirectUri={window.location.origin}
                audience="https://dev-kk-pm4fd.eu.auth0.com/api/v2/"
                scope="read:current_user update:current_user_metadata"
            >
                <App/>
            </Auth0Provider>
        </Provider>
    </BrowserRouter>
    // </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();