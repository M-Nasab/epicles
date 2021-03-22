const DEFAULT_OPTIONS = {
    period: 32,
    oscillators: 7,
    initialState: null,
};

export function epicles (options = {}) {
    const mergedOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const {
        period,
        oscillators,
        initialState,
    } = mergedOptions;

    if (period < 2) {
        throw new Error('gear size must be at least 2');
    }

    if (initialState && initialState.length !== period) {
        throw new Error('initial state length must be equal to period');
    }

    let state = initialState ? sanetizeState(initialState) : Array(oscillators).fill(0);
    const subscribers = new Map();

    function sanetizeState(state) {
        return state.map((oscillator) => {
            return oscillator > 0 ? oscillator % period : (period - (Math.abs(oscillator) % period)) % period;
        });
    }

    function getState() {
        return [...state];
    }

    function cyclicIncrement(value) {
        return (value + 1) % period;
    }

    function increment(state, index) {
        const nextState = [...state];
        nextState[index] = cyclicIncrement(nextState[index]);

        if (nextState[index] === 0 && (index < (state.length - 1))) {
            return increment(nextState, index + 1);
        }

        return nextState;
    }

    function tick() {
        state = increment(state, 0);

        const emitState = getState();

        subscribers.forEach((subscriber) => {
            subscriber(emitState);
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