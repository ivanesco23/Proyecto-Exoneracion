import dateUtils from "../../../../../core/utils/date";
export var getStartViewDate = (startDayHour, firstDayOfWeek, currentDate) => {
  var result = dateUtils.getFirstWeekDate(currentDate, firstDayOfWeek);
  result.setHours(startDayHour);
  return result;
};