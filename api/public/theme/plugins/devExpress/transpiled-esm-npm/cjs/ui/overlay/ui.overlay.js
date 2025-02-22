"use strict";

exports.default = void 0;

var _size = require("../../core/utils/size");

var _fx = _interopRequireDefault(require("../../animation/fx"));

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _element = require("../../core/element");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _empty_template = require("../../core/templates/empty_template");

var _array = require("../../core/utils/array");

var _common = require("../../core/utils/common");

var _deferred = require("../../core/utils/deferred");

var _dom = require("../../core/utils/dom");

var _extend = require("../../core/utils/extend");

var _iterator = require("../../core/utils/iterator");

var _ready_callbacks = _interopRequireDefault(require("../../core/utils/ready_callbacks"));

var _type = require("../../core/utils/type");

var _view_port = require("../../core/utils/view_port");

var _window = require("../../core/utils/window");

var _errors = _interopRequireDefault(require("../../core/errors"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _drag = require("../../events/drag");

var _pointer = _interopRequireDefault(require("../../events/pointer"));

var _short = require("../../events/short");

var _index = require("../../events/utils/index");

var _visibility_change = require("../../events/visibility_change");

var _hide_callback = require("../../mobile/hide_callback");

var _resizable = _interopRequireDefault(require("../resizable"));

var _overlay_drag = _interopRequireDefault(require("./overlay_drag"));

var _selectors = require("../widget/selectors");

var _swatch_container = _interopRequireDefault(require("../widget/swatch_container"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _browser = _interopRequireDefault(require("../../core/utils/browser"));

var zIndexPool = _interopRequireWildcard(require("./z_index"));

var _resize_observer = _interopRequireDefault(require("../../core/resize_observer"));

var _overlay_position_controller = require("./overlay_position_controller");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ready = _ready_callbacks.default.add;
var window = (0, _window.getWindow)();
var viewPortChanged = _view_port.changeCallback;
var OVERLAY_CLASS = 'dx-overlay';
var OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
var OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
var OVERLAY_SHADER_CLASS = 'dx-overlay-shader';
var OVERLAY_MODAL_CLASS = 'dx-overlay-modal';
var INNER_OVERLAY_CLASS = 'dx-inner-overlay';
var INVISIBLE_STATE_CLASS = 'dx-state-invisible';
var ANONYMOUS_TEMPLATE_NAME = 'content';
var RTL_DIRECTION_CLASS = 'dx-rtl';
var ACTIONS = ['onShowing', 'onShown', 'onHiding', 'onHidden', 'onPositioned', 'onResizeStart', 'onResize', 'onResizeEnd', 'onVisualPositionChanged'];
var OVERLAY_STACK = [];
var DISABLED_STATE_CLASS = 'dx-state-disabled';
var PREVENT_SAFARI_SCROLLING_CLASS = 'dx-prevent-safari-scrolling';
var TAB_KEY = 'tab';
ready(function () {
  _events_engine.default.subscribeGlobal(_dom_adapter.default.getDocument(), _pointer.default.down, function (e) {
    for (var i = OVERLAY_STACK.length - 1; i >= 0; i--) {
      if (!OVERLAY_STACK[i]._proxiedDocumentDownHandler(e)) {
        return;
      }
    }
  });
});

var Overlay = _ui.default.inherit({
  _supportedKeys: function _supportedKeys() {
    var _this = this;

    return (0, _extend.extend)(this.callBase(), {
      escape: function escape() {
        this.hide();
      },
      upArrow: function upArrow(e) {
        _this._drag.moveUp(e);
      },
      downArrow: function downArrow(e) {
        _this._drag.moveDown(e);
      },
      leftArrow: function leftArrow(e) {
        _this._drag.moveLeft(e);
      },
      rightArrow: function rightArrow(e) {
        _this._drag.moveRight(e);
      }
    });
  },
  _getDefaultOptions: function _getDefaultOptions() {
    var _this2 = this;

    return (0, _extend.extend)(this.callBase(), {
      /**
      * @name dxOverlayOptions.activeStateEnabled
      * @hidden
      */
      activeStateEnabled: false,
      visible: false,
      deferRendering: true,
      shading: true,
      shadingColor: '',
      wrapperAttr: {},
      position: (0, _extend.extend)({}, _overlay_position_controller.OVERLAY_POSITION_ALIASES.center),
      width: '80vw',
      minWidth: null,
      maxWidth: null,
      height: '80vh',
      minHeight: null,
      maxHeight: null,
      animation: {
        show: {
          type: 'pop',
          duration: 300,
          from: {
            scale: 0.55
          }
        },
        hide: {
          type: 'pop',
          duration: 300,
          to: {
            opacity: 0,
            scale: 0.55
          },
          from: {
            opacity: 1,
            scale: 1
          }
        }
      },
      dragOutsideBoundary: false,
      closeOnOutsideClick: false,
      copyRootClassesToWrapper: false,
      _ignoreCopyRootClassesToWrapperDeprecation: false,
      onShowing: null,
      onShown: null,
      onHiding: null,
      onHidden: null,
      contentTemplate: 'content',
      dragEnabled: false,
      dragAndResizeArea: undefined,
      outsideDragFactor: 0,
      resizeEnabled: false,
      onResizeStart: null,
      onResize: null,
      onResizeEnd: null,
      innerOverlay: false,
      restorePosition: true,
      // NOTE: private options
      target: undefined,
      container: undefined,
      hideTopOverlayHandler: function hideTopOverlayHandler() {
        _this2.hide();
      },
      hideOnParentScroll: false,
      onPositioned: null,
      propagateOutsideClick: false,
      ignoreChildEvents: true,
      _checkParentVisibility: true,
      _fixWrapperPosition: false
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: function device() {
        return !(0, _window.hasWindow)();
      },
      options: {
        width: null,
        height: null,
        animation: null,
        _checkParentVisibility: false
      }
    }]);
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      animation: true
    });
  },
  $wrapper: function $wrapper() {
    return this._$wrapper;
  },
  _eventBindingTarget: function _eventBindingTarget() {
    return this._$content;
  },
  _setDeprecatedOptions: function _setDeprecatedOptions() {
    this.callBase();
    (0, _extend.extend)(this._deprecatedOptions, {
      'elementAttr': {
        since: '21.2',
        message: 'Use the "wrapperAttr" option instead'
      }
    });
  },
  ctor: function ctor(element, options) {
    this.callBase(element, options);

    if (options && options.copyRootClassesToWrapper && !options._ignoreCopyRootClassesToWrapperDeprecation) {
      _errors.default.log('W0001', this.NAME, 'copyRootClassesToWrapper', '21.2', 'Use the "wrapperAttr" option instead');
    }
  },
  _init: function _init() {
    var _this3 = this;

    this.callBase();

    this._initActions();

    this._initCloseOnOutsideClickHandler();

    this._initTabTerminatorHandler();

    this._customWrapperClass = null;
    this._$wrapper = (0, _renderer.default)('<div>').addClass(OVERLAY_WRAPPER_CLASS);
    this._$content = (0, _renderer.default)('<div>').addClass(OVERLAY_CONTENT_CLASS);

    this._initInnerOverlayClass();

    var $element = this.$element();

    if (this.option('copyRootClassesToWrapper')) {
      this._$wrapper.addClass($element.attr('class'));
    }

    $element.addClass(OVERLAY_CLASS);

    this._$wrapper.attr('data-bind', 'dxControlsDescendantBindings: true'); // NOTE: bootstrap integration T342292


    _events_engine.default.on(this._$wrapper, 'focusin', function (e) {
      e.stopPropagation();
    });

    this._toggleViewPortSubscription(true);

    this._initHideTopOverlayHandler(this.option('hideTopOverlayHandler'));

    this._parentsScrollSubscriptionInfo = {
      handler: function handler(e) {
        _this3._targetParentsScrollHandler(e);
      }
    };

    this._updateResizeCallbackSkipCondition();

    this.warnPositionAsFunction();
  },
  warnPositionAsFunction: function warnPositionAsFunction() {
    if ((0, _type.isFunction)(this.option('position'))) {
      // position as function deprecated in 21.2
      _errors.default.log('W0018');
    }
  },
  _initOptions: function _initOptions(options) {
    this._setAnimationTarget(options.target);

    this.callBase(options);
  },
  _initInnerOverlayClass: function _initInnerOverlayClass() {
    this._$content.toggleClass(INNER_OVERLAY_CLASS, this.option('innerOverlay'));
  },
  _setAnimationTarget: function _setAnimationTarget(target) {
    if (!(0, _type.isDefined)(target)) {
      return;
    }

    var options = this.option();
    ['animation.show.from.position.of', 'animation.show.to.position.of', 'animation.hide.from.position.of', 'animation.hide.to.position.of'].forEach(function (path) {
      var pathParts = path.split('.');
      var option = options;

      while (option) {
        if (pathParts.length === 1) {
          if ((0, _type.isPlainObject)(option)) {
            option[pathParts.shift()] = target;
          }

          break;
        } else {
          option = option[pathParts.shift()];
        }
      }
    });
  },
  _initHideTopOverlayHandler: function _initHideTopOverlayHandler(handler) {
    this._hideTopOverlayHandler = handler;
  },
  _initActions: function _initActions() {
    var _this4 = this;

    this._actions = {};
    (0, _iterator.each)(ACTIONS, function (_, action) {
      _this4._actions[action] = _this4._createActionByOption(action, {
        excludeValidators: ['disabled', 'readOnly']
      }) || _common.noop;
    });
  },
  _initCloseOnOutsideClickHandler: function _initCloseOnOutsideClickHandler() {
    var _this5 = this;

    this._proxiedDocumentDownHandler = function () {
      return _this5._documentDownHandler.apply(_this5, arguments);
    };
  },
  _areContentDimensionsRendered: function _areContentDimensionsRendered(entry) {
    var _entry$contentBoxSize, _this$_renderedDimens3, _this$_renderedDimens4;

    var contentBox = (_entry$contentBoxSize = entry.contentBoxSize) === null || _entry$contentBoxSize === void 0 ? void 0 : _entry$contentBoxSize[0];

    if (contentBox) {
      var _this$_renderedDimens, _this$_renderedDimens2;

      return parseInt(contentBox.inlineSize, 10) === ((_this$_renderedDimens = this._renderedDimensions) === null || _this$_renderedDimens === void 0 ? void 0 : _this$_renderedDimens.width) && parseInt(contentBox.blockSize, 10) === ((_this$_renderedDimens2 = this._renderedDimensions) === null || _this$_renderedDimens2 === void 0 ? void 0 : _this$_renderedDimens2.height);
    }

    var contentRect = entry.contentRect;
    return parseInt(contentRect.width, 10) === ((_this$_renderedDimens3 = this._renderedDimensions) === null || _this$_renderedDimens3 === void 0 ? void 0 : _this$_renderedDimens3.width) && parseInt(contentRect.height, 10) === ((_this$_renderedDimens4 = this._renderedDimensions) === null || _this$_renderedDimens4 === void 0 ? void 0 : _this$_renderedDimens4.height);
  },
  _contentResizeHandler: function _contentResizeHandler(entry) {
    if (!this._shouldSkipContentResize(entry)) {
      this._renderGeometry({
        shouldOnlyReposition: true
      });
    }
  },
  _updateResizeCallbackSkipCondition: function _updateResizeCallbackSkipCondition() {
    var _this6 = this;

    var doesShowAnimationChangeDimensions = this._doesShowAnimationChangeDimensions();

    this._shouldSkipContentResize = function (entry) {
      return doesShowAnimationChangeDimensions && _this6._showAnimationProcessing || _this6._areContentDimensionsRendered(entry);
    };
  },
  _doesShowAnimationChangeDimensions: function _doesShowAnimationChangeDimensions() {
    var animation = this.option('animation');
    return ['to', 'from'].some(function (prop) {
      var _animation$show;

      var config = animation === null || animation === void 0 ? void 0 : (_animation$show = animation.show) === null || _animation$show === void 0 ? void 0 : _animation$show[prop];
      return (0, _type.isObject)(config) && ('width' in config || 'height' in config);
    });
  },
  _observeContentResize: function _observeContentResize(shouldObserve) {
    var _this7 = this;

    if (!this.option('useResizeObserver')) {
      return;
    }

    var contentElement = this._$content.get(0);

    if (shouldObserve) {
      _resize_observer.default.observe(contentElement, function (entry) {
        _this7._contentResizeHandler(entry);
      });
    } else {
      _resize_observer.default.unobserve(contentElement);
    }
  },
  _initMarkup: function _initMarkup() {
    this.callBase();

    this._renderWrapperAttributes();

    this._initPositionController();
  },
  _documentDownHandler: function _documentDownHandler(e) {
    if (this._showAnimationProcessing) {
      this._stopAnimation();
    }

    var closeOnOutsideClick = this.option('closeOnOutsideClick');

    if ((0, _type.isFunction)(closeOnOutsideClick)) {
      closeOnOutsideClick = closeOnOutsideClick(e);
    }

    var isAttachedTarget = (0, _renderer.default)(window.document).is(e.target) || (0, _dom.contains)(window.document, e.target);
    var isInnerOverlay = (0, _renderer.default)(e.target).closest(".".concat(INNER_OVERLAY_CLASS)).length;
    var outsideClick = isAttachedTarget && !isInnerOverlay && !(this._$content.is(e.target) || (0, _dom.contains)(this._$content.get(0), e.target));

    if (outsideClick && closeOnOutsideClick) {
      this._outsideClickHandler(e);
    }

    return this.option('propagateOutsideClick');
  },
  _outsideClickHandler: function _outsideClickHandler(e) {
    if (this.option('shading')) {
      e.preventDefault();
    }

    this.hide();
  },
  _getAnonymousTemplateName: function _getAnonymousTemplateName() {
    return ANONYMOUS_TEMPLATE_NAME;
  },
  _initTemplates: function _initTemplates() {
    this._templateManager.addDefaultTemplates({
      content: new _empty_template.EmptyTemplate()
    });

    this.callBase();
  },
  _isTopOverlay: function _isTopOverlay() {
    var overlayStack = this._overlayStack();

    for (var i = overlayStack.length - 1; i >= 0; i--) {
      var tabbableElements = overlayStack[i]._findTabbableBounds();

      if (tabbableElements.first || tabbableElements.last) {
        return overlayStack[i] === this;
      }
    }

    return false;
  },
  _overlayStack: function _overlayStack() {
    return OVERLAY_STACK;
  },
  _zIndexInitValue: function _zIndexInitValue() {
    return Overlay.baseZIndex();
  },
  _toggleViewPortSubscription: function _toggleViewPortSubscription(toggle) {
    var _this8 = this;

    viewPortChanged.remove(this._viewPortChangeHandle);

    if (toggle) {
      this._viewPortChangeHandle = function () {
        _this8._viewPortChangeHandler.apply(_this8, arguments);
      };

      viewPortChanged.add(this._viewPortChangeHandle);
    }
  },
  _viewPortChangeHandler: function _viewPortChangeHandler() {
    this._positionController.updateContainer(this.option('container'));

    this._refresh();
  },
  _renderWrapperAttributes: function _renderWrapperAttributes() {
    var _this$option = this.option(),
        wrapperAttr = _this$option.wrapperAttr;

    var attributes = (0, _extend.extend)({}, wrapperAttr);
    var classNames = attributes.class;
    delete attributes.class;
    this.$wrapper().attr(attributes).removeClass(this._customWrapperClass).addClass(classNames);
    this._customWrapperClass = classNames;
  },
  _renderVisibilityAnimate: function _renderVisibilityAnimate(visible) {
    this._observeContentResize(visible);

    this._stopAnimation();

    return visible ? this._show() : this._hide();
  },
  _getAnimationConfig: function _getAnimationConfig() {
    return this._getOptionValue('animation', this);
  },
  _animateShowing: function _animateShowing() {
    var _this$_getAnimationCo,
        _showAnimation$start,
        _showAnimation$comple,
        _this9 = this;

    var animation = (_this$_getAnimationCo = this._getAnimationConfig()) !== null && _this$_getAnimationCo !== void 0 ? _this$_getAnimationCo : {};

    var showAnimation = this._normalizeAnimation(animation.show, 'to');

    var startShowAnimation = (_showAnimation$start = showAnimation === null || showAnimation === void 0 ? void 0 : showAnimation.start) !== null && _showAnimation$start !== void 0 ? _showAnimation$start : _common.noop;
    var completeShowAnimation = (_showAnimation$comple = showAnimation === null || showAnimation === void 0 ? void 0 : showAnimation.complete) !== null && _showAnimation$comple !== void 0 ? _showAnimation$comple : _common.noop;

    this._animate(showAnimation, function () {
      if (_this9._isAnimationPaused) {
        return;
      }

      if (_this9.option('focusStateEnabled')) {
        _events_engine.default.trigger(_this9._focusTarget(), 'focus');
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      completeShowAnimation.call.apply(completeShowAnimation, [_this9].concat(args));
      _this9._showAnimationProcessing = false;
      _this9._isShown = true;

      _this9._actions.onShown();

      _this9._toggleSafariScrolling();

      _this9._showingDeferred.resolve();
    }, function () {
      if (_this9._isAnimationPaused) {
        return;
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      startShowAnimation.call.apply(startShowAnimation, [_this9].concat(args));
      _this9._showAnimationProcessing = true;
    });
  },
  _show: function _show() {
    var _this10 = this;

    this._showingDeferred = new _deferred.Deferred();
    this._parentHidden = this._isParentHidden();

    this._showingDeferred.done(function () {
      delete _this10._parentHidden;
    });

    if (this._parentHidden) {
      this._isHidden = true;
      return this._showingDeferred.resolve();
    }

    if (this._currentVisible) {
      return new _deferred.Deferred().resolve().promise();
    }

    this._currentVisible = true;
    this._isShown = false;

    if (this._isHidingActionCanceled) {
      delete this._isHidingActionCanceled;

      this._showingDeferred.resolve();
    } else {
      var show = function show() {
        _this10._renderVisibility(true);

        if (_this10._isShowingActionCanceled) {
          delete _this10._isShowingActionCanceled;

          _this10._showingDeferred.resolve();

          return;
        }

        _this10._animateShowing();
      };

      if (this.option('templatesRenderAsynchronously')) {
        this._stopShowTimer();

        this._asyncShowTimeout = setTimeout(show);
      } else {
        show();
      }
    }

    return this._showingDeferred.promise();
  },
  _normalizeAnimation: function _normalizeAnimation(animation, prop) {
    if (animation) {
      animation = (0, _extend.extend)({
        type: 'slide',
        skipElementInitialStyles: true // NOTE: for fadeIn animation

      }, animation);

      if (animation[prop] && _typeof(animation[prop]) === 'object') {
        (0, _extend.extend)(animation[prop], {
          position: this._positionController._position
        });
      }
    }

    return animation;
  },
  _animateHiding: function _animateHiding() {
    var _this$_getAnimationCo2,
        _hideAnimation$start,
        _hideAnimation$comple,
        _this11 = this;

    var animation = (_this$_getAnimationCo2 = this._getAnimationConfig()) !== null && _this$_getAnimationCo2 !== void 0 ? _this$_getAnimationCo2 : {};

    var hideAnimation = this._normalizeAnimation(animation.hide, 'from');

    var startHideAnimation = (_hideAnimation$start = hideAnimation === null || hideAnimation === void 0 ? void 0 : hideAnimation.start) !== null && _hideAnimation$start !== void 0 ? _hideAnimation$start : _common.noop;
    var completeHideAnimation = (_hideAnimation$comple = hideAnimation === null || hideAnimation === void 0 ? void 0 : hideAnimation.complete) !== null && _hideAnimation$comple !== void 0 ? _hideAnimation$comple : _common.noop;

    this._animate(hideAnimation, function () {
      var _this11$_actions;

      _this11._$content.css('pointerEvents', '');

      _this11._renderVisibility(false);

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      completeHideAnimation.call.apply(completeHideAnimation, [_this11].concat(args));
      _this11._hideAnimationProcessing = false;
      (_this11$_actions = _this11._actions) === null || _this11$_actions === void 0 ? void 0 : _this11$_actions.onHidden();

      _this11._hidingDeferred.resolve();
    }, function () {
      _this11._$content.css('pointerEvents', 'none');

      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      startHideAnimation.call.apply(startHideAnimation, [_this11].concat(args));
      _this11._hideAnimationProcessing = true;
    });
  },
  _hide: function _hide() {
    if (!this._currentVisible) {
      return new _deferred.Deferred().resolve().promise();
    }

    this._currentVisible = false;
    this._hidingDeferred = new _deferred.Deferred();
    var hidingArgs = {
      cancel: false
    };

    if (this._isShowingActionCanceled) {
      this._hidingDeferred.resolve();
    } else {
      this._actions.onHiding(hidingArgs);

      this._toggleSafariScrolling();

      if (hidingArgs.cancel) {
        this._isHidingActionCanceled = true;
        this.option('visible', true);

        this._hidingDeferred.resolve();
      } else {
        this._forceFocusLost();

        this._toggleShading(false);

        this._toggleSubscriptions(false);

        this._stopShowTimer();

        this._animateHiding();
      }
    }

    return this._hidingDeferred.promise();
  },
  _forceFocusLost: function _forceFocusLost() {
    var activeElement = _dom_adapter.default.getActiveElement();

    var shouldResetActiveElement = !!this._$content.find(activeElement).length;

    if (shouldResetActiveElement) {
      (0, _dom.resetActiveElement)();
    }
  },
  _animate: function _animate(animation, completeCallback, startCallback) {
    if (animation) {
      startCallback = startCallback || animation.start || _common.noop;

      _fx.default.animate(this._$content, (0, _extend.extend)({}, animation, {
        start: startCallback,
        complete: completeCallback
      }));
    } else {
      completeCallback();
    }
  },
  _stopAnimation: function _stopAnimation() {
    _fx.default.stop(this._$content, true);
  },
  _renderVisibility: function _renderVisibility(visible) {
    if (visible && this._isParentHidden()) {
      return;
    }

    this._currentVisible = visible;

    this._stopAnimation();

    if (!visible) {
      (0, _visibility_change.triggerHidingEvent)(this._$content);
    }

    this._toggleVisibility(visible);

    this._$content.toggleClass(INVISIBLE_STATE_CLASS, !visible);

    this._updateZIndexStackPosition(visible);

    if (visible) {
      this._positionController.openingHandled();

      this._renderContent();

      var showingArgs = {
        cancel: false
      };

      this._actions.onShowing(showingArgs);

      if (showingArgs.cancel) {
        this._toggleVisibility(false);

        this._$content.toggleClass(INVISIBLE_STATE_CLASS, true);

        this._updateZIndexStackPosition(false);

        this._moveFromContainer();

        this._isShowingActionCanceled = true;
        this.option('visible', false);
        return;
      }

      this._moveToContainer();

      this._renderGeometry();

      (0, _visibility_change.triggerShownEvent)(this._$content);
      (0, _visibility_change.triggerResizeEvent)(this._$content);
    } else {
      this._moveFromContainer();
    }

    this._toggleShading(visible);

    this._toggleSubscriptions(visible);
  },
  _updateZIndexStackPosition: function _updateZIndexStackPosition(pushToStack) {
    var overlayStack = this._overlayStack();

    var index = (0, _array.inArray)(this, overlayStack);

    if (pushToStack) {
      if (index === -1) {
        this._zIndex = zIndexPool.create(this._zIndexInitValue());
        overlayStack.push(this);
      }

      this._$wrapper.css('zIndex', this._zIndex);

      this._$content.css('zIndex', this._zIndex);
    } else if (index !== -1) {
      overlayStack.splice(index, 1);
      zIndexPool.remove(this._zIndex);
    }
  },
  _toggleShading: function _toggleShading(visible) {
    this._$wrapper.toggleClass(OVERLAY_MODAL_CLASS, this.option('shading') && !this.option('container'));

    this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible && this.option('shading'));

    this._$wrapper.css('backgroundColor', this.option('shading') ? this.option('shadingColor') : '');

    this._toggleTabTerminator(visible && this.option('shading'));
  },
  _initTabTerminatorHandler: function _initTabTerminatorHandler() {
    var _this12 = this;

    this._proxiedTabTerminatorHandler = function () {
      _this12._tabKeyHandler.apply(_this12, arguments);
    };
  },
  _toggleTabTerminator: function _toggleTabTerminator(enabled) {
    var eventName = (0, _index.addNamespace)('keydown', this.NAME);

    if (enabled) {
      _events_engine.default.on(_dom_adapter.default.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    } else {
      _events_engine.default.off(_dom_adapter.default.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    }
  },
  _findTabbableBounds: function _findTabbableBounds() {
    var $elements = this._$wrapper.find('*');

    var elementsCount = $elements.length - 1;
    var result = {
      first: null,
      last: null
    };

    for (var i = 0; i <= elementsCount; i++) {
      if (!result.first && $elements.eq(i).is(_selectors.tabbable)) {
        result.first = $elements.eq(i);
      }

      if (!result.last && $elements.eq(elementsCount - i).is(_selectors.tabbable)) {
        result.last = $elements.eq(elementsCount - i);
      }

      if (result.first && result.last) {
        break;
      }
    }

    return result;
  },
  _tabKeyHandler: function _tabKeyHandler(e) {
    if ((0, _index.normalizeKeyName)(e) !== TAB_KEY || !this._isTopOverlay()) {
      return;
    }

    var tabbableElements = this._findTabbableBounds();

    var $firstTabbable = tabbableElements.first;
    var $lastTabbable = tabbableElements.last;
    var isTabOnLast = !e.shiftKey && e.target === $lastTabbable.get(0);
    var isShiftTabOnFirst = e.shiftKey && e.target === $firstTabbable.get(0);
    var isEmptyTabList = tabbableElements.length === 0;
    var isOutsideTarget = !(0, _dom.contains)(this._$wrapper.get(0), e.target);

    if (isTabOnLast || isShiftTabOnFirst || isEmptyTabList || isOutsideTarget) {
      e.preventDefault();
      var $focusElement = e.shiftKey ? $lastTabbable : $firstTabbable;

      _events_engine.default.trigger($focusElement, 'focusin');

      _events_engine.default.trigger($focusElement, 'focus');
    }
  },
  _toggleSubscriptions: function _toggleSubscriptions(enabled) {
    if ((0, _window.hasWindow)()) {
      this._toggleHideTopOverlayCallback(enabled);

      this._toggleParentsScrollSubscription(enabled);
    }
  },
  _toggleHideTopOverlayCallback: function _toggleHideTopOverlayCallback(subscribe) {
    if (!this._hideTopOverlayHandler) {
      return;
    }

    if (subscribe) {
      _hide_callback.hideCallback.add(this._hideTopOverlayHandler);
    } else {
      _hide_callback.hideCallback.remove(this._hideTopOverlayHandler);
    }
  },
  _toggleParentsScrollSubscription: function _toggleParentsScrollSubscription(needSubscribe) {
    var _this$_parentsScrollS;

    var scrollEvent = (0, _index.addNamespace)('scroll', this.NAME);

    var _ref = (_this$_parentsScrollS = this._parentsScrollSubscriptionInfo) !== null && _this$_parentsScrollS !== void 0 ? _this$_parentsScrollS : {},
        prevTargets = _ref.prevTargets,
        handler = _ref.handler;

    _events_engine.default.off(prevTargets, scrollEvent, handler);

    var closeOnScroll = this.option('hideOnParentScroll');

    if (needSubscribe && closeOnScroll) {
      var $parents = this._$wrapper.parents();

      if (_devices.default.real().deviceType === 'desktop') {
        $parents = $parents.add(window);
      }

      _events_engine.default.on($parents, scrollEvent, handler);

      this._parentsScrollSubscriptionInfo.prevTargets = $parents;
    }
  },
  _targetParentsScrollHandler: function _targetParentsScrollHandler(e) {
    var closeHandled = false;
    var closeOnScroll = this.option('hideOnParentScroll');

    if ((0, _type.isFunction)(closeOnScroll)) {
      closeHandled = closeOnScroll(e);
    }

    if (!closeHandled && !this._showAnimationProcessing) {
      this.hide();
    }
  },
  _render: function _render() {
    this.callBase();

    this._appendContentToElement();

    this._renderVisibilityAnimate(this.option('visible'));
  },
  _appendContentToElement: function _appendContentToElement() {
    if (!this._$content.parent().is(this.$element())) {
      this._$content.appendTo(this.$element());
    }
  },
  _renderContent: function _renderContent() {
    var shouldDeferRendering = !this._currentVisible && this.option('deferRendering');

    var isParentHidden = this.option('visible') && this._isParentHidden();

    if (isParentHidden) {
      this._isHidden = true;
      return;
    }

    if (this._contentAlreadyRendered || shouldDeferRendering) {
      return;
    }

    this._contentAlreadyRendered = true;

    this._appendContentToElement();

    this.callBase();
  },
  _isParentHidden: function _isParentHidden() {
    if (!this.option('_checkParentVisibility')) {
      return false;
    }

    if (this._parentHidden !== undefined) {
      return this._parentHidden;
    }

    var $parent = this.$element().parent();

    if ($parent.is(':visible')) {
      return false;
    }

    var isHidden = false;
    $parent.add($parent.parents()).each(function () {
      var $element = (0, _renderer.default)(this);

      if ($element.css('display') === 'none') {
        isHidden = true;
        return false;
      }
    });
    return isHidden || !_dom_adapter.default.getBody().contains($parent.get(0));
  },
  _renderContentImpl: function _renderContentImpl() {
    var _this13 = this;

    var whenContentRendered = new _deferred.Deferred();
    var contentTemplateOption = this.option('contentTemplate');

    var contentTemplate = this._getTemplate(contentTemplateOption);

    var transclude = this._templateManager.anonymousTemplateName === contentTemplateOption;
    contentTemplate && contentTemplate.render({
      container: (0, _element.getPublicElement)(this.$content()),
      noModel: true,
      transclude: transclude,
      onRendered: function onRendered() {
        whenContentRendered.resolve();
      }
    });

    this._renderDrag();

    this._renderResize();

    this._renderScrollTerminator();

    whenContentRendered.done(function () {
      if (_this13.option('visible')) {
        _this13._moveToContainer();
      }
    });
    return whenContentRendered.promise();
  },
  _getPositionControllerConfig: function _getPositionControllerConfig() {
    var _this$option2 = this.option(),
        target = _this$option2.target,
        container = _this$option2.container,
        dragAndResizeArea = _this$option2.dragAndResizeArea,
        dragOutsideBoundary = _this$option2.dragOutsideBoundary,
        outsideDragFactor = _this$option2.outsideDragFactor,
        _fixWrapperPosition = _this$option2._fixWrapperPosition,
        restorePosition = _this$option2.restorePosition; // NOTE: position is passed to controller in renderGeometry to prevent window field using in server side mode


    return {
      target: target,
      container: container,
      $root: this.$element(),
      $content: this._$content,
      $wrapper: this._$wrapper,
      onPositioned: this._actions.onPositioned,
      onVisualPositionChanged: this._actions.onVisualPositionChanged,
      restorePosition: restorePosition,
      dragAndResizeArea: dragAndResizeArea,
      dragOutsideBoundary: dragOutsideBoundary,
      outsideDragFactor: outsideDragFactor,
      _fixWrapperPosition: _fixWrapperPosition
    };
  },
  _initPositionController: function _initPositionController() {
    this._positionController = new _overlay_position_controller.OverlayPositionController(this._getPositionControllerConfig());
  },
  _renderDrag: function _renderDrag() {
    var $dragTarget = this._getDragTarget();

    if (!$dragTarget) {
      return;
    }

    var config = {
      dragEnabled: this.option('dragEnabled'),
      handle: $dragTarget.get(0),
      draggableElement: this._$content.get(0),
      positionController: this._positionController
    };

    if (this._drag) {
      this._drag.init(config);
    } else {
      this._drag = new _overlay_drag.default(config);
    }
  },
  _renderResize: function _renderResize() {
    var _this14 = this;

    this._resizable = this._createComponent(this._$content, _resizable.default, {
      handles: this.option('resizeEnabled') ? 'all' : 'none',
      onResizeEnd: function onResizeEnd(e) {
        _this14._resizeEndHandler(e);

        _this14._observeContentResize(true);
      },
      onResize: function onResize(e) {
        _this14._actions.onResize(e);
      },
      onResizeStart: function onResizeStart(e) {
        _this14._observeContentResize(false);

        _this14._actions.onResizeStart(e);
      },
      minHeight: 100,
      minWidth: 100,
      area: this._positionController.$dragResizeContainer
    });
  },
  _resizeEndHandler: function _resizeEndHandler(e) {
    var width = this._resizable.option('width');

    var height = this._resizable.option('height');

    width && this._setOptionWithoutOptionChange('width', width);
    height && this._setOptionWithoutOptionChange('height', height);

    this._cacheDimensions();

    this._positionController.resizeHandled();

    this._positionController.detectVisualPositionChange(e.event);

    this._actions.onResizeEnd(e);
  },
  _renderScrollTerminator: function _renderScrollTerminator() {
    var $scrollTerminator = this._$wrapper;
    var terminatorEventName = (0, _index.addNamespace)(_drag.move, this.NAME);

    _events_engine.default.off($scrollTerminator, terminatorEventName);

    _events_engine.default.on($scrollTerminator, terminatorEventName, {
      validate: function validate() {
        return true;
      },
      getDirection: function getDirection() {
        return 'both';
      },
      _toggleGestureCover: function _toggleGestureCover(toggle) {
        if (!toggle) {
          this._toggleGestureCoverImpl(toggle);
        }
      },
      _clearSelection: _common.noop,
      isNative: true
    }, function (e) {
      var originalEvent = e.originalEvent.originalEvent;

      var _ref2 = originalEvent || {},
          type = _ref2.type;

      var isWheel = type === 'wheel';
      var isMouseMove = type === 'mousemove';
      var isScrollByWheel = isWheel && !(0, _index.isCommandKeyPressed)(e);
      e._cancelPreventDefault = true;

      if (originalEvent && e.cancelable !== false && (!isMouseMove && !isWheel || isScrollByWheel)) {
        e.preventDefault();
      }
    });
  },
  _getDragTarget: function _getDragTarget() {
    return this.$content();
  },
  _moveFromContainer: function _moveFromContainer() {
    this._$content.appendTo(this.$element());

    this._detachWrapperToContainer();
  },
  _detachWrapperToContainer: function _detachWrapperToContainer() {
    this._$wrapper.detach();
  },
  _moveToContainer: function _moveToContainer() {
    this._attachWrapperToContainer();

    this._$content.appendTo(this._$wrapper);
  },
  _attachWrapperToContainer: function _attachWrapperToContainer() {
    var $element = this.$element();
    var containerDefined = this.option('container') !== undefined;
    var renderContainer = containerDefined ? this._positionController.$container : _swatch_container.default.getSwatchContainer($element);

    if (renderContainer && renderContainer[0] === $element.parent()[0]) {
      renderContainer = $element;
    }

    this._$wrapper.appendTo(renderContainer);
  },
  _renderGeometry: function _renderGeometry(options) {
    var _this$option3 = this.option(),
        visible = _this$option3.visible,
        useResizeObserver = _this$option3.useResizeObserver;

    if (visible && (0, _window.hasWindow)()) {
      var isAnimated = this._showAnimationProcessing;
      var shouldRepeatAnimation = isAnimated && !(options !== null && options !== void 0 && options.forceStopAnimation) && useResizeObserver;
      this._isAnimationPaused = shouldRepeatAnimation || undefined;

      this._stopAnimation();

      if (options !== null && options !== void 0 && options.shouldOnlyReposition) {
        this._positionController.positionContent();
      } else {
        this._renderGeometryImpl();
      }

      if (shouldRepeatAnimation) {
        this._animateShowing();

        this._isAnimationPaused = undefined;
      }
    }
  },
  _cacheDimensions: function _cacheDimensions() {
    if (!this.option('useResizeObserver')) {
      return;
    }

    this._renderedDimensions = {
      width: parseInt((0, _size.getWidth)(this._$content), 10),
      height: parseInt((0, _size.getHeight)(this._$content), 10)
    };
  },
  _renderGeometryImpl: function _renderGeometryImpl() {
    // NOTE: position can be specified as a function which needs to be called strict on render start
    this._positionController.updatePosition(this._getOptionValue('position'));

    this._renderWrapper();

    this._renderDimensions();

    this._cacheDimensions();

    this._renderPosition();
  },
  _renderPosition: function _renderPosition() {
    this._positionController.positionContent();
  },
  _isAllWindowCovered: function _isAllWindowCovered() {
    return this._positionController.isAllWindowCoveredByWrapper() && this.option('shading');
  },
  _toggleSafariScrolling: function _toggleSafariScrolling() {
    var visible = this.option('visible');
    var $body = (0, _renderer.default)(_dom_adapter.default.getBody());

    var isIosSafari = _devices.default.real().platform === 'ios' && _browser.default.safari;

    var isAllWindowCovered = this._isAllWindowCovered();

    var isScrollingPrevented = $body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS);
    var shouldPreventScrolling = !isScrollingPrevented && visible && isAllWindowCovered;
    var shouldEnableScrolling = isScrollingPrevented && (!visible || !isAllWindowCovered || this._disposed);

    if (isIosSafari) {
      if (shouldEnableScrolling) {
        $body.removeClass(PREVENT_SAFARI_SCROLLING_CLASS);
        window.scrollTo(0, this._cachedBodyScrollTop);
        this._cachedBodyScrollTop = undefined;
      } else if (shouldPreventScrolling) {
        this._cachedBodyScrollTop = window.pageYOffset;
        $body.addClass(PREVENT_SAFARI_SCROLLING_CLASS);
      }
    }
  },
  _renderWrapper: function _renderWrapper() {
    this._positionController.styleWrapperPosition();

    this._renderWrapperDimensions();

    this._positionController.positionWrapper();
  },
  _renderWrapperDimensions: function _renderWrapperDimensions() {
    var wrapperWidth;
    var wrapperHeight;
    var $container = this._positionController._$wrapperCoveredElement;

    if (!$container) {
      return;
    }

    var isWindow = this._positionController.isAllWindowCoveredByWrapper();

    var documentElement = _dom_adapter.default.getDocumentElement();

    wrapperWidth = isWindow ? documentElement.clientWidth : (0, _size.getOuterWidth)($container), wrapperHeight = isWindow ? window.innerHeight : (0, _size.getOuterHeight)($container);

    this._$wrapper.css({
      width: wrapperWidth,
      height: wrapperHeight
    });
  },
  _renderDimensions: function _renderDimensions() {
    var content = this._$content.get(0);

    this._$content.css({
      minWidth: this._getOptionValue('minWidth', content),
      maxWidth: this._getOptionValue('maxWidth', content),
      minHeight: this._getOptionValue('minHeight', content),
      maxHeight: this._getOptionValue('maxHeight', content),
      width: this._getOptionValue('width', content),
      height: this._getOptionValue('height', content)
    });
  },
  _focusTarget: function _focusTarget() {
    return this._$content;
  },
  _attachKeyboardEvents: function _attachKeyboardEvents() {
    var _this15 = this;

    this._keyboardListenerId = _short.keyboard.on(this._$content, null, function (opts) {
      return _this15._keyboardHandler(opts);
    });
  },
  _keyboardHandler: function _keyboardHandler(options) {
    var e = options.originalEvent;
    var $target = (0, _renderer.default)(e.target);

    if ($target.is(this._$content) || !this.option('ignoreChildEvents')) {
      this.callBase.apply(this, arguments);
    }
  },
  _isVisible: function _isVisible() {
    return this.option('visible');
  },
  _visibilityChanged: function _visibilityChanged(visible) {
    if (visible) {
      if (this.option('visible')) {
        this._renderVisibilityAnimate(visible);
      }
    } else {
      this._renderVisibilityAnimate(visible);
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    this._renderGeometry();
  },
  _clean: function _clean() {
    if (!this._contentAlreadyRendered) {
      this.$content().empty();
    }

    this._renderVisibility(false);

    this._stopShowTimer();

    this._observeContentResize(false);

    this._cleanFocusState();
  },
  _stopShowTimer: function _stopShowTimer() {
    if (this._asyncShowTimeout) {
      clearTimeout(this._asyncShowTimeout);
    }

    this._asyncShowTimeout = null;
  },
  _dispose: function _dispose() {
    _fx.default.stop(this._$content, false);

    clearTimeout(this._deferShowTimer);

    this._toggleViewPortSubscription(false);

    this._toggleSubscriptions(false);

    this._updateZIndexStackPosition(false);

    this._toggleTabTerminator(false);

    this._actions = null;
    this._parentsScrollSubscriptionInfo = null;
    this.callBase();

    this._toggleSafariScrolling();

    zIndexPool.remove(this._zIndex);

    this._$wrapper.remove();

    this._$content.remove();
  },
  _toggleDisabledState: function _toggleDisabledState(value) {
    this.callBase.apply(this, arguments);

    this._$content.toggleClass(DISABLED_STATE_CLASS, Boolean(value));
  },
  _toggleRTLDirection: function _toggleRTLDirection(rtl) {
    this._$content.toggleClass(RTL_DIRECTION_CLASS, rtl);
  },
  _optionChanged: function _optionChanged(args) {
    var _this$_resizable,
        _this16 = this;

    var value = args.value;

    if ((0, _array.inArray)(args.name, ACTIONS) > -1) {
      this._initActions();

      return;
    }

    switch (args.name) {
      case 'dragEnabled':
        this._renderDrag();

        this._renderGeometry();

        break;

      case 'resizeEnabled':
        this._renderResize();

        this._renderGeometry();

        break;

      case 'shading':
        this._toggleShading(this.option('visible'));

        this._toggleSafariScrolling();

        break;

      case 'shadingColor':
        this._toggleShading(this.option('visible'));

        break;

      case 'width':
      case 'height':
        this._renderGeometry();

        (_this$_resizable = this._resizable) === null || _this$_resizable === void 0 ? void 0 : _this$_resizable.option(args.name, args.value);
        break;

      case 'minWidth':
      case 'maxWidth':
      case 'minHeight':
      case 'maxHeight':
        this._renderGeometry();

        break;

      case 'position':
        this._positionController.updatePosition(this.option('position'));

        this._positionController.restorePositionOnNextRender(true);

        this._renderGeometry();

        this._toggleSafariScrolling();

        break;

      case 'visible':
        this._renderVisibilityAnimate(value).done(function () {
          if (!_this16._animateDeferred) {
            return;
          }

          _this16._animateDeferred.resolveWith(_this16);
        });

        break;

      case 'target':
        this._positionController.updateTarget(value);

        this._setAnimationTarget(value);

        this._invalidate();

        break;

      case 'container':
        this._positionController.updateContainer(value);

        this._invalidate();

        this._toggleSafariScrolling();

        if (this.option('resizeEnabled')) {
          var _this$_resizable2;

          (_this$_resizable2 = this._resizable) === null || _this$_resizable2 === void 0 ? void 0 : _this$_resizable2.option('area', this._positionController.$dragResizeContainer);
        }

        break;

      case 'innerOverlay':
        this._initInnerOverlayClass();

        break;

      case 'deferRendering':
      case 'contentTemplate':
        this._contentAlreadyRendered = false;

        this._clean();

        this._invalidate();

        break;

      case 'hideTopOverlayHandler':
        this._toggleHideTopOverlayCallback(false);

        this._initHideTopOverlayHandler(args.value);

        this._toggleHideTopOverlayCallback(this.option('visible'));

        break;

      case 'hideOnParentScroll':
        this._toggleParentsScrollSubscription(this.option('visible'));

        break;

      case 'closeOnOutsideClick':
      case 'propagateOutsideClick':
        break;

      case 'animation':
        this._updateResizeCallbackSkipCondition();

        break;

      case 'rtlEnabled':
        this._contentAlreadyRendered = false;
        this.callBase(args);
        break;

      case '_fixWrapperPosition':
        this._positionController.fixWrapperPosition = value;
        break;

      case 'wrapperAttr':
        this._renderWrapperAttributes();

        break;

      case 'dragAndResizeArea':
        this._positionController.dragAndResizeArea = value;

        if (this.option('resizeEnabled')) {
          this._resizable.option('area', this._positionController.$dragResizeContainer);
        }

        this._positionController.positionContent();

        break;

      case 'dragOutsideBoundary':
        this._positionController.dragOutsideBoundary = value;

        if (this.option('resizeEnabled')) {
          this._resizable.option('area', this._positionController.$dragResizeContainer);
        }

        break;

      case 'outsideDragFactor':
        this._positionController.outsideDragFactor = value;
        break;

      case 'restorePosition':
        this._positionController.restorePosition = args.value;
        break;

      default:
        this.callBase(args);
    }
  },
  toggle: function toggle(showing) {
    var _this17 = this;

    showing = showing === undefined ? !this.option('visible') : showing;
    var result = new _deferred.Deferred();

    if (showing === this.option('visible')) {
      return result.resolveWith(this, [showing]).promise();
    }

    var animateDeferred = new _deferred.Deferred();
    this._animateDeferred = animateDeferred;
    this.option('visible', showing);
    animateDeferred.promise().done(function () {
      delete _this17._animateDeferred;
      result.resolveWith(_this17, [_this17.option('visible')]);
    });
    return result.promise();
  },
  $content: function $content() {
    return this._$content;
  },
  show: function show() {
    return this.toggle(true);
  },
  hide: function hide() {
    return this.toggle(false);
  },
  content: function content() {
    return (0, _element.getPublicElement)(this._$content);
  },
  repaint: function repaint() {
    if (this._contentAlreadyRendered) {
      this._positionController.restorePositionOnNextRender(true);

      this._renderGeometry({
        forceStopAnimation: true
      });

      (0, _visibility_change.triggerResizeEvent)(this._$content);
    } else {
      this.callBase();
    }
  }
});
/**
* @name ui.dxOverlay
* @section utils
*/


Overlay.baseZIndex = function (zIndex) {
  return zIndexPool.base(zIndex);
};

(0, _component_registrator.default)('dxOverlay', Overlay);
var _default = Overlay;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;