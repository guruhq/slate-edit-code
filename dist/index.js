'use strict';

var _require = require('slate'),
    Document = _require.Document;

var _require2 = require('slate-react'),
    getEventTransfer = _require2.getEventTransfer;

var onEnter = require('./onEnter');
var onModEnter = require('./onModEnter');
var onTab = require('./onTab');
var onShiftTab = require('./onShiftTab');
var onBackspace = require('./onBackspace');
var onSelectAll = require('./onSelectAll');
var makeSchema = require('./makeSchema');
var getCurrentCode = require('./getCurrentCode');
var Options = require('./options');
var deserializeCode = require('./deserializeCode');
var isInCodeBlock = require('./isInCodeBlock');

var wrapCodeBlockByKey = require('./changes/wrapCodeBlockByKey');
var unwrapCodeBlockByKey = require('./changes/unwrapCodeBlockByKey');
var wrapCodeBlock = require('./changes/wrapCodeBlock');
var unwrapCodeBlock = require('./changes/unwrapCodeBlock');
var toggleCodeBlock = require('./changes/toggleCodeBlock');

var KEY_ENTER = 'Enter';
var KEY_TAB = 'Tab';
var KEY_BACKSPACE = 'Backspace';

/**
 * A Slate plugin to handle keyboard events in code blocks.
 * @param {Options | Object} opts
 * @return {Object}
 */

function EditCode(opts) {
    opts = new Options(opts);

    /**
     * User is pressing a key in the editor
     */
    function _onKeyDown(event, change) {
        var state = change.state;

        var currentCode = getCurrentCode(opts, state);

        // Inside code ?
        if (!currentCode) {
            return;
        }

        // Add opts in the argument list
        var args = [event, change, opts];

        // Select all the code in the block (Mod+a)
        if (event.key === 'a' && event.metaKey && opts.selectAll) {
            return onSelectAll.apply(undefined, args);
        }

        // User is pressing Shift+Tab
        else if (event.key === KEY_TAB && event.shiftKey) {
                return onShiftTab.apply(undefined, args);
            }

            // User is pressing Tab
            else if (event.key == KEY_TAB) {
                    return onTab.apply(undefined, args);
                }

                // User is pressing Mod+Enter
                else if (event.key == KEY_ENTER && event.metaKey && opts.exitBlockType) {
                        return onModEnter.apply(undefined, args);
                    }

                    // User is pressing Enter
                    else if (event.key == KEY_ENTER) {
                            return onEnter.apply(undefined, args);
                        }

                        // User is pressing Backspace
                        else if (event.key == KEY_BACKSPACE) {
                                return onBackspace.apply(undefined, args);
                            }
    }

    /**
     * User is pasting content, insert it as text
     */
    function onPaste(event, change) {
        var state = change.state;

        var currentCode = getCurrentCode(opts, state);
        var EventTransfer = getEventTransfer(event);

        // Only handle paste when selection is completely a code block
        var endBlock = state.endBlock;

        if (!currentCode || !currentCode.hasDescendant(endBlock.key)) {
            return;
        }

        // Convert to text if needed
        var text = void 0;
        if (EventTransfer.type === 'fragment') {
            text = EventTransfer.fragment.getTexts().map(function (t) {
                return t.text;
            }).join('\n');
        } else {
            text = EventTransfer.text;
        }

        // Convert the text to code lines
        var lines = deserializeCode(opts, text).nodes;

        var fragment = Document.create({ nodes: lines });

        return change.insertFragment(fragment);
    }

    var schema = makeSchema(opts);

    return {
        onKeyDown: _onKeyDown,
        onPaste: onPaste,

        schema: schema,

        changes: {
            unwrapCodeBlockByKey: unwrapCodeBlockByKey.bind(null, opts),
            wrapCodeBlockByKey: wrapCodeBlockByKey.bind(null, opts),
            wrapCodeBlock: wrapCodeBlock.bind(null, opts),
            unwrapCodeBlock: unwrapCodeBlock.bind(null, opts),
            toggleCodeBlock: toggleCodeBlock.bind(null, opts)
        },

        utils: {
            isInCodeBlock: isInCodeBlock.bind(null, opts),
            deserializeCode: deserializeCode.bind(null, opts)
        }
    };
}

module.exports = EditCode;