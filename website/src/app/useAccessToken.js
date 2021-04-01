import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";

// eslint-disable-next-line
export default () => {
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        (async () => {
            const token = await getAccessTokenSilently({
                audience: 'https://dev-kk-pm4fd.eu.auth0.com/api/v2/',
                scope: 'read:current_user',
            });
            setAccessToken(token);
        })();
    }, [isAuthenticated, getAccessTokenSilently]);

    return accessToken;
};