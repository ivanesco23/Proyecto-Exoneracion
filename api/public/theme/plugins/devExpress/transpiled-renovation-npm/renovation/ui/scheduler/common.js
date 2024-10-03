"use strict";

exports.filterAppointments = exports.createTimeZoneCalculator = exports.createDataAccessors = void 0;

var _utils = require("../../../ui/scheduler/utils");

var _utils2 = require("./timeZoneCalculator/utils");

var _utils3 = _interopRequireDefault(require("../../../ui/scheduler/utils.timeZone"));

var _appointmentFilter = require("../../../ui/scheduler/appointments/dataProvider/appointmentFilter");

var _utils4 = require("../../../ui/scheduler/resources/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createDataAccessors = function createDataAccessors(props) {
  var forceIsoDateParsing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var dataAccessors = _utils.utils.dataAccessors.create({
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

  dataAccessors.resources = (0, _utils4.createExpressions)(props.resources);
  return dataAccessors;
};

exports.createDataAccessors = createDataAccessors;

var createTimeZoneCalculator = function createTimeZoneCalculator(currentTimeZone) {
  return new _utils2.TimeZoneCalculator({
    getClientOffset: function getClientOffset(date) {
      return _utils3.default.getClientTimezoneOffset(date);
    },
    getCommonOffset: function getCommonOffset(date) {
      return _utils3.default.calculateTimezoneByValue(currentTimeZone, date);
    },
    getAppointmentOffset: function getAppointmentOffset(date, appointmentTimezone) {
      return _utils3.default.calculateTimezoneByValue(appointmentTimezone, date);
    }
  });
};

exports.createTimeZoneCalculator = createTimeZoneCalculator;

var filterAppointments = function filterAppointments(appointmentsConfig, dataItems, dataAccessors, timeZoneCalculator, loadedResources, viewDataProvider) {
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
    timeZoneCalculator: timeZoneCalculator,
    dataSource: undefined,
    dataAccessors: dataAccessors,
    loadedResources: loadedResources,
    viewDataProvider: viewDataProvider
  };
  var filterStrategy = appointmentsConfig.isVirtualScrolling ? new _appointmentFilter.AppointmentFilterVirtualStrategy(filterOptions) : new _appointmentFilter.AppointmentFilterBaseStrategy(filterOptions);
  var preparedDataItems = filterStrategy.getPreparedDataItems(dataItems);
  var filteredItems = filterStrategy.filter(preparedDataItems);
  return filteredItems;
};

exports.filterAppointments = filterAppointments;