"use strict";

exports.getAppointmentsModel = exports.getAppointmentsConfig = void 0;

var _positionHelper = require("../../../../ui/scheduler/workspaces/helpers/positionHelper");

var _utils = require("../../../../ui/scheduler/resources/utils");

var _utils2 = require("../workspaces/utils");

var _date = _interopRequireDefault(require("../../../../core/utils/date"));

var _base = require("../view_model/to_test/views/utils/base");

var _utils3 = require("../resources/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var toMs = function toMs(name) {
  return _date.default.dateToMilliseconds(name);
};

var getAppointmentRenderingStrategyName = function getAppointmentRenderingStrategyName(viewType) {
  var appointmentRenderingStrategyMap = {
    day: {
      renderingStrategy: "vertical"
    },
    week: {
      renderingStrategy: "vertical"
    },
    workWeek: {
      renderingStrategy: "vertical"
    },
    month: {
      renderingStrategy: "horizontalMonth"
    },
    timelineDay: {
      renderingStrategy: "horizontal"
    },
    timelineWeek: {
      renderingStrategy: "horizontal"
    },
    timelineWorkWeek: {
      renderingStrategy: "horizontal"
    },
    timelineMonth: {
      renderingStrategy: "horizontalMonthLine"
    },
    agenda: {
      renderingStrategy: "agenda"
    }
  };
  var renderingStrategy = appointmentRenderingStrategyMap[viewType].renderingStrategy;
  return renderingStrategy;
};

var getAppointmentsConfig = function getAppointmentsConfig(schedulerConfig, viewConfig, loadedResources, viewDataProvider, isAllDayPanelSupported) {
  var groupCount = (0, _utils.getGroupCount)(loadedResources);
  var startViewDate = viewDataProvider.getStartViewDate();
  var dateRange = [startViewDate, viewDataProvider.getLastViewDateByEndDayHour(viewConfig.endDayHour)];
  return {
    adaptivityEnabled: schedulerConfig.adaptivityEnabled,
    rtlEnabled: schedulerConfig.rtlEnabled,
    resources: schedulerConfig.resources,
    maxAppointmentsPerCell: schedulerConfig.maxAppointmentsPerCell,
    timeZone: schedulerConfig.timeZone,
    modelGroups: schedulerConfig.groups,
    startDayHour: viewConfig.startDayHour,
    viewStartDayHour: viewConfig.startDayHour,
    endDayHour: viewConfig.endDayHour,
    viewEndDayHour: viewConfig.endDayHour,
    currentDate: viewConfig.currentDate,
    isVirtualScrolling: viewConfig.scrolling.mode === "virtual",
    intervalCount: viewConfig.intervalCount,
    hoursInterval: viewConfig.hoursInterval,
    showAllDayPanel: viewConfig.showAllDayPanel,
    supportAllDayRow: isAllDayPanelSupported,
    groupOrientation: viewConfig.groupOrientation,
    firstDayOfWeek: viewConfig.firstDayOfWeek,
    viewType: viewConfig.type,
    cellDurationInMinutes: viewConfig.cellDuration,
    isVerticalGroupOrientation: viewConfig.groupOrientation === "vertical",
    groupByDate: viewConfig.groupByDate,
    startViewDate: startViewDate,
    loadedResources: loadedResources,
    appointmentCountPerCell: 2,
    appointmentOffset: 26,
    allowResizing: false,
    allowAllDayResizing: false,
    dateTableOffset: 0,
    groupCount: groupCount,
    dateRange: dateRange
  };
};

exports.getAppointmentsConfig = getAppointmentsConfig;

var getAppointmentsModel = function getAppointmentsModel(appointmentsConfig, viewDataProvider, timeZoneCalculator, dataAccessors, cellsMetaData) {
  var groupedByDate = (0, _utils2.isGroupingByDate)(appointmentsConfig.modelGroups, appointmentsConfig.groupOrientation, appointmentsConfig.groupByDate);
  var positionHelper = new _positionHelper.PositionHelper({
    viewDataProvider: viewDataProvider,
    groupedByDate: groupedByDate,
    rtlEnabled: appointmentsConfig.rtlEnabled,
    groupCount: appointmentsConfig.groupCount,
    getDOMMetaDataCallback: function getDOMMetaDataCallback() {
      return cellsMetaData;
    }
  });
  var isGroupedAllDayPanel = (0, _base.calculateIsGroupedAllDayPanel)(appointmentsConfig.loadedResources, appointmentsConfig.groupOrientation, appointmentsConfig.showAllDayPanel);
  var rowCount = viewDataProvider.getRowCount({
    intervalCount: appointmentsConfig.intervalCount,
    currentDate: appointmentsConfig.currentDate,
    viewType: appointmentsConfig.viewType,
    hoursInterval: appointmentsConfig.hoursInterval,
    startDayHour: appointmentsConfig.startDayHour,
    endDayHour: appointmentsConfig.endDayHour
  });
  var allDayHeight = (0, _positionHelper.getAllDayHeight)(appointmentsConfig.showAllDayPanel, appointmentsConfig.isVerticalGroupOrientation, cellsMetaData);
  var endViewDate = viewDataProvider.getLastCellEndDate();
  var visibleDayDuration = viewDataProvider.getVisibleDayDuration(appointmentsConfig.startDayHour, appointmentsConfig.endDayHour, appointmentsConfig.hoursInterval);
  var intervalDuration = viewDataProvider.getIntervalDuration(appointmentsConfig.intervalCount);
  var allDayIntervalDuration = toMs("day") * 3600000;
  var _viewDataProvider$vie = viewDataProvider.viewData,
      leftVirtualCellCount = _viewDataProvider$vie.leftVirtualCellCount,
      topVirtualRowCount = _viewDataProvider$vie.topVirtualRowCount;
  var cellDuration = (0, _base.getCellDuration)(appointmentsConfig.viewType, appointmentsConfig.startDayHour, appointmentsConfig.endDayHour, appointmentsConfig.hoursInterval);
  var getAppointmentColor = (0, _utils3.createGetAppointmentColor)({
    resources: appointmentsConfig.resources,
    dataAccessors: dataAccessors.resources,
    loadedResources: appointmentsConfig.loadedResources,
    resourceLoaderMap: new Map()
  });
  var appointmentRenderingStrategyName = getAppointmentRenderingStrategyName(appointmentsConfig.viewType);
  return _extends({}, appointmentsConfig, {
    appointmentRenderingStrategyName: appointmentRenderingStrategyName,
    loadedResources: [],
    dataAccessors: dataAccessors,
    timeZoneCalculator: timeZoneCalculator,
    viewDataProvider: viewDataProvider,
    positionHelper: positionHelper,
    isGroupedAllDayPanel: isGroupedAllDayPanel,
    rowCount: rowCount,
    cellWidth: (0, _positionHelper.getCellWidth)(cellsMetaData),
    cellHeight: (0, _positionHelper.getCellHeight)(cellsMetaData),
    allDayHeight: allDayHeight,
    isGroupedByDate: groupedByDate,
    endViewDate: endViewDate,
    visibleDayDuration: visibleDayDuration,
    intervalDuration: intervalDuration,
    allDayIntervalDuration: allDayIntervalDuration,
    leftVirtualCellCount: leftVirtualCellCount,
    topVirtualCellCount: topVirtualRowCount,
    cellDuration: cellDuration,
    getAppointmentColor: getAppointmentColor,
    resizableStep: positionHelper.getResizableStep(),
    DOMMetaData: cellsMetaData
  });
};

exports.getAppointmentsModel = getAppointmentsModel;