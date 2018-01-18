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
<<<<<<< HEAD
        change
=======
        change,
        {}
>>>>>>> 9f003001e09394a05e6d3c3f71222dd85d12e551
    );
}
