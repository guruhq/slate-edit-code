'use strict';

/**
 * Unwrap a code block into a normal block.
 *
 * @param  {Change} change
 * @param  {String} key
 * @param  {String} type
 * @return {Change}
 */
function unwrapCodeBlockByKey(opts, change, key, type) {
    var state = change.state;
    var document = state.document;

    // Get the code block

    var codeBlock = document.getDescendant(key);

    if (!codeBlock || codeBlock.type != opts.containerType) {
        throw new Error('Block passed to unwrapCodeBlockByKey should be a code block container');
    }

    // change lines into paragraph
    codeBlock.nodes.forEach(function (line) {
        return change.setNodeByKey(line.key, { type: type }).unwrapNodeByKey(line.key);
    });

    return change;
}

module.exports = unwrapCodeBlockByKey;