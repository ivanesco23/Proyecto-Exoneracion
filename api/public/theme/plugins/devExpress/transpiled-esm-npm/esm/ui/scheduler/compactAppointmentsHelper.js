import $ from '../../core/renderer';
import Button from '../button';
import { move, locate } from '../../animation/translator';
import messageLocalization from '../../localization/message';
import { FunctionTemplate } from '../../core/templates/function_template';
import { when } from '../../core/utils/deferred';
import { extendFromObject } from '../../core/utils/extend';
import { getBoundingRect } from '../../core/utils/position';
import { AppointmentTooltipInfo } from './dataStructures';
import { LIST_ITEM_DATA_KEY, LIST_ITEM_CLASS } from './constants';
import { createAppointmentAdapter } from './appointmentAdapter';
import { getTimeZoneCalculator } from './instanceFactory';
var APPOINTMENT_COLLECTOR_CLASS = 'dx-scheduler-appointment-collector';
var COMPACT_APPOINTMENT_COLLECTOR_CLASS = APPOINTMENT_COLLECTOR_CLASS + '-compact';
var APPOINTMENT_COLLECTOR_CONTENT_CLASS = APPOINTMENT_COLLECTOR_CLASS + '-content';
var WEEK_VIEW_COLLECTOR_OFFSET = 5;
var COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET = 1;
export class CompactAppointmentsHelper {
  constructor(instance) {
    this.instance = instance;
    this.key = this.instance.key;
    this.elements = [];
  }

  render(options) {
    var {
      isCompact,
      items,
      buttonColor
    } = options;

    var template = this._createTemplate(items.data.length, isCompact);

    var button = this._createCompactButton(template, options);

    var $button = button.$element();

    this._makeBackgroundColor($button, items.colors, buttonColor);

    this._makeBackgroundDarker($button);

    this.elements.push($button);
    $button.data('items', this._createTooltipInfos(items));
    return $button;
  }

  clear() {
    this.elements.forEach(button => {
      button.detach();
      button.remove();
    });
    this.elements = [];
  }

  _createTooltipInfos(items) {
    return items.data.map((appointment, index) => {
      var _items$settings;

      var targetedAdapter = createAppointmentAdapter(appointment, this.instance._dataAccessors, getTimeZoneCalculator(this.key)).clone();

      if (((_items$settings = items.settings) === null || _items$settings === void 0 ? void 0 : _items$settings.length) > 0) {
        var {
          info
        } = items.settings[index];
        targetedAdapter.startDate = info.sourceAppointment.startDate;
        targetedAdapter.endDate = info.sourceAppointment.endDate;
      }

      return new AppointmentTooltipInfo(appointment, targetedAdapter.source(), items.colors[index], items.settings[index]);
    });
  }

  _onButtonClick(e, options) {
    var $button = $(e.element);
    this.instance.showAppointmentTooltipCore($button, $button.data('items'), this._getExtraOptionsForTooltip(options, $button));
  }

  _getExtraOptionsForTooltip(options, $appointmentCollector) {
    return {
      clickEvent: this._clickEvent(options.onAppointmentClick).bind(this),
      dragBehavior: options.allowDrag && this._createTooltipDragBehavior($appointmentCollector).bind(this),
      dropDownAppointmentTemplate: this.instance.option().dropDownAppointmentTemplate,
      // TODO deprecated option
      isButtonClick: true
    };
  }

  _clickEvent(onAppointmentClick) {
    return e => {
      var config = {
        itemData: e.itemData.appointment,
        itemElement: e.itemElement,
        targetedAppointment: e.itemData.targetedAppointment
      };
      var createClickEvent = extendFromObject(this.instance.fire('mapAppointmentFields', config), e, false);
      delete createClickEvent.itemData;
      delete createClickEvent.itemIndex;
      delete createClickEvent.itemElement;
      onAppointmentClick(createClickEvent);
    };
  }

  _createTooltipDragBehavior($appointmentCollector) {
    return e => {
      var $element = $(e.element);
      var workSpace = this.instance.getWorkSpace();

      var getItemData = itemElement => {
        var _$$data;

        return (_$$data = $(itemElement).data(LIST_ITEM_DATA_KEY)) === null || _$$data === void 0 ? void 0 : _$$data.appointment;
      };

      var getItemSettings = (_, event) => {
        return event.itemSettings;
      };

      var initialPosition = locate($appointmentCollector);
      var options = {
        filter: ".".concat(LIST_ITEM_CLASS),
        isSetCursorOffset: true,
        initialPosition,
        getItemData,
        getItemSettings
      };

      workSpace._createDragBehaviorBase($element, options);
    };
  }

  _getCollectorOffset(width, cellWidth) {
    return cellWidth - width - this._getCollectorRightOffset();
  }

  _getCollectorRightOffset() {
    return this.instance.getRenderingStrategyInstance()._isCompactTheme() ? COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET : WEEK_VIEW_COLLECTOR_OFFSET;
  }

  _makeBackgroundDarker(button) {
    button.css('boxShadow', "inset ".concat(getBoundingRect(button.get(0)).width, "px 0 0 0 rgba(0, 0, 0, 0.3)"));
  }

  _makeBackgroundColor($button, colors, color) {
    when.apply(null, colors).done(function () {
      this._makeBackgroundColorCore($button, color, arguments);
    }.bind(this));
  }

  _makeBackgroundColorCore($button, color, itemsColors) {
    var paintButton = true;
    var currentItemColor;
    color && color.done(function (color) {
      if (itemsColors.length) {
        currentItemColor = itemsColors[0];

        for (var i = 1; i < itemsColors.length; i++) {
          if (currentItemColor !== itemsColors[i]) {
            paintButton = false;
            break;
          }

          currentItemColor = color;
        }
      }

      color && paintButton && $button.css('backgroundColor', color);
    }.bind(this));
  }

  _setPosition(element, position) {
    move(element, {
      top: position.top,
      left: position.left
    });
  }

  _createCompactButton(template, options) {
    var $button = this._createCompactButtonElement(options);

    return this.instance._createComponent($button, Button, {
      type: 'default',
      width: options.width,
      height: options.height,
      onClick: e => this._onButtonClick(e, options),
      template: this._renderTemplate(template, options.items, options.isCompact)
    });
  }

  _createCompactButtonElement(_ref) {
    var {
      isCompact,
      $container,
      width,
      coordinates,
      applyOffset,
      cellWidth
    } = _ref;
    var result = $('<div>').addClass(APPOINTMENT_COLLECTOR_CLASS).toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact).appendTo($container);
    var offset = applyOffset ? this._getCollectorOffset(width, cellWidth) : 0;

    this._setPosition(result, {
      top: coordinates.top,
      left: coordinates.left + offset
    });

    return result;
  }

  _renderTemplate(template, items, isCompact) {
    return new FunctionTemplate(options => {
      return template.render({
        model: {
          appointmentCount: items.data.length,
          isCompact: isCompact
        },
        container: options.container
      });
    });
  }

  _createTemplate(count, isCompact) {
    this._initButtonTemplate(count, isCompact);

    return this.instance._getAppointmentTemplate('appointmentCollectorTemplate');
  }

  _initButtonTemplate(count, isCompact) {
    this.instance._templateManager.addDefaultTemplates({
      appointmentCollector: new FunctionTemplate(options => this._createButtonTemplate(count, $(options.container), isCompact))
    });
  }

  _createButtonTemplate(appointmentCount, element, isCompact) {
    var text = isCompact ? appointmentCount : messageLocalization.getFormatter('dxScheduler-moreAppointments')(appointmentCount);
    return element.append($('<span>').text(text)).addClass(APPOINTMENT_COLLECTOR_CONTENT_CLASS);
  }

}