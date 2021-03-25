import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {Button} from "semantic-ui-react";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    const {logout, loginWithRedirect, isAuthenticated, isLoading} = useAuth0();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Button onClick={() => loginWithRedirect()}>Log In</Button>
    }

    return (
        <Button negative onClick={() => logout({returnTo: window.location.origin})}>
            Log Out
        </Button>
    );
};