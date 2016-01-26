'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _tabTemplate = require('./tabTemplate');

var _tabTemplate2 = _interopRequireDefault(_tabTemplate);

var _inkBar = require('../ink-bar');

var _inkBar2 = _interopRequireDefault(_inkBar);

var _tabPaginatorButton = require('./tab-paginator-button');

var _tabPaginatorButton2 = _interopRequireDefault(_tabPaginatorButton);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _styleResizable = require('../mixins/style-resizable');

var _styleResizable2 = _interopRequireDefault(_styleResizable);

var _controllable = require('../mixins/controllable');

var _controllable2 = _interopRequireDefault(_controllable);

var _lightRawTheme = require('../styles/raw-themes/light-raw-theme');

var _lightRawTheme2 = _interopRequireDefault(_lightRawTheme);

var _themeManager = require('../styles/theme-manager');

var _themeManager2 = _interopRequireDefault(_themeManager);

var _events = require('../utils/events');

var _events2 = _interopRequireDefault(_events);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Constants = {
  TAB_ITEM_REF_NAME_PREFIX: 'tab-',
  TAB_WRAPPER_REF_NAME: 'tab-wrapper',
  TAB_SCROLL_WRAPPER_REF_NAME: 'tab-scroll-wrapper',
  TAB_CONTAINER_REF_NAME: 'tab-container',
  TAB_PAGINATOR_BUTTON_DEFAULT_WIDTH: 32
};

var Tabs = _react2.default.createClass({
  displayName: 'Tabs',

  propTypes: {
    /**
     * Should be used to pass `Tab` components.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * The css class name of the content's container.
     */
    contentContainerClassName: _react2.default.PropTypes.string,

    /**
     * Override the inline-styles of the content's container.
     */
    contentContainerStyle: _react2.default.PropTypes.object,

    /**
     * Specify initial visible tab index.
     * Initial selected index is set by default to 0.
     * If initialSelectedIndex is set but larger than the total amount of specified tabs,
     * initialSelectedIndex will revert back to default.
     */
    initialSelectedIndex: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the InkBar.
     */
    inkBarStyle: _react2.default.PropTypes.object,

    /**
     * Called when the selected value change.
     */
    onChange: _react2.default.PropTypes.func,

    /**
     * Stretch tab container to occupy the whole width
     */
    stretchTabContainer: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of the tab-labels container.
     */
    tabItemContainerStyle: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of the tab paginator button icon.
     */
    tabPaginatorButtonIconStyle: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of the tab paginator buttons.
     */
    tabPaginatorButtonStyle: _react2.default.PropTypes.object,

    /**
     * Override the default tab template used to wrap the content of each tab element.
     */
    tabTemplate: _react2.default.PropTypes.func,

    /**
     * Override the inline-styles of the tab items container.
     */
    tabWrapperStyle: _react2.default.PropTypes.object,

    /**
     * Makes Tabs controllable and selects the tab whose value prop matches this prop.
     */
    value: _react2.default.PropTypes.any
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default, _controllable2.default, _styleResizable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      initialSelectedIndex: 0,
      stretchTabContainer: true
    };
  },
  getInitialState: function getInitialState() {
    var valueLink = this.getValueLink(this.props);
    var initialIndex = this.props.initialSelectedIndex;
    var selectedIndex = valueLink.value !== undefined ? this._getSelectedIndex(this.props) : initialIndex < this.getTabCount() ? initialIndex : 0;

    return {
      selectedIndex: selectedIndex,
      previousIndex: selectedIndex,
      muiTheme: this.context.muiTheme ? this.context.muiTheme : _themeManager2.default.getMuiTheme(_lightRawTheme2.default),
      disableLeftPaginatorButton: selectedIndex === 0,
      disableRightPaginatorButton: selectedIndex === this.getTabCount() - 1,
      tabInfo: [],
      shouldPaginate: false,
      tabContainerWidth: 0,
      tabWrapperWidth: 0
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    var self = this;
    window.requestAnimationFrame(function () {
      window.setTimeout(self.handleWindowWidthChange, 10);
    });
    _events2.default.on(window, 'resize', this.handleWindowWidthChange);
  },
  componentWillReceiveProps: function componentWillReceiveProps(newProps, nextContext) {
    var valueLink = this.getValueLink(newProps);
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;

    if (valueLink.value !== undefined) {
      this.setState({ selectedIndex: this._getSelectedIndex(newProps) });
    }

    this.setState({ muiTheme: newMuiTheme });
  },
  componentDidUpdate: function componentDidUpdate() {
    this.updateTabWrapperScrollOffset(this.state.tabInfo);
  },
  componentWillUnmount: function componentWillUnmount() {
    _events2.default.off(window, 'resize', this.handleWindowWidthChange);
  },
  getEvenWidth: function getEvenWidth() {
    return parseInt(window.getComputedStyle(_reactDom2.default.findDOMNode(this)).getPropertyValue('width'), 10);
  },
  getTabCount: function getTabCount() {
    return _react2.default.Children.count(this.props.children);
  },
  _getSelectedIndex: function _getSelectedIndex(props) {
    var valueLink = this.getValueLink(props);
    var selectedIndex = -1;

    _react2.default.Children.forEach(props.children, function (tab, index) {
      if (valueLink.value === tab.props.value) {
        selectedIndex = index;
      }
    });

    return selectedIndex;
  },
  _handleTabTouchTap: function _handleTabTouchTap(value, e, tab) {
    var valueLink = this.getValueLink(this.props);
    var tabIndex = tab.props.tabIndex;

    if (valueLink.value && valueLink.value !== value || this.state.selectedIndex !== tabIndex) {
      valueLink.requestChange(value, e, tab);
    }

    this.setState({ selectedIndex: tabIndex });

    if (tab.props.onActive) {
      tab.props.onActive(tab);
    }
  },
  _getSelected: function _getSelected(tab, index) {
    var valueLink = this.getValueLink(this.props);
    return valueLink.value ? valueLink.value === tab.props.value : this.state.selectedIndex === index;
  },
  _getDOMNode: function _getDOMNode(refName) {
    return _reactDom2.default.findDOMNode(this.refs[refName]);
  },
  _getDOMNodeWidth: function _getDOMNodeWidth(refName) {
    return this._getDOMNode(refName).offsetWidth;
  },
  _getSelectedTabWidth: function _getSelectedTabWidth(tabIndex) {
    return this._getDOMNode(Constants.TAB_ITEM_REF_NAME_PREFIX + tabIndex).offsetWidth;
  },
  _getSelectedTabLeftOffset: function _getSelectedTabLeftOffset(tabIndex) {
    var _this = this;

    var tabLeftOffset = 0;
    _react2.default.Children.forEach(this.props.children, function (tab, index) {
      var tempWidth = _this._getDOMNodeWidth(Constants.TAB_ITEM_REF_NAME_PREFIX + index);
      if (index < tabIndex) {
        tabLeftOffset += tempWidth;
      }
    });
    return tabLeftOffset;
  },
  _handleLeftTabPaginatorTap: function _handleLeftTabPaginatorTap() {
    var tabContainerWidth = this._getDOMNodeWidth(Constants.TAB_CONTAINER_REF_NAME);
    this._getDOMNode(Constants.TAB_SCROLL_WRAPPER_REF_NAME).scrollLeft -= tabContainerWidth / this.getTabCount();
    // tabContainerWidth needed due to that element might not have proper width
    this.setState({
      disableLeftPaginatorButton: this._disableLeftPaginatorButton(),
      disableRightPaginatorButton: this._disableRightPaginatorButton(),
      tabContainerWidth: tabContainerWidth
    });
  },
  _handleRightTabPaginatorTap: function _handleRightTabPaginatorTap() {
    var tabContainerWidth = this._getDOMNodeWidth(Constants.TAB_CONTAINER_REF_NAME);
    this._getDOMNode(Constants.TAB_SCROLL_WRAPPER_REF_NAME).scrollLeft += tabContainerWidth / this.getTabCount();
    // tabContainerWidth needed due to that element might not have proper width
    this.setState({
      disableLeftPaginatorButton: this._disableLeftPaginatorButton(),
      disableRightPaginatorButton: this._disableRightPaginatorButton(),
      tabContainerWidth: tabContainerWidth
    });
  },
  _disableLeftPaginatorButton: function _disableLeftPaginatorButton() {
    return this._getDOMNode(Constants.TAB_SCROLL_WRAPPER_REF_NAME).scrollLeft === 0;
  },
  _disableRightPaginatorButton: function _disableRightPaginatorButton() {
    var tabContainerWidth = this._getDOMNodeWidth(Constants.TAB_CONTAINER_REF_NAME);
    var tabWrapperWidth = this._getDOMNodeWidth(Constants.TAB_WRAPPER_REF_NAME);
    return this._getDOMNode(Constants.TAB_SCROLL_WRAPPER_REF_NAME).scrollLeft === tabContainerWidth - tabWrapperWidth;
  },
  handleWindowWidthChange: function handleWindowWidthChange() {
    this.replaceState(this.getNewState());
  },
  getNewState: function getNewState() {
    var _this2 = this;

    var newState = {};
    var tabContainerWidth = this._getDOMNodeWidth(Constants.TAB_CONTAINER_REF_NAME);
    var tabWrapperWidth = this._getDOMNodeWidth(Constants.TAB_WRAPPER_REF_NAME);
    var nextShouldPaginate = tabContainerWidth > tabWrapperWidth;
    var tabInfo = [];
    _react2.default.Children.forEach(this.props.children, function (tab, index) {
      var tabWidth = _this2._getDOMNodeWidth(Constants.TAB_ITEM_REF_NAME_PREFIX + index);
      var leftOffset = nextShouldPaginate ? Constants.TAB_PAGINATOR_BUTTON_DEFAULT_WIDTH : 0;
      if (tabInfo.length > 0) {
        var lastAddedTab = tabInfo[tabInfo.length - 1];
        leftOffset = lastAddedTab.rightOffset;
      }
      tabInfo[index] = {
        width: tabWidth,
        leftOffset: leftOffset,
        rightOffset: leftOffset + tabWidth,
        right: tabWrapperWidth - leftOffset - tabWidth
      };
    });
    this.updateTabWrapperScrollOffset(tabInfo);
    newState.tabContainerWidth = tabContainerWidth;
    newState.tabInfo = tabInfo;
    newState.tabWrapperWidth = tabWrapperWidth;
    newState.shouldPaginate = nextShouldPaginate;
    newState.muiTheme = this.state.muiTheme;
    newState.selectedIndex = this.state.selectedIndex;
    newState.previousIndex = this.state.previousIndex;
    newState.deviceSize = this.getDeviceSize();
    newState.disableLeftPaginatorButton = this._disableLeftPaginatorButton();
    newState.disableRightPaginatorButton = this._disableRightPaginatorButton();
    return newState;
  },
  updateTabWrapperScrollOffset: function updateTabWrapperScrollOffset(tabInfo) {
    // make selected tab visible on either first entry or device orientation change
    var tabContainerWidth = this._getDOMNodeWidth(Constants.TAB_CONTAINER_REF_NAME);
    var tabWrapperWidth = this._getDOMNodeWidth(Constants.TAB_WRAPPER_REF_NAME);
    var nextShouldPaginate = tabContainerWidth > tabWrapperWidth;
    var tabWrapperWidthChange = this.state.tabWrapperWidth !== tabWrapperWidth;
    var paginationChange = this.state.shouldPaginate !== nextShouldPaginate;
    if (paginationChange || tabContainerWidth !== this.state.tabContainerWidth || tabWrapperWidthChange) {
      var nextSelectedTab = tabInfo[this.state.selectedIndex];
      if (nextSelectedTab !== undefined) {
        var tabScrollWrapper = this._getDOMNode(Constants.TAB_SCROLL_WRAPPER_REF_NAME);
        var tabScrollWrapperLeftScroll = tabScrollWrapper.scrollLeft;
        var tabScrollWrapperWidth = tabScrollWrapper.offsetWidth;
        var tabPaginationButtonMargin = nextShouldPaginate ? Constants.TAB_PAGINATOR_BUTTON_DEFAULT_WIDTH : 0;
        var tabVisible = nextSelectedTab.leftOffset - tabPaginationButtonMargin >= tabScrollWrapperLeftScroll && tabScrollWrapperLeftScroll + tabScrollWrapperWidth - nextSelectedTab.rightOffset - tabPaginationButtonMargin >= 0;
        if (!tabVisible) {
          var shouldScrollRight = tabScrollWrapperLeftScroll + tabScrollWrapperWidth - nextSelectedTab.rightOffset - tabPaginationButtonMargin < 0;
          // calculate how much to set tag scroll wrapper's scrollLeft to
          if (shouldScrollRight) {
            tabScrollWrapper.scrollLeft = nextSelectedTab.rightOffset + tabPaginationButtonMargin - tabScrollWrapperWidth;
          } else {
            tabScrollWrapper.scrollLeft = nextSelectedTab.leftOffset - tabPaginationButtonMargin;
          }
        }
      }
    }
  },
  render: function render() {
    var _this3 = this;

    var _props = this.props;
    var children = _props.children;
    var contentContainerClassName = _props.contentContainerClassName;
    var contentContainerStyle = _props.contentContainerStyle;
    var initialSelectedIndex = _props.initialSelectedIndex;
    var inkBarStyle = _props.inkBarStyle;
    var style = _props.style;
    var tabWrapperStyle = _props.tabWrapperStyle;
    var tabPaginatorButtonStyle = _props.tabPaginatorButtonStyle;
    var tabPaginatorButtonIconStyle = _props.tabPaginatorButtonIconStyle;
    var tabItemContainerStyle = _props.tabItemContainerStyle;
    var tabTemplate = _props.tabTemplate;
    var stretchTabContainer = _props.stretchTabContainer;

    var other = _objectWithoutProperties(_props, ['children', 'contentContainerClassName', 'contentContainerStyle', 'initialSelectedIndex', 'inkBarStyle', 'style', 'tabWrapperStyle', 'tabPaginatorButtonStyle', 'tabPaginatorButtonIconStyle', 'tabItemContainerStyle', 'tabTemplate', 'stretchTabContainer']);

    // stretch tabs if stretchTabContainer is true and if device screen size is large

    var shouldStretch = stretchTabContainer && this.isDeviceSize(_styleResizable2.default.statics.Sizes.LARGE) && !this.state.shouldPaginate;

    var themeVariables = this.state.muiTheme.tabs;
    var styles = {
      tabWrapper: {
        position: 'relative',
        minWidth: '100%',
        backgroundColor: themeVariables.backgroundColor
      },
      tabScrollWrapper: {
        position: 'relative',
        minWidth: '100%',
        overflowY: 'hidden',
        overflowX: 'hidden'
      },
      tabItemContainer: {
        margin: 0,
        height: 48,
        padding: this.state.shouldPaginate ? '0 ' + Constants.TAB_PAGINATOR_BUTTON_DEFAULT_WIDTH + 'px' : 0,
        backgroundColor: themeVariables.backgroundColor,
        whiteSpace: 'nowrap',
        display: 'table',
        width: shouldStretch ? '100%' : 0
      }
    };

    // calculate selected tab's width and offset, used to animate inl-bar
    var width = 0;
    var left = 0;
    var right = 0;
    if (shouldStretch) {
      width = this.state.tabWrapperWidth / this.getTabCount();
      left = width * this.state.selectedIndex;
      right = this.state.tabWrapperWidth - width - left;
    } else if (this.state.tabInfo.length > 0) {
      width = this.state.tabInfo[this.state.selectedIndex].width;
      left = this.state.tabInfo[this.state.selectedIndex].leftOffset;
      right = this.state.tabInfo[this.state.selectedIndex].right;
    }

    var valueLink = this.getValueLink(this.props);
    var tabValue = valueLink.value;
    var tabContent = [];

    var tabs = _react2.default.Children.map(children, function (tab, index) {
      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(tab.type && tab.type.displayName === 'Tab', 'Tabs only accepts Tab Components as children.\n        Found ' + (tab.type.displayName || tab.type) + ' as child number ' + (index + 1) + ' of Tabs') : undefined;

      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(!tabValue || tab.props.value !== undefined, 'Tabs value prop has been passed, but Tab ' + index + '\n        does not have a value prop. Needs value if Tabs is going\n        to be a controlled component.') : undefined;

      tabContent.push(tab.props.children ? _react2.default.createElement(tabTemplate || _tabTemplate2.default, {
        key: index,
        selected: _this3._getSelected(tab, index)
      }, tab.props.children) : undefined);

      return _react2.default.cloneElement(tab, {
        key: index,
        ref: Constants.TAB_ITEM_REF_NAME_PREFIX + index,
        selected: _this3._getSelected(tab, index),
        tabIndex: index,
        width: shouldStretch ? width : 0,
        onTouchTap: _this3._handleTabTouchTap
      });
    });

    var inkBar = this.state.selectedIndex !== -1 ? _react2.default.createElement(_inkBar2.default, {
      left: left,
      right: right,
      moveBarLeft: this.state.selectedIndex < this.state.previousIndex,
      style: inkBarStyle
    }) : null;

    var inkBarContainerWidth = tabItemContainerStyle ? tabItemContainerStyle.width : '100%';

    return _react2.default.createElement(
      'div',
      _extends({}, other, {
        style: this.prepareStyles(style) }),
      _react2.default.createElement(
        'div',
        {
          ref: Constants.TAB_WRAPPER_REF_NAME,
          style: this.prepareStyles(styles.tabWrapper, tabWrapperStyle) },
        _react2.default.createElement(_tabPaginatorButton2.default, { display: this.state.shouldPaginate,
          isLeftPaginatorButton: true,
          style: tabPaginatorButtonStyle,
          iconStyle: tabPaginatorButtonIconStyle,
          disabled: this.state.disableLeftPaginatorButton,
          onTouchTap: this._handleLeftTabPaginatorTap }),
        _react2.default.createElement(_tabPaginatorButton2.default, { display: this.state.shouldPaginate,
          isLeftPaginatorButton: false,
          style: tabPaginatorButtonStyle,
          iconStyle: tabPaginatorButtonIconStyle,
          disabled: this.state.disableRightPaginatorButton,
          onTouchTap: this._handleRightTabPaginatorTap }),
        _react2.default.createElement(
          'div',
          {
            ref: Constants.TAB_SCROLL_WRAPPER_REF_NAME,
            style: styles.tabScrollWrapper },
          _react2.default.createElement(
            'div',
            {
              ref: Constants.TAB_CONTAINER_REF_NAME,
              style: this.prepareStyles(styles.tabItemContainer, tabItemContainerStyle) },
            tabs
          ),
          _react2.default.createElement(
            'div',
            { style: { width: inkBarContainerWidth } },
            inkBar
          )
        )
      ),
      _react2.default.createElement(
        'div',
        {
          style: this.prepareStyles(contentContainerStyle),
          className: contentContainerClassName },
        tabContent
      )
    );
  }
});

exports.default = Tabs;
module.exports = exports['default'];