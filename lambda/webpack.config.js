const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
    mode: 'production',
    stats: {
        errorDetails: true,
    },
    target: 'node14',
};