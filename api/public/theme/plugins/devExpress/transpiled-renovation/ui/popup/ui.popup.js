"use strict";

exports.default = void 0;

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _devices = _interopRequireDefault(require("../../core/devices"));

var _element = require("../../core/element");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _empty_template = require("../../core/templates/empty_template");

var _array = require("../../core/utils/array");

var _browser = _interopRequireDefault(require("../../core/utils/browser"));

var _common = require("../../core/utils/common");

var _extend = require("../../core/utils/extend");

var _inflector = require("../../core/utils/inflector");

var _iterator = require("../../core/utils/iterator");

var _size = require("../../core/utils/size");

var _position = require("../../core/utils/position");

var _type = require("../../core/utils/type");

var _version = require("../../core/utils/version");

var _window = require("../../core/utils/window");

var _visibility_change = require("../../events/visibility_change");

var _message = _interopRequireDefault(require("../../localization/message"));

var _button = _interopRequireDefault(require("../button"));

var _ui = _interopRequireDefault(require("../overlay/ui.overlay"));

var _themes = require("../themes");

require("../toolbar/ui.toolbar.base");

var _popup_position_controller = require("./popup_position_controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var window = (0, _window.getWindow)(); // STYLE popup

var POPUP_CLASS = 'dx-popup';
var POPUP_WRAPPER_CLASS = 'dx-popup-wrapper';
var POPUP_FULL_SCREEN_CLASS = 'dx-popup-fullscreen';
var POPUP_FULL_SCREEN_WIDTH_CLASS = 'dx-popup-fullscreen-width';
var POPUP_NORMAL_CLASS = 'dx-popup-normal';
var POPUP_CONTENT_CLASS = 'dx-popup-content';
var POPUP_DRAGGABLE_CLASS = 'dx-popup-draggable';
var POPUP_TITLE_CLASS = 'dx-popup-title';
var POPUP_TITLE_CLOSEBUTTON_CLASS = 'dx-closebutton';
var POPUP_BOTTOM_CLASS = 'dx-popup-bottom';
var POPUP_HAS_CLOSE_BUTTON_CLASS = 'dx-has-close-button';
var TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
var POPUP_CONTENT_FLEX_HEIGHT_CLASS = 'dx-popup-flex-height';
var POPUP_CONTENT_INHERIT_HEIGHT_CLASS = 'dx-popup-inherit-height';
var ALLOWED_TOOLBAR_ITEM_ALIASES = ['cancel', 'clear', 'done'];
var BUTTON_DEFAULT_TYPE = 'default';
var BUTTON_NORMAL_TYPE = 'normal';
var BUTTON_TEXT_MODE = 'text';
var BUTTON_CONTAINED_MODE = 'contained';
var IS_OLD_SAFARI = _browser.default.safari && (0, _version.compare)(_browser.default.version, [11]) < 0;
var HEIGHT_STRATEGIES = {
  static: '',
  inherit: POPUP_CONTENT_INHERIT_HEIGHT_CLASS,
  flex: POPUP_CONTENT_FLEX_HEIGHT_CLASS
};

var getButtonPlace = function getButtonPlace(name) {
  var device = _devices.default.current();

  var platform = device.platform;
  var toolbar = 'bottom';
  var location = 'before';

  if (platform === 'ios') {
    switch (name) {
      case 'cancel':
        toolbar = 'top';
        break;

      case 'clear':
        toolbar = 'top';
        location = 'after';
        break;

      case 'done':
        location = 'after';
        break;
    }
  } else if (platform === 'android' && device.version && parseInt(device.version[0]) > 4) {
    switch (name) {
      case 'cancel':
        location = 'after';
        break;

      case 'done':
        location = 'after';
        break;
    }
  }

  return {
    toolbar: toolbar,
    location: location
  };
};

var Popup = _ui.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      fullScreen: false,
      title: '',
      showTitle: true,
      titleTemplate: 'title',
      onTitleRendered: null,
      dragEnabled: false,
      toolbarItems: [],
      showCloseButton: false,
      bottomTemplate: 'bottom',
      useDefaultToolbarButtons: false,
      useFlatToolbarButtons: false,
      autoResizeEnabled: true
    });
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    var themeName = (0, _themes.current)();
    return this.callBase().concat([{
      device: {
        platform: 'ios'
      },
      options: {
        animation: this._iosAnimation
      }
    }, {
      device: {
        platform: 'android'
      },
      options: {
        animation: this._androidAnimation
      }
    }, {
      device: {
        platform: 'generic'
      },
      options: {
        showCloseButton: true
      }
    }, {
      device: function device(_device) {
        return _devices.default.real().deviceType === 'desktop' && _device.platform === 'generic';
      },
      options: {
        dragEnabled: true
      }
    }, {
      device: function device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device: function device() {
        return (0, _themes.isMaterial)(themeName);
      },
      options: {
        useDefaultToolbarButtons: true,
        useFlatToolbarButtons: true,
        showCloseButton: false
      }
    }]);
  },
  _iosAnimation: {
    show: {
      type: 'slide',
      duration: 400,
      from: {
        position: {
          my: 'top',
          at: 'bottom'
        }
      },
      to: {
        position: {
          my: 'center',
          at: 'center'
        }
      }
    },
    hide: {
      type: 'slide',
      duration: 400,
      from: {
        opacity: 1,
        position: {
          my: 'center',
          at: 'center'
        }
      },
      to: {
        opacity: 1,
        position: {
          my: 'top',
          at: 'bottom'
        }
      }
    }
  },
  _androidAnimation: function _androidAnimation() {
    var fullScreenConfig = {
      show: {
        type: 'slide',
        duration: 300,
        from: {
          top: '30%',
          opacity: 0
        },
        to: {
          top: 0,
          opacity: 1
        }
      },
      hide: {
        type: 'slide',
        duration: 300,
        from: {
          top: 0,
          opacity: 1
        },
        to: {
          top: '30%',
          opacity: 0
        }
      }
    };
    var defaultConfig = {
      show: {
        type: 'fade',
        duration: 400,
        from: 0,
        to: 1
      },
      hide: {
        type: 'fade',
        duration: 400,
        from: 1,
        to: 0
      }
    };
    return this.option('fullScreen') ? fullScreenConfig : defaultConfig;
  },
  _init: function _init() {
    this.callBase();
    this.$element().addClass(POPUP_CLASS);
    this.$wrapper().addClass(POPUP_WRAPPER_CLASS);
    this._$popupContent = this._$content.wrapInner((0, _renderer.default)('<div>').addClass(POPUP_CONTENT_CLASS)).children().eq(0);
  },
  _render: function _render() {
    var isFullscreen = this.option('fullScreen');

    this._toggleFullScreenClass(isFullscreen);

    this.callBase();
  },
  _toggleFullScreenClass: function _toggleFullScreenClass(value) {
    this.$overlayContent().toggleClass(POPUP_FULL_SCREEN_CLASS, value).toggleClass(POPUP_NORMAL_CLASS, !value);
  },
  _initTemplates: function _initTemplates() {
    this.callBase();

    this._templateManager.addDefaultTemplates({
      title: new _empty_template.EmptyTemplate(),
      bottom: new _empty_template.EmptyTemplate()
    });
  },
  _renderContentImpl: function _renderContentImpl() {
    this._renderTitle();

    this.callBase();

    this._renderBottom();
  },
  _renderTitle: function _renderTitle() {
    var items = this._getToolbarItems('top');

    var titleText = this.option('title');
    var showTitle = this.option('showTitle');

    if (showTitle && !!titleText) {
      items.unshift({
        location: _devices.default.current().ios ? 'center' : 'before',
        text: titleText
      });
    }

    if (showTitle || items.length > 0) {
      this._$title && this._$title.remove();
      var $title = (0, _renderer.default)('<div>').addClass(POPUP_TITLE_CLASS).insertBefore(this.$content());
      this._$title = this._renderTemplateByType('titleTemplate', items, $title).addClass(POPUP_TITLE_CLASS);

      this._renderDrag();

      this._executeTitleRenderAction(this._$title);

      this._$title.toggleClass(POPUP_HAS_CLOSE_BUTTON_CLASS, this._hasCloseButton());
    } else if (this._$title) {
      this._$title.detach();
    }
  },
  _renderTemplateByType: function _renderTemplateByType(optionName, data, $container, additionalToolbarOptions) {
    var template = this._getTemplateByOption(optionName);

    var toolbarTemplate = template instanceof _empty_template.EmptyTemplate;

    if (toolbarTemplate) {
      var integrationOptions = (0, _extend.extend)({}, this.option('integrationOptions'), {
        skipTemplates: ['content', 'title']
      });
      var toolbarOptions = (0, _extend.extend)(additionalToolbarOptions, {
        items: data,
        rtlEnabled: this.option('rtlEnabled'),
        useDefaultButtons: this.option('useDefaultToolbarButtons'),
        useFlatButtons: this.option('useFlatToolbarButtons'),
        integrationOptions: integrationOptions
      });

      this._getTemplate('dx-polymorph-widget').render({
        container: $container,
        model: {
          widget: 'dxToolbarBase',
          options: toolbarOptions
        }
      });

      var $toolbar = $container.children('div');
      $container.replaceWith($toolbar);
      return $toolbar;
    } else {
      var $result = (0, _renderer.default)(template.render({
        container: (0, _element.getPublicElement)($container)
      }));

      if ($result.hasClass(TEMPLATE_WRAPPER_CLASS)) {
        $container.replaceWith($result);
        $container = $result;
      }

      return $container;
    }
  },
  _executeTitleRenderAction: function _executeTitleRenderAction($titleElement) {
    this._getTitleRenderAction()({
      titleElement: (0, _element.getPublicElement)($titleElement)
    });
  },
  _getTitleRenderAction: function _getTitleRenderAction() {
    return this._titleRenderAction || this._createTitleRenderAction();
  },
  _createTitleRenderAction: function _createTitleRenderAction() {
    return this._titleRenderAction = this._createActionByOption('onTitleRendered', {
      element: this.element(),
      excludeValidators: ['disabled', 'readOnly']
    });
  },
  _getCloseButton: function _getCloseButton() {
    return {
      toolbar: 'top',
      location: 'after',
      template: this._getCloseButtonRenderer()
    };
  },
  _getCloseButtonRenderer: function _getCloseButtonRenderer() {
    var _this = this;

    return function (_, __, container) {
      var $button = (0, _renderer.default)('<div>').addClass(POPUP_TITLE_CLOSEBUTTON_CLASS);

      _this._createComponent($button, _button.default, {
        icon: 'close',
        onClick: _this._createToolbarItemAction(undefined),
        stylingMode: 'text',
        integrationOptions: {}
      });

      (0, _renderer.default)(container).append($button);
    };
  },
  _getToolbarItems: function _getToolbarItems(toolbar) {
    var _this2 = this;

    var toolbarItems = this.option('toolbarItems');
    var toolbarsItems = [];
    this._toolbarItemClasses = [];

    var currentPlatform = _devices.default.current().platform;

    var index = 0;
    (0, _iterator.each)(toolbarItems, function (_, data) {
      var isShortcut = (0, _type.isDefined)(data.shortcut);
      var item = isShortcut ? getButtonPlace(data.shortcut) : data;

      if (isShortcut && currentPlatform === 'ios' && index < 2) {
        item.toolbar = 'top';
        index++;
      }

      item.toolbar = data.toolbar || item.toolbar || 'top';

      if (item && item.toolbar === toolbar) {
        if (isShortcut) {
          (0, _extend.extend)(item, {
            location: data.location
          }, _this2._getToolbarItemByAlias(data));
        }

        var isLTROrder = currentPlatform === 'generic';

        if (data.shortcut === 'done' && isLTROrder || data.shortcut === 'cancel' && !isLTROrder) {
          toolbarsItems.unshift(item);
        } else {
          toolbarsItems.push(item);
        }
      }
    });

    if (toolbar === 'top' && this._hasCloseButton()) {
      toolbarsItems.push(this._getCloseButton());
    }

    return toolbarsItems;
  },
  _hasCloseButton: function _hasCloseButton() {
    return this.option('showCloseButton') && this.option('showTitle');
  },
  _getLocalizationKey: function _getLocalizationKey(itemType) {
    return itemType.toLowerCase() === 'done' ? 'OK' : (0, _inflector.camelize)(itemType, true);
  },
  _getToolbarItemByAlias: function _getToolbarItemByAlias(data) {
    var that = this;
    var itemType = data.shortcut;

    if ((0, _array.inArray)(itemType, ALLOWED_TOOLBAR_ITEM_ALIASES) < 0) {
      return false;
    }

    var itemConfig = (0, _extend.extend)({
      text: _message.default.format(this._getLocalizationKey(itemType)),
      onClick: this._createToolbarItemAction(data.onClick),
      integrationOptions: {},
      type: that.option('useDefaultToolbarButtons') ? BUTTON_DEFAULT_TYPE : BUTTON_NORMAL_TYPE,
      stylingMode: that.option('useFlatToolbarButtons') ? BUTTON_TEXT_MODE : BUTTON_CONTAINED_MODE
    }, data.options || {});
    var itemClass = POPUP_CLASS + '-' + itemType;

    this._toolbarItemClasses.push(itemClass);

    return {
      template: function template(_, __, container) {
        var $toolbarItem = (0, _renderer.default)('<div>').addClass(itemClass).appendTo(container);

        that._createComponent($toolbarItem, _button.default, itemConfig);
      }
    };
  },
  _createToolbarItemAction: function _createToolbarItemAction(clickAction) {
    return this._createAction(clickAction, {
      afterExecute: function afterExecute(e) {
        e.component.hide();
      }
    });
  },
  _renderBottom: function _renderBottom() {
    var items = this._getToolbarItems('bottom');

    if (items.length) {
      this._$bottom && this._$bottom.remove();
      var $bottom = (0, _renderer.default)('<div>').addClass(POPUP_BOTTOM_CLASS).insertAfter(this.$content());
      this._$bottom = this._renderTemplateByType('bottomTemplate', items, $bottom, {
        compactMode: true
      }).addClass(POPUP_BOTTOM_CLASS);

      this._toggleClasses();
    } else {
      this._$bottom && this._$bottom.detach();
    }
  },
  _toggleClasses: function _toggleClasses() {
    var _this3 = this;

    var aliases = ALLOWED_TOOLBAR_ITEM_ALIASES;
    (0, _iterator.each)(aliases, function (_, alias) {
      var className = POPUP_CLASS + '-' + alias;

      if ((0, _array.inArray)(className, _this3._toolbarItemClasses) >= 0) {
        _this3.$wrapper().addClass(className + '-visible');

        _this3._$bottom.addClass(className);
      } else {
        _this3.$wrapper().removeClass(className + '-visible');

        _this3._$bottom.removeClass(className);
      }
    });
  },
  _getPositionControllerConfig: function _getPositionControllerConfig() {
    var _this$option = this.option(),
        fullScreen = _this$option.fullScreen,
        forceApplyBindings = _this$option.forceApplyBindings;

    return (0, _extend.extend)({}, this.callBase(), {
      fullScreen: fullScreen,
      forceApplyBindings: forceApplyBindings
    });
  },
  _initPositionController: function _initPositionController() {
    this._positionController = new _popup_position_controller.PopupPositionController(this._getPositionControllerConfig());
  },
  _getDragTarget: function _getDragTarget() {
    return this.topToolbar();
  },
  _renderGeometryImpl: function _renderGeometryImpl() {
    // NOTE: for correct new position calculation
    this._resetContentHeight();

    this.callBase();

    this._setContentHeight();
  },
  _resetContentHeight: function _resetContentHeight() {
    var height = this._getOptionValue('height');

    if (height === 'auto') {
      this.$content().css({
        height: 'auto',
        maxHeight: 'none'
      });
    }
  },
  _renderDrag: function _renderDrag() {
    this.callBase();
    this.$overlayContent().toggleClass(POPUP_DRAGGABLE_CLASS, this.option('dragEnabled'));
  },
  _renderResize: function _renderResize() {
    this.callBase();

    this._resizable.option('onResize', function () {
      this._setContentHeight();

      this._actions.onResize(arguments);
    }.bind(this));
  },
  _setContentHeight: function _setContentHeight() {
    (this.option('forceApplyBindings') || _common.noop)();

    var overlayContent = this.$overlayContent().get(0);

    var currentHeightStrategyClass = this._chooseHeightStrategy(overlayContent);

    this.$content().css(this._getHeightCssStyles(currentHeightStrategyClass, overlayContent));

    this._setHeightClasses(this.$overlayContent(), currentHeightStrategyClass);
  },
  _heightStrategyChangeOffset: function _heightStrategyChangeOffset(currentHeightStrategyClass, popupVerticalPaddings) {
    return currentHeightStrategyClass === HEIGHT_STRATEGIES.flex ? -popupVerticalPaddings : 0;
  },
  _chooseHeightStrategy: function _chooseHeightStrategy(overlayContent) {
    var isAutoWidth = overlayContent.style.width === 'auto' || overlayContent.style.width === '';
    var currentHeightStrategyClass = HEIGHT_STRATEGIES.static;

    if (this._isAutoHeight() && this.option('autoResizeEnabled')) {
      if (isAutoWidth || IS_OLD_SAFARI) {
        currentHeightStrategyClass = HEIGHT_STRATEGIES.inherit;
      } else {
        currentHeightStrategyClass = HEIGHT_STRATEGIES.flex;
      }
    }

    return currentHeightStrategyClass;
  },
  _getHeightCssStyles: function _getHeightCssStyles(currentHeightStrategyClass, overlayContent) {
    var cssStyles = {};

    var contentMaxHeight = this._getOptionValue('maxHeight', overlayContent);

    var contentMinHeight = this._getOptionValue('minHeight', overlayContent);

    var popupHeightParts = this._splitPopupHeight();

    var toolbarsAndVerticalOffsetsHeight = popupHeightParts.header + popupHeightParts.footer + popupHeightParts.contentVerticalOffsets + popupHeightParts.popupVerticalOffsets + this._heightStrategyChangeOffset(currentHeightStrategyClass, popupHeightParts.popupVerticalPaddings);

    if (currentHeightStrategyClass === HEIGHT_STRATEGIES.static) {
      if (!this._isAutoHeight() || contentMaxHeight || contentMinHeight) {
        var overlayHeight = this.option('fullScreen') ? Math.min((0, _position.getBoundingRect)(overlayContent).height, (0, _window.getWindow)().innerHeight) : (0, _position.getBoundingRect)(overlayContent).height;
        var contentHeight = overlayHeight - toolbarsAndVerticalOffsetsHeight;
        cssStyles = {
          height: Math.max(0, contentHeight),
          minHeight: 'auto',
          maxHeight: 'auto'
        };
      }
    } else {
      var container = (0, _renderer.default)(this._positionController._$wrapperCoveredElement).get(0);
      var maxHeightValue = (0, _size.addOffsetToMaxHeight)(contentMaxHeight, -toolbarsAndVerticalOffsetsHeight, container);
      var minHeightValue = (0, _size.addOffsetToMinHeight)(contentMinHeight, -toolbarsAndVerticalOffsetsHeight, container);
      cssStyles = {
        height: 'auto',
        minHeight: minHeightValue,
        maxHeight: maxHeightValue
      };
    }

    return cssStyles;
  },
  _setHeightClasses: function _setHeightClasses($container, currentClass) {
    var excessClasses = '';

    for (var name in HEIGHT_STRATEGIES) {
      if (HEIGHT_STRATEGIES[name] !== currentClass) {
        excessClasses += ' ' + HEIGHT_STRATEGIES[name];
      }
    }

    $container.removeClass(excessClasses).addClass(currentClass);
  },
  _isAutoHeight: function _isAutoHeight() {
    return this.$overlayContent().get(0).style.height === 'auto';
  },
  _splitPopupHeight: function _splitPopupHeight() {
    var topToolbar = this.topToolbar();
    var bottomToolbar = this.bottomToolbar();
    return {
      header: (0, _size.getVisibleHeight)(topToolbar && topToolbar.get(0)),
      footer: (0, _size.getVisibleHeight)(bottomToolbar && bottomToolbar.get(0)),
      contentVerticalOffsets: (0, _size.getVerticalOffsets)(this.$overlayContent().get(0), true),
      popupVerticalOffsets: (0, _size.getVerticalOffsets)(this.$content().get(0), true),
      popupVerticalPaddings: (0, _size.getVerticalOffsets)(this.$content().get(0), false)
    };
  },
  _isAllWindowCovered: function _isAllWindowCovered() {
    return this.callBase() || this.option('fullScreen');
  },
  _renderDimensions: function _renderDimensions() {
    if (this.option('fullScreen')) {
      this.$overlayContent().css({
        width: '100%',
        height: '100%',
        minWidth: '',
        maxWidth: '',
        minHeight: '',
        maxHeight: ''
      });
    } else {
      this.callBase();
    }

    if ((0, _window.hasWindow)()) {
      this._renderFullscreenWidthClass();
    }
  },
  _renderFullscreenWidthClass: function _renderFullscreenWidthClass() {
    this.$overlayContent().toggleClass(POPUP_FULL_SCREEN_WIDTH_CLASS, (0, _size.getOuterWidth)(this.$overlayContent()) === (0, _size.getWidth)(window));
  },
  refreshPosition: function refreshPosition() {
    this._renderPosition();
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'showTitle':
      case 'title':
      case 'titleTemplate':
        this._renderTitle();

        this._renderGeometry();

        (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
        break;

      case 'bottomTemplate':
        this._renderBottom();

        this._renderGeometry();

        (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
        break;

      case 'onTitleRendered':
        this._createTitleRenderAction(args.value);

        break;

      case 'toolbarItems':
      case 'useDefaultToolbarButtons':
      case 'useFlatToolbarButtons':
        {
          // NOTE: Geometry rendering after "toolbarItems" runtime change breaks the popup animation first appereance.
          // But geometry rendering for options connected to the popup position still should be called.
          var shouldRenderGeometry = !args.fullName.match(/^toolbarItems((\[\d+\])(\.(options|visible).*)?)?$/);

          this._renderTitle();

          this._renderBottom();

          if (shouldRenderGeometry) {
            this._renderGeometry();

            (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
          }

          break;
        }

      case 'dragEnabled':
        this._renderDrag();

        break;

      case 'autoResizeEnabled':
        this._renderGeometry();

        (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
        break;

      case 'fullScreen':
        this._positionController.fullScreen = args.value;

        this._toggleFullScreenClass(args.value);

        this._toggleSafariScrolling();

        this._renderGeometry();

        (0, _visibility_change.triggerResizeEvent)(this.$overlayContent());
        break;

      case 'showCloseButton':
        this._renderTitle();

        break;

      default:
        this.callBase(args);
    }
  },
  bottomToolbar: function bottomToolbar() {
    return this._$bottom;
  },
  topToolbar: function topToolbar() {
    return this._$title;
  },
  $content: function $content() {
    return this._$popupContent;
  },
  content: function content() {
    return (0, _element.getPublicElement)(this.$content());
  },
  $overlayContent: function $overlayContent() {
    return this._$content;
  }
});

(0, _component_registrator.default)('dxPopup', Popup);
var _default = Popup;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;