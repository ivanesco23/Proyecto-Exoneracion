import dateUtils from "../../../../../core/utils/date";
export var getStartViewDate = (startDayHour, firstDayOfWeek, currentDate) => {
  var firstMonthDate = dateUtils.getFirstMonthDate(currentDate);
  var result = dateUtils.getFirstWeekDate(firstMonthDate, firstDayOfWeek);
  result.setHours(startDayHour);
  return result;
};