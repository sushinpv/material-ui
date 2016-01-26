'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('../utils/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Widths = {
  LARGE_DEVICE_MINIMUM: 992,
  MEDIUM_DEVICE_MINIMUM: 786
};

var Sizes = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3
};

exports.default = {

  statics: {
    Sizes: Sizes
  },

  getInitialState: function getInitialState() {
    return {
      deviceSize: Sizes.SMALL
    };
  },
  componentDidMount: function componentDidMount() {
    this._updateDeviceSize();
    if (!this.manuallyBindResize) this._bindResize();
  },
  componentWillUnmount: function componentWillUnmount() {
    this._unbindResize();
  },
  isDeviceSize: function isDeviceSize(desiredSize) {
    return this.state.deviceSize >= desiredSize;
  },
  getDeviceSize: function getDeviceSize() {
    var width = window.innerWidth;
    if (width >= Widths.LARGE_DEVICE_MINIMUM) return Sizes.LARGE;
    if (width >= Widths.MEDIUM_DEVICE_MINIMUM) return Sizes.MEDIUM;
    return Sizes.SMALL; // width < 768
  },
  _updateDeviceSize: function _updateDeviceSize() {
    this.setState({ deviceSize: this.getDeviceSize() });
  },
  _bindResize: function _bindResize() {
    _events2.default.on(window, 'resize', this._updateDeviceSize);
  },
  _unbindResize: function _unbindResize() {
    _events2.default.off(window, 'resize', this._updateDeviceSize);
  }
};
module.exports = exports['default'];