'use strict';

const {MediaConvertClient, CreateJobCommand} = require('@aws-sdk/client-mediaconvert');
const getEnv = require('../util/getEnv');

async function createJob(client, params) {
    const response = await client.send(new CreateJobCommand(params));
    console.log('MediaConvert job response', response);
}

exports.handler = (event, context, callback) => {
    const env = getEnv('BUCKET', 'MEDIA_ROLE', 'MEDIA_ENDPOINT');
    if (env.missing.size > 0) {
        callback('missing environment variables: ' + env.missing.keys());
        return;
    }
    // noinspection JSUnresolvedVariable
    const mediaConvertClient = new MediaConvertClient({region: 'us-east-1', endpoint: env.MEDIA_ENDPOINT});
    // noinspection JSUnresolvedVariable
    const key = event.Records[0].s3.object.key;
    const sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));
    const outputKey = sourceKey.split('.')[0];
    // noinspection JSUnresolvedVariable
    const input = `s3://${event.Records[0].s3.bucket.name}/${sourceKey}`;
    // noinspection JSUnresolvedVariable
    const output = `s3://${env.BUCKET}/${outputKey}/`;

    // console.log('key', key);
    // console.log('sourceKey', sourceKey);
    // console.log('outputKey', outputKey);
    // console.log('input', input);
    // console.log('output', output);

    // noinspection JSUnresolvedVariable
    const jobParams = {
        'Role': env.MEDIA_ROLE,
        'Settings': {
            'Inputs': [{
                'FileInput': input,
                "AudioSelectors": {
                    "Audio Selector 1": {
                        "Offset": 0,
                        "DefaultSelection": "DEFAULT",
                        "SelectorType": "TRACK",
                        "ProgramSelection": 1,
                    },
                },
            }],
            'OutputGroups': [{
                'Name': 'File Group',
                'Outputs': [
                    {
                        'Preset': 'System-Generic_Hd_Mp4_Avc_Aac_16x9_1920x1080p_24Hz_6Mbps',
                        'Extension': 'mp4',
                        'NameModifier': '_16x9_1920x1080p_24Hz_6Mbps',
                    },
                    {
                        'Preset': 'System-Generic_Hd_Mp4_Avc_Aac_16x9_1280x720p_24Hz_4.5Mbps',
                        'Extension': 'mp4',
                        'NameModifier': '_16x9_1280x720p_24Hz_4.5Mbps',
                    },
                    {
                        'Preset': 'System-Generic_Sd_Mp4_Avc_Aac_4x3_640x480p_24Hz_1.5Mbps',
                        'Extension': 'mp4',
                        'NameModifier': '_4x3_640x480p_24Hz_1.5Mbps',
                    },
                ],
                'OutputGroupSettings': {
                    'Type': 'FILE_GROUP_SETTINGS',
                    'FileGroupSettings': {
                        'Destination': output,
                    },
                },
            }],
        },
    };

    createJob(mediaConvertClient, jobParams).catch(err => callback(err));
}