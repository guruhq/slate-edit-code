// @flow
import { type Value, type Block } from 'slate';

import type Options from '../options';

/**
 * Return the current code block, from current selection or from a node key.
 */
<<<<<<< HEAD:lib/getCurrentCode.js
function getCurrentCode(opts, state, key) {
    const { document, selection, startBlock } = state;

    let currentBlock;
    if (key) {
        currentBlock = document.getDescendant(key);
    } else {
        if (!selection.startKey) return null;
        currentBlock = startBlock;
=======
function getCurrentCode(opts: Options, value: Value, key?: string): ?Block {
    const { document } = value;

    let currentBlock;
    if (key) {
        currentBlock = value.document.getDescendant(key);
    } else {
        if (!value.selection.startKey) return null;
        currentBlock = value.startBlock;
>>>>>>> 9f003001e09394a05e6d3c3f71222dd85d12e551:lib/utils/getCurrentCode.js
    }

    // The structure is always code_block -> code_line -> text
    // So the parent of the currentBlock should be the code_block
    const parent = document.getParent(currentBlock.key);
    if (parent && parent.type === opts.containerType) {
        return parent;
    }
    return null;
}

export default getCurrentCode;
