"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slate = require("slate");

var _slateSchemaViolations = require("slate-schema-violations");

var _immutable = require("immutable");

var _utils = require("../utils");

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
      nodes: [{ objects: ["text"], min: 1 }],
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
    }).join("");
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


  if (node.object === "inline" || node.object === "block") {
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

  // idea:
  // if parent is a table cell, unwrap code_block_line
  // wrap it in a code_snippet instead

  var parentIsTableCell = parent.type === "TABLE_CELL";
  if (parentIsTableCell) {
    // console.log("context", context); // context.node is the CODE_BLOCK_LINE

    // 1:
    // if we just unwrap, then the CODE_BLOCK_LINE is within a TABLE_ROW which is also invalid
    // const changeToUnwrap = change.unwrapNodeByKey(context.node.key, {
    //   normalize: false,
    // });

    // 2:
    // Trying to extract text taken from context.node.text, then wrap that in a Mark,
    // And then insert into the TABLE_CELL, then remove the original node via change.removeNodeByKey(context.node.key)
    // This is not complete or working:
    // const textToPaste = context.node.text;
    // const codeSnippetToWrap = Mark.create({
    //   type: "CODE_SNIPPET",
    //   nodes: [Text.create(textToPaste)],
    // });
    // change.insertTextByKey(
    //   parent.key,
    //   change.value.selection.focusOffset,
    //   textToInsert,
    //   [codeSnippetToWrap]
    // );

    // with either of these enabled, we strip the content code_block_line
    // which at least renders the rest of the content:
    return null;
    // OR
    // return change.removeNodeByKey(context.node.key);
  }

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