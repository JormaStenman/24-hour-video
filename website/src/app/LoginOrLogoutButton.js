import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Image, Label} from "semantic-ui-react";
import useAuth0UserThroughAWS from "./useAuth0UserThroughAWS";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    const {logout, loginWithRedirect, isAuthenticated, isLoading} = useAuth0();
    const user = useAuth0UserThroughAWS();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Button onClick={() => loginWithRedirect({
            redirectUri: window.location.origin,
        })}>Log In</Button>
    }

    if (!user) {
        return null;
    }

    return (
        <Button as='div' labelPosition='left' onClick={() => logout({returnTo: window.location.origin})}>
            <Label basic>
                <Image avatar spaced src={user.picture} alt={user.name}/>
                {user.name}
            </Label>
            <Button negative>
                Log Out
            </Button>
        </Button>
    );
};