import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["position", "source"];
import { createVNode, createFragment } from "inferno";
import { Fragment } from "inferno";
import { BaseInfernoComponent } from "@devextreme/runtime/inferno";
import { getImageSourceType } from "../../../core/utils/icon";
import { combineClasses } from "../../utils/combine_classes";
export var viewFunction = _ref => {
  var {
    iconClassName,
    props: {
      source
    },
    sourceType
  } = _ref;
  return createFragment([sourceType === "dxIcon" && createVNode(1, "i", iconClassName), sourceType === "fontIcon" && createVNode(1, "i", iconClassName), sourceType === "image" && createVNode(1, "img", iconClassName, null, 1, {
    "alt": "",
    "src": source
  }), sourceType === "svg" && createVNode(1, "i", iconClassName, source, 0)], 0);
};
export var IconProps = {
  position: "left",
  source: ""
};
export class Icon extends BaseInfernoComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  get sourceType() {
    return getImageSourceType(this.props.source);
  }

  get cssClass() {
    return this.props.position !== "left" ? "dx-icon-right" : "";
  }

  get iconClassName() {
    var generalClasses = {
      "dx-icon": true,
      [this.cssClass]: !!this.cssClass
    };
    var {
      source
    } = this.props;

    if (this.sourceType === "dxIcon") {
      return combineClasses(_extends({}, generalClasses, {
        ["dx-icon-".concat(source)]: true
      }));
    }

    if (this.sourceType === "fontIcon") {
      return combineClasses(_extends({}, generalClasses, {
        [String(source)]: !!source
      }));
    }

    if (this.sourceType === "image") {
      return combineClasses(generalClasses);
    }

    if (this.sourceType === "svg") {
      return combineClasses(_extends({}, generalClasses, {
        "dx-svg-icon": true
      }));
    }

    return "";
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
      sourceType: this.sourceType,
      cssClass: this.cssClass,
      iconClassName: this.iconClassName,
      restAttributes: this.restAttributes
    });
  }

}
Icon.defaultProps = IconProps;