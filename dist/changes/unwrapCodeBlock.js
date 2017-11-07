'use strict';

var getCurrentCode = require('../getCurrentCode');
var unwrapCodeBlockByKey = require('./unwrapCodeBlockByKey');

/**
 * Convert a code block to a normal block.
 * @param  {Change} change
 * @param  {String} type
 * @return {Change}
 */
function unwrapCodeBlock(opts, change, type) {
    var _change = change,
        state = _change.state;


    var codeBlock = getCurrentCode(opts, state);

    if (!codeBlock) {
        return change;
    }

    // Convert to paragraph
    change = unwrapCodeBlockByKey(opts, change, codeBlock.key, type);

    return change;
}

module.exports = unwrapCodeBlock;