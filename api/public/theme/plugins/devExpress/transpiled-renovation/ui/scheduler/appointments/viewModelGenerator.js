"use strict";

exports.AppointmentViewModelGenerator = void 0;

var _strategy_vertical = _interopRequireDefault(require("./rendering_strategies/strategy_vertical"));

var _strategy_horizontal = _interopRequireDefault(require("./rendering_strategies/strategy_horizontal"));

var _strategy_horizontal_month_line = _interopRequireDefault(require("./rendering_strategies/strategy_horizontal_month_line"));

var _strategy_horizontal_month = _interopRequireDefault(require("./rendering_strategies/strategy_horizontal_month"));

var _strategy_agenda = _interopRequireDefault(require("./rendering_strategies/strategy_agenda"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var RENDERING_STRATEGIES = {
  'horizontal': _strategy_horizontal.default,
  'horizontalMonth': _strategy_horizontal_month.default,
  'horizontalMonthLine': _strategy_horizontal_month_line.default,
  'vertical': _strategy_vertical.default,
  'agenda': _strategy_agenda.default
};

var AppointmentViewModelGenerator = /*#__PURE__*/function () {
  function AppointmentViewModelGenerator() {}

  var _proto = AppointmentViewModelGenerator.prototype;

  _proto.initRenderingStrategy = function initRenderingStrategy(options) {
    var RenderingStrategy = RENDERING_STRATEGIES[options.appointmentRenderingStrategyName];
    this.renderingStrategy = new RenderingStrategy(options);
  };

  _proto.generate = function generate(filteredItems, options) {
    var isRenovatedAppointments = options.isRenovatedAppointments,
        appointmentRenderingStrategyName = options.appointmentRenderingStrategyName;
    var appointments = filteredItems ? filteredItems.slice() : [];
    this.initRenderingStrategy(options);
    var renderingStrategy = this.getRenderingStrategy();
    var positionMap = renderingStrategy.createTaskPositionMap(appointments); // TODO - appointments are mutated inside!

    var viewModel = this.postProcess(appointments, positionMap, appointmentRenderingStrategyName, isRenovatedAppointments);

    if (isRenovatedAppointments) {
      // TODO this structure should be by default after remove old render
      return this.makeRenovatedViewModel(viewModel);
    }

    return {
      positionMap: positionMap,
      viewModel: viewModel
    };
  };

  _proto.postProcess = function postProcess(filteredItems, positionMap, appointmentRenderingStrategyName, isRenovatedAppointments) {
    var _this = this;

    return filteredItems.map(function (data, index) {
      // TODO research do we need this code
      if (!_this.getRenderingStrategy().keepAppointmentSettings()) {
        delete data.settings;
      } // TODO Seems we can analize direction in the rendering strategies


      var appointmentSettings = positionMap[index];
      appointmentSettings.forEach(function (item) {
        item.direction = appointmentRenderingStrategyName === 'vertical' && !item.allDay ? 'vertical' : 'horizontal';
      });
      var item = {
        itemData: data,
        settings: appointmentSettings
      };

      if (!isRenovatedAppointments) {
        item.needRepaint = true;
        item.needRemove = false;
      }

      return item;
    });
  };

  _proto.makeRenovatedViewModel = function makeRenovatedViewModel(viewModel) {
    var strategy = this.getRenderingStrategy();
    var regularViewModel = [];
    var allDayViewModel = [];
    viewModel.forEach(function (_ref) {
      var itemData = _ref.itemData,
          settings = _ref.settings;
      settings.forEach(function (options) {
        var geometry = strategy.getAppointmentGeometry(options);
        var item = {
          appointment: itemData,
          geometry: _extends({}, geometry, {
            // TODO move to the rendering strategies
            leftVirtualWidth: options.leftVirtualWidth,
            topVirtualHeight: options.topVirtualHeight
          }),
          info: _extends({}, options.info, {
            allDay: options.allDay
          })
        };

        if (options.allDay) {
          allDayViewModel.push(item);
        } else {
          regularViewModel.push(item);
        }
      });
    });
    return {
      allDay: allDayViewModel,
      regular: regularViewModel
    };
  };

  _proto.getRenderingStrategy = function getRenderingStrategy() {
    return this.renderingStrategy;
  };

  return AppointmentViewModelGenerator;
}();

exports.AppointmentViewModelGenerator = AppointmentViewModelGenerator;