'use strict';

const axios = require('axios');

const getTokenInfo = async (awsCallback, token) => {
    try {
        const response = await axios.post(
            `https://${process.env.DOMAIN}/userinfo`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        // noinspection JSUnresolvedVariable
        awsCallback(null, response.data);
    } catch (error) {
        if (error.response) {
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
            awsCallback(error.response);
        } else if (error.request) {
            const msg = 'no response for request';
            console.error(msg, error.request);
            awsCallback(msg);
        } else {
            awsCallback('error building request');
        }
        console.log('axios config:', error.config);
    }
}

exports.handler = (event, context, callback) => {

    // noinspection JSUnresolvedVariable
    if (!event.authToken) {
        callback('Could not find authToken.');
        return;
    }

    const token = event.authToken.split(' ')[1];

    // noinspection JSIgnoredPromiseFromCall
    getTokenInfo(callback, token);
}