import React, {useState} from 'react';
import './App.css';
import {Button, Card, Container, Grid, Header, Image, Message, Placeholder} from "semantic-ui-react";
import {Route, Switch} from "react-router-dom";
import Navbar from "./app/Navbar";
import {useAuth0} from "@auth0/auth0-react";

const userProfileUrl = 'https://chdpvoeon7.execute-api.us-east-1.amazonaws.com/dev/user-profile';

const UserInfoThroughAWS = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const {getAccessTokenSilently} = useAuth0();

    const fetchThroughAWS = async () => {
        setLoading(true);
        setError(null);
        setUser(null);
        try {
            const token = await getAccessTokenSilently({
                audience: 'https://dev-kk-pm4fd.eu.auth0.com/api/v2/',
                scope: 'read:current_user',
            });
            const response = await fetch(userProfileUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                setError(`AWS error: ${response.status} (${response.statusText})`);
            } else {
                setUser(await response.json());
                setError(null);
            }
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    const displayContent = () => {
        if (loading) {
            return (
                <Placeholder>
                    <Placeholder.Paragraph/>
                </Placeholder>
            );
        }
        if (error) {
            return (
                <Message error>{JSON.stringify(error)}</Message>
            );
        }
        if (user) {
            return (
                <Card raised>
                    <Image src={user.picture} alt={user.name} size='tiny'/>
                    <Card.Header>{user.name}</Card.Header>
                    <Card.Meta>
                        <span className='email'>{user.email}</span>
                    </Card.Meta>
                </Card>
            );
        }
        return null;
    };

    return (
        <Grid.Row columns='2'>
            <Grid.Column width='4'>
                <Button onClick={fetchThroughAWS}>Fetch Auth0 user info through AWS</Button>
            </Grid.Column>
            <Grid.Column>
                {displayContent()}
            </Grid.Column>
        </Grid.Row>
    );
};

const UserInfo = () => {
    const {user, isAuthenticated, isLoading} = useAuth0();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Message>Log in to display user info.</Message>
    }

    return (
        <Grid container>
            <Grid.Row columns='2'>
                <Grid.Column width='4'>
                    <Header as='h2'>User info from Auth0</Header>
                </Grid.Column>
                <Grid.Column>
                    <Card raised>
                        <Image src={user.picture} alt={user.name} size='tiny'/>
                        <Card.Header>{user.name}</Card.Header>
                        <Card.Meta>
                            <span className='email'>{user.email}</span>
                        </Card.Meta>
                    </Card>
                </Grid.Column>
            </Grid.Row>
            <UserInfoThroughAWS/>
        </Grid>
    );

};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
    <Container>
        <Navbar/>
        <Switch>
            <Route path='/'>
                <UserInfo/>
            </Route>
        </Switch>
    </Container>
);