import simulateKey from '../simulate-key';

<<<<<<< HEAD
module.exports = function(plugin, change) {
    return plugin.onKeyDown(
        {
            key: 'Tab',
            shiftKey: true,
            preventDefault() {},
            stopPropagation() {}
        },
        change
    );
};
=======
export default function(plugin, change) {
    return plugin.onKeyDown(simulateKey('shift+tab'), change, {});
}
>>>>>>> 9f003001e09394a05e6d3c3f71222dd85d12e551
