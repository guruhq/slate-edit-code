import simulateKey from '../simulate-key';

export default function(plugin, change) {
    const { value } = change;
    const block = value.document.findDescendant(
        node => node.type == 'code_block'
    );

    change.collapseToStartOf(block).moveOffsetsTo(0);

<<<<<<< HEAD
    return plugin.onKeyDown(
        {
            key: 'Tab',
            preventDefault() {},
            stopPropagation() {}
        },
        change
    );
};
=======
    return plugin.onKeyDown(simulateKey('tab'), change, {});
}
>>>>>>> 9f003001e09394a05e6d3c3f71222dd85d12e551
