'use strict';

const axios = require('axios');
const auth0Domain = process.env.AUTH0_DOMAIN;

const getTokenInfo = async (awsCallback, token) => {
    try {
        console.log('sending request to Auth0');
        const response = await axios.post(
            `https://${auth0Domain}/userinfo`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log('response:', response);
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

    if (!auth0Domain) {
        callback('set AUTH0_DOMAIN env variable');
        return;
    }

    const token = event.authToken.split(' ')[1];

    // noinspection JSIgnoredPromiseFromCall
    getTokenInfo(callback, token);
}