'use strict';

const {S3Client, ListObjectsV2Command} = require('@aws-sdk/client-s3');

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
    console.log(event);

    const [bucket = '', suffix = ''] = [process.env.BUCKET, process.env.SUFFIX];
    const params = {
        Bucket: bucket,
        EncodingType: 'url',
    };

    let encoding = null;
    // noinspection JSUnresolvedVariable
    if (event.queryStringParameters && event.queryStringParameters.encoding) {
        encoding = decodeURIComponent(event.queryStringParameters.encoding);
    }

    const matchSuffix = () => {
        return `${encoding ? encoding : ''}${suffix}`.toLowerCase();
    };

    listObjects(params)
        .then(objects => {
            const result = {
                baseUrl: `https://${bucket}.s3.amazonaws.com/`,
                files: objects.Contents
                    .filter(item => item.Key.toLowerCase().endsWith(matchSuffix()))
                    .map(item => ({
                        filename: item.Key,
                        eTag: item.ETag.replace(/"/g, ''),
                        size: item.Size,
                    }))
            };
            callback(null, createSuccessResponse(result));
        })
        .catch(err => callback(null, createErrorResponse(500, err, encoding)));
}