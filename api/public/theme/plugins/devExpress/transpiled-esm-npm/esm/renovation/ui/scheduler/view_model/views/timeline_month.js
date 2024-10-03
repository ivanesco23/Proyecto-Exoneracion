import dateUtils from "../../../../../core/utils/date";
export var getStartViewDate = (startDayHour, _firstDayOfWeek, currentDate) => {
  var result = dateUtils.getFirstMonthDate(currentDate);
  result.setHours(startDayHour);
  return result;
};