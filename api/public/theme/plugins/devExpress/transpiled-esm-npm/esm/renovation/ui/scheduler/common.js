import { utils } from "../../../ui/scheduler/utils";
import { TimeZoneCalculator } from "./timeZoneCalculator/utils";
import timeZoneUtils from "../../../ui/scheduler/utils.timeZone";
import { AppointmentFilterBaseStrategy, AppointmentFilterVirtualStrategy } from "../../../ui/scheduler/appointments/dataProvider/appointmentFilter";
import { createExpressions } from "../../../ui/scheduler/resources/utils";
export var createDataAccessors = function createDataAccessors(props) {
  var forceIsoDateParsing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dataAccessors = utils.dataAccessors.create({
    startDate: props.startDateExpr,
    endDate: props.endDateExpr,
    startDateTimeZone: props.startDateTimeZoneExpr,
    endDateTimeZone: props.endDateTimeZoneExpr,
    allDay: props.allDayExpr,
    text: props.textExpr,
    description: props.descriptionExpr,
    recurrenceRule: props.recurrenceRuleExpr,
    recurrenceException: props.recurrenceExceptionExpr
  }, null, forceIsoDateParsing, props.dateSerializationFormat);
  dataAccessors.resources = createExpressions(props.resources);
  return dataAccessors;
};
export var createTimeZoneCalculator = currentTimeZone => new TimeZoneCalculator({
  getClientOffset: date => timeZoneUtils.getClientTimezoneOffset(date),
  getCommonOffset: date => timeZoneUtils.calculateTimezoneByValue(currentTimeZone, date),
  getAppointmentOffset: (date, appointmentTimezone) => timeZoneUtils.calculateTimezoneByValue(appointmentTimezone, date)
});
export var filterAppointments = (appointmentsConfig, dataItems, dataAccessors, timeZoneCalculator, loadedResources, viewDataProvider) => {
  if (!appointmentsConfig) {
    return [];
  }

  var filterOptions = {
    resources: appointmentsConfig.resources,
    startDayHour: appointmentsConfig.startDayHour,
    endDayHour: appointmentsConfig.endDayHour,
    appointmentDuration: appointmentsConfig.cellDurationInMinutes,
    showAllDayPanel: appointmentsConfig.showAllDayPanel,
    supportAllDayRow: appointmentsConfig.supportAllDayRow,
    firstDayOfWeek: appointmentsConfig.firstDayOfWeek,
    viewType: appointmentsConfig.viewType,
    viewDirection: "vertical",
    dateRange: appointmentsConfig.dateRange,
    groupCount: appointmentsConfig.groupCount,
    timeZoneCalculator,
    dataSource: undefined,
    dataAccessors,
    loadedResources,
    viewDataProvider
  };
  var filterStrategy = appointmentsConfig.isVirtualScrolling ? new AppointmentFilterVirtualStrategy(filterOptions) : new AppointmentFilterBaseStrategy(filterOptions);
  var preparedDataItems = filterStrategy.getPreparedDataItems(dataItems);
  var filteredItems = filterStrategy.filter(preparedDataItems);
  return filteredItems;
};