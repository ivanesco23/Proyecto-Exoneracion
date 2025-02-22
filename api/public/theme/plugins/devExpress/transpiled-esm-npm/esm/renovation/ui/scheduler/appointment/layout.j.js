import registerComponent from "../../../../core/component_registrator";
import BaseComponent from "../../../component_wrapper/common/component";
import { AppointmentLayout as AppointmentLayoutComponent } from "./layout";
export default class AppointmentLayout extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ["appointmentTemplate"],
      props: ["appointments", "appointmentTemplate"]
    };
  }

  get _viewComponent() {
    return AppointmentLayoutComponent;
  }

}
registerComponent("dxAppointmentLayout", AppointmentLayout);