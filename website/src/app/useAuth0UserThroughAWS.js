import {useEffect, useState} from "react";
import useAccessToken from "./useAccessToken";

const userProfileUrl = 'https://jbm3qrd33k.execute-api.us-east-1.amazonaws.com/dev/user-profile';

// eslint-disable-next-line
export default () => {
    const [user, setUser] = useState(null);
    const accessToken = useAccessToken();

    useEffect(() => {
        if (!accessToken) return;
        (async () => {
            try {
                const response = await fetch(userProfileUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                if (!response.ok) {
                    console.error(`AWS error: ${response.status} (${response.statusText})`);
                } else {
                    setUser(await response.json());
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [accessToken]);

    return user;
}