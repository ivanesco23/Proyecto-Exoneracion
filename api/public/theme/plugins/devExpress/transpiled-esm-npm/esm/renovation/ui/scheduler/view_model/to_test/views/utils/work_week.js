import dateUtils from "../../../../../../../core/utils/date";
import { getViewStartByOptions, setOptionHour } from "./base";
import { getValidStartDate } from "./week";
var SATURDAY_INDEX = 6;
var SUNDAY_INDEX = 0;
export var isDataOnWeekend = date => {
  var day = date.getDay();
  return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
};
export var getWeekendsCount = days => 2 * Math.floor(days / 7);
export var calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration, firstDayOfWeek) => {
  var viewStart = getViewStartByOptions(startDate, currentDate, intervalDuration, getValidStartDate(startDate, firstDayOfWeek));
  var firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
  var normalizedDate = dateUtils.normalizeDateByWeek(firstViewDate, viewStart);
  return setOptionHour(normalizedDate, startDayHour);
};