"use strict";

exports.getStartViewDate = void 0;

var _date = _interopRequireDefault(require("../../../../../core/utils/date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getStartViewDate = function getStartViewDate(startDayHour, _firstDayOfWeek, currentDate) {
  var result = _date.default.getFirstMonthDate(currentDate);

  result.setHours(startDayHour);
  return result;
};

exports.getStartViewDate = getStartViewDate;