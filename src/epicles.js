import { createGear } from "./gear";

const DEFAULT_OPTIONS = {
    size: 32,
    initialState: null,
};

export function epicles (options = {}) {
    const mergedOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const {
        size,
        initialState,
    } = mergedOptions;

    if (size < 2) {
        throw new Error('gear size must be at least 2');
    }

    const gears = [];
    const subscribers = new Map();

    for (let i = 0; i < size; i++) {
        const cursor = (initialState && initialState[i]) || 0;
        const gear = createGear(size, cursor);
        const prevGear = i > 0 ? gears[i - 1] : null;

        if (prevGear) {
            prevGear.subscribe((cursor) => {
                if (cursor === 0) {
                    gear.tick();
                }
            });
        }

        gears.push(gear);
    }

    function getState() {
        return gears.map((gear) => gear.getState());
    }

    function tick() {
        if (gears && gears[0]) {
            gears[0].tick();

            const state = getState();

            subscribers.forEach((subscriber) => {
                subscriber(state);
            });
        }
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