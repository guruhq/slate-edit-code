"use strict";

/**
 * Return the current code block, from current selection or from a node key.
 *
 * @param {PluginOptions} opts
 * @param {Slate.State} state
 * @param {String} key?
 * @return {Slate.Block || Void}
 */
function getCurrentCode(opts, state, key) {
    var document = state.document,
        selection = state.selection,
        startBlock = state.startBlock;


    var currentBlock = void 0;
    if (key) {
        currentBlock = document.getDescendant(key);
    } else {
        if (!selection.startKey) return null;
        currentBlock = startBlock;
    }

    // The structure is always code_block -> code_line -> text
    // So the parent of the currentBlock should be the code_block
    var parent = document.getParent(currentBlock.key);
    if (parent && parent.type === opts.containerType) {
        return parent;
    } else {
        return null;
    }
}

module.exports = getCurrentCode;