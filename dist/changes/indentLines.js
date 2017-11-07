"use strict";

/**
 * Indent all lines in selection
 * @param  {Change} change
 * @param  {String} indent
 * @return {Change}
 */
function indentLines(opts, change, indent) {
    var state = change.state;
    var document = state.document,
        selection = state.selection;

    var lines = document.getBlocksAtRange(selection).filter(function (node) {
        return node.type === opts.lineType;
    });

    return lines.reduce(function (c, line) {
        // Insert an indent at start of line
        var text = line.nodes.first();
        return c.insertTextByKey(text.key, 0, indent);
    }, change);
}

module.exports = indentLines;