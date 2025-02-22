"use strict";

exports.ICON_MAP = void 0;
exports.applyFormat = applyFormat;
exports.getDefaultClickHandler = getDefaultClickHandler;
exports.getFormatHandlers = getFormatHandlers;

var _renderer = _interopRequireDefault(require("../../../core/renderer"));

var _message = _interopRequireDefault(require("../../../localization/message"));

var _table_helper = require("./table_helper");

var _type = require("../../../core/utils/type");

var _iterator = require("../../../core/utils/iterator");

var _form = _interopRequireDefault(require("../../form"));

var _button_group = _interopRequireDefault(require("../../button_group"));

var _color_box = _interopRequireDefault(require("../../color_box"));

var _scroll_view = _interopRequireDefault(require("../../scroll_view"));

var _size = require("../../../core/utils/size");

var _window = require("../../../core/utils/window");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MIN_HEIGHT = 400;
var BORDER_STYLES = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];
var USER_ACTION = 'user';
var SILENT_ACTION = 'silent';
var DIALOG_COLOR_CAPTION = 'dxHtmlEditor-dialogColorCaption';
var DIALOG_BACKGROUND_CAPTION = 'dxHtmlEditor-dialogBackgroundCaption';
var DIALOG_LINK_CAPTION = 'dxHtmlEditor-dialogLinkCaption';
var DIALOG_IMAGE_CAPTION = 'dxHtmlEditor-dialogImageCaption';
var DIALOG_TABLE_CAPTION = 'dxHtmlEditor-dialogInsertTableCaption';
var DIALOG_LINK_FIELD_URL = 'dxHtmlEditor-dialogLinkUrlField';
var DIALOG_LINK_FIELD_TEXT = 'dxHtmlEditor-dialogLinkTextField';
var DIALOG_LINK_FIELD_TARGET = 'dxHtmlEditor-dialogLinkTargetField';
var DIALOG_LINK_FIELD_TARGET_CLASS = 'dx-formdialog-field-target';
var DIALOG_IMAGE_FIELD_URL = 'dxHtmlEditor-dialogImageUrlField';
var DIALOG_IMAGE_FIELD_ALT = 'dxHtmlEditor-dialogImageAltField';
var DIALOG_IMAGE_FIELD_WIDTH = 'dxHtmlEditor-dialogImageWidthField';
var DIALOG_IMAGE_FIELD_HEIGHT = 'dxHtmlEditor-dialogImageHeightField';
var DIALOG_TABLE_FIELD_COLUMNS = 'dxHtmlEditor-dialogInsertTableRowsField';
var DIALOG_TABLE_FIELD_ROWS = 'dxHtmlEditor-dialogInsertTableColumnsField';
var ICON_MAP = {
  insertHeaderRow: 'header',
  clear: 'clearformat'
};
exports.ICON_MAP = ICON_MAP;

function getFormatHandlers(module) {
  return {
    clear: function clear(_ref) {
      var event = _ref.event;
      var range = module.quill.getSelection();

      if (range) {
        var _getToolbarModule;

        module.saveValueChangeEvent(event);
        module.quill.removeFormat(range);
        (_getToolbarModule = getToolbarModule(module)) === null || _getToolbarModule === void 0 ? void 0 : _getToolbarModule.updateFormatWidgets();
      }
    },
    link: prepareLinkHandler(module),
    image: prepareImageHandler(module),
    color: prepareColorClickHandler(module, 'color'),
    background: prepareColorClickHandler(module, 'background'),
    orderedList: prepareShortcutHandler(module, 'list', 'ordered'),
    bulletList: prepareShortcutHandler(module, 'list', 'bullet'),
    alignLeft: prepareShortcutHandler(module, 'align', 'left'),
    alignCenter: prepareShortcutHandler(module, 'align', 'center'),
    alignRight: prepareShortcutHandler(module, 'align', 'right'),
    alignJustify: prepareShortcutHandler(module, 'align', 'justify'),
    codeBlock: getDefaultClickHandler(module, 'code-block'),
    undo: function undo(_ref2) {
      var event = _ref2.event;
      module.saveValueChangeEvent(event);
      module.quill.history.undo();
    },
    redo: function redo(_ref3) {
      var event = _ref3.event;
      module.saveValueChangeEvent(event);
      module.quill.history.redo();
    },
    increaseIndent: function increaseIndent(_ref4) {
      var event = _ref4.event;
      applyFormat(module, ['indent', '+1', USER_ACTION], event);
    },
    decreaseIndent: function decreaseIndent(_ref5) {
      var event = _ref5.event;
      applyFormat(module, ['indent', '-1', USER_ACTION], event);
    },
    superscript: prepareShortcutHandler(module, 'script', 'super'),
    subscript: prepareShortcutHandler(module, 'script', 'sub'),
    insertTable: prepareInsertTableHandler(module),
    insertHeaderRow: (0, _table_helper.getTableOperationHandler)(module.quill, 'insertHeaderRow'),
    insertRowAbove: (0, _table_helper.getTableOperationHandler)(module.quill, 'insertRowAbove'),
    insertRowBelow: (0, _table_helper.getTableOperationHandler)(module.quill, 'insertRowBelow'),
    insertColumnLeft: (0, _table_helper.getTableOperationHandler)(module.quill, 'insertColumnLeft'),
    insertColumnRight: (0, _table_helper.getTableOperationHandler)(module.quill, 'insertColumnRight'),
    deleteColumn: (0, _table_helper.getTableOperationHandler)(module.quill, 'deleteColumn'),
    deleteRow: (0, _table_helper.getTableOperationHandler)(module.quill, 'deleteRow'),
    deleteTable: (0, _table_helper.getTableOperationHandler)(module.quill, 'deleteTable'),
    cellProperties: prepareShowFormProperties(module, 'cell'),
    tableProperties: prepareShowFormProperties(module, 'table')
  };
}

function resetFormDialogOptions(editorInstance, _ref6) {
  var contentTemplate = _ref6.contentTemplate,
      title = _ref6.title,
      minHeight = _ref6.minHeight,
      minWidth = _ref6.minWidth,
      maxWidth = _ref6.maxWidth;
  editorInstance.formDialogOption({
    contentTemplate: contentTemplate,
    title: title,
    minHeight: minHeight !== null && minHeight !== void 0 ? minHeight : 0,
    minWidth: minWidth !== null && minWidth !== void 0 ? minWidth : 0,
    maxWidth: maxWidth !== null && maxWidth !== void 0 ? maxWidth : 'none'
  });
}

function prepareShowFormProperties(module, type) {
  return function ($element) {
    var _$element, _module$quill$getModu;

    if (!((_$element = $element) !== null && _$element !== void 0 && _$element.length)) {
      $element = (0, _renderer.default)(getTargetTableNode(module, type));
    }

    var _ref7 = (_module$quill$getModu = module.quill.getModule('table').getTable()) !== null && _module$quill$getModu !== void 0 ? _module$quill$getModu : [],
        _ref8 = _slicedToArray(_ref7, 2),
        tableBlot = _ref8[0],
        rowBlot = _ref8[1];

    var formats = module.quill.getFormat(module.editorInstance.getSelection(true));
    var tablePropertiesFormConfig = getFormConfigConstructor(type)(module, {
      $element: $element,
      formats: formats,
      tableBlot: tableBlot,
      rowBlot: rowBlot
    });

    var _module$editorInstanc = module.editorInstance._formDialog._popup.option(),
        contentTemplate = _module$editorInstanc.contentTemplate,
        title = _module$editorInstanc.title,
        minHeight = _module$editorInstanc.minHeight,
        minWidth = _module$editorInstanc.minWidth,
        maxWidth = _module$editorInstanc.maxWidth;

    var savedOptions = {
      contentTemplate: contentTemplate,
      title: title,
      minHeight: minHeight,
      minWidth: minWidth,
      maxWidth: maxWidth
    };
    var formInstance;
    module.editorInstance.formDialogOption({
      'contentTemplate': function contentTemplate(container) {
        var $content = (0, _renderer.default)('<div>').appendTo(container);
        var $form = (0, _renderer.default)('<div>').appendTo($content);

        module.editorInstance._createComponent($form, _form.default, tablePropertiesFormConfig.formOptions);

        module.editorInstance._createComponent($content, _scroll_view.default, {});

        formInstance = $form.dxForm('instance');
        return $content;
      },
      title: _message.default.format("dxHtmlEditor-".concat(type, "Properties")),
      minHeight: MIN_HEIGHT,
      minWidth: Math.min(800, (0, _size.getWidth)((0, _window.getWindow)()) * 0.9 - 1),
      maxWidth: (0, _size.getWidth)((0, _window.getWindow)()) * 0.9
    });
    var promise = module.editorInstance.showFormDialog();
    promise.done(function (formData, event) {
      module.saveValueChangeEvent(event);
      tablePropertiesFormConfig.applyHandler(formInstance);
      resetFormDialogOptions(module.editorInstance, savedOptions);
    });
    promise.fail(function () {
      module.quill.focus();
      resetFormDialogOptions(module.editorInstance, savedOptions);
    });
  };
}

function applyFormat(module, formatArgs, event) {
  var _module$quill;

  module.editorInstance._saveValueChangeEvent(event);

  (_module$quill = module.quill).format.apply(_module$quill, _toConsumableArray(formatArgs));
}

function getTargetTableNode(module, partName) {
  var currentSelectionParts = module.quill.getModule('table').getTable();
  return partName === 'table' ? currentSelectionParts[0].domNode : currentSelectionParts[2].domNode;
}

function prepareLinkHandler(module) {
  return function () {
    module.quill.focus();
    var selection = module.quill.getSelection();
    var selectionHasEmbedContent = (0, _table_helper.hasEmbedContent)(module, selection);
    var formats = selection ? module.quill.getFormat() : {};
    var formData = {
      href: formats.link || '',
      text: selection && !selectionHasEmbedContent ? module.quill.getText(selection) : '',
      target: Object.prototype.hasOwnProperty.call(formats, 'target') ? !!formats.target : true
    };
    module.editorInstance.formDialogOption('title', _message.default.format(DIALOG_LINK_CAPTION));
    var promise = module.editorInstance.showFormDialog({
      formData: formData,
      items: getLinkFormItems(module, selection)
    });
    promise.done(function (formData, event) {
      if (selection && !selectionHasEmbedContent) {
        var text = formData.text || formData.href;
        var index = selection.index,
            length = selection.length;
        formData.text = undefined;
        module.saveValueChangeEvent(event);
        length && module.quill.deleteText(index, length, SILENT_ACTION);
        module.quill.insertText(index, text, 'link', formData, USER_ACTION);
        module.quill.setSelection(index + text.length, 0, USER_ACTION);
      } else {
        formData.text = !selection && !formData.text ? formData.href : formData.text;
        applyFormat(module, ['link', formData, USER_ACTION], event);
      }
    });
    promise.fail(function () {
      module.quill.focus();
    });
  };
}

function prepareImageHandler(module) {
  return function () {
    var formData = module.quill.getFormat();
    var isUpdateDialog = Object.prototype.hasOwnProperty.call(formData, 'imageSrc');
    var defaultIndex = defaultPasteIndex(module);

    if (isUpdateDialog) {
      var _module$quill$getForm = module.quill.getFormat(defaultIndex - 1, 1),
          imageSrc = _module$quill$getForm.imageSrc;

      formData.src = formData.imageSrc;
      delete formData.imageSrc;

      if (!imageSrc || defaultIndex === 0) {
        module.quill.setSelection(defaultIndex + 1, 0, SILENT_ACTION);
      }
    }

    var formatIndex = embedFormatIndex(module);
    module.editorInstance.formDialogOption('title', _message.default.format(DIALOG_IMAGE_CAPTION));
    var promise = module.editorInstance.showFormDialog({
      formData: formData,
      items: imageFormItems()
    });
    promise.done(function (formData, event) {
      var index = defaultIndex;
      module.saveValueChangeEvent(event);

      if (isUpdateDialog) {
        index = formatIndex;
        module.quill.deleteText(index, 1, SILENT_ACTION);
      }

      module.quill.insertEmbed(index, 'extendedImage', formData, USER_ACTION);
      module.quill.setSelection(index + 1, 0, USER_ACTION);
    }).always(function () {
      module.quill.focus();
    });
  };
}

function getLinkFormItems(module, selection) {
  return [{
    dataField: 'href',
    label: {
      text: _message.default.format(DIALOG_LINK_FIELD_URL)
    }
  }, {
    dataField: 'text',
    label: {
      text: _message.default.format(DIALOG_LINK_FIELD_TEXT)
    },
    visible: !(0, _table_helper.hasEmbedContent)(module, selection)
  }, {
    dataField: 'target',
    editorType: 'dxCheckBox',
    editorOptions: {
      text: _message.default.format(DIALOG_LINK_FIELD_TARGET)
    },
    cssClass: DIALOG_LINK_FIELD_TARGET_CLASS,
    label: {
      visible: false
    }
  }];
}

function embedFormatIndex(module) {
  var selection = module.quill.getSelection();

  if (selection) {
    if (selection.length) {
      return selection.index;
    } else {
      return selection.index - 1;
    }
  } else {
    return module.quill.getLength();
  }
}

function defaultPasteIndex(module) {
  var _selection$index;

  var selection = module.quill.getSelection();
  return (_selection$index = selection === null || selection === void 0 ? void 0 : selection.index) !== null && _selection$index !== void 0 ? _selection$index : module.quill.getLength();
}

function imageFormItems() {
  return [{
    dataField: 'src',
    label: {
      text: _message.default.format(DIALOG_IMAGE_FIELD_URL)
    }
  }, {
    dataField: 'width',
    label: {
      text: _message.default.format(DIALOG_IMAGE_FIELD_WIDTH)
    }
  }, {
    dataField: 'height',
    label: {
      text: _message.default.format(DIALOG_IMAGE_FIELD_HEIGHT)
    }
  }, {
    dataField: 'alt',
    label: {
      text: _message.default.format(DIALOG_IMAGE_FIELD_ALT)
    }
  }];
}

function prepareColorClickHandler(module, name) {
  return function () {
    var formData = module.quill.getFormat();
    var caption = name === 'color' ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;
    module.editorInstance.formDialogOption('title', _message.default.format(caption));
    var promise = module.editorInstance.showFormDialog({
      formData: formData,
      items: [{
        dataField: name,
        editorType: 'dxColorView',
        editorOptions: {
          focusStateEnabled: false
        },
        label: {
          visible: false
        }
      }]
    });
    promise.done(function (formData, event) {
      applyFormat(module, [name, formData[name], USER_ACTION], event);
    });
    promise.fail(function () {
      module.quill.focus();
    });
  };
}

function prepareShortcutHandler(module, name, shortcutValue) {
  return function (_ref9) {
    var _getToolbarModule2;

    var event = _ref9.event;
    var formats = module.quill.getFormat();
    var value = formats[name] === shortcutValue ? false : shortcutValue;
    applyFormat(module, [name, value, USER_ACTION], event);
    (_getToolbarModule2 = getToolbarModule(module)) === null || _getToolbarModule2 === void 0 ? void 0 : _getToolbarModule2.updateFormatWidgets(true);
  };
}

function getToolbarModule(module) {
  return module._updateFormatWidget ? module : module.quill.getModule('toolbar');
}

function getDefaultClickHandler(module, name) {
  return function (_ref10) {
    var _getToolbarModule3;

    var event = _ref10.event;
    var formats = module.quill.getFormat();
    var value = formats[name];
    var newValue = !((0, _type.isBoolean)(value) ? value : (0, _type.isDefined)(value));
    applyFormat(module, [name, newValue, USER_ACTION], event);
    (_getToolbarModule3 = getToolbarModule(module)) === null || _getToolbarModule3 === void 0 ? void 0 : _getToolbarModule3._updateFormatWidget(name, newValue, formats);
  };
}

function insertTableFormItems() {
  return [{
    dataField: 'columns',
    editorType: 'dxNumberBox',
    editorOptions: {
      min: 1
    },
    label: {
      text: _message.default.format(DIALOG_TABLE_FIELD_COLUMNS)
    }
  }, {
    dataField: 'rows',
    editorType: 'dxNumberBox',
    editorOptions: {
      min: 1
    },
    label: {
      text: _message.default.format(DIALOG_TABLE_FIELD_ROWS)
    }
  }];
}

function prepareInsertTableHandler(module) {
  return function () {
    var formats = module.quill.getFormat();

    var isTableFocused = module._tableFormats.some(function (format) {
      return Object.prototype.hasOwnProperty.call(formats, format);
    });

    var formData = {
      rows: 1,
      columns: 1
    };

    if (isTableFocused) {
      module.quill.focus();
      return;
    }

    module.editorInstance.formDialogOption('title', _message.default.format(DIALOG_TABLE_CAPTION));
    var promise = module.editorInstance.showFormDialog({
      formData: formData,
      items: insertTableFormItems()
    });
    promise.done(function (formData, event) {
      module.quill.focus();
      var table = module.quill.getModule('table');

      if (table) {
        module.saveValueChangeEvent(event);
        var columns = formData.columns,
            rows = formData.rows;
        table.insertTable(columns, rows);
      }
    }).always(function () {
      module.quill.focus();
    });
  };
}

function getTablePropertiesFormConfig(module, _ref11) {
  var $element = _ref11.$element,
      formats = _ref11.formats,
      tableBlot = _ref11.tableBlot;
  var window = (0, _window.getWindow)();
  var alignmentEditorInstance;
  var borderColorEditorInstance;
  var backgroundColorEditorInstance;
  var $table = $element;
  var editorInstance = module.editorInstance;
  var startTableWidth = (0, _type.isDefined)(formats.tableWidth) ? parseInt(formats.tableWidth) : (0, _size.getOuterWidth)($table);
  var tableStyles = window.getComputedStyle($table.get(0));
  var startTextAlign = tableStyles.textAlign === 'start' ? 'left' : tableStyles.textAlign;
  var formOptions = {
    colCount: 2,
    formData: {
      width: startTableWidth,
      height: (0, _type.isDefined)(formats.tableHeight) ? parseInt(formats.tableHeight) : (0, _size.getOuterHeight)($table),
      backgroundColor: formats.tableBackgroundColor || tableStyles.backgroundColor,
      borderStyle: formats.tableBorderStyle || tableStyles.borderTopStyle,
      borderColor: formats.tableBorderColor || tableStyles.borderTopColor,
      borderWidth: parseInt((0, _type.isDefined)(formats.tableBorderWidth) ? formats.tableBorderWidth : tableStyles.borderTopWidth),
      alignment: formats.tableAlign || startTextAlign
    },
    items: [{
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-border'),
      colCountByScreen: {
        xs: 2
      },
      colCount: 2,
      items: [{
        dataField: 'borderStyle',
        label: {
          text: _message.default.format('dxHtmlEditor-style')
        },
        editorType: 'dxSelectBox',
        editorOptions: {
          items: BORDER_STYLES,
          placeholder: 'Select style'
        }
      }, {
        dataField: 'borderWidth',
        label: {
          text: _message.default.format('dxHtmlEditor-borderWidth')
        },
        editorOptions: {
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        itemType: 'simple',
        dataField: 'borderColor',
        label: {
          text: _message.default.format('dxHtmlEditor-borderColor')
        },
        colSpan: 2,
        template: function template(e) {
          var $content = (0, _renderer.default)('<div>');

          editorInstance._createComponent($content, _color_box.default, {
            editAlphaChannel: true,
            value: e.component.option('formData').borderColor,
            onInitialized: function onInitialized(e) {
              borderColorEditorInstance = e.component;
            }
          });

          return $content;
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-dimensions'),
      colCountByScreen: {
        xs: 2
      },
      colCount: 2,
      items: [{
        dataField: 'width',
        label: {
          text: _message.default.format('dxHtmlEditor-width')
        },
        editorOptions: {
          min: 0,
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        dataField: 'height',
        label: {
          text: _message.default.format('dxHtmlEditor-height')
        },
        editorOptions: {
          min: 0,
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-tableBackground'),
      items: [{
        itemType: 'simple',
        dataField: 'backgroundColor',
        label: {
          text: _message.default.format('dxHtmlEditor-borderColor')
        },
        template: function template(e) {
          var $content = (0, _renderer.default)('<div>');

          editorInstance._createComponent($content, _color_box.default, {
            editAlphaChannel: true,
            value: e.component.option('formData').backgroundColor,
            onInitialized: function onInitialized(e) {
              backgroundColorEditorInstance = e.component;
            }
          });

          return $content;
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-alignment'),
      items: [{
        itemType: 'simple',
        label: {
          text: _message.default.format('dxHtmlEditor-horizontal')
        },
        template: function template() {
          var $content = (0, _renderer.default)('<div>');

          editorInstance._createComponent($content, _button_group.default, {
            items: [{
              value: 'left',
              icon: 'alignleft'
            }, {
              value: 'center',
              icon: 'aligncenter'
            }, {
              value: 'right',
              icon: 'alignright'
            }, {
              value: 'justify',
              icon: 'alignjustify'
            }],
            keyExpr: 'value',
            selectedItemKeys: [startTextAlign],
            onInitialized: function onInitialized(e) {
              alignmentEditorInstance = e.component;
            }
          });

          return $content;
        }
      }]
    }],
    showColonAfterLabel: true,
    labelLocation: 'top',
    minColWidth: 400
  };

  var applyHandler = function applyHandler(formInstance) {
    var formData = formInstance.option('formData');
    var newWidth = formData.width === startTableWidth ? undefined : formData.width;
    var newHeight = formData.height;
    applyTableDimensionChanges(module, {
      $table: $table,
      newHeight: newHeight,
      newWidth: newWidth,
      tableBlot: tableBlot
    });
    module.editorInstance.format('tableBorderStyle', formData.borderStyle);
    module.editorInstance.format('tableBorderWidth', formData.borderWidth + 'px');
    module.editorInstance.format('tableBorderColor', borderColorEditorInstance.option('value'));
    module.editorInstance.format('tableBackgroundColor', backgroundColorEditorInstance.option('value'));
    module.editorInstance.format('tableTextAlign', alignmentEditorInstance.option('selectedItemKeys')[0]);
  };

  return {
    formOptions: formOptions,
    applyHandler: applyHandler
  };
}

function getCellPropertiesFormConfig(module, _ref12) {
  var $element = _ref12.$element,
      formats = _ref12.formats,
      tableBlot = _ref12.tableBlot,
      rowBlot = _ref12.rowBlot;
  var window = (0, _window.getWindow)();
  var alignmentEditorInstance;
  var verticalAlignmentEditorInstance;
  var borderColorEditorInstance;
  var backgroundColorEditorInstance;
  var $cell = $element;
  var startCellWidth = (0, _type.isDefined)(formats.cellWidth) ? parseInt(formats.cellWidth) : (0, _size.getOuterWidth)($cell);
  var editorInstance = module.editorInstance;
  var cellStyles = window.getComputedStyle($cell.get(0));
  var startTextAlign = cellStyles.textAlign === 'start' ? 'left' : cellStyles.textAlign;
  var formOptions = {
    colCount: 2,
    formData: {
      width: startCellWidth,
      height: (0, _type.isDefined)(formats.cellHeight) ? parseInt(formats.cellHeight) : (0, _size.getOuterHeight)($cell),
      backgroundColor: formats.cellBackgroundColor || cellStyles.backgroundColor,
      borderStyle: formats.cellBorderStyle || cellStyles.borderTopStyle,
      borderColor: formats.cellBorderColor || cellStyles.borderTopColor,
      borderWidth: parseInt((0, _type.isDefined)(formats.cellBorderWidth) ? formats.cellBorderWidth : cellStyles.borderTopWidth),
      alignment: formats.cellTextAlign || startTextAlign,
      verticalAlignment: formats.cellVerticalAlign || cellStyles.verticalAlign,
      verticalPadding: parseInt((0, _type.isDefined)(formats.cellPaddingTop) ? formats.cellPaddingTop : cellStyles.paddingTop),
      horizontalPadding: parseInt((0, _type.isDefined)(formats.cellPaddingLeft) ? formats.cellPaddingLeft : cellStyles.paddingLeft)
    },
    items: [{
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-border'),
      colCountByScreen: {
        xs: 2
      },
      colCount: 2,
      items: [{
        dataField: 'borderStyle',
        label: {
          text: _message.default.format('dxHtmlEditor-style')
        },
        editorType: 'dxSelectBox',
        editorOptions: {
          items: BORDER_STYLES
        }
      }, {
        dataField: 'borderWidth',
        label: {
          text: _message.default.format('dxHtmlEditor-borderWidth')
        },
        editorOptions: {
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        itemType: 'simple',
        dataField: 'borderColor',
        colSpan: 2,
        label: {
          text: _message.default.format('dxHtmlEditor-borderColor')
        },
        template: function template(e) {
          var $content = (0, _renderer.default)('<div>');

          editorInstance._createComponent($content, _color_box.default, {
            editAlphaChannel: true,
            value: e.component.option('formData').borderColor,
            onInitialized: function onInitialized(e) {
              borderColorEditorInstance = e.component;
            }
          });

          return $content;
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-dimensions'),
      colCount: 2,
      colCountByScreen: {
        xs: 2
      },
      items: [{
        dataField: 'width',
        label: {
          text: _message.default.format('dxHtmlEditor-width')
        },
        editorOptions: {
          min: 0,
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        dataField: 'height',
        label: {
          text: _message.default.format('dxHtmlEditor-height')
        },
        editorOptions: {
          min: 0,
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        dataField: 'verticalPadding',
        label: {
          text: _message.default.format('dxHtmlEditor-paddingVertical')
        },
        editorOptions: {
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }, {
        label: {
          text: _message.default.format('dxHtmlEditor-paddingHorizontal')
        },
        dataField: 'horizontalPadding',
        editorOptions: {
          placeholder: _message.default.format('dxHtmlEditor-pixels')
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-tableBackground'),
      items: [{
        itemType: 'simple',
        dataField: 'backgroundColor',
        label: {
          text: _message.default.format('dxHtmlEditor-borderColor')
        },
        template: function template(e) {
          var $content = (0, _renderer.default)('<div>');

          editorInstance._createComponent($content, _color_box.default, {
            editAlphaChannel: true,
            value: e.component.option('formData').backgroundColor,
            onInitialized: function onInitialized(e) {
              backgroundColorEditorInstance = e.component;
            }
          });

          return $content;
        }
      }]
    }, {
      itemType: 'group',
      caption: _message.default.format('dxHtmlEditor-alignment'),
      colCount: 2,
      items: [{
        itemType: 'simple',
        label: {
          text: _message.default.format('dxHtmlEditor-horizontal')
        },
        template: function template() {
          var $content = (0, _renderer.default)('<div>');

          editorInstance._createComponent($content, _button_group.default, {
            items: [{
              value: 'left',
              icon: 'alignleft'
            }, {
              value: 'center',
              icon: 'aligncenter'
            }, {
              value: 'right',
              icon: 'alignright'
            }, {
              value: 'justify',
              icon: 'alignjustify'
            }],
            keyExpr: 'value',
            selectedItemKeys: [startTextAlign],
            onInitialized: function onInitialized(e) {
              alignmentEditorInstance = e.component;
            }
          });

          return $content;
        }
      }, {
        itemType: 'simple',
        label: {
          text: _message.default.format('dxHtmlEditor-vertical')
        },
        template: function template() {
          var $content = (0, _renderer.default)('<div>');

          editorInstance._createComponent($content, _button_group.default, {
            items: [{
              value: 'top',
              icon: 'verticalaligntop'
            }, {
              value: 'middle',
              icon: 'verticalaligncenter'
            }, {
              value: 'bottom',
              icon: 'verticalalignbottom'
            }],
            keyExpr: 'value',
            selectedItemKeys: [cellStyles.verticalAlign],
            onInitialized: function onInitialized(e) {
              verticalAlignmentEditorInstance = e.component;
            }
          });

          return $content;
        }
      }]
    }],
    showColonAfterLabel: true,
    labelLocation: 'top',
    minColWidth: 400
  };

  var applyHandler = function applyHandler(formInstance) {
    var formData = formInstance.option('formData');
    var newWidth = formData.width === parseInt(startCellWidth) ? undefined : formData.width;
    var newHeight = formData.height;
    applyCellDimensionChanges(module, {
      $cell: $cell,
      newHeight: newHeight,
      newWidth: newWidth,
      tableBlot: tableBlot,
      rowBlot: rowBlot
    });
    module.editorInstance.format('cellBorderWidth', formData.borderWidth + 'px');
    module.editorInstance.format('cellBorderColor', borderColorEditorInstance.option('value'));
    module.editorInstance.format('cellBorderStyle', formData.borderStyle);
    module.editorInstance.format('cellBackgroundColor', backgroundColorEditorInstance.option('value'));
    module.editorInstance.format('cellTextAlign', alignmentEditorInstance.option('selectedItemKeys')[0]);
    module.editorInstance.format('cellVerticalAlign', verticalAlignmentEditorInstance.option('selectedItemKeys')[0]);
    module.editorInstance.format('cellPaddingLeft', formData.horizontalPadding + 'px');
    module.editorInstance.format('cellPaddingRight', formData.horizontalPadding + 'px');
    module.editorInstance.format('cellPaddingTop', formData.verticalPadding + 'px');
    module.editorInstance.format('cellPaddingBottom', formData.verticalPadding + 'px');
  };

  return {
    formOptions: formOptions,
    applyHandler: applyHandler
  };
}

function getFormConfigConstructor(type) {
  return type === 'cell' ? getCellPropertiesFormConfig : getTablePropertiesFormConfig;
}

function applyTableDimensionChanges(module, _ref13) {
  var $table = _ref13.$table,
      newHeight = _ref13.newHeight,
      newWidth = _ref13.newWidth,
      tableBlot = _ref13.tableBlot;

  if ((0, _type.isDefined)(newWidth)) {
    var autoWidthColumns = (0, _table_helper.getAutoSizedElements)($table);

    if (autoWidthColumns.length > 0) {
      module.editorInstance.format('tableWidth', newWidth + 'px');
    } else {
      var $columns = (0, _table_helper.getColumnElements)($table);
      var oldTableWidth = (0, _size.getOuterWidth)($table);
      (0, _table_helper.unfixTableWidth)($table, tableBlot);
      (0, _iterator.each)($columns, function (i, element) {
        var $element = (0, _renderer.default)(element);
        var newElementWidth = newWidth / oldTableWidth * (0, _size.getOuterWidth)($element);
        var $lineElements = (0, _table_helper.getLineElements)($table, $element.index(), 'horizontal');
        (0, _table_helper.setLineElementsFormat)(module, {
          elements: $lineElements,
          property: 'width',
          value: newElementWidth
        });
      });
    }
  }

  var autoHeightRows = (0, _table_helper.getAutoSizedElements)($table, 'vertical');

  if ((autoHeightRows === null || autoHeightRows === void 0 ? void 0 : autoHeightRows.length) > 0) {
    tableBlot.format('tableHeight', newHeight + 'px');
  } else {
    var $rows = (0, _table_helper.getRowElements)($table);
    var oldTableHeight = (0, _size.getOuterHeight)($table);
    (0, _iterator.each)($rows, function (i, element) {
      var $element = (0, _renderer.default)(element);
      var newElementHeight = newHeight / oldTableHeight * (0, _size.getOuterHeight)($element);
      var $lineElements = (0, _table_helper.getLineElements)($table, i, 'vertical');
      (0, _table_helper.setLineElementsFormat)(module, {
        elements: $lineElements,
        property: 'height',
        value: newElementHeight
      });
    });
  }
}

function applyCellDimensionChanges(module, _ref14) {
  var $cell = _ref14.$cell,
      newHeight = _ref14.newHeight,
      newWidth = _ref14.newWidth,
      tableBlot = _ref14.tableBlot,
      rowBlot = _ref14.rowBlot;
  var $table = (0, _renderer.default)($cell.closest('table'));

  if ((0, _type.isDefined)(newWidth)) {
    var index = (0, _renderer.default)($cell).index();
    var $verticalCells = (0, _table_helper.getLineElements)($table, index);
    var widthDiff = newWidth - (0, _size.getOuterWidth)($cell);
    var tableWidth = (0, _size.getOuterWidth)($table);

    if (newWidth > tableWidth) {
      (0, _table_helper.unfixTableWidth)($table, tableBlot);
    }

    (0, _table_helper.setLineElementsFormat)(module, {
      elements: $verticalCells,
      property: 'width',
      value: newWidth
    });
    var $nextColumnCell = $cell.next();
    var shouldUpdateNearestColumnWidth = (0, _table_helper.getAutoSizedElements)($table).length === 0;

    if (shouldUpdateNearestColumnWidth) {
      (0, _table_helper.unfixTableWidth)($table, tableBlot);

      if ($nextColumnCell.length === 1) {
        $verticalCells = (0, _table_helper.getLineElements)($table, index + 1);
        var nextColumnWidth = (0, _size.getOuterWidth)($verticalCells.eq(0)) - widthDiff;
        (0, _table_helper.setLineElementsFormat)(module, {
          elements: $verticalCells,
          property: 'width',
          value: Math.max(nextColumnWidth, 0)
        });
      } else {
        var $prevColumnCell = $cell.prev();

        if ($prevColumnCell.length === 1) {
          $verticalCells = (0, _table_helper.getLineElements)($table, index - 1);
          var prevColumnWidth = (0, _size.getOuterWidth)($verticalCells.eq(0)) - widthDiff;
          (0, _table_helper.setLineElementsFormat)(module, {
            elements: $verticalCells,
            property: 'width',
            value: Math.max(prevColumnWidth, 0)
          });
        }
      }
    }
  }

  rowBlot.children.forEach(function (rowCell) {
    rowCell.format('cellHeight', newHeight + 'px');
  });
  var autoHeightRows = (0, _table_helper.getAutoSizedElements)($table, 'vertical');

  if (autoHeightRows.length === 0) {
    $table.css('height', 'auto');
  }
}