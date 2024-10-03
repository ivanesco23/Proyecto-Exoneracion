import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["appointmentTemplate", "appointments"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { InfernoWrapperComponent } from "@devextreme/runtime/inferno";
import { Appointment } from "./appointment";
import { getAppointmentKey } from "./utils";
export var viewFunction = _ref => {
  var {
    props: {
      appointmentTemplate,
      appointments
    }
  } = _ref;
  return createVNode(1, "div", "dx-scheduler-appointments", appointments.map((item, index) => createComponentVNode(2, Appointment, {
    "viewModel": item,
    "appointmentTemplate": appointmentTemplate,
    "index": index
  }, getAppointmentKey(item))), 0);
};
export var AppointmentLayoutProps = {
  get appointments() {
    return [];
  }

};
import { createReRenderEffect } from "@devextreme/runtime/inferno";

var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);

export class AppointmentLayout extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        appointmentTemplate: getTemplate(props.appointmentTemplate)
      }),
      restAttributes: this.restAttributes
    });
  }

}
AppointmentLayout.defaultProps = AppointmentLayoutProps;