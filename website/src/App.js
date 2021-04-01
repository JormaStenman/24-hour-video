import React from 'react';
import './App.css';
import {Container} from "semantic-ui-react";
import {Redirect, Route, Switch} from "react-router-dom";
import Navbar from "./app/Navbar";
import Videos from "./features/videos/Videos";
import Main from "./app/Main";
import {withAuthenticationRequired} from "@auth0/auth0-react";

const ProtectedRoute = ({component, ...args}) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
);

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    return (
        <Container>
            <Navbar/>
            <Switch>
                <ProtectedRoute component={Videos} path='/videos'/>
                <Route path='/main'>
                    <Main/>
                </Route>
                <Route path='/'>
                    <Redirect to='/main'/>
                </Route>
            </Switch>
        </Container>
    );
};