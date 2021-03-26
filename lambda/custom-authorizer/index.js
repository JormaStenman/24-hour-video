'use strict';

const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

const generatePolicy = ({principalId, effect = undefined, resource = undefined}) => {
    const authResponse = {
        principalId,
    };
    if (effect && resource) {
        authResponse.policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        };
    }
    return authResponse;
};

exports.handler = (event, context, callback) => {
    console.log('event:', event);
    // noinspection JSUnresolvedVariable
    if (!event.authorizationToken) {
        callback('Could not find authToken');
        return;
    }
    ssm.getParameter({Name: 'auth0-certificate'}, (err, auth0Certificate) => {
        if (err) {
            callback('Error reading parameter auth0-certificate: ' + err);
            return;
        }
        const key = Buffer.from(auth0Certificate.Parameter.Value);
        const token = event.authorizationToken.split(' ')[1];
        jwt.verify(token, key, {algorithms: ['RS256']}, err => {
            if (err) {
                callback('JWT verification failed: ' + err);
                return;
            }
            // noinspection JSUnresolvedVariable
            callback(null, generatePolicy({
                principalId: 'user',
                effect: 'allow',
                resource: event.methodArn
            }));
        });
    })
}