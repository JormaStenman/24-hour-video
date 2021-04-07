function createErrorResponse(code, message, extra) {
    return {
        statusCode: code,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({
            code,
            message,
            ...extra,
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

module.exports = {
    createErrorResponse,
    createSuccessResponse,
};