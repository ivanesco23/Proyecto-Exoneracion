"use strict";

exports.getTotalRowCount = exports.getTotalCellCount = exports.getRowCountWithAllDayRow = exports.getHiddenInterval = exports.getDateForHeaderText = exports.createCellElementMetaData = void 0;

var _date = _interopRequireDefault(require("../../../../../core/utils/date"));

var _utils = require("../../../../../ui/scheduler/resources/utils");

var _utils2 = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DAY_MS = _date.default.dateToMilliseconds("day");

var HOUR_MS = _date.default.dateToMilliseconds("hour");

var getTotalRowCount = function getTotalRowCount(rowCount, groupOrientation, groups, isAllDayPanelVisible) {
  var isVerticalGrouping = (0, _utils2.isVerticalGroupingApplied)(groups, groupOrientation);
  var groupCount = (0, _utils.getGroupCount)(groups);
  var totalRowCount = isVerticalGrouping ? rowCount * groupCount : rowCount;
  return isAllDayPanelVisible ? totalRowCount + groupCount : totalRowCount;
};

exports.getTotalRowCount = getTotalRowCount;

var getTotalCellCount = function getTotalCellCount(cellCount, groupOrientation, groups) {
  var isHorizontalGrouping = (0, _utils2.isHorizontalGroupingApplied)(groups, groupOrientation);
  var groupCount = (0, _utils.getGroupCount)(groups);
  return isHorizontalGrouping ? cellCount * groupCount : cellCount;
};

exports.getTotalCellCount = getTotalCellCount;

var getRowCountWithAllDayRow = function getRowCountWithAllDayRow(rowCount, isAllDayPanelVisible) {
  return isAllDayPanelVisible ? rowCount + 1 : rowCount;
};

exports.getRowCountWithAllDayRow = getRowCountWithAllDayRow;

var getHiddenInterval = function getHiddenInterval(hoursInterval, cellCountInDay) {
  var visibleInterval = hoursInterval * cellCountInDay * HOUR_MS;
  return DAY_MS - visibleInterval;
};

exports.getHiddenInterval = getHiddenInterval;

var createCellElementMetaData = function createCellElementMetaData(tableRect, cellRect) {
  var bottom = cellRect.bottom,
      height = cellRect.height,
      left = cellRect.left,
      right = cellRect.right,
      top = cellRect.top,
      width = cellRect.width,
      x = cellRect.x,
      y = cellRect.y;
  return {
    right: right,
    bottom: bottom,
    left: left - tableRect.left,
    top: top - tableRect.top,
    width: width,
    height: height,
    x: x,
    y: y
  };
};

exports.createCellElementMetaData = createCellElementMetaData;

var getDateForHeaderText = function getDateForHeaderText(_, date) {
  return date;
};

exports.getDateForHeaderText = getDateForHeaderText;