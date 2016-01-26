'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeSingle(objA, objB) {
  if (!objA) return objB;
  if (!objB) return objA;
  return (0, _reactAddonsUpdate2.default)(objA, { $merge: objB });
}

exports.default = {
  merge: function merge(base) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    for (var i = 0; i < args.length; i++) {
      if (args[i]) {
        base = mergeSingle(base, args[i]);
      }
    }
    return base;
  },
  mergeItem: function mergeItem(obj, key, newValueObject) {
    var command = {};
    command[key] = { $merge: newValueObject };
    return (0, _reactAddonsUpdate2.default)(obj, command);
  },
  push: function push(array, obj) {
    var newObj = Array.isArray(obj) ? obj : [obj];
    return (0, _reactAddonsUpdate2.default)(array, { $push: newObj });
  },
  shift: function shift(array) {
    return (0, _reactAddonsUpdate2.default)(array, { $splice: [[0, 1]] });
  }
};
module.exports = exports['default'];