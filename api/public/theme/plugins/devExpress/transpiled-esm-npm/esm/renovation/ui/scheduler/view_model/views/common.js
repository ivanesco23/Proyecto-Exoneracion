import dateUtils from "../../../../../core/utils/date";
export var getCurrentDate = (currentDate, startDate) => {
  var validCurrentDate = startDate !== null && startDate !== void 0 ? startDate : currentDate;
  return dateUtils.trimTime(validCurrentDate);
};
export var getFirstDayOfWeek = (includedDays, firstDayOfWeek) => {
  var isFirstDayOfWeekInIncludedDays = includedDays.includes(firstDayOfWeek);
  var sortedIncludedDays = includedDays.slice().sort((a, b) => a - b);
  return isFirstDayOfWeekInIncludedDays ? firstDayOfWeek : sortedIncludedDays[0];
};
export var getStartViewDate = (_startDayHour, _firstDayOfWeek, currentDate) => currentDate;