"use strict";

exports.ModelProvider = void 0;

var _utils = require("./resources/utils");

var _type = require("../../core/utils/type");

var _views = require("../../renovation/ui/scheduler/model/views");

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VIEW_RENDERING_CONFIG = {
  day: {
    renderingStrategy: 'vertical'
  },
  week: {
    renderingStrategy: 'vertical'
  },
  workWeek: {
    renderingStrategy: 'vertical'
  },
  month: {
    renderingStrategy: 'horizontalMonth'
  },
  timelineDay: {
    renderingStrategy: 'horizontal'
  },
  timelineWeek: {
    renderingStrategy: 'horizontal'
  },
  timelineWorkWeek: {
    renderingStrategy: 'horizontal'
  },
  timelineMonth: {
    renderingStrategy: 'horizontalMonthLine'
  },
  agenda: {
    renderingStrategy: 'agenda'
  }
};

var ModelProvider = /*#__PURE__*/function () {
  function ModelProvider(model) {
    this.model = model;
    this.currentView = null;
  }

  var _proto = ModelProvider.prototype;

  _proto.supportAllDayResizing = function supportAllDayResizing() {
    return this.currentViewType !== 'day' || this.currentView.intervalCount > 1;
  };

  _proto.updateCurrentView = function updateCurrentView() {
    var views = this.model['views'];
    var currentView = this.model['currentView'];
    this.currentView = (0, _views.getCurrentView)(currentView, views);
  };

  _proto.isGroupedByDate = function isGroupedByDate() {
    return this.model['groupByDate'] && this._isHorizontalGroupedWorkSpace() && (0, _utils.getGroupCount)(this.loadedResources) > 0;
  };

  _proto._isHorizontalGroupedWorkSpace = function _isHorizontalGroupedWorkSpace() {
    return !!this.loadedResources.length && this.model['groupOrientation'] === 'horizontal';
  };

  _proto.getCurrentViewOption = function getCurrentViewOption(optionName) {
    if (this.currentView && this.currentView[optionName] !== undefined) {
      return this.currentView[optionName];
    }

    return this.model[optionName];
  };

  _proto.getAppointmentRenderingStrategyName = function getAppointmentRenderingStrategyName() {
    var renderingStrategy = VIEW_RENDERING_CONFIG[this.currentViewType].renderingStrategy;
    return renderingStrategy;
  };

  _createClass(ModelProvider, [{
    key: "key",
    get: function get() {
      return this.model.key;
    }
  }, {
    key: "loadedResources",
    get: function get() {
      return this.model.loadedResources;
    }
  }, {
    key: "startDayHour",
    get: function get() {
      return this.model['startDayHour'];
    }
  }, {
    key: "endDayHour",
    get: function get() {
      return this.model['endDayHour'];
    }
  }, {
    key: "adaptivityEnabled",
    get: function get() {
      return this.model['adaptivityEnabled'];
    }
  }, {
    key: "rtlEnabled",
    get: function get() {
      return this.model['rtlEnabled'];
    }
  }, {
    key: "maxAppointmentsPerCell",
    get: function get() {
      return this.getCurrentViewOption('maxAppointmentsPerCell');
    }
  }, {
    key: "currentViewOptions",
    get: function get() {
      return this.currentView;
    }
  }, {
    key: "currentViewType",
    get: function get() {
      return (0, _type.isObject)(this.currentView) ? this.currentView.type : this.currentView;
    }
  }, {
    key: "agendaDuration",
    get: function get() {
      return this.model['agendaDuration'];
    }
  }, {
    key: "currentDate",
    get: function get() {
      return this.model['currentDate'];
    }
  }, {
    key: "timeZone",
    get: function get() {
      return this.model['timeZone'];
    }
  }, {
    key: "isRenovatedAppointments",
    get: function get() {
      return this.model['isRenovatedAppointments'];
    }
  }]);

  return ModelProvider;
}();

exports.ModelProvider = ModelProvider;