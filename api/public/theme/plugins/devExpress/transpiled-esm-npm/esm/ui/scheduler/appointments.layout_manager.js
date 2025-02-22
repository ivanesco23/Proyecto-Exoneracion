import _extends from "@babel/runtime/helpers/esm/extends";
import { equalByValue } from '../../core/utils/common';
import { getModelProvider, getTimeZoneCalculator } from './instanceFactory';
import { AppointmentViewModelGenerator } from './appointments/viewModelGenerator';
import { getGroupCount } from './resources/utils';
import { getCellWidth, getCellHeight, getAllDayHeight } from './workspaces/helpers/positionHelper';
import { getCellDuration } from '../../renovation/ui/scheduler/view_model/to_test/views/utils/base';

class AppointmentLayoutManager {
  constructor(instance) {
    this.instance = instance;
    this.appointmentViewModel = new AppointmentViewModelGenerator();
  }

  get modelProvider() {
    return getModelProvider(this.instance.key);
  }

  get appointmentRenderingStrategyName() {
    return this.modelProvider.getAppointmentRenderingStrategyName();
  }

  getCellDimensions(options) {
    if (this.instance._workSpace) {
      return {
        width: this.instance._workSpace.getCellWidth(),
        height: this.instance._workSpace.getCellHeight(),
        allDayHeight: this.instance._workSpace.getAllDayHeight()
      };
    }
  }

  _getRenderingStrategyOptions() {
    var workspace = this.instance.getWorkSpace();
    var key = this.instance.key;
    var {
      virtualScrollingDispatcher
    } = this.instance.getWorkSpace();
    var {
      cellCountInsideLeftVirtualCell,
      cellCountInsideTopVirtualRow
    } = virtualScrollingDispatcher;
    var groupCount = getGroupCount(this.instance.option('loadedResources'));
    var DOMMetaData = workspace.getDOMElementsMetaData();
    var allDayHeight = getAllDayHeight(workspace.option('showAllDayPanel'), workspace._isVerticalGroupedWorkSpace(), DOMMetaData);

    var rowCount = workspace._getRowCount();

    var {
      positionHelper,
      viewDataProvider
    } = workspace;
    var visibleDayDuration = viewDataProvider.getVisibleDayDuration(workspace.option('startDayHour'), workspace.option('endDayHour'), workspace.option('hoursInterval'));
    var cellDuration = getCellDuration(workspace.type, workspace.option('startDayHour'), workspace.option('endDayHour'), workspace.option('hoursInterval'));
    return {
      resources: this.instance.option('resources'),
      loadedResources: this.instance.option('loadedResources'),
      getAppointmentColor: this.instance.createGetAppointmentColor(),
      dataAccessors: this.instance._dataAccessors,
      key,
      isRenovatedAppointments: this.modelProvider.isRenovatedAppointments,
      appointmentRenderingStrategyName: this.appointmentRenderingStrategyName,
      adaptivityEnabled: this.modelProvider.adaptivityEnabled,
      rtlEnabled: this.modelProvider.rtlEnabled,
      startDayHour: this.modelProvider.startDayHour,
      endDayHour: this.modelProvider.endDayHour,
      maxAppointmentsPerCell: this.modelProvider.maxAppointmentsPerCell,
      currentDate: this.modelProvider.currentDate,
      isVirtualScrolling: this.instance.isVirtualScrolling(),
      leftVirtualCellCount: cellCountInsideLeftVirtualCell,
      topVirtualCellCount: cellCountInsideTopVirtualRow,
      intervalCount: workspace.option('intervalCount'),
      hoursInterval: workspace.option('hoursInterval'),
      showAllDayPanel: workspace.option('showAllDayPanel'),
      isGroupedAllDayPanel: workspace.isGroupedAllDayPanel(),
      modelGroups: this.modelProvider.getCurrentViewOption('groups'),
      groupCount,
      rowCount,
      appointmentCountPerCell: this.instance.option('_appointmentCountPerCell'),
      appointmentOffset: this.instance.option('_appointmentOffset'),
      allowResizing: this.instance._allowResizing(),
      allowAllDayResizing: this.instance._allowAllDayResizing(),
      startViewDate: workspace.getStartViewDate(),
      groupOrientation: workspace._getRealGroupOrientation(),
      cellWidth: getCellWidth(DOMMetaData),
      cellHeight: getCellHeight(DOMMetaData),
      allDayHeight: allDayHeight,
      resizableStep: positionHelper.getResizableStep(),
      visibleDayDuration,
      // appointment settings
      timeZoneCalculator: getTimeZoneCalculator(key),
      timeZone: this.modelProvider.timeZone,
      firstDayOfWeek: this.instance.getFirstDayOfWeek(),
      viewStartDayHour: this.modelProvider.getCurrentViewOption('startDayHour'),
      viewEndDayHour: this.modelProvider.getCurrentViewOption('endDayHour'),
      viewType: workspace.type,
      endViewDate: workspace.getEndViewDate(),
      positionHelper,
      isGroupedByDate: workspace.isGroupedByDate(),
      cellDuration,
      cellDurationInMinutes: workspace.option('cellDuration'),
      viewDataProvider: workspace.viewDataProvider,
      supportAllDayRow: workspace.supportAllDayRow(),
      dateRange: workspace.getDateRange(),
      intervalDuration: workspace.getIntervalDuration(),
      allDayIntervalDuration: workspace.getIntervalDuration(true),
      isVerticalOrientation: workspace.isVerticalOrientation(),
      DOMMetaData,
      // agenda only
      instance: this.instance,
      agendaDuration: workspace.option('agendaDuration')
    };
  }

  createAppointmentsMap(items) {
    var renderingStrategyOptions = this._getRenderingStrategyOptions();

    var {
      viewModel,
      positionMap
    } = this.appointmentViewModel.generate(items, renderingStrategyOptions);
    this._positionMap = positionMap; // TODO get rid of this after remove old render

    return viewModel;
  }

  _isDataChanged(data) {
    var appointmentDataProvider = this.instance.appointmentDataProvider;
    var updatedData = appointmentDataProvider.getUpdatedAppointment();
    return updatedData === data || appointmentDataProvider.getUpdatedAppointmentKeys().some(item => data[item.key] === item.value);
  }

  _isAppointmentShouldAppear(currentAppointment, sourceAppointment) {
    return currentAppointment.needRepaint && sourceAppointment.needRemove;
  }

  _isSettingChanged(settings, sourceSetting) {
    if (settings.length !== sourceSetting.length) {
      return true;
    }

    var createSettingsToCompare = (settings, index) => {
      var currentSetting = settings[index];
      var leftVirtualCellCount = currentSetting.leftVirtualCellCount || 0;
      var topVirtualCellCount = currentSetting.topVirtualCellCount || 0;
      var columnIndex = currentSetting.columnIndex + leftVirtualCellCount;
      var rowIndex = currentSetting.rowIndex + topVirtualCellCount;
      var hMax = currentSetting.reduced ? currentSetting.hMax : undefined;
      var vMax = currentSetting.reduced ? currentSetting.vMax : undefined;
      return _extends({}, currentSetting, {
        columnIndex,
        rowIndex,
        topVirtualCellCount: undefined,
        leftVirtualCellCount: undefined,
        leftVirtualWidth: undefined,
        topVirtualHeight: undefined,
        hMax,
        vMax,
        info: {}
      });
    };

    for (var i = 0; i < settings.length; i++) {
      var newSettings = createSettingsToCompare(settings, i);
      var oldSettings = createSettingsToCompare(sourceSetting, i);

      if (oldSettings) {
        // exclude sortedIndex property for comparison in commonUtils.equalByValue
        oldSettings.sortedIndex = newSettings.sortedIndex;
      }

      if (!equalByValue(newSettings, oldSettings)) {
        return true;
      }
    }

    return false;
  }

  _getAssociatedSourceAppointment(currentAppointment, sourceAppointments) {
    for (var i = 0; i < sourceAppointments.length; i++) {
      var item = sourceAppointments[i];

      if (item.itemData === currentAppointment.itemData) {
        return item;
      }
    }

    return null;
  }

  _getDeletedAppointments(currentAppointments, sourceAppointments) {
    var result = [];

    for (var i = 0; i < sourceAppointments.length; i++) {
      var sourceAppointment = sourceAppointments[i];

      var currentAppointment = this._getAssociatedSourceAppointment(sourceAppointment, currentAppointments);

      if (!currentAppointment) {
        sourceAppointment.needRemove = true;
        result.push(sourceAppointment);
      }
    }

    return result;
  }

  getRepaintedAppointments(currentAppointments, sourceAppointments) {
    if (sourceAppointments.length === 0 || this.appointmentRenderingStrategyName === 'agenda') {
      return currentAppointments;
    }

    currentAppointments.forEach(appointment => {
      var sourceAppointment = this._getAssociatedSourceAppointment(appointment, sourceAppointments);

      if (sourceAppointment) {
        appointment.needRepaint = this._isDataChanged(appointment.itemData) || this._isSettingChanged(appointment.settings, sourceAppointment.settings) || this._isAppointmentShouldAppear(appointment, sourceAppointment);
      }
    });
    return currentAppointments.concat(this._getDeletedAppointments(currentAppointments, sourceAppointments));
  }

  getRenderingStrategyInstance() {
    var renderingStrategy = this.appointmentViewModel.getRenderingStrategy();

    if (!renderingStrategy) {
      var options = this._getRenderingStrategyOptions();

      this.appointmentViewModel.initRenderingStrategy(options);
    }

    return this.appointmentViewModel.getRenderingStrategy();
  }

}

export default AppointmentLayoutManager;