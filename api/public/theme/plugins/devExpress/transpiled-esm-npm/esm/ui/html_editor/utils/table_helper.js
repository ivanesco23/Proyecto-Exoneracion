import $ from '../../../core/renderer';
import { each } from '../../../core/utils/iterator';
import { camelize } from '../../../core/utils/inflector';
var TABLE_FORMATS = ['table', 'tableHeaderCell'];
var TABLE_OPERATIONS = ['insertTable', 'insertHeaderRow', 'insertRowAbove', 'insertRowBelow', 'insertColumnLeft', 'insertColumnRight', 'deleteColumn', 'deleteRow', 'deleteTable', 'cellProperties', 'tableProperties'];

function getTableFormats(quill) {
  var tableModule = quill.getModule('table'); // backward compatibility with an old devextreme-quill packages

  return tableModule !== null && tableModule !== void 0 && tableModule.tableFormats ? tableModule.tableFormats() : TABLE_FORMATS;
}

function hasEmbedContent(module, selection) {
  return !!selection && module.quill.getText(selection).trim().length < selection.length;
}

function unfixTableWidth($table, tableBlot) {
  var unfixValue = 'initial';

  if (tableBlot) {
    tableBlot.format('tableWidth', unfixValue);
  } else {
    $table.css('width', unfixValue);
  }
}

function getColumnElements($table) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return $table.find('tr').eq(index).find('th, td');
}

function getAutoSizedElements($table) {
  var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'horizontal';
  var result = [];
  var isHorizontal = direction === 'horizontal';
  var $lineElements = isHorizontal ? getColumnElements($table) : getRowElements($table);
  $lineElements.each((index, element) => {
    var $element = $(element);

    if ($element.get(0).style[isHorizontal ? 'width' : 'height'] === '') {
      result.push($element);
    }
  });
  return result;
}

function setLineElementsFormat(module, _ref) {
  var {
    elements,
    property,
    value
  } = _ref;
  each(elements, (i, element) => {
    var cellBlot = module.quill.scroll.find(element);
    var fullPropertyName = "cell".concat(camelize(property, true));
    cellBlot === null || cellBlot === void 0 ? void 0 : cellBlot.format(fullPropertyName, value + 'px');
  });
}

function getLineElements($table, index) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'horizontal';
  return direction === 'horizontal' ? getRowElements($table, index) : getColumnElements($table, index);
}

function getRowElements($table) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return $table.find("th:nth-child(".concat(1 + index, "), td:nth-child(").concat(1 + index, ")"));
}

function getTableOperationHandler(quill, operationName) {
  for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  return () => {
    var table = quill.getModule('table');

    if (!table) {
      return;
    }

    quill.focus();
    return table[operationName](...rest);
  };
}

export { TABLE_OPERATIONS, getTableFormats, getTableOperationHandler, unfixTableWidth, getColumnElements, getAutoSizedElements, setLineElementsFormat, getLineElements, getRowElements, hasEmbedContent };