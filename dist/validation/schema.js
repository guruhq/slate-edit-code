'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

var _slateSchemaViolations = require('slate-schema-violations');

var _immutable = require('immutable');

var _utils = require('../utils');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Create a schema definition with rules to normalize code blocks
 */
function schema(opts) {
    var _blocks;

    var baseSchema = {
        blocks: (_blocks = {}, _defineProperty(_blocks, opts.containerType, {
            nodes: [{ types: [opts.lineType] }],
            normalize: function normalize(change, violation, context) {
                switch (violation) {
                    case _slateSchemaViolations.CHILD_INVALID:
                    case _slateSchemaViolations.CHILD_TYPE_INVALID:
                        return onlyLine(opts, change, context);
                    default:
                        return undefined;
                }
            }
        }), _defineProperty(_blocks, opts.lineType, {
            nodes: [{ objects: ['text'], min: 1 }],
            parent: { types: [opts.containerType] },
            normalize: function normalize(change, violation, context) {
                switch (violation) {
                    // This constant does not exist yet in
                    // official Slate, but exists in GitBook's
                    // fork. Until the PR is merged, we accept both
                    // https://github.com/ianstormtaylor/slate/pull/1842
                    case _slateSchemaViolations.PARENT_INVALID:
                    case _slateSchemaViolations.PARENT_TYPE_INVALID:
                        return noOrphanLine(opts, change, context);
                    case _slateSchemaViolations.CHILD_INVALID:
                    case _slateSchemaViolations.CHILD_OBJECT_INVALID:
                        return onlyTextInCode(opts, change, context);
                    default:
                        return undefined;
                }
            }
        }), _blocks)
    };

    if (!opts.allowMarks) {
        baseSchema.blocks[opts.lineType].marks = [];
    }

    return baseSchema;
}

/**
 * Return a list of group of nodes matching the given filter.
 */
function getSuccessiveNodes(nodes, match) {
    var nonLines = nodes.takeUntil(match);
    var afterNonLines = nodes.skip(nonLines.size);
    if (afterNonLines.isEmpty()) {
        return (0, _immutable.List)();
    }

    var firstGroup = afterNonLines.takeWhile(match);
    var restOfNodes = afterNonLines.skip(firstGroup.size);

    return (0, _immutable.List)([firstGroup]).concat(getSuccessiveNodes(restOfNodes, match));
}

/**
 * A rule that ensure code blocks only contain lines of code, and no marks
 */
function onlyLine(opts, change, context) {
    var isNotLine = function isNotLine(n) {
        return n.type !== opts.lineType;
    };
    var nonLineGroups = getSuccessiveNodes(context.node.nodes, isNotLine);

    nonLineGroups.filter(function (group) {
        return !group.isEmpty();
    }).forEach(function (nonLineGroup) {
        // Convert text to code lines
        var text = nonLineGroup.map(function (n) {
            return n.text;
        }).join('');
        var codeLines = (0, _utils.deserializeCode)(opts, text).nodes;

        // Insert them in place of the invalid node
        var first = nonLineGroup.first();
        var parent = change.value.document.getParent(first.key);
        var invalidNodeIndex = parent.nodes.indexOf(first);

        codeLines.forEach(function (codeLine, index) {
            change.insertNodeByKey(parent.key, invalidNodeIndex + index, codeLine, {
                normalize: false
            });
        });

        // Remove the block
        nonLineGroup.forEach(function (n) {
            return change.removeNodeByKey(n.key, { normalize: false });
        });
    });

    return change;
}

/**
 * A rule that ensure code lines only contain text
 */
function onlyTextInCode(opts, change, context) {
    var node = context.node;


    if (node.object === 'inline' || node.object === 'block') {
        node.nodes.forEach(function (child) {
            change.unwrapNodeByKey(child.key, { normalize: false });
        });

        return change;
    }

    return undefined;
}

/**
 * A rule that ensure code lines are always children
 * of a code block.
 */
function noOrphanLine(opts, change, context) {
    var parent = context.parent;


    var isLine = function isLine(n) {
        return n.type === opts.lineType;
    };

    var linesGroup = getSuccessiveNodes(parent.nodes, isLine);

    linesGroup.forEach(function (group) {
        var container = _slate.Block.create({ type: opts.containerType, nodes: [] });
        var firstLineIndex = parent.nodes.indexOf(group.first());

        change.insertNodeByKey(parent.key, firstLineIndex, container, {
            normalize: false
        });

        group.forEach(function (line, index) {
            return change.moveNodeByKey(line.key, container.key, index, {
                normalize: false
            });
        });
    });
}

exports.default = schema;