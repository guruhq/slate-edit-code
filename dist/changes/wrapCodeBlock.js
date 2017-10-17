'use strict';

var wrapCodeBlockByKey = require('./wrapCodeBlockByKey');

/**
 * Wrap current block into a code block.
 * @param  {Change} change
 * @return {Change}
 */
function wrapCodeBlock(opts, change) {
    var _change = change,
        state = _change.state;
    var startBlock = state.startBlock,
        selection = state.selection;

    // Convert to code block

    change = wrapCodeBlockByKey(opts, change, startBlock.key);

    // Move selection back in the block
    change.collapseToStartOf(change.state.document.getDescendant(startBlock.key)).moveOffsetsTo(selection.startOffset);

    return change;
}

module.exports = wrapCodeBlock;