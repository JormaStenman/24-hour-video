'use strict';

const jwt = require('jsonwebtoken');

const cert = `
-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJKNWQsXJnBc0wMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1ray1wbTRmZC5ldS5hdXRoMC5jb20wHhcNMjEwMzI0MTIwNzQwWhcN
MzQxMjAxMTIwNzQwWjAkMSIwIAYDVQQDExlkZXYta2stcG00ZmQuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo0dgU6MyWnqH0tq0
L1Sl6n/IkEVsc7b8VADleKtcomY3pB7TPuEFh/cI63DAmTFUREeMYX1qTiQUR7H0
jXS8oJO6TxcpuBMvs6fHSph24leZUW4zC1E5wsfvAoO3/7VHcSjcpQtQnZ5ZkmBM
PeBOoT0COz1l8Z6HGDS8s7dqVYPsA5Krj96KP5p5/B/cN9+/6OV4wi1jU9ddeIQc
ev6G1YxR1L+vF0kiGtBEpn2FauYgEJOBPKJVC8rksWvnDx04W9luUKvqK/4cJ7tH
IRLexsc9rybb/bYzfah7VPNkw3ZIo+CG6aNyHE3OgwiQLGrYrj8hUK7u4JPHdACy
o/dorQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQHqpm8cSm8
DIQob5UYp0or22njLDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AB2ERPWHt+iB3t985zeVWQcsB/VY0Asumb/cpvixedIS4OFcxEBHpBau5ar6nXfi
XJZXNeDyGh9Ug7wmLZbMuZ6SMuWT4tkD3iz+66itpkgu76zoKamsUAf8c0kA4V+4
DOxXo43DHLOe5eT6ckvBUVJY5TGVvyLjCMxQaw72Z1aQ5T1I0bfAKTwEN4SBNA/r
QVoWvUhXPI2OqnwzHGPzoN2si3slM8fPbuBN4ZKaf23U+OP9hfPMURkUKhoYiit8
zXLZuoMwG7pcu5S3fjhs951vF66+uFTdyMpfHmFG+qOheHtoFqXUPReQkURn8F3U
NZMUVgsmi3o22FWEFnxY9Ik=
-----END CERTIFICATE-----
`;

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
    console.log('authResponse:', JSON.stringify(authResponse));
    return authResponse;
};

exports.handler = (event, context, callback) => {
    console.log('event:', event);
    // noinspection JSUnresolvedVariable
    if (!event.authorizationToken) {
        callback('Could not find authToken');
        return;
    }
    const token = event.authorizationToken.split(' ')[1];
    const key = Buffer.from(cert);
    jwt.verify(token, key, {algorithms: ['RS256']}, err => {
        if (err) {
            const msg = 'JWT verification failed: ' + err;
            console.error(msg, 'authToken:', event.authorizationToken);
            callback(msg);
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