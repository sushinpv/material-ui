'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _iconButton = require('../icon-button');

var _iconButton2 = _interopRequireDefault(_iconButton);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _lightRawTheme = require('../styles/raw-themes/light-raw-theme');

var _lightRawTheme2 = _interopRequireDefault(_lightRawTheme);

var _themeManager = require('../styles/theme-manager');

var _themeManager2 = _interopRequireDefault(_themeManager);

var _colorManipulator = require('../utils/color-manipulator');

var _colorManipulator2 = _interopRequireDefault(_colorManipulator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TabPaginatorButton = _react2.default.createClass({
  displayName: 'TabPaginatorButton',

  propTypes: {
    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * Disable ripple effect on touch focus, true by default
     */
    disableTouchRipple: _react2.default.PropTypes.bool,

    /**
     * Should button be disabled
     */
    disabled: _react2.default.PropTypes.bool.isRequired,

    /**
     * Should button be displayed
     */
    display: _react2.default.PropTypes.bool.isRequired,

    /**
     * Override the inline-styles of the icon element.
     */
    iconStyle: _react2.default.PropTypes.object,

    /**
     * True if this component should be left button
     */
    isLeftPaginatorButton: _react2.default.PropTypes.bool.isRequired,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      disableTouchRipple: true
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : _themeManager2.default.getMuiTheme(_lightRawTheme2.default)
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },
  render: function render() {
    var _props = this.props;
    var disabled = _props.disabled;
    var isLeftPaginatorButton = _props.isLeftPaginatorButton;
    var display = _props.display;
    var style = _props.style;
    var iconStyle = _props.iconStyle;

    var other = _objectWithoutProperties(_props, ['disabled', 'isLeftPaginatorButton', 'display', 'style', 'iconStyle']);

    // tab paginator button width comes from google's design guide
    // https://www.google.com/design/spec/components/tabs.html#tabs-specs

    var themeVariables = this.state.muiTheme.tabs;
    var styles = {
      buttonStyle: {
        display: display ? '' : 'none',
        position: 'absolute',
        top: 0,
        zIndex: 1,
        width: 32,
        height: '100%',
        padding: 0,
        backgroundColor: themeVariables.backgroundColor
      },
      iconStyle: {
        lineHeight: iconStyle && iconStyle.lineHeight ? iconStyle.lineHeight : '48px',
        color: iconStyle && iconStyle.color ? disabled ? _colorManipulator2.default.fade(iconStyle.color, 0.3) : iconStyle.color : disabled ? this.state.muiTheme.tabs.textColor : this.state.muiTheme.tabs.selectedTextColor
      }
    };

    if (isLeftPaginatorButton) {
      styles.buttonStyle.left = 0;
    } else {
      styles.buttonStyle.right = 0;
    }

    return _react2.default.createElement(
      _iconButton2.default,
      _extends({}, other, {
        disableTouchRipple: this.props.disableTouchRipple,
        disabled: disabled,
        iconClassName: 'material-icons',
        iconStyle: this.mergeStyles(iconStyle, styles.iconStyle),
        style: this.mergeStyles(styles.buttonStyle, style) }),
      isLeftPaginatorButton ? 'keyboard_arrow_left' : 'keyboard_arrow_right'
    );
  }
});

exports.default = TabPaginatorButton;
module.exports = exports['default'];