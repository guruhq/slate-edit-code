'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record;

var DEFAULTS = {
    // Type of the code containers
    containerType: 'code_block',
    // Type of the code lines
    lineType: 'code_line',

    // Mod+Enter will exit the code container, into the given block type.
    // Backspace at start of empty code container, will turn it into the given block type.
    exitBlockType: 'paragraph',
    // Should the plugin handle the select all inside a code container
    selectAll: true,
    // Allow marks inside code blocks
    allowMarks: false,
    // Custom exit handler
    // exitBlockType option is useless if onExit is provided
    onExit: function onExit(change, options) {
        // Exit the code block
        change.insertBlock({ type: options.exitBlockType });

        var inserted = change.state.startBlock;
        return change.unwrapNodeByKey(inserted.key);
    }
};

/**
 * The plugin options
 */

var Options = function (_ref) {
    _inherits(Options, _ref);

    function Options() {
        _classCallCheck(this, Options);

        return _possibleConstructorReturn(this, (Options.__proto__ || Object.getPrototypeOf(Options)).apply(this, arguments));
    }

    return Options;
}(new Record(DEFAULTS));

module.exports = Options;