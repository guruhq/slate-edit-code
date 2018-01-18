export default function(plugin, change) {
    return plugin.onPaste(
        {
            dataTransfer: {
                items: ['text'],
                getData: () => 'Yes\nNo\nQuestion?'
            },
            preventDefault() {},
            stopPropagation() {},
            clipboardData: {
                // Simulate a text data from IE
                // https://github.com/ianstormtaylor/slate/blob/master/packages/slate-react/src/utils/get-event-transfer.js#L161
                getData: () => 'Yes\nNo\nQuestion?'
            }
        },
        change,
        {}
    );
}
