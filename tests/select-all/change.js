import simulateKey from '../simulate-key';

<<<<<<< HEAD
module.exports = function(plugin, change) {
    return plugin.onKeyDown(
        {
            key: 'a',
            metaKey: true,
            preventDefault() {},
            stopPropagation() {}
        },
        change
    );
};
=======
export default function(plugin, change) {
    return plugin.onKeyDown(simulateKey('mod+a'), change, {});
}
>>>>>>> 9f003001e09394a05e6d3c3f71222dd85d12e551
