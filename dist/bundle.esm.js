function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var DEFAULT_OPTIONS = {
  period: 32,
  oscillators: 7,
  initialState: null
};
function epicles() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var mergedOptions = _objectSpread2(_objectSpread2({}, DEFAULT_OPTIONS), options);

  var period = mergedOptions.period,
      oscillators = mergedOptions.oscillators,
      initialState = mergedOptions.initialState;

  if (period < 2) {
    throw new Error('gear size must be at least 2');
  }

  if (initialState && initialState.length !== period) {
    throw new Error('initial state length must be equal to period');
  }

  var state = initialState ? sanetizeState(initialState) : Array(oscillators).fill(0);
  var subscribers = new Map();

  function sanetizeState(state) {
    return state.map(function (oscillator) {
      return oscillator > 0 ? oscillator % period : (period - Math.abs(oscillator) % period) % period;
    });
  }

  function getState() {
    return _toConsumableArray(state);
  }

  function cyclicIncrement(value) {
    return (value + 1) % period;
  }

  function increment(state, index) {
    var nextState = _toConsumableArray(state);

    nextState[index] = cyclicIncrement(nextState[index]);

    if (nextState[index] === 0 && index < state.length - 1) {
      return increment(nextState, index + 1);
    }

    return nextState;
  }

  function tick() {
    state = increment(state, 0);
    var emitState = getState();
    subscribers.forEach(function (subscriber) {
      subscriber(emitState);
    });
  }

  function subscribe(callback) {
    var key = Symbol();
    subscribers.set(key, callback);

    var unsubscribe = function unsubscribe() {
      subscribers["delete"](key);
    };

    return unsubscribe;
  }

  return {
    tick: tick,
    subscribe: subscribe
  };
}

export { epicles };
