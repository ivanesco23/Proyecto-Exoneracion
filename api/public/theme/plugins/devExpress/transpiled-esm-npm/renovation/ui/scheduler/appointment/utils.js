"use strict";

exports.getAppointmentStyles = exports.getAppointmentKey = void 0;

var _utils = require("../workspaces/utils");

var getAppointmentStyles = function getAppointmentStyles(item) {
  var _item$geometry = item.geometry,
      height = _item$geometry.height,
      left = _item$geometry.left,
      top = _item$geometry.top,
      width = _item$geometry.width,
      resourceColor = item.info.resourceColor;
  var result = (0, _utils.addToStyles)([{
    attr: "height",
    value: height || 50
  }, {
    attr: "width",
    value: width || 50
  }, {
    attr: "top",
    value: top
  }, {
    attr: "left",
    value: left
  }]);

  if (resourceColor) {
    result = (0, _utils.addToStyles)([{
      attr: "backgroundColor",
      value: resourceColor
    }], result);
  }

  return result;
};

exports.getAppointmentStyles = getAppointmentStyles;

var getAppointmentKey = function getAppointmentKey(item) {
  var _item$geometry2 = item.geometry,
      height = _item$geometry2.height,
      left = _item$geometry2.left,
      leftVirtualWidth = _item$geometry2.leftVirtualWidth,
      top = _item$geometry2.top,
      topVirtualHeight = _item$geometry2.topVirtualHeight,
      width = _item$geometry2.width,
      _item$info = item.info,
      _item$info$appointmen = _item$info.appointment,
      endDate = _item$info$appointmen.endDate,
      startDate = _item$info$appointmen.startDate,
      groupIndex = _item$info.sourceAppointment.groupIndex;
  var startTime = startDate.getTime();
  var endTime = endDate.getTime();
  var leftOffset = left + leftVirtualWidth;
  var topOffset = top + topVirtualHeight;
  return "".concat(groupIndex, "-").concat(startTime, "-").concat(endTime, "_").concat(leftOffset, "-").concat(topOffset, "-").concat(width, "-").concat(height);
};

exports.getAppointmentKey = getAppointmentKey;