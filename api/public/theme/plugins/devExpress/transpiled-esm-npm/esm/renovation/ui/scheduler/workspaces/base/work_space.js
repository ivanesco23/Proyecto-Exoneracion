import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["accessKey", "activeStateEnabled", "allDayAppointments", "allDayPanelExpanded", "allowMultipleCellSelection", "appointments", "cellDuration", "className", "crossScrollingEnabled", "currentDate", "dataCellTemplate", "dateCellTemplate", "disabled", "endDayHour", "firstDayOfWeek", "focusStateEnabled", "groupByDate", "groupOrientation", "groups", "height", "hint", "hoursInterval", "hoverStateEnabled", "indicatorTime", "indicatorUpdateInterval", "intervalCount", "onClick", "onKeyDown", "onViewRendered", "resourceCellTemplate", "rtlEnabled", "schedulerHeight", "schedulerWidth", "scrolling", "selectedCellData", "shadeUntilCurrentTime", "showAllDayPanel", "showCurrentTimeIndicator", "startDate", "startDayHour", "tabIndex", "timeCellTemplate", "type", "visible", "width"];
import { createComponentVNode, normalizeProps } from "inferno";
import { InfernoEffect, InfernoComponent } from "@devextreme/runtime/inferno";
import { combineClasses } from "../../../../utils/combine_classes";
import { OrdinaryLayout } from "./ordinary_layout";
import ViewDataProvider from "../../../../../ui/scheduler/workspaces/view_model/view_data_provider";
import { createCellElementMetaData, getTotalCellCount } from "./utils";
import { WorkSpaceProps } from "../props";
import { getViewRenderConfigByType } from "./work_space_config";
import { isVerticalGroupingApplied } from "../utils";
import { CrossScrollingLayout } from "./cross_scrolling_layout";
export var prepareGenerationOptions = (workSpaceProps, renderConfig, isAllDayPanelVisible) => {
  var {
    cellDuration,
    currentDate,
    endDayHour,
    firstDayOfWeek,
    groupByDate,
    groupOrientation,
    groups,
    hoursInterval,
    intervalCount,
    startDate,
    startDayHour,
    type
  } = workSpaceProps;
  var {
    getDateForHeaderText,
    headerCellTextFormat,
    isGenerateWeekDaysHeaderData,
    isProvideVirtualCellsWidth,
    isRenderTimePanel
  } = renderConfig;
  return {
    startRowIndex: 0,
    startCellIndex: 0,
    groupOrientation,
    groupByDate,
    groups,
    isProvideVirtualCellsWidth,
    isAllDayPanelVisible,
    selectedCells: undefined,
    focusedCell: undefined,
    headerCellTextFormat,
    getDateForHeaderText,
    startDayHour,
    endDayHour,
    cellDuration,
    viewType: type,
    intervalCount,
    hoursInterval,
    currentDate,
    startDate,
    firstDayOfWeek,
    isGenerateTimePanelData: isRenderTimePanel,
    isGenerateWeekDaysHeaderData
  };
};
export var viewFunction = _ref => {
  var {
    allDayPanelRef,
    classes,
    dateTableRef,
    dateTableTemplate,
    groupPanelData,
    groupPanelHeight,
    groupPanelRef,
    headerEmptyCellWidth,
    headerPanelTemplate,
    isAllDayPanelVisible,
    isRenderHeaderEmptyCell,
    isStandaloneAllDayPanel,
    isVerticalGrouping,
    layout: Layout,
    props: {
      allDayAppointments,
      allDayPanelExpanded,
      appointments,
      dataCellTemplate,
      dateCellTemplate,
      groupByDate,
      groupOrientation,
      groups,
      intervalCount,
      resourceCellTemplate,
      timeCellTemplate
    },
    renderConfig: {
      groupPanelClassName,
      isRenderDateHeader,
      scrollingDirection
    },
    timePanelRef,
    timePanelTemplate,
    viewDataProvider
  } = _ref;
  return createComponentVNode(2, Layout, {
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
import { createRef as infernoCreateRef } from "inferno";

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class WorkSpace extends InfernoComponent {
  constructor(props) {
    super(props);
    this.dateTableRef = infernoCreateRef();
    this.allDayPanelRef = infernoCreateRef();
    this.timePanelRef = infernoCreateRef();
    this.groupPanelRef = infernoCreateRef();
    this.__getterCache = {};
    this.state = {
      groupPanelHeight: undefined,
      headerEmptyCellWidth: undefined
    };
    this.groupPanelHeightEffect = this.groupPanelHeightEffect.bind(this);
    this.headerEmptyCellWidthEffect = this.headerEmptyCellWidthEffect.bind(this);
    this.onViewRendered = this.onViewRendered.bind(this);
    this.createDateTableElementsMeta = this.createDateTableElementsMeta.bind(this);
    this.createAllDayPanelElementsMeta = this.createAllDayPanelElementsMeta.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.groupPanelHeightEffect, [this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new InfernoEffect(this.headerEmptyCellWidthEffect, [this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]), new InfernoEffect(this.onViewRendered, [this.props.currentDate, this.props.endDayHour, this.props.groupOrientation, this.props.groups, this.props.hoursInterval, this.props.intervalCount, this.props.onViewRendered, this.props.startDayHour, this.props.type, this.props.cellDuration, this.props.firstDayOfWeek, this.props.groupByDate, this.props.startDate, this.props.crossScrollingEnabled, this.props.showAllDayPanel])];
  }

  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3;

    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.state.groupPanelHeight, this.state.headerEmptyCellWidth, this.props.dataCellTemplate, this.props.dateCellTemplate, this.props.timeCellTemplate, this.props.resourceCellTemplate, this.props.intervalCount, this.props.groups, this.props.groupByDate, this.props.groupOrientation, this.props.crossScrollingEnabled, this.props.startDayHour, this.props.endDayHour, this.props.firstDayOfWeek, this.props.currentDate, this.props.startDate, this.props.hoursInterval, this.props.showAllDayPanel, this.props.allDayPanelExpanded, this.props.allowMultipleCellSelection, this.props.indicatorTime, this.props.indicatorUpdateInterval, this.props.shadeUntilCurrentTime, this.props.selectedCellData, this.props.scrolling, this.props.cellDuration, this.props.showCurrentTimeIndicator, this.props.schedulerHeight, this.props.schedulerWidth, this.props.type, this.props.onViewRendered, this.props.appointments, this.props.allDayAppointments, this.props.className, this.props.accessKey, this.props.activeStateEnabled, this.props.disabled, this.props.focusStateEnabled, this.props.height, this.props.hint, this.props.hoverStateEnabled, this.props.onClick, this.props.onKeyDown, this.props.rtlEnabled, this.props.tabIndex, this.props.visible, this.props.width]);
    (_this$_effects$3 = this._effects[2]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.currentDate, this.props.endDayHour, this.props.groupOrientation, this.props.groups, this.props.hoursInterval, this.props.intervalCount, this.props.onViewRendered, this.props.startDayHour, this.props.type, this.props.cellDuration, this.props.firstDayOfWeek, this.props.groupByDate, this.props.startDate, this.props.crossScrollingEnabled, this.props.showAllDayPanel]);
  }

  groupPanelHeightEffect() {
    this.setState(__state_argument => {
      var _this$dateTableRef$cu;

      return {
        groupPanelHeight: (_this$dateTableRef$cu = this.dateTableRef.current) === null || _this$dateTableRef$cu === void 0 ? void 0 : _this$dateTableRef$cu.getBoundingClientRect().height
      };
    });
  }

  headerEmptyCellWidthEffect() {
    var _this$timePanelRef$cu, _this$timePanelRef$cu2, _this$groupPanelRef$c, _this$groupPanelRef$c2;

    var timePanelWidth = (_this$timePanelRef$cu = (_this$timePanelRef$cu2 = this.timePanelRef.current) === null || _this$timePanelRef$cu2 === void 0 ? void 0 : _this$timePanelRef$cu2.getBoundingClientRect().width) !== null && _this$timePanelRef$cu !== void 0 ? _this$timePanelRef$cu : 0;
    var groupPanelWidth = (_this$groupPanelRef$c = (_this$groupPanelRef$c2 = this.groupPanelRef.current) === null || _this$groupPanelRef$c2 === void 0 ? void 0 : _this$groupPanelRef$c2.getBoundingClientRect().width) !== null && _this$groupPanelRef$c !== void 0 ? _this$groupPanelRef$c : 0;
    this.setState(__state_argument => ({
      headerEmptyCellWidth: timePanelWidth + groupPanelWidth
    }));
  }

  onViewRendered() {
    var {
      currentDate,
      endDayHour,
      groupOrientation,
      groups,
      hoursInterval,
      intervalCount,
      onViewRendered,
      startDayHour,
      type
    } = this.props;
    var cellCount = this.viewDataProvider.getCellCount({
      intervalCount,
      currentDate,
      viewType: type,
      hoursInterval,
      startDayHour,
      endDayHour
    });
    var totalCellCount = getTotalCellCount(cellCount, groupOrientation, groups);
    var dateTableCellsMeta = this.createDateTableElementsMeta(totalCellCount);
    var allDayPanelCellsMeta = this.createAllDayPanelElementsMeta();
    onViewRendered({
      viewDataProvider: this.viewDataProvider,
      cellsMetaData: {
        dateTableCellsMeta,
        allDayPanelCellsMeta
      }
    });
  }

  get isVerticalGrouping() {
    return isVerticalGroupingApplied(this.props.groups, this.props.groupOrientation);
  }

  get renderConfig() {
    if (this.__getterCache["renderConfig"] !== undefined) {
      return this.__getterCache["renderConfig"];
    }

    return this.__getterCache["renderConfig"] = (() => {
      return getViewRenderConfigByType(this.props.type, this.props.crossScrollingEnabled, this.props.intervalCount, this.isVerticalGrouping);
    })();
  }

  get layout() {
    return this.renderConfig.isCreateCrossScrolling ? CrossScrollingLayout : OrdinaryLayout;
  }

  get isAllDayPanelVisible() {
    var {
      showAllDayPanel
    } = this.props;
    var {
      isAllDayPanelSupported
    } = this.renderConfig;
    return isAllDayPanelSupported && showAllDayPanel;
  }

  get viewData() {
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

  get dateHeaderData() {
    return {
      dataMap: [[]],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      leftVirtualCellWidth: 0,
      rightVirtualCellWidth: 0
    };
  }

  get timePanelData() {
    return {
      groupedData: [],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      topVirtualRowCount: 0,
      bottomVirtualRowCount: 0
    };
  }

  get viewDataProvider() {
    var {
      cellDuration,
      currentDate,
      endDayHour,
      firstDayOfWeek,
      groupByDate,
      groupOrientation,
      groups,
      hoursInterval,
      intervalCount,
      startDate,
      startDayHour,
      type
    } = this.props;
    var viewDataProvider = new ViewDataProvider(type);
    var generationOptions = prepareGenerationOptions({
      intervalCount,
      groups,
      groupByDate,
      groupOrientation,
      startDayHour,
      endDayHour,
      currentDate,
      startDate,
      firstDayOfWeek,
      hoursInterval,
      type,
      cellDuration
    }, this.renderConfig, this.isAllDayPanelVisible);
    viewDataProvider.update(generationOptions, true);
    return viewDataProvider;
  }

  get groupPanelData() {
    var generationOptions = prepareGenerationOptions(this.props, this.renderConfig, this.isAllDayPanelVisible);
    return this.viewDataProvider.getGroupPanelData(generationOptions);
  }

  get headerPanelTemplate() {
    var {
      headerPanelTemplate
    } = this.renderConfig;
    return headerPanelTemplate;
  }

  get dateTableTemplate() {
    var {
      dateTableTemplate
    } = this.renderConfig;
    return dateTableTemplate;
  }

  get timePanelTemplate() {
    var {
      timePanelTemplate
    } = this.renderConfig;
    return timePanelTemplate;
  }

  get isRenderHeaderEmptyCell() {
    return this.isVerticalGrouping || !!this.timePanelTemplate;
  }

  get isWorkSpaceWithOddCells() {
    return false;
  }

  get classes() {
    var {
      allDayPanelExpanded,
      groupByDate,
      groups,
      intervalCount
    } = this.props;
    return combineClasses({
      [this.renderConfig.className]: true,
      "dx-scheduler-work-space-count": intervalCount > 1,
      "dx-scheduler-work-space-odd-cells": !!this.isWorkSpaceWithOddCells,
      "dx-scheduler-work-space-all-day-collapsed": !allDayPanelExpanded && this.isAllDayPanelVisible,
      "dx-scheduler-work-space-all-day": this.isAllDayPanelVisible,
      "dx-scheduler-work-space-group-by-date": groupByDate,
      "dx-scheduler-work-space-grouped": groups.length > 0,
      "dx-scheduler-work-space-vertical-grouped": this.isVerticalGrouping && this.renderConfig.defaultGroupOrientation !== "vertical",
      "dx-scheduler-group-column-count-one": this.isVerticalGrouping && groups.length === 1,
      "dx-scheduler-group-column-count-two": this.isVerticalGrouping && groups.length === 2,
      "dx-scheduler-group-column-count-three": this.isVerticalGrouping && groups.length === 3,
      "dx-scheduler-work-space-both-scrollbar": this.props.crossScrollingEnabled,
      "dx-scheduler-work-space": true
    });
  }

  get isStandaloneAllDayPanel() {
    var {
      groupOrientation,
      groups
    } = this.props;
    return !isVerticalGroupingApplied(groups, groupOrientation) && this.isAllDayPanelVisible;
  }

  createDateTableElementsMeta(totalCellCount) {
    var dateTableCells = this.dateTableRef.current.querySelectorAll("td");
    var dateTableRect = this.dateTableRef.current.getBoundingClientRect();
    var dateTableCellsMeta = [];
    dateTableCells.forEach((cellElement, index) => {
      if (index % totalCellCount === 0) {
        dateTableCellsMeta.push([]);
      }

      var cellRect = cellElement.getBoundingClientRect();
      var validCellRect = createCellElementMetaData(dateTableRect, cellRect);
      dateTableCellsMeta[dateTableCellsMeta.length - 1].push(validCellRect);
    });
    return dateTableCellsMeta;
  }

  createAllDayPanelElementsMeta() {
    if (!this.allDayPanelRef.current) {
      return [];
    }

    var allDayPanelCells = this.allDayPanelRef.current.querySelectorAll("td");
    var allDayPanelRect = this.allDayPanelRef.current.getBoundingClientRect();
    var allDayPanelCellsMeta = [];
    allDayPanelCells.forEach(cellElement => {
      var cellRect = cellElement.getBoundingClientRect();
      allDayPanelCellsMeta.push(createCellElementMetaData(allDayPanelRect, cellRect));
    });
    return allDayPanelCellsMeta;
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  componentWillUpdate(nextProps, nextState, context) {
    super.componentWillUpdate();

    if (this.props["type"] !== nextProps["type"] || this.props["crossScrollingEnabled"] !== nextProps["crossScrollingEnabled"] || this.props["intervalCount"] !== nextProps["intervalCount"] || this.props["groups"] !== nextProps["groups"] || this.props["groupOrientation"] !== nextProps["groupOrientation"]) {
      this.__getterCache["renderConfig"] = undefined;
    }
  }

  render() {
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
  }

}
WorkSpace.defaultProps = WorkSpaceProps;