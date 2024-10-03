import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["dateText", "text"];
import { createVNode } from "inferno";
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
export var viewFunction = _ref => {
  var {
    props: {
      dateText,
      text
    }
  } = _ref;
  return createVNode(1, "div", "dx-scheduler-appointment-content", [createVNode(1, "div", "dx-scheduler-appointment-title", text, 0), createVNode(1, "div", "dx-scheduler-appointment-content-details", createVNode(1, "div", "dx-scheduler-appointment-content-date", dateText, 0), 2)], 4);
};
export var AppointmentContentProps = {
  text: "",
  dateText: ""
};
export class AppointmentContent extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      restAttributes: this.restAttributes
    });
  }

}
AppointmentContent.defaultProps = AppointmentContentProps;