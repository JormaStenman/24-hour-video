'use strict';

const {createErrorResponse, createSuccessResponse} = require('../util/awsApiGateway');
const getEnv = require('../util/getEnv');
const crypto = require('crypto');

function generateExpirationDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate.toISOString();
}

function generate(filename) {
    const directory = crypto.randomBytes(20).toString('hex');
    const key = directory + '/' + filename;
    const expiration = generateExpirationDate();

    const policy = {
        expiration,
        conditions: [
            {key},
            {bucket: process.env.UPLOAD_BUCKET},
            {acl: 'private'},
            ['starts-with', '$Content-Type', '']
        ]
    };

    return {
        key,
        policy
    };
}

function base64encode(value) {
    return Buffer.from(value).toString('base64');
}

function encode(params) {
    return {
        ...params,
        encoded_policy: base64encode(JSON.stringify(params.policy)).replace('\n', '')
    };
}

function sign(params) {
    return {
        ...params,
        signature: crypto
            .createHmac('sha1', process.env.SECRET_ACCESS_KEY)
            .update(params.encoded_policy)
            .digest('base64')
    };
}

function getFilename(event) {
    // noinspection JSUnresolvedVariable
    if (event.queryStringParameters && event.queryStringParameters.filename) {
        return decodeURIComponent(event.queryStringParameters.filename);
    } else {
        return null;
    }
}

function response(filename) {
    try {
        const {encoded_policy, signature} = sign(encode(generate(filename)));
        return createSuccessResponse({
            signature,
            encoded_policy,
            access_key: process.env.ACCESS_KEY,
            upload_url: `${process.env.UPLOAD_URL}/${process.env.UPLOAD_BUCKET}`,
        });
    } catch (e) {
        return createErrorResponse(500, e);
    }
}

exports.handler = (event, context, callback) => {
    const env = getEnv(
        'ACCESS_KEY',
        'SECRET_ACCESS_KEY',
        'UPLOAD_BUCKET',
        'UPLOAD_URL',
    );
    if (env.missing.size) {
        callback(`missing environment variables: ${Array.from(env.missing.keys())
            .sort((a, b) => a.localeCompare(b))
            .join(', ')
        }`);
        return;
    }

    const filename = getFilename(event);
    if (!filename) {
        callback(null, createErrorResponse(500, 'Filename must be provided'));
        return;
    }

    callback(null, response(filename));
}