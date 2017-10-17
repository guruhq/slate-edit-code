"use strict";

/**
 * Dedent all lines in selection
 * @param  {Change} change
 * @param  {String} indent To remove
 * @return {Change}
 */
function dedentLines(opts, change, indent) {
    var state = change.state;
    var document = state.document,
        selection = state.selection;

    var lines = document.getBlocksAtRange(selection).filter(function (node) {
        return node.type === opts.lineType;
    });

    return lines.reduce(function (c, line) {
        // Remove a level of indent from the start of line
        var text = line.nodes.first();
        var lengthToRemove = text.characters.takeWhile(function (char, index) {
            return indent.charAt(index) === char.text;
        }).count();
        return c.removeTextByKey(text.key, 0, lengthToRemove);
    }, change);
}

module.exports = dedentLines;