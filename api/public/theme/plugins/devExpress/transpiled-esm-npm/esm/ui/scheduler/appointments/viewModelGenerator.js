import _extends from "@babel/runtime/helpers/esm/extends";
import VerticalAppointmentsStrategy from './rendering_strategies/strategy_vertical';
import HorizontalAppointmentsStrategy from './rendering_strategies/strategy_horizontal';
import HorizontalMonthLineAppointmentsStrategy from './rendering_strategies/strategy_horizontal_month_line';
import HorizontalMonthAppointmentsStrategy from './rendering_strategies/strategy_horizontal_month';
import AgendaAppointmentsStrategy from './rendering_strategies/strategy_agenda';
var RENDERING_STRATEGIES = {
  'horizontal': HorizontalAppointmentsStrategy,
  'horizontalMonth': HorizontalMonthAppointmentsStrategy,
  'horizontalMonthLine': HorizontalMonthLineAppointmentsStrategy,
  'vertical': VerticalAppointmentsStrategy,
  'agenda': AgendaAppointmentsStrategy
};
export class AppointmentViewModelGenerator {
  initRenderingStrategy(options) {
    var RenderingStrategy = RENDERING_STRATEGIES[options.appointmentRenderingStrategyName];
    this.renderingStrategy = new RenderingStrategy(options);
  }

  generate(filteredItems, options) {
    var {
      isRenovatedAppointments,
      appointmentRenderingStrategyName
    } = options;
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
      positionMap,
      viewModel
    };
  }

  postProcess(filteredItems, positionMap, appointmentRenderingStrategyName, isRenovatedAppointments) {
    return filteredItems.map((data, index) => {
      // TODO research do we need this code
      if (!this.getRenderingStrategy().keepAppointmentSettings()) {
        delete data.settings;
      } // TODO Seems we can analize direction in the rendering strategies


      var appointmentSettings = positionMap[index];
      appointmentSettings.forEach(item => {
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
  }

  makeRenovatedViewModel(viewModel) {
    var strategy = this.getRenderingStrategy();
    var regularViewModel = [];
    var allDayViewModel = [];
    viewModel.forEach(_ref => {
      var {
        itemData,
        settings
      } = _ref;
      settings.forEach(options => {
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
  }

  getRenderingStrategy() {
    return this.renderingStrategy;
  }

}