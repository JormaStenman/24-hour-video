'use strict';

const {S3Client, ListObjectsV2Command} = require('@aws-sdk/client-s3');
const getEnv = require('../util/getEnv');

const s3Client = new S3Client({region: 'us-east-1'});

async function listObjects(params) {
    return await s3Client.send(new ListObjectsV2Command(params));
}

function createErrorResponse(code, message, encoding) {
    return {
        statusCode: code,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({
            code,
            encoding,
            message,
        })
    };
}

function createSuccessResponse(result) {
    return {
        statusCode: 200,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify(result)
    };
}

exports.handler = (event, context, callback) => {
    const env = getEnv('BUCKET', 'SUFFIX');

    if (env.missing.size > 0) {
        callback('missing environment variables: ' + env.missing.keys());
        return;
    }

    // noinspection JSUnresolvedVariable
    const params = {
        Bucket: env.BUCKET,
        EncodingType: 'url',
    };

    let encoding = null;
    // noinspection JSUnresolvedVariable
    if (event.queryStringParameters && event.queryStringParameters.encoding) {
        encoding = decodeURIComponent(event.queryStringParameters.encoding);
    }

    const itemFilter = item => {
        // noinspection JSUnresolvedVariable
        const regExp = new RegExp(`${(encoding ? `\\d+x${encoding}` : '')}.*${env.SUFFIX}$`, 'i');
        const match = item.Key.match(regExp);
        // console.log(`item.Key=${item.Key}, regExp=${regExp}, match=${match}`);
        return match !== null;
    };

    listObjects(params)
        .then(objects => {
            // noinspection JSUnresolvedVariable
            const result = {
                baseUrl: `https://${env.BUCKET}.s3.amazonaws.com/`,
                files: objects.Contents
                    .filter(item => itemFilter(item))
                    .map(item => ({
                        date: item.LastModified,
                        eTag: item.ETag.replace(/"/g, ''),
                        filename: item.Key,
                        size: item.Size,
                    }))
            };
            callback(null, createSuccessResponse(result));
        })
        .catch(err => callback(null, createErrorResponse(500, err, encoding)));
}