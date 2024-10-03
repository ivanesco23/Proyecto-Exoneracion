"use strict";

exports.viewFunction = exports.prepareGenerationOptions = exports.WorkSpace = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _combine_classes = require("../../../../utils/combine_classes");

var _ordinary_layout = require("./ordinary_layout");

var _view_data_provider = _interopRequireDefault(require("../../../../../ui/scheduler/workspaces/view_model/view_data_provider"));

var _utils = require("./utils");

var _props = require("../props");

var _work_space_config = require("./work_space_config");

var _utils2 = require("../utils");

var _cross_scrolling_layout = require("./cross_scrolling_layout");

var _excluded = ["accessKey", "activeStateEnabled", "allDayAppointments", "allDayPanelExpanded", "allowMultipleCellSelection", "appointments", "cellDuration", "className", "crossScrollingEnabled", "currentDate", "dataCellTemplate", "dateCellTemplate", "disabled", "endDayHour", "firstDayOfWeek", "focusStateEnabled", "groupByDate", "groupOrientation", "groups", "height", "hint", "hoursInterval", "hoverStateEnabled", "indicatorTime", "indicatorUpdateInterval", "intervalCount", "onClick", "onKeyDown", "onViewRendered", "resourceCellTemplate", "rtlEnabled", "schedulerHeight", "schedulerWidth", "scrolling", "selectedCellData", "shadeUntilCurrentTime", "showAllDayPanel", "showCurrentTimeIndicator", "startDate", "startDayHour", "tabIndex", "timeCellTemplate", "type", "visible", "width"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var prepareGenerationOptions = function prepareGenerationOptions(workSpaceProps, renderConfig, isAllDayPanelVisible) {
  var cellDuration = workSpaceProps.cellDuration,
      currentDate = workSpaceProps.currentDate,
      endDayHour = workSpaceProps.endDayHour,
      firstDayOfWeek = workSpaceProps.firstDayOfWeek,
      groupByDate = workSpaceProps.groupByDate,
      groupOrientation = workSpaceProps.groupOrientation,
      groups = workSpaceProps.groups,
      hoursInterval = workSpaceProps.hoursInterval,
      intervalCount = workSpaceProps.intervalCount,
      startDate = workSpaceProps.startDate,
      startDayHour = workSpaceProps.startDayHour,
      type = workSpaceProps.type;
  var getDateForHeaderText = renderConfig.getDateForHeaderText,
      headerCellTextFormat = renderConfig.headerCellTextFormat,
      isGenerateWeekDaysHeaderData = renderConfig.isGenerateWeekDaysHeaderData,
      isProvideVirtualCellsWidth = renderConfig.isProvideVirtualCellsWidth,
      isRenderTimePanel = renderConfig.isRenderTimePanel;
  return {
    startRowIndex: 0,
    startCellIndex: 0,
    groupOrientation: groupOrientation,
    groupByDate: groupByDate,
    groups: groups,
    isProvideVirtualCellsWidth: isProvideVirtualCellsWidth,
    isAllDayPanelVisible: isAllDayPanelVisible,
    selectedCells: undefined,
    focusedCell: undefined,
    headerCellTextFormat: headerCellTextFormat,
    getDateForHeaderText: getDateForHeaderText,
    startDayHour: startDayHour,
    endDayHour: endDayHour,
    cellDuration: cellDuration,
    viewType: type,
    intervalCount: intervalCount,
    hoursInterval: hoursInterval,
    currentDate: currentDate,
    startDate: startDate,
    firstDayOfWeek: firstDayOfWeek,
    isGenerateTimePanelData: isRenderTimePanel,
    isGenerateWeekDaysHeaderData: isGenerateWeekDaysHeaderData
  };
};

exports.prepareGenerationOptions = prepareGenerationOptions;

var viewFunction = function viewFunction(_ref) {
  var allDayPanelRef = _ref.allDayPanelRef,
      classes = _ref.classes,
      dateTableRef = _ref.dateTableRef,
      dateTableTemplate = _ref.dateTableTemplate,
      groupPanelData = _ref.groupPanelData,
      groupPanelHeight = _ref.groupPanelHeight,
      groupPanelRef = _ref.groupPanelRef,
      headerEmptyCellWidth = _ref.headerEmptyCellWidth,
      headerPanelTemplate = _ref.headerPanelTemplate,
      isAllDayPanelVisible = _ref.isAllDayPanelVisible,
      isRenderHeaderEmptyCell = _ref.isRenderHeaderEmptyCell,
      isStandaloneAllDayPanel = _ref.isStandaloneAllDayPanel,
      isVerticalGrouping = _ref.isVerticalGrouping,
      Layout = _ref.layout,
      _ref$props = _ref.props,
      allDayAppointments = _ref$props.allDayAppointments,
      allDayPanelExpanded = _ref$props.allDayPanelExpanded,
      appointments = _ref$props.appointments,
      dataCellTemplate = _ref$props.dataCellTemplate,
      dateCellTemplate = _ref$props.dateCellTemplate,
      groupByDate = _ref$props.groupByDate,
      groupOrientation = _ref$props.groupOrientation,
      groups = _ref$props.groups,
      intervalCount = _ref$props.intervalCount,
      resourceCellTemplate = _ref$props.resourceCellTemplate,
      timeCellTemplate = _ref$props.timeCellTemplate,
      _ref$renderConfig = _ref.renderConfig,
      groupPanelClassName = _ref$renderConfig.groupPanelClassName,
      isRenderDateHeader = _ref$renderConfig.isRenderDateHeader,
      scrollingDirection = _ref$renderConfig.scrollingDirection,
      timePanelRef = _ref.timePanelRef,
      timePanelTemplate = _ref.timePanelTemplate,
      viewDataProvider = _ref.viewDataProvider;
  return (0, _inferno.createComponentVNode)(2, Layout, {
    "viewData": viewDataProvider.viewData,
    "dateHeaderData": viewDataProvider.dateHeaderData,
    "timePanelData": viewDataProvider.timePanelData,
    "groupPanelData": groupPanelData,
    "dataCellTemplate": dataCellTemplate,
    "dateCellTemplate": dateCellTemplate,
    "timeCellTemplate": timeCellTemplate,
    "resourceCellTemplate": resourceCellTemplate,
    "groups": groups,
    "groupByDate": groupByDate,
    "groupOrientation": groupOrientation,
    "groupPanelClassName": groupPanelClassName,
    "intervalCount": intervalCount,
    "headerPanelTemplate": headerPanelTemplate,
    "dateTableTemplate": dateTableTemplate,
    "timePanelTemplate": timePanelTemplate,
    "isAllDayPanelCollapsed": !allDayPanelExpanded,
    "isAllDayPanelVisible": isAllDayPanelVisible,
    "isRenderDateHeader": isRenderDateHeader,
    "isRenderHeaderEmptyCell": isRenderHeaderEmptyCell,
    "isRenderGroupPanel": isVerticalGrouping,
    "isStandaloneAllDayPanel": isStandaloneAllDayPanel,
    "scrollingDirection": scrollingDirection,
    "groupPanelHeight": groupPanelHeight,
    "headerEmptyCellWidth": headerEmptyCellWidth,
    "className": classes,
    "dateTableRef": dateTableRef,
    "allDayPanelRef": allDayPanelRef,
    "timePanelRef": timePanelRef,
    "groupPanelRef": groupPanelRef,
    "appointments": appointments,
    "allDayAppointments": allDayAppointments
  });
};

exports.viewFunction = viewFunction;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var WorkSpace = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(WorkSpace, _InfernoComponent);

  function WorkSpace(props) {
    var _this;

    _this = _InfernoComponent.call(this, props) || this;
    _this.dateTableRef = (0, _inferno.createRef)();
    _this.allDayPanelRef = (0, _inferno.createRef)();
    _this.timePanelRef = (0, _inferno.createRef)();
    _this.groupPanelRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.state = {
      groupPanelHeight: undefined,
      headerEmptyCellWidth: undefined
    };
    _this.groupPanelHeightEffect = _this.groupPanelHeightEffect.bind(_assertThisInitialized(_this));
    _this.headerEmptyCellWidthEffect = _this.headerEmptyCellWidthEffect.bind(_assertThisInitialized(_this));
    _this.onViewRendered = _this.onViewRendered.bind(_assertThisInitialized(_this));
    _this.createDateTableElementsMeta = _this.createDateTableElementsMeta.bind(_assertThisInitialized(_this));
    _this.createAllDayPanelElementsMeta = _this.createAllDayPanelElementsMeta.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = WorkSpace.prototype;

  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.groupPanelHeightEffect, [this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new _inferno2.InfernoEffect(this.headerEmptyCellWidthEffect, [this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new _inferno2.InfernoEffect(this.onViewRendered, [this.props.currentDate, this.props.endDayHour, this.props.groupOrientation, this.props.groups, this.props.hoursInterval, this.props.intervalCount, this.props.onViewRendered, this.props.startDayHour, this.props.type, this.props.cellDuration, this.props.firstDayOfWeek, this.props.groupByDate, this.props.startDate, this.props.crossScrollingEnabled, this.props.showAllDayPanel])];
  };

  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3;

    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$3 = this._effects[2]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.currentDate, this.props.endDayHour, this.props.groupOrientation, this.props.groups, this.props.hoursInterval, this.props.intervalCount, this.props.onViewRendered, this.props.startDayHour, this.props.type, this.props.cellDuration, this.props.firstDayOfWeek, this.props.groupByDate, this.props.startDate, this.props.crossScrollingEnabled, this.props.showAllDayPanel]);
  };

  _proto.groupPanelHeightEffect = function groupPanelHeightEffect() {
    var _this2 = this;

    this.setState(function (__state_argument) {
      var _this2$dateTableRef$c;

      return {
        groupPanelHeight: (_this2$dateTableRef$c = _this2.dateTableRef.current) === null || _this2$dateTableRef$c === void 0 ? void 0 : _this2$dateTableRef$c.getBoundingClientRect().height
      };
    });
  };

  _proto.headerEmptyCellWidthEffect = function headerEmptyCellWidthEffect() {
    var _this$timePanelRef$cu, _this$timePanelRef$cu2, _this$groupPanelRef$c, _this$groupPanelRef$c2;

    var timePanelWidth = (_this$timePanelRef$cu = (_this$timePanelRef$cu2 = this.timePanelRef.current) === null || _this$timePanelRef$cu2 === void 0 ? void 0 : _this$timePanelRef$cu2.getBoundingClientRect().width) !== null && _this$timePanelRef$cu !== void 0 ? _this$timePanelRef$cu : 0;
    var groupPanelWidth = (_this$groupPanelRef$c = (_this$groupPanelRef$c2 = this.groupPanelRef.current) === null || _this$groupPanelRef$c2 === void 0 ? void 0 : _this$groupPanelRef$c2.getBoundingClientRect().width) !== null && _this$groupPanelRef$c !== void 0 ? _this$groupPanelRef$c : 0;
    this.setState(function (__state_argument) {
      return {
        headerEmptyCellWidth: timePanelWidth + groupPanelWidth
      };
    });
  };

  _proto.onViewRendered = function onViewRendered() {
    var _this$props = this.props,
        currentDate = _this$props.currentDate,
        endDayHour = _this$props.endDayHour,
        groupOrientation = _this$props.groupOrientation,
        groups = _this$props.groups,
        hoursInterval = _this$props.hoursInterval,
        intervalCount = _this$props.intervalCount,
        onViewRendered = _this$props.onViewRendered,
        startDayHour = _this$props.startDayHour,
        type = _this$props.type;
    var cellCount = this.viewDataProvider.getCellCount({
      intervalCount: intervalCount,
      currentDate: currentDate,
      viewType: type,
      hoursInterval: hoursInterval,
      startDayHour: startDayHour,
      endDayHour: endDayHour
    });
    var totalCellCount = (0, _utils.getTotalCellCount)(cellCount, groupOrientation, groups);
    var dateTableCellsMeta = this.createDateTableElementsMeta(totalCellCount);
    var allDayPanelCellsMeta = this.createAllDayPanelElementsMeta();
    onViewRendered({
      viewDataProvider: this.viewDataProvider,
      cellsMetaData: {
        dateTableCellsMeta: dateTableCellsMeta,
        allDayPanelCellsMeta: allDayPanelCellsMeta
      }
    });
  };

  _proto.createDateTableElementsMeta = function createDateTableElementsMeta(totalCellCount) {
    var dateTableCells = this.dateTableRef.current.querySelectorAll("td");
    var dateTableRect = this.dateTableRef.current.getBoundingClientRect();
    var dateTableCellsMeta = [];
    dateTableCells.forEach(function (cellElement, index) {
      if (index % totalCellCount === 0) {
        dateTableCellsMeta.push([]);
      }

      var cellRect = cellElement.getBoundingClientRect();
      var validCellRect = (0, _utils.createCellElementMetaData)(dateTableRect, cellRect);
      dateTableCellsMeta[dateTableCellsMeta.length - 1].push(validCellRect);
    });
    return dateTableCellsMeta;
  };

  _proto.createAllDayPanelElementsMeta = function createAllDayPanelElementsMeta() {
    if (!this.allDayPanelRef.current) {
      return [];
    }

    var allDayPanelCells = this.allDayPanelRef.current.querySelectorAll("td");
    var allDayPanelRect = this.allDayPanelRef.current.getBoundingClientRect();
    var allDayPanelCellsMeta = [];
    allDayPanelCells.forEach(function (cellElement) {
      var cellRect = cellElement.getBoundingClientRect();
      allDayPanelCellsMeta.push((0, _utils.createCellElementMetaData)(allDayPanelRect, cellRect));
    });
    return allDayPanelCellsMeta;
  };

  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);

    if (this.props["type"] !== nextProps["type"] || this.props["crossScrollingEnabled"] !== nextProps["crossScrollingEnabled"] || this.props["intervalCount"] !== nextProps["intervalCount"] || this.props["groups"] !== nextProps["groups"] || this.props["groupOrientation"] !== nextProps["groupOrientation"]) {
      this.__getterCache["renderConfig"] = undefined;
    }
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        dataCellTemplate: getTemplate(props.dataCellTemplate),
        dateCellTemplate: getTemplate(props.dateCellTemplate),
        timeCellTemplate: getTemplate(props.timeCellTemplate),
        resourceCellTemplate: getTemplate(props.resourceCellTemplate)
      }),
      groupPanelHeight: this.state.groupPanelHeight,
      headerEmptyCellWidth: this.state.headerEmptyCellWidth,
      dateTableRef: this.dateTableRef,
      allDayPanelRef: this.allDayPanelRef,
      timePanelRef: this.timePanelRef,
      groupPanelRef: this.groupPanelRef,
      isVerticalGrouping: this.isVerticalGrouping,
      renderConfig: this.renderConfig,
      layout: this.layout,
      isAllDayPanelVisible: this.isAllDayPanelVisible,
      viewData: this.viewData,
      dateHeaderData: this.dateHeaderData,
      timePanelData: this.timePanelData,
      viewDataProvider: this.viewDataProvider,
      groupPanelData: this.groupPanelData,
      headerPanelTemplate: this.headerPanelTemplate,
      dateTableTemplate: this.dateTableTemplate,
      timePanelTemplate: this.timePanelTemplate,
      isRenderHeaderEmptyCell: this.isRenderHeaderEmptyCell,
      isWorkSpaceWithOddCells: this.isWorkSpaceWithOddCells,
      classes: this.classes,
      isStandaloneAllDayPanel: this.isStandaloneAllDayPanel,
      createDateTableElementsMeta: this.createDateTableElementsMeta,
      createAllDayPanelElementsMeta: this.createAllDayPanelElementsMeta,
      restAttributes: this.restAttributes
    });
  };

  _createClass(WorkSpace, [{
    key: "isVerticalGrouping",
    get: function get() {
      return (0, _utils2.isVerticalGroupingApplied)(this.props.groups, this.props.groupOrientation);
    }
  }, {
    key: "renderConfig",
    get: function get() {
      var _this3 = this;

      if (this.__getterCache["renderConfig"] !== undefined) {
        return this.__getterCache["renderConfig"];
      }

      return this.__getterCache["renderConfig"] = function () {
        return (0, _work_space_config.getViewRenderConfigByType)(_this3.props.type, _this3.props.crossScrollingEnabled, _this3.props.intervalCount, _this3.isVerticalGrouping);
      }();
    }
  }, {
    key: "layout",
    get: function get() {
      return this.renderConfig.isCreateCrossScrolling ? _cross_scrolling_layout.CrossScrollingLayout : _ordinary_layout.OrdinaryLayout;
    }
  }, {
    key: "isAllDayPanelVisible",
    get: function get() {
      var showAllDayPanel = this.props.showAllDayPanel;
      var isAllDayPanelSupported = this.renderConfig.isAllDayPanelSupported;
      return isAllDayPanelSupported && showAllDayPanel;
    }
  }, {
    key: "viewData",
    get: function get() {
      return {
        groupedData: [{
          dateTable: [[{
            startDate: new Date(),
            endDate: new Date(),
            index: 0,
            isFirstGroupCell: true,
            isLastGroupCell: true,
            key: 0,
            groupIndex: 0
          }]],
          groupIndex: 0
        }],
        leftVirtualCellCount: 0,
        rightVirtualCellCount: 0,
        topVirtualRowCount: 0,
        bottomVirtualRowCount: 0
      };
    }
  }, {
    key: "dateHeaderData",
    get: function get() {
      return {
        dataMap: [[]],
        leftVirtualCellCount: 0,
        rightVirtualCellCount: 0,
        leftVirtualCellWidth: 0,
        rightVirtualCellWidth: 0
      };
    }
  }, {
    key: "timePanelData",
    get: function get() {
      return {
        groupedData: [],
        leftVirtualCellCount: 0,
        rightVirtualCellCount: 0,
        topVirtualRowCount: 0,
        bottomVirtualRowCount: 0
      };
    }
  }, {
    key: "viewDataProvider",
    get: function get() {
      var _this$props2 = this.props,
          cellDuration = _this$props2.cellDuration,
          currentDate = _this$props2.currentDate,
          endDayHour = _this$props2.endDayHour,
          firstDayOfWeek = _this$props2.firstDayOfWeek,
          groupByDate = _this$props2.groupByDate,
          groupOrientation = _this$props2.groupOrientation,
          groups = _this$props2.groups,
          hoursInterval = _this$props2.hoursInterval,
          intervalCount = _this$props2.intervalCount,
          startDate = _this$props2.startDate,
          startDayHour = _this$props2.startDayHour,
          type = _this$props2.type;
      var viewDataProvider = new _view_data_provider.default(type);
      var generationOptions = prepareGenerationOptions({
        intervalCount: intervalCount,
        groups: groups,
        groupByDate: groupByDate,
        groupOrientation: groupOrientation,
        startDayHour: startDayHour,
        endDayHour: endDayHour,
        currentDate: currentDate,
        startDate: startDate,
        firstDayOfWeek: firstDayOfWeek,
        hoursInterval: hoursInterval,
        type: type,
        cellDuration: cellDuration
      }, this.renderConfig, this.isAllDayPanelVisible);
      viewDataProvider.update(generationOptions, true);
      return viewDataProvider;
    }
  }, {
    key: "groupPanelData",
    get: function get() {
      var generationOptions = prepareGenerationOptions(this.props, this.renderConfig, this.isAllDayPanelVisible);
      return this.viewDataProvider.getGroupPanelData(generationOptions);
    }
  }, {
    key: "headerPanelTemplate",
    get: function get() {
      var headerPanelTemplate = this.renderConfig.headerPanelTemplate;
      return headerPanelTemplate;
    }
  }, {
    key: "dateTableTemplate",
    get: function get() {
      var dateTableTemplate = this.renderConfig.dateTableTemplate;
      return dateTableTemplate;
    }
  }, {
    key: "timePanelTemplate",
    get: function get() {
      var timePanelTemplate = this.renderConfig.timePanelTemplate;
      return timePanelTemplate;
    }
  }, {
    key: "isRenderHeaderEmptyCell",
    get: function get() {
      return this.isVerticalGrouping || !!this.timePanelTemplate;
    }
  }, {
    key: "isWorkSpaceWithOddCells",
    get: function get() {
      return false;
    }
  }, {
    key: "classes",
    get: function get() {
      var _combineClasses;

      var _this$props3 = this.props,
          allDayPanelExpanded = _this$props3.allDayPanelExpanded,
          groupByDate = _this$props3.groupByDate,
          groups = _this$props3.groups,
          intervalCount = _this$props3.intervalCount;
      return (0, _combine_classes.combineClasses)((_combineClasses = {}, _defineProperty(_combineClasses, this.renderConfig.className, true), _defineProperty(_combineClasses, "dx-scheduler-work-space-count", intervalCount > 1), _defineProperty(_combineClasses, "dx-scheduler-work-space-odd-cells", !!this.isWorkSpaceWithOddCells), _defineProperty(_combineClasses, "dx-scheduler-work-space-all-day-collapsed", !allDayPanelExpanded && this.isAllDayPanelVisible), _defineProperty(_combineClasses, "dx-scheduler-work-space-all-day", this.isAllDayPanelVisible), _defineProperty(_combineClasses, "dx-scheduler-work-space-group-by-date", groupByDate), _defineProperty(_combineClasses, "dx-scheduler-work-space-grouped", groups.length > 0), _defineProperty(_combineClasses, "dx-scheduler-work-space-vertical-grouped", this.isVerticalGrouping && this.renderConfig.defaultGroupOrientation !== "vertical"), _defineProperty(_combineClasses, "dx-scheduler-group-column-count-one", this.isVerticalGrouping && groups.length === 1), _defineProperty(_combineClasses, "dx-scheduler-group-column-count-two", this.isVerticalGrouping && groups.length === 2), _defineProperty(_combineClasses, "dx-scheduler-group-column-count-three", this.isVerticalGrouping && groups.length === 3), _defineProperty(_combineClasses, "dx-scheduler-work-space-both-scrollbar", this.props.crossScrollingEnabled), _defineProperty(_combineClasses, "dx-scheduler-work-space", true), _combineClasses));
    }
  }, {
    key: "isStandaloneAllDayPanel",
    get: function get() {
      var _this$props4 = this.props,
          groupOrientation = _this$props4.groupOrientation,
          groups = _this$props4.groups;
      return !(0, _utils2.isVerticalGroupingApplied)(groups, groupOrientation) && this.isAllDayPanelVisible;
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props5 = this.props,
          accessKey = _this$props5.accessKey,
          activeStateEnabled = _this$props5.activeStateEnabled,
          allDayAppointments = _this$props5.allDayAppointments,
          allDayPanelExpanded = _this$props5.allDayPanelExpanded,
          allowMultipleCellSelection = _this$props5.allowMultipleCellSelection,
          appointments = _this$props5.appointments,
          cellDuration = _this$props5.cellDuration,
          className = _this$props5.className,
          crossScrollingEnabled = _this$props5.crossScrollingEnabled,
          currentDate = _this$props5.currentDate,
          dataCellTemplate = _this$props5.dataCellTemplate,
          dateCellTemplate = _this$props5.dateCellTemplate,
          disabled = _this$props5.disabled,
          endDayHour = _this$props5.endDayHour,
          firstDayOfWeek = _this$props5.firstDayOfWeek,
          focusStateEnabled = _this$props5.focusStateEnabled,
          groupByDate = _this$props5.groupByDate,
          groupOrientation = _this$props5.groupOrientation,
          groups = _this$props5.groups,
          height = _this$props5.height,
          hint = _this$props5.hint,
          hoursInterval = _this$props5.hoursInterval,
          hoverStateEnabled = _this$props5.hoverStateEnabled,
          indicatorTime = _this$props5.indicatorTime,
          indicatorUpdateInterval = _this$props5.indicatorUpdateInterval,
          intervalCount = _this$props5.intervalCount,
          onClick = _this$props5.onClick,
          onKeyDown = _this$props5.onKeyDown,
          onViewRendered = _this$props5.onViewRendered,
          resourceCellTemplate = _this$props5.resourceCellTemplate,
          rtlEnabled = _this$props5.rtlEnabled,
          schedulerHeight = _this$props5.schedulerHeight,
          schedulerWidth = _this$props5.schedulerWidth,
          scrolling = _this$props5.scrolling,
          selectedCellData = _this$props5.selectedCellData,
          shadeUntilCurrentTime = _this$props5.shadeUntilCurrentTime,
          showAllDayPanel = _this$props5.showAllDayPanel,
          showCurrentTimeIndicator = _this$props5.showCurrentTimeIndicator,
          startDate = _this$props5.startDate,
          startDayHour = _this$props5.startDayHour,
          tabIndex = _this$props5.tabIndex,
          timeCellTemplate = _this$props5.timeCellTemplate,
          type = _this$props5.type,
          visible = _this$props5.visible,
          width = _this$props5.width,
          restProps = _objectWithoutProperties(_this$props5, _excluded);

      return restProps;
    }
  }]);

  return WorkSpace;
}(_inferno2.InfernoComponent);

exports.WorkSpace = WorkSpace;
WorkSpace.defaultProps = _props.WorkSpaceProps;