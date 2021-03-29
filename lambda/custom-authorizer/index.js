'use strict';

const jwt = require('jsonwebtoken');
const {SSMClient, GetParameterCommand} = require('@aws-sdk/client-ssm');

const ssmClient = new SSMClient({region: 'us-east-1'});

function generatePolicy({principalId, effect = undefined, resource = undefined}) {
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
}

async function getCert() {
    console.log('sending GetParameterCommand');
    const result = await ssmClient.send(new GetParameterCommand({Name: 'auth0-certificate'}));
    console.log('result:', result);
    return result.Parameter.Value;
}

function verifyJWT(cert, event, callback) {
    const key = Buffer.from(cert);
    // noinspection JSUnresolvedVariable
    const token = event.authorizationToken.split(' ')[1];
    console.log(`verifying token ${token} with cert ${cert}`);
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
}

exports.handler = (event, context, callback) => {
    // noinspection JSUnresolvedVariable
    if (!event.authorizationToken) {
        callback('Could not find authToken');
        return;
    }
    getCert()
        .then(cert => verifyJWT(cert, event, callback))
        .catch(e => callback(e));
}