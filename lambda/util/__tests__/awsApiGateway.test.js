const {createErrorResponse} = require('../awsApiGateway');

test('error response with all params', () => {
    const errorResponse = createErrorResponse('code', 'message', {
        aString: 'abc',
        anInt: 2,
    });
    expect(errorResponse).toEqual({
        statusCode: 'code',
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({
            code: 'code',
            message: 'message',
            aString: 'abc',
            anInt: 2,
        })
    });
});

test('error response without extra param', () => {
    const errorResponse = createErrorResponse('code', 'message');
    expect(errorResponse).toEqual({
        statusCode: 'code',
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({
            code: 'code',
            message: 'message',
        })
    });
});