'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/js/subjx.common.js');
} else {
    module.exports = require('./dist/js/subjx.dev.common.js');
}