(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Epicles = {}));
}(this, (function (exports) { 'use strict';

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
    steps: 32,
    steppers: 7,
    initialState: null
  };
  function epicles() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var mergedOptions = _objectSpread2(_objectSpread2({}, DEFAULT_OPTIONS), options);

    var steps = mergedOptions.steps,
        steppers = mergedOptions.steppers,
        initialState = mergedOptions.initialState;

    if (steps < 2) {
      throw new Error('step size must be at least 2');
    }

    if (initialState && initialState.length !== steps) {
      throw new Error('initial state length must be equal to step size');
    }

    var state = initialState ? sanetizeState(initialState) : Array(steppers).fill(0);
    var subscribers = [];

    function sanetizeState(state) {
      return state.map(function (stepper) {
        return stepper > 0 ? stepper % steps : (steps - Math.abs(stepper) % steps) % steps;
      });
    }

    function cyclicIncrement(value) {
      return (value + 1) % steps;
    }

    function emitTickEvent(event) {
      subscribers.forEach(function (subscriber) {
        subscriber(event);
      });
    }

    function increment(state, index) {
      var tickEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      var nextState = _toConsumableArray(state);

      nextState[index] = cyclicIncrement(nextState[index]);
      tickEvents.push({
        step: nextState[index],
        stepper: index
      });

      if (nextState[index] === 0 && index < state.length - 1) {
        return increment(nextState, index + 1, tickEvents);
      }

      return {
        nextState: nextState,
        tickEvents: tickEvents
      };
    }

    function tick() {
      var _increment = increment(state, 0, []),
          nextState = _increment.nextState,
          tickEvents = _increment.tickEvents;

      state = nextState;
      emitTickEvent(tickEvents);
    }

    function subscribe(callback) {
      if (subscribers.find(callback)) return;
      subscribers.push(callback);

      var unsubscribe = function unsubscribe() {
        subscribers = subscribers.filter(function (subscriber) {
          return subscriber !== callback;
        });
      };

      return unsubscribe;
    }

    return {
      tick: tick,
      subscribe: subscribe
    };
  }

  exports.epicles = epicles;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
