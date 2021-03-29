'use strict';

const {ElasticTranscoderClient, CreateJobCommand} = require('@aws-sdk/client-elastic-transcoder');

const elasticTranscoder = new ElasticTranscoderClient({region: 'us-east-1'});

async function createJob(params) {
    await elasticTranscoder.send(new CreateJobCommand(params));
}

exports.handler = (event, context, callback) => {
    // noinspection JSUnresolvedVariable
    const key = event.Records[0].s3.object.key;
    const sourceKey = decodeURIComponent(key.replace(/\+g/, ' '));
    const outputKey = sourceKey.split('.')[0];
    const params = {
        PipelineId: '1616415202996-n3m5q3',
        OutputKeyPrefix: outputKey + '/',
        Input: {
            Key: sourceKey,
        },
        Outputs: [
            {
                Key: `${outputKey}-1080p.mp4`,
                PresetId: '1351620000001-000001',
            },
            {
                Key: `${outputKey}-720p.mp4`,
                PresetId: '1351620000001-000010',
            },
            {
                Key: `${outputKey}-web-720p.mp4`,
                PresetId: '1351620000001-100070',
            },
        ],
    };
    createJob(params).catch(err => callback(err));
}