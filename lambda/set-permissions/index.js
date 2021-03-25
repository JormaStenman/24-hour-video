'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    const text = event.Records[0].Sns.Message;
    console.log('message:', text);
    const message = JSON.parse(text);
    const sourceBucket = message.Records[0].s3.bucket.name;
    const sourceKey = decodeURIComponent(message.Records[0].s3.object.key.replace(/\+/g, ''));
    console.log('sourceBucket:', sourceBucket);
    console.log('sourceKey:', sourceKey);
    const params = {
        ACL: 'public-read',
        Bucket: sourceBucket,
        Key: sourceKey,
    };
    s3.putObjectAcl(params, (err, data) => {
        if (err) {
            callback(err);
        } else {
            console.log(data);
        }
    });
}