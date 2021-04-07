const {handler} = require('../index');
const crypto = require('crypto');

function clearEnv() {
    delete process.env.ACCESS_KEY;
    delete process.env.SECRET_ACCESS_KEY;
    delete process.env.UPLOAD_BUCKET;
    delete process.env.UPLOAD_URL;
}

function setEnv() {
    process.env.ACCESS_KEY = 'access key';
    process.env.SECRET_ACCESS_KEY = 'secret access key';
    process.env.UPLOAD_BUCKET = 'upload bucket';
    process.env.UPLOAD_URL = 'upload url';
}

beforeEach(() => {
    setEnv();
})

afterEach(() => {
    clearEnv();
});

test('missing env vars', () => {
    clearEnv();
    const callback = jest.fn(err => {
        expect(err).toEqual('missing environment variables: ACCESS_KEY, SECRET_ACCESS_KEY, UPLOAD_BUCKET, UPLOAD_URL');
    });
    handler(null, null, callback);
    expect(callback).toHaveBeenCalledTimes(1);
});

test('missing query parameter', () => {
    const callback = jest.fn((_, response) => {
        expect(response).toMatchObject({
            statusCode: 500,
            body: expect.stringContaining('Filename must be provided'),
        });
    });
    handler({}, null, callback);
    expect(callback).toHaveBeenCalledTimes(1);
});

function tomorrow() {
    const plusOneDay = new Date();
    plusOneDay.setDate(plusOneDay.getDate() + 1);
    return plusOneDay;
}

test('happy case', () => {
    const callback = jest.fn((_, response) => {
        expect(response).toMatchObject({
            statusCode: 200,
            body: expect.stringMatching(/.+/),
        });
        const body = JSON.parse(response.body);
        const someB64 = /[a-z0-9+/=]+/i;
        expect(body).toMatchObject({
            signature: expect.stringMatching(someB64),
            encoded_policy: expect.stringMatching(someB64),
            access_key: 'access key',
            upload_url: 'upload url/upload bucket',
        });
        const expectedSignature = crypto
            .createHmac('sha1', 'secret access key')
            .update(body.encoded_policy)
            .digest('base64');
        expect(body.signature).toEqual(expectedSignature);
        const policy = JSON.parse(Buffer.from(body.encoded_policy, 'base64').toString());
        expect(policy).toMatchObject({
            expiration: expect.stringMatching(new RegExp(`^${tomorrow().toISOString().substr(0, 10)}T`)),
            conditions: expect.arrayContaining([
                {key: expect.stringMatching(/[0-9a-f]{20}\/file.txt/)},
                {bucket: 'upload bucket'},
                {acl: 'private'},
                ['starts-with', '$Content-Type', ''],
            ]),
        });
    });
    handler({queryStringParameters: {filename: 'file.txt'}}, null, callback);
    expect(callback).toHaveBeenCalledTimes(1);
});