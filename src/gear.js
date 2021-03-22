const DEFAULT_SIZE = 32;

export function createGear (size = DEFAULT_SIZE, cursor = 0) {
    const _size = size || DEFAULT_SIZE;
    let _cursor = cursor > 0 ? cursor % _size : (_size - (Math.abs(cursor) % _size)) % _size;

    if (_size < 2) {
        throw new Error('gear size must be at least 2');
    }

    const subscribers = new Map();

    function tick () {
        _cursor = (_cursor + 1) % _size;

        subscribers.forEach((subscriber) => {
            subscriber(_cursor);
        });
    }

    function subscribe (callback) {
        const key = Symbol();

        subscribers.set(key, callback);

        const unsubscribe = function () {
            subscribers.delete(key);
        };

        return unsubscribe;
    }

    return {
        tick,
        subscribe,
    };
}