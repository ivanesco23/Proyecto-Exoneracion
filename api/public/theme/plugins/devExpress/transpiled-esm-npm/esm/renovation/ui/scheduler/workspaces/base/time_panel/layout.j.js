import registerComponent from "../../../../../../core/component_registrator";
import BaseComponent from "../../../../../component_wrapper/common/component";
import { TimePanelTableLayout as TimePanelTableLayoutComponent } from "./layout";
export default class TimePanelTableLayout extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: ["timeCellTemplate"],
      props: ["groupOrientation", "timePanelData", "timeCellTemplate"]
    };
  }

  get _viewComponent() {
    return TimePanelTableLayoutComponent;
  }

}
registerComponent("dxTimePanelTableLayout", TimePanelTableLayout);