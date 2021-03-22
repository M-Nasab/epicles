var Epicles = (function (exports) {
    'use strict';

    var DEFAULT_SIZE = 32;
    function createGear() {
      var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_SIZE;
      var cursor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var _size = size || DEFAULT_SIZE;

      var _cursor = cursor > 0 ? cursor % _size : (_size - Math.abs(cursor) % _size) % _size;

      if (_size < 2) {
        throw new Error('gear size must be at least 2');
      }

      var subscribers = new Map();

      function tick() {
        _cursor = (_cursor + 1) % _size;
        subscribers.forEach(function (subscriber) {
          subscriber(_cursor);
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

    exports.createGear = createGear;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
