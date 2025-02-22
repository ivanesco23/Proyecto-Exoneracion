"use strict";

exports.LABEL_VERTICAL_ALIGNMENT_CLASS = exports.LABEL_HORIZONTAL_ALIGNMENT_CLASS = exports.FLEX_LAYOUT_CLASS = exports.FIELD_ITEM_REQUIRED_CLASS = exports.FIELD_ITEM_OPTIONAL_CLASS = exports.FIELD_ITEM_LABEL_ALIGN_CLASS = exports.FIELD_ITEM_HELP_TEXT_CLASS = exports.FIELD_ITEM_CONTENT_WRAPPER_CLASS = exports.FIELD_ITEM_CONTENT_LOCATION_CLASS = void 0;
exports.renderFieldItem = renderFieldItem;

var _renderer = _interopRequireDefault(require("../../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));

var _click = require("../../../events/click");

var _element = require("../../../core/element");

var _inflector = require("../../../core/utils/inflector");

var _string = require("../../../core/utils/string");

var _themes = require("../../themes");

var _ui = _interopRequireDefault(require("../../widget/ui.errors"));

var _validator = _interopRequireDefault(require("../../validator"));

var _constants = require("../constants");

var _label = require("./label");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FLEX_LAYOUT_CLASS = 'dx-flex-layout';
exports.FLEX_LAYOUT_CLASS = FLEX_LAYOUT_CLASS;
var FIELD_ITEM_OPTIONAL_CLASS = 'dx-field-item-optional';
exports.FIELD_ITEM_OPTIONAL_CLASS = FIELD_ITEM_OPTIONAL_CLASS;
var FIELD_ITEM_REQUIRED_CLASS = 'dx-field-item-required';
exports.FIELD_ITEM_REQUIRED_CLASS = FIELD_ITEM_REQUIRED_CLASS;
var FIELD_ITEM_CONTENT_WRAPPER_CLASS = 'dx-field-item-content-wrapper';
exports.FIELD_ITEM_CONTENT_WRAPPER_CLASS = FIELD_ITEM_CONTENT_WRAPPER_CLASS;
var FIELD_ITEM_CONTENT_LOCATION_CLASS = 'dx-field-item-content-location-';
exports.FIELD_ITEM_CONTENT_LOCATION_CLASS = FIELD_ITEM_CONTENT_LOCATION_CLASS;
var FIELD_ITEM_LABEL_ALIGN_CLASS = 'dx-field-item-label-align';
exports.FIELD_ITEM_LABEL_ALIGN_CLASS = FIELD_ITEM_LABEL_ALIGN_CLASS;
var FIELD_ITEM_HELP_TEXT_CLASS = 'dx-field-item-help-text';
exports.FIELD_ITEM_HELP_TEXT_CLASS = FIELD_ITEM_HELP_TEXT_CLASS;
var LABEL_VERTICAL_ALIGNMENT_CLASS = 'dx-label-v-align';
exports.LABEL_VERTICAL_ALIGNMENT_CLASS = LABEL_VERTICAL_ALIGNMENT_CLASS;
var LABEL_HORIZONTAL_ALIGNMENT_CLASS = 'dx-label-h-align';
exports.LABEL_HORIZONTAL_ALIGNMENT_CLASS = LABEL_HORIZONTAL_ALIGNMENT_CLASS;
var TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
var INVALID_CLASS = 'dx-invalid';

function renderFieldItem(_ref) {
  var $parent = _ref.$parent,
      rootElementCssClassList = _ref.rootElementCssClassList,
      parentComponent = _ref.parentComponent,
      createComponentCallback = _ref.createComponentCallback,
      useFlexLayout = _ref.useFlexLayout,
      labelOptions = _ref.labelOptions,
      labelNeedBaselineAlign = _ref.labelNeedBaselineAlign,
      labelLocation = _ref.labelLocation,
      needRenderLabel = _ref.needRenderLabel,
      formLabelLocation = _ref.formLabelLocation,
      item = _ref.item,
      editorOptions = _ref.editorOptions,
      isSimpleItem = _ref.isSimpleItem,
      isRequired = _ref.isRequired,
      template = _ref.template,
      helpID = _ref.helpID,
      labelID = _ref.labelID,
      name = _ref.name,
      helpText = _ref.helpText,
      requiredMessageTemplate = _ref.requiredMessageTemplate,
      validationGroup = _ref.validationGroup;
  var $rootElement = (0, _renderer.default)('<div>').addClass(rootElementCssClassList.join(' ')).appendTo($parent);
  $rootElement.addClass(isRequired ? FIELD_ITEM_REQUIRED_CLASS : FIELD_ITEM_OPTIONAL_CLASS);

  if (isSimpleItem && useFlexLayout) {
    $rootElement.addClass(FLEX_LAYOUT_CLASS);
  }

  if (isSimpleItem && labelNeedBaselineAlign) {
    // TODO: label related code, execute ony if needRenderLabel ?
    $rootElement.addClass(FIELD_ITEM_LABEL_ALIGN_CLASS);
  } //
  // Setup field editor container:
  //


  var $fieldEditorContainer = (0, _renderer.default)('<div>');
  $fieldEditorContainer.data('dx-form-item', item);
  var locationClassSuffix = {
    right: 'left',
    left: 'right',
    top: 'bottom'
  };
  $fieldEditorContainer.addClass(_constants.FIELD_ITEM_CONTENT_CLASS).addClass(FIELD_ITEM_CONTENT_LOCATION_CLASS + locationClassSuffix[formLabelLocation]); //
  // Setup $label:
  //

  var $label = needRenderLabel ? (0, _label.renderLabel)(labelOptions) : null;

  if ($label) {
    $rootElement.append($label);

    if (labelLocation === 'top' || labelLocation === 'left') {
      $rootElement.append($fieldEditorContainer);
    }

    if (labelLocation === 'right') {
      $rootElement.prepend($fieldEditorContainer);
    }

    if (labelLocation === 'top') {
      $rootElement.addClass(LABEL_VERTICAL_ALIGNMENT_CLASS);
    } else {
      $rootElement.addClass(LABEL_HORIZONTAL_ALIGNMENT_CLASS);
    }

    if (item.editorType === 'dxCheckBox' || item.editorType === 'dxSwitch') {
      _events_engine.default.on($label, _click.name, function () {
        _events_engine.default.trigger($fieldEditorContainer.children(), _click.name);
      });
    }
  } else {
    $rootElement.append($fieldEditorContainer);
  } //
  // Append field editor:
  //


  var widgetInstance;

  if (template) {
    template.render({
      container: (0, _element.getPublicElement)($fieldEditorContainer),
      model: {
        dataField: item.dataField,
        editorType: item.editorType,
        editorOptions: editorOptions,
        component: parentComponent,
        name: item.name
      }
    });
  } else {
    var $div = (0, _renderer.default)('<div>').appendTo($fieldEditorContainer);

    try {
      widgetInstance = createComponentCallback($div, item.editorType, editorOptions);
      widgetInstance.setAria('describedby', helpID);
      widgetInstance.setAria('labelledby', labelID);
      widgetInstance.setAria('required', isRequired);
    } catch (e) {
      _ui.default.log('E1035', e.message);
    }
  } //
  // Setup $validation:
  //


  var editorElem = $fieldEditorContainer.children().first();
  var $validationTarget = editorElem.hasClass(TEMPLATE_WRAPPER_CLASS) ? editorElem.children().first() : editorElem;
  var validationTargetInstance = $validationTarget && $validationTarget.data('dx-validation-target');

  if (validationTargetInstance) {
    var isItemHaveCustomLabel = item.label && item.label.text;
    var itemName = isItemHaveCustomLabel ? null : name;
    var fieldName = isItemHaveCustomLabel ? item.label.text : itemName && (0, _inflector.captionize)(itemName);
    var validationRules;

    if (isSimpleItem) {
      if (item.validationRules) {
        validationRules = item.validationRules;
      } else {
        var requiredMessage = (0, _string.format)(requiredMessageTemplate, fieldName || '');
        validationRules = item.isRequired ? [{
          type: 'required',
          message: requiredMessage
        }] : null;
      }
    }

    if (Array.isArray(validationRules) && validationRules.length) {
      createComponentCallback($validationTarget, _validator.default, {
        validationRules: validationRules,
        validationGroup: validationGroup,
        dataGetter: function dataGetter() {
          return {
            formItem: item
          };
        }
      });
    }

    if ((0, _themes.isMaterial)()) {
      var wrapperClass = '.' + FIELD_ITEM_CONTENT_WRAPPER_CLASS;

      var toggleInvalidClass = function toggleInvalidClass(e) {
        (0, _renderer.default)(e.element).parents(wrapperClass).toggleClass(INVALID_CLASS, e.component.option('isValid') === false && (e.component._isFocused() || e.component.option('validationMessageMode') === 'always'));
      };

      validationTargetInstance.on('optionChanged', function (e) {
        if (e.name !== 'isValid') return;
        toggleInvalidClass(e);
      });
      validationTargetInstance.on('focusIn', toggleInvalidClass).on('focusOut', toggleInvalidClass).on('enterKey', toggleInvalidClass);
    }
  } //
  // Append help text elements:
  //


  if (helpText && isSimpleItem) {
    var $editorParent = $fieldEditorContainer.parent(); // TODO: DOM hierarchy is changed here: new node is added between $editor and $editor.parent()

    $editorParent.append((0, _renderer.default)('<div>').addClass(FIELD_ITEM_CONTENT_WRAPPER_CLASS).append($fieldEditorContainer).append((0, _renderer.default)('<div>').addClass(FIELD_ITEM_HELP_TEXT_CLASS).attr('id', helpID).text(helpText)));
  }

  return {
    $fieldEditorContainer: $fieldEditorContainer,
    $rootElement: $rootElement,
    widgetInstance: widgetInstance
  };
}