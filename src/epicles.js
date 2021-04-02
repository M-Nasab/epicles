const DEFAULT_OPTIONS = {
    steps: 32,
    steppers: 7,
    initialState: null,
};

export function epicles (options = {}) {
    const mergedOptions = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const {
        steps,
        steppers,
        initialState,
    } = mergedOptions;

    if (steps < 2) {
        throw new Error('step size must be at least 2');
    }

    if (initialState && initialState.length !== steps) {
        throw new Error('initial state length must be equal to step size');
    }

    let state = initialState ? sanetizeState(initialState) : Array(steppers).fill(0);
    let subscribers = [];

    function sanetizeState(state) {
        return state.map((stepper) => {
            return stepper > 0 ? stepper % steps : (steps - (Math.abs(stepper) % steps)) % steps;
        });
    }

    function cyclicIncrement(value) {
        return (value + 1) % steps;
    }

    function emitTickEvent(event) {
        subscribers.forEach((subscriber) => {
            subscriber(event);
        });
    }

    function increment(state, index, tickEvents = []) {
        const nextState = [...state];
        nextState[index] = cyclicIncrement(nextState[index]);

        tickEvents.push({
            step: nextState[index],
            stepper: index,
        });

        if (nextState[index] === 0 && (index < (state.length - 1))) {
            return increment(nextState, index + 1, tickEvents);
        }

        return {
            nextState,
            tickEvents,
        };
    }

    function tick() {
        const { nextState, tickEvents } = increment(state, 0, []);

        state = nextState;

        emitTickEvent(tickEvents);
    }

    function subscribe (callback) {
        if (subscribers.find(callback)) return;

        subscribers.push(callback);

        const unsubscribe = function () {
            subscribers = subscribers.filter((subscriber) => subscriber !== callback);
        };

        return unsubscribe;
    }

    function getState() {
        return state.map((value, index) => {
            return {
                stepper: index,
                step: value,
            };
        });
    }

    return {
        tick,
        subscribe,
        getState,
    };
}