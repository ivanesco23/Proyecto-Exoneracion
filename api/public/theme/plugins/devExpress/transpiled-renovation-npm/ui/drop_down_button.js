"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _ui = _interopRequireDefault(require("./widget/ui.widget"));

var _function_template = require("../core/templates/function_template");

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _button_group = _interopRequireDefault(require("./button_group"));

var _popup = _interopRequireDefault(require("./popup"));

var _list_light = _interopRequireDefault(require("./list_light"));

var _data = require("../core/utils/data");

var _element = require("../core/element");

var _icon = require("../core/utils/icon");

var _data_helper = _interopRequireDefault(require("../data_helper"));

var _data_source = require("../data/data_source/data_source");

var _array_store = _interopRequireDefault(require("../data/array_store"));

var _deferred = require("../core/utils/deferred");

var _extend = require("../core/utils/extend");

var _type = require("../core/utils/type");

var _common = require("../core/utils/common");

var _guid = _interopRequireDefault(require("../core/guid"));

var _utils = require("./drop_down_editor/utils");

var _message = _interopRequireDefault(require("../localization/message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// STYLE dropDownButton
var DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
var DROP_DOWN_BUTTON_CONTENT = 'dx-dropdownbutton-content';
var DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
var DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';
var DROP_DOWN_BUTTON_HAS_ARROW_CLASS = 'dx-dropdownbutton-has-arrow';
var DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS = 'dx-dropdownbutton-popup-wrapper';
var DROP_DOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';
var DX_BUTTON_TEXT_CLASS = 'dx-button-text';
var DX_ICON_RIGHT_CLASS = 'dx-icon-right';

var DropDownButton = _ui.default.inherit({
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      /**
       * @name dxDropDownButtonItem.key
       * @hidden
       */

      /**
       * @name dxDropDownButtonItem.showChevron
       * @hidden
       */
      itemTemplate: 'item',
      keyExpr: 'this',
      displayExpr: undefined,
      selectedItem: null,
      selectedItemKey: null,
      stylingMode: 'outlined',
      deferRendering: true,
      noDataText: _message.default.format('dxCollectionWidget-noDataText'),
      useSelectMode: false,
      splitButton: false,
      showArrowIcon: true,
      text: '',
      icon: undefined,
      onButtonClick: null,
      onSelectionChanged: null,
      onItemClick: null,
      opened: false,
      items: null,
      dataSource: null,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      dropDownOptions: {},
      dropDownContentTemplate: 'content',
      wrapItemText: false,
      useItemTextAsTitle: true,
      grouped: false,
      groupTemplate: 'group',
      buttonGroupOptions: {}
    });
  },
  _setOptionsByReference: function _setOptionsByReference() {
    this.callBase();
    (0, _extend.extend)(this._optionsByReference, {
      selectedItem: true
    });
  },
  _init: function _init() {
    this.callBase();

    this._createItemClickAction();

    this._createActionClickAction();

    this._createSelectionChangedAction();

    this._initDataSource();

    this._compileKeyGetter();

    this._compileDisplayGetter();

    this._itemsToDataSource(this.option('items'));

    this._options.cache('buttonGroupOptions', this.option('buttonGroupOptions'));

    this._options.cache('dropDownOptions', this.option('dropDownOptions'));
  },
  _initTemplates: function _initTemplates() {
    var _this = this;

    this._templateManager.addDefaultTemplates({
      content: new _function_template.FunctionTemplate(function (options) {
        var $popupContent = (0, _renderer.default)(options.container);
        var $listContainer = (0, _renderer.default)('<div>').appendTo($popupContent);
        _this._list = _this._createComponent($listContainer, _list_light.default, _this._listOptions());

        _this._list.registerKeyHandler('escape', _this._escHandler.bind(_this));

        _this._list.registerKeyHandler('tab', _this._escHandler.bind(_this));

        _this._list.registerKeyHandler('leftArrow', _this._escHandler.bind(_this));

        _this._list.registerKeyHandler('rightArrow', _this._escHandler.bind(_this));
      })
    });

    this.callBase();
  },
  _itemsToDataSource: function _itemsToDataSource(value) {
    if (!this._dataSource) {
      this._dataSource = new _data_source.DataSource({
        store: new _array_store.default({
          key: this._getKey(),
          data: value
        }),
        pageSize: 0
      });
    }
  },
  _getKey: function _getKey() {
    var _this$_dataSource;

    var keyExpr = this.option('keyExpr');
    var storeKey = (_this$_dataSource = this._dataSource) === null || _this$_dataSource === void 0 ? void 0 : _this$_dataSource.key();
    return (0, _type.isDefined)(storeKey) && (!(0, _type.isDefined)(keyExpr) || keyExpr === 'this') ? storeKey : keyExpr;
  },
  _compileKeyGetter: function _compileKeyGetter() {
    this._keyGetter = (0, _data.compileGetter)(this._getKey());
  },
  _compileDisplayGetter: function _compileDisplayGetter() {
    this._displayGetter = (0, _data.compileGetter)(this.option('displayExpr'));
  },
  _initMarkup: function _initMarkup() {
    this.callBase();
    this.$element().addClass(DROP_DOWN_BUTTON_CLASS);

    this._renderButtonGroup();

    this._updateArrowClass();

    if ((0, _type.isDefined)(this.option('selectedItemKey'))) {
      this._loadSelectedItem().done(this._updateActionButton.bind(this));
    }
  },
  // T977758
  _renderFocusTarget: _common.noop,
  _render: function _render() {
    if (!this.option('deferRendering') || this.option('opened')) {
      this._renderPopup();
    }

    this.callBase();
  },
  _renderContentImpl: function _renderContentImpl() {
    if (this._popup) {
      this._renderPopupContent();
    }

    return this.callBase();
  },
  _loadSelectedItem: function _loadSelectedItem() {
    var _this$_loadSingleDefe;

    (_this$_loadSingleDefe = this._loadSingleDeferred) === null || _this$_loadSingleDefe === void 0 ? void 0 : _this$_loadSingleDefe.reject();
    var d = new _deferred.Deferred();

    if (this._list && this._lastSelectedItemData !== undefined) {
      var cachedResult = this.option('useSelectMode') ? this._list.option('selectedItem') : this._lastSelectedItemData;
      return d.resolve(cachedResult);
    }

    this._lastSelectedItemData = undefined;
    var selectedItemKey = this.option('selectedItemKey');

    this._loadSingle(this._getKey(), selectedItemKey).done(d.resolve).fail(function () {
      d.resolve(null);
    });

    this._loadSingleDeferred = d;
    return d.promise();
  },
  _createActionClickAction: function _createActionClickAction() {
    this._actionClickAction = this._createActionByOption('onButtonClick');
  },
  _createSelectionChangedAction: function _createSelectionChangedAction() {
    this._selectionChangedAction = this._createActionByOption('onSelectionChanged');
  },
  _createItemClickAction: function _createItemClickAction() {
    this._itemClickAction = this._createActionByOption('onItemClick');
  },
  _fireSelectionChangedAction: function _fireSelectionChangedAction(_ref) {
    var previousValue = _ref.previousValue,
        value = _ref.value;

    this._selectionChangedAction({
      item: value,
      previousItem: previousValue
    });
  },
  _fireItemClickAction: function _fireItemClickAction(_ref2) {
    var event = _ref2.event,
        itemElement = _ref2.itemElement,
        itemData = _ref2.itemData;
    return this._itemClickAction({
      event: event,
      itemElement: itemElement,
      itemData: this._actionItem || itemData
    });
  },
  _actionButtonConfig: function _actionButtonConfig() {
    return {
      text: this.option('text'),
      icon: this.option('icon'),
      elementAttr: {
        class: DROP_DOWN_BUTTON_ACTION_CLASS
      }
    };
  },
  _getButtonGroupItems: function _getButtonGroupItems() {
    var items = [];
    items.push(this._actionButtonConfig());

    if (this.option('splitButton')) {
      items.push({
        icon: 'spindown',
        elementAttr: {
          class: DROP_DOWN_BUTTON_TOGGLE_CLASS
        }
      });
    }

    return items;
  },
  _buttonGroupItemClick: function _buttonGroupItemClick(_ref3) {
    var event = _ref3.event,
        itemData = _ref3.itemData;
    var isActionButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_ACTION_CLASS;
    var isToggleButton = itemData.elementAttr.class === DROP_DOWN_BUTTON_TOGGLE_CLASS;

    if (isToggleButton) {
      this.toggle();
    } else if (isActionButton) {
      this._actionClickAction({
        event: event,
        selectedItem: this.option('selectedItem')
      });

      if (!this.option('splitButton')) {
        this.toggle();
      }
    }
  },
  _buttonGroupOptions: function _buttonGroupOptions() {
    var _this2 = this;

    var buttonTemplate = this.option('splitButton') || !this.option('showArrowIcon') ? 'content' : function (_ref4, buttonContent) {
      var text = _ref4.text,
          icon = _ref4.icon;
      var $firstIcon = (0, _icon.getImageContainer)(icon);
      var $textContainer = text ? (0, _renderer.default)('<span>').text(text).addClass(DX_BUTTON_TEXT_CLASS) : undefined;
      var $secondIcon = (0, _icon.getImageContainer)('spindown').addClass(DX_ICON_RIGHT_CLASS);
      (0, _renderer.default)(buttonContent).append($firstIcon, $textContainer, $secondIcon);
    };
    return (0, _extend.extend)({
      items: this._getButtonGroupItems(),
      focusStateEnabled: this.option('focusStateEnabled'),
      hoverStateEnabled: this.option('hoverStateEnabled'),
      onItemClick: this._buttonGroupItemClick.bind(this),
      width: '100%',
      height: '100%',
      stylingMode: this.option('stylingMode'),
      selectionMode: 'none',
      tabIndex: this.option('tabIndex'),
      onKeyboardHandled: function onKeyboardHandled(e) {
        return _this2._keyboardHandler(e);
      },
      buttonTemplate: buttonTemplate
    }, this._options.cache('buttonGroupOptions'));
  },
  _renderPopupContent: function _renderPopupContent() {
    var $content = this._popup.$content();

    var template = this._getTemplateByOption('dropDownContentTemplate');

    $content.empty();
    this._popupContentId = 'dx-' + new _guid.default();
    this.setAria('id', this._popupContentId, $content);
    return template.render({
      container: (0, _element.getPublicElement)($content),
      model: this.option('items') || this._dataSource
    });
  },
  _popupOptions: function _popupOptions() {
    var _this3 = this;

    var horizontalAlignment = this.option('rtlEnabled') ? 'right' : 'left';
    return (0, _extend.extend)({
      dragEnabled: false,
      focusStateEnabled: false,
      deferRendering: this.option('deferRendering'),
      closeOnOutsideClick: function closeOnOutsideClick(e) {
        var $element = _this3.$element();

        var $buttonClicked = (0, _renderer.default)(e.target).closest(".".concat(DROP_DOWN_BUTTON_CLASS));
        return !$buttonClicked.is($element);
      },
      showTitle: false,
      animation: {
        show: {
          type: 'fade',
          duration: 0,
          from: 0,
          to: 1
        },
        hide: {
          type: 'fade',
          duration: 400,
          from: 1,
          to: 0
        }
      },
      _ignoreFunctionValueDeprecation: true,
      width: function width() {
        return (0, _utils.getElementWidth)(_this3.$element());
      },
      height: 'auto',
      shading: false,
      position: {
        of: this.$element(),
        collision: 'flipfit',
        my: horizontalAlignment + ' top',
        at: horizontalAlignment + ' bottom'
      },
      wrapperAttr: {
        class: DROP_DOWN_EDITOR_OVERLAY_CLASS
      }
    }, this._options.cache('dropDownOptions'), {
      visible: this.option('opened')
    });
  },
  _listOptions: function _listOptions() {
    var _this4 = this;

    var selectedItemKey = this.option('selectedItemKey');
    var useSelectMode = this.option('useSelectMode');
    return {
      selectionMode: useSelectMode ? 'single' : 'none',
      wrapItemText: this.option('wrapItemText'),
      focusStateEnabled: this.option('focusStateEnabled'),
      hoverStateEnabled: this.option('hoverStateEnabled'),
      useItemTextAsTitle: this.option('useItemTextAsTitle'),
      onContentReady: function onContentReady() {
        return _this4._fireContentReadyAction();
      },
      selectedItemKeys: (0, _type.isDefined)(selectedItemKey) && useSelectMode ? [selectedItemKey] : [],
      grouped: this.option('grouped'),
      groupTemplate: this.option('groupTemplate'),
      keyExpr: this._getKey(),
      noDataText: this.option('noDataText'),
      displayExpr: this.option('displayExpr'),
      itemTemplate: this.option('itemTemplate'),
      items: this.option('items'),
      dataSource: this._dataSource,
      onItemClick: function onItemClick(e) {
        if (!_this4.option('useSelectMode')) {
          _this4._lastSelectedItemData = e.itemData;
        }

        _this4.option('selectedItemKey', _this4._keyGetter(e.itemData));

        var actionResult = _this4._fireItemClickAction(e);

        if (actionResult !== false) {
          _this4.toggle(false);

          _this4._buttonGroup.focus();
        }
      }
    };
  },
  _upDownKeyHandler: function _upDownKeyHandler() {
    if (this._popup && this._popup.option('visible') && this._list) {
      this._list.focus();
    } else {
      this.open();
    }

    return true;
  },
  _escHandler: function _escHandler() {
    this.close();

    this._buttonGroup.focus();

    return true;
  },
  _tabHandler: function _tabHandler() {
    this.close();
    return true;
  },
  _renderPopup: function _renderPopup() {
    var $popup = (0, _renderer.default)('<div>');
    this.$element().append($popup);
    this._popup = this._createComponent($popup, _popup.default, this._popupOptions());

    this._popup.$content().addClass(DROP_DOWN_BUTTON_CONTENT);

    this._popup.$wrapper().addClass(DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS);

    this._popup.on('hiding', this._popupHidingHandler.bind(this));

    this._popup.on('showing', this._popupShowingHandler.bind(this));

    this._bindInnerWidgetOptions(this._popup, 'dropDownOptions');
  },
  _popupHidingHandler: function _popupHidingHandler() {
    this.option('opened', false);
    this.setAria({
      expanded: false,
      owns: undefined
    });
  },
  _popupOptionChanged: function _popupOptionChanged(args) {
    var options = _ui.default.getOptionsFromContainer(args);

    this._setPopupOption(options);

    var optionsKeys = Object.keys(options);

    if (optionsKeys.indexOf('width') !== -1 || optionsKeys.indexOf('height') !== -1) {
      this._dimensionChanged();
    }
  },
  _dimensionChanged: function _dimensionChanged() {
    var _this5 = this;

    var popupWidth = (0, _utils.getSizeValue)(this.option('dropDownOptions.width'));

    if (popupWidth === undefined) {
      this._setPopupOption('width', function () {
        return (0, _utils.getElementWidth)(_this5.$element());
      });
    }
  },
  _setPopupOption: function _setPopupOption(optionName, value) {
    this._setWidgetOption('_popup', arguments);
  },
  _popupShowingHandler: function _popupShowingHandler() {
    this.option('opened', true);
    this.setAria({
      expanded: true,
      owns: this._popupContentId
    });
  },
  _renderButtonGroup: function _renderButtonGroup() {
    var $buttonGroup = this._buttonGroup && this._buttonGroup.$element() || (0, _renderer.default)('<div>');

    if (!this._buttonGroup) {
      this.$element().append($buttonGroup);
    }

    this._buttonGroup = this._createComponent($buttonGroup, _button_group.default, this._buttonGroupOptions());

    this._buttonGroup.registerKeyHandler('downArrow', this._upDownKeyHandler.bind(this));

    this._buttonGroup.registerKeyHandler('tab', this._tabHandler.bind(this));

    this._buttonGroup.registerKeyHandler('upArrow', this._upDownKeyHandler.bind(this));

    this._buttonGroup.registerKeyHandler('escape', this._escHandler.bind(this));

    this._bindInnerWidgetOptions(this._buttonGroup, 'buttonGroupOptions');
  },
  _updateArrowClass: function _updateArrowClass() {
    var hasArrow = this.option('splitButton') || this.option('showArrowIcon');
    this.$element().toggleClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS, hasArrow);
  },
  toggle: function toggle(visible) {
    if (!this._popup) {
      this._renderPopup();

      this._renderContent();
    }

    return this._popup.toggle(visible);
  },
  open: function open() {
    return this.toggle(true);
  },
  close: function close() {
    return this.toggle(false);
  },
  _setListOption: function _setListOption(name, value) {
    this._list && this._list.option(name, value);
  },
  _getDisplayValue: function _getDisplayValue(item) {
    var isPrimitiveItem = !(0, _type.isPlainObject)(item);
    var displayValue = isPrimitiveItem ? item : this._displayGetter(item);
    return !(0, _type.isPlainObject)(displayValue) ? String((0, _common.ensureDefined)(displayValue, '')) : '';
  },
  _updateActionButton: function _updateActionButton(selectedItem) {
    if (this.option('useSelectMode')) {
      this.option({
        text: this._getDisplayValue(selectedItem),
        icon: (0, _type.isPlainObject)(selectedItem) ? selectedItem.icon : undefined
      });
    }

    this._setOptionWithoutOptionChange('selectedItem', selectedItem);

    this._setOptionWithoutOptionChange('selectedItemKey', this._keyGetter(selectedItem));
  },
  _clean: function _clean() {
    this._list && this._list.$element().remove();
    this._popup && this._popup.$element().remove();
  },
  _selectedItemKeyChanged: function _selectedItemKeyChanged(value) {
    var _this6 = this;

    this._setListOption('selectedItemKeys', this.option('useSelectMode') && (0, _type.isDefined)(value) ? [value] : []);

    var previousItem = this.option('selectedItem');

    this._loadSelectedItem().done(function (selectedItem) {
      _this6._updateActionButton(selectedItem);

      if (_this6._displayGetter(previousItem) !== _this6._displayGetter(selectedItem)) {
        _this6._fireSelectionChangedAction({
          previousValue: previousItem,
          value: selectedItem
        });
      }
    });
  },
  _actionButtonOptionChanged: function _actionButtonOptionChanged(_ref5) {
    var name = _ref5.name,
        value = _ref5.value;
    var newConfig = {};
    newConfig[name] = value;

    this._buttonGroup.option('items[0]', (0, _extend.extend)({}, this._actionButtonConfig(), newConfig));

    this._popup && this._popup.repaint();
  },
  _selectModeChanged: function _selectModeChanged(value) {
    if (value) {
      this._setListOption('selectionMode', 'single');

      var selectedItemKey = this.option('selectedItemKey');

      this._setListOption('selectedItemKeys', (0, _type.isDefined)(selectedItemKey) ? [selectedItemKey] : []);
    } else {
      this._setListOption('selectionMode', 'none');

      this.option({
        'selectedItemKey': undefined,
        'selectedItem': undefined
      });
    }
  },
  _updateItemCollection: function _updateItemCollection(optionName) {
    var _this7 = this;

    var selectedItemKey = this.option('selectedItemKey');

    this._setListOption('selectedItem', null);

    this._setWidgetOption('_list', [optionName]);

    if ((0, _type.isDefined)(selectedItemKey)) {
      this._loadSelectedItem().done(function (selectedItem) {
        _this7._setListOption('selectedItemKeys', [selectedItemKey]);

        _this7._setListOption('selectedItem', selectedItem);
      }).fail(function (error) {
        _this7._setListOption('selectedItemKeys', []);
      }).always(this._updateActionButton.bind(this));
    }
  },
  _updateDataSource: function _updateDataSource() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._dataSource.items();
    this._dataSource = undefined;

    this._itemsToDataSource(items);

    this._updateKeyExpr();
  },
  _updateKeyExpr: function _updateKeyExpr() {
    this._compileKeyGetter();

    this._setListOption('keyExpr', this._getKey());
  },
  focus: function focus() {
    this._buttonGroup.focus();
  },
  _optionChanged: function _optionChanged(args) {
    var _this$_popup;

    var name = args.name,
        value = args.value;

    switch (name) {
      case 'useSelectMode':
        this._selectModeChanged(value);

        break;

      case 'splitButton':
        this._updateArrowClass();

        this._renderButtonGroup();

        break;

      case 'displayExpr':
        this._compileDisplayGetter();

        this._setListOption(name, value);

        this._updateActionButton(this.option('selectedItem'));

        break;

      case 'keyExpr':
        this._updateDataSource();

        break;

      case 'buttonGroupOptions':
        this._innerWidgetOptionChanged(this._buttonGroup, args);

        break;

      case 'dropDownOptions':
        if (args.fullName === 'dropDownOptions.visible') {
          break;
        }

        if (args.value.visible !== undefined) {
          delete args.value.visible;
        }

        this._popupOptionChanged(args);

        this._innerWidgetOptionChanged(this._popup, args);

        break;

      case 'opened':
        this.toggle(value);
        break;

      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._setListOption(name, value);

        this._buttonGroup.option(name, value);

        this.callBase(args);
        break;

      case 'items':
        this._updateDataSource(this.option('items'));

        this._updateItemCollection(name);

        break;

      case 'dataSource':
        if (Array.isArray(value)) {
          this._updateDataSource(this.option('dataSource'));
        } else {
          this._initDataSource();

          this._updateKeyExpr();
        }

        this._updateItemCollection(name);

        break;

      case 'icon':
      case 'text':
        this._actionButtonOptionChanged(args);

        break;

      case 'showArrowIcon':
        this._updateArrowClass();

        this._renderButtonGroup();

        this._popup && this._popup.repaint();
        break;

      case 'width':
      case 'height':
        this.callBase(args);
        (_this$_popup = this._popup) === null || _this$_popup === void 0 ? void 0 : _this$_popup.repaint();
        break;

      case 'stylingMode':
        this._buttonGroup.option(name, value);

        break;

      case 'itemTemplate':
      case 'grouped':
      case 'noDataText':
      case 'groupTemplate':
      case 'wrapItemText':
      case 'useItemTextAsTitle':
        this._setListOption(name, value);

        break;

      case 'dropDownContentTemplate':
        this._renderContent();

        break;

      case 'selectedItemKey':
        this._selectedItemKeyChanged(value);

        break;

      case 'selectedItem':
        break;

      case 'onItemClick':
        this._createItemClickAction();

        break;

      case 'onButtonClick':
        this._createActionClickAction();

        break;

      case 'onSelectionChanged':
        this._createSelectionChangedAction();

        break;

      case 'deferRendering':
        this.toggle(this.option('opened'));
        break;

      case 'tabIndex':
        this._buttonGroup.option(name, value);

        break;

      default:
        this.callBase(args);
    }
  }
}).include(_data_helper.default);

(0, _component_registrator.default)('dxDropDownButton', DropDownButton);
var _default = DropDownButton;
/**
 * @name dxDropDownButtonItem
 * @inherits dxListItem
 * @type object
 */

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;