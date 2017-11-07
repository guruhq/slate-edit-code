'use strict';

var deserializeCode = require('../deserializeCode');

/**
 * Wrap a block into a code block.
 *
 * @param  {Change} change
 * @param  {String} key
 * @return {Change}
 */
function wrapCodeBlockByKey(opts, change, key) {
    var state = change.state;
    var document = state.document;


    var startBlock = document.getDescendant(key);
    var text = startBlock.text;

    // Remove all child
    startBlock.nodes.forEach(function (node) {
        change.removeNodeByKey(node.key, { normalize: false });
    });

    // Insert new text
    var toInsert = deserializeCode(opts, text);

    toInsert.nodes.forEach(function (node, i) {
        change.insertNodeByKey(startBlock.key, i, node);
    });

    // Set node type
    change.setNodeByKey(startBlock.key, {
        type: opts.containerType
    });

    return change;
}

module.exports = wrapCodeBlockByKey;