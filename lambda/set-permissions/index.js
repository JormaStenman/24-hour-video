'use strict';

const {S3Client, PutObjectAclCommand} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({region: 'us-east-1'});

async function setAcl(params) {
    await s3Client.send(new PutObjectAclCommand(params));
}

exports.handler = (event, context, callback) => {
    // noinspection JSUnresolvedVariable
    const text = event.Records[0].Sns.Message;
    const message = JSON.parse(text);
    // noinspection JSUnresolvedVariable
    const sourceBucket = message.Records[0].s3.bucket.name;
    // noinspection JSUnresolvedVariable
    const sourceKey = decodeURIComponent(message.Records[0].s3.object.key.replace(/\+/g, ' '));

    // console.log('sourceBucket', sourceBucket);
    // console.log('sourceKey', sourceKey);

    const params = {
        ACL: 'public-read',
        Bucket: sourceBucket,
        Key: sourceKey,
    };

    setAcl(params).catch(err => callback(err));
}