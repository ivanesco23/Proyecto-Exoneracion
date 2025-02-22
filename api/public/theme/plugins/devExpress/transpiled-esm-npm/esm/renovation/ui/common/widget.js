import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["_feedbackHideTimeout", "_feedbackShowTimeout", "accessKey", "activeStateEnabled", "activeStateUnit", "addWidgetClass", "aria", "children", "className", "classes", "cssText", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "name", "onActive", "onClick", "onDimensionChanged", "onFocusIn", "onFocusOut", "onHoverEnd", "onHoverStart", "onInactive", "onKeyDown", "onRootElementRendered", "onVisibilityChange", "rootElementRef", "rtlEnabled", "tabIndex", "visible", "width"];
import { createVNode, createComponentVNode, normalizeProps } from "inferno";
import { InfernoEffect, InfernoWrapperComponent, normalizeStyles } from "@devextreme/runtime/inferno";
import "../../../events/click";
import "../../../events/hover";
import { isFunction } from "../../../core/utils/type";
import { active, dxClick, focus, hover, keyboard, resize, visibility } from "../../../events/short";
import { combineClasses } from "../../utils/combine_classes";
import { extend } from "../../../core/utils/extend";
import { focusable } from "../../../ui/widget/selectors";
import { normalizeStyleProp } from "../../../core/utils/style";
import { BaseWidgetProps } from "./base_props";
import { ConfigContext } from "../../common/config_context";
import { ConfigProvider } from "../../common/config_provider";
import { resolveRtlEnabled, resolveRtlEnabledDefinition } from "../../utils/resolve_rtl";
import resizeCallbacks from "../../../core/utils/resize_callbacks";
import errors from "../../../core/errors";
import domAdapter from "../../../core/dom_adapter";
var DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
var DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;

var getAria = args => Object.keys(args).reduce((r, key) => {
  if (args[key]) {
    return _extends({}, r, {
      [key === "role" || key === "id" ? key : "aria-".concat(key)]: String(args[key])
    });
  }

  return r;
}, {});

export var viewFunction = viewModel => {
  var widget = normalizeProps(createVNode(1, "div", viewModel.cssClasses, viewModel.props.children, 0, _extends({}, viewModel.attributes, {
    "tabIndex": viewModel.tabIndex,
    "title": viewModel.props.hint,
    "hidden": !viewModel.props.visible,
    "style": normalizeStyles(viewModel.styles)
  }), null, viewModel.widgetElementRef));
  return viewModel.shouldRenderConfigProvider ? createComponentVNode(2, ConfigProvider, {
    "rtlEnabled": viewModel.rtlEnabled,
    children: widget
  }) : widget;
};
export var WidgetProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(BaseWidgetProps), Object.getOwnPropertyDescriptors({
  _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
  _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
  cssText: "",

  get aria() {
    return {};
  },

  classes: "",
  name: "",
  addWidgetClass: true
})));
import { createReRenderEffect } from "@devextreme/runtime/inferno";
import { createRef as infernoCreateRef } from "inferno";
export class Widget extends InfernoWrapperComponent {
  constructor(props) {
    super(props);
    this.widgetElementRef = infernoCreateRef();
    this.state = {
      active: false,
      focused: false,
      hovered: false
    };
    this.setRootElementRef = this.setRootElementRef.bind(this);
    this.activeEffect = this.activeEffect.bind(this);
    this.clickEffect = this.clickEffect.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.focusEffect = this.focusEffect.bind(this);
    this.hoverEffect = this.hoverEffect.bind(this);
    this.keyboardEffect = this.keyboardEffect.bind(this);
    this.resizeEffect = this.resizeEffect.bind(this);
    this.windowResizeEffect = this.windowResizeEffect.bind(this);
    this.visibilityEffect = this.visibilityEffect.bind(this);
    this.checkDeprecation = this.checkDeprecation.bind(this);
    this.applyCssTextEffect = this.applyCssTextEffect.bind(this);
  }

  get config() {
    if ("ConfigContext" in this.context) {
      return this.context.ConfigContext;
    }

    return ConfigContext;
  }

  createEffects() {
    return [new InfernoEffect(this.setRootElementRef, []), new InfernoEffect(this.activeEffect, [this.props._feedbackHideTimeout, this.props._feedbackShowTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.disabled, this.props.onActive, this.props.onInactive]), new InfernoEffect(this.clickEffect, [this.props.disabled, this.props.name, this.props.onClick]), new InfernoEffect(this.focusEffect, [this.props.disabled, this.props.focusStateEnabled, this.props.name, this.props.onFocusIn, this.props.onFocusOut]), new InfernoEffect(this.hoverEffect, [this.props.activeStateUnit, this.props.disabled, this.props.hoverStateEnabled, this.props.onHoverEnd, this.props.onHoverStart, this.state.active]), new InfernoEffect(this.keyboardEffect, [this.props.focusStateEnabled, this.props.onKeyDown]), new InfernoEffect(this.resizeEffect, [this.props.name, this.props.onDimensionChanged]), new InfernoEffect(this.windowResizeEffect, [this.props.onDimensionChanged]), new InfernoEffect(this.visibilityEffect, [this.props.name, this.props.onVisibilityChange]), new InfernoEffect(this.checkDeprecation, [this.props.height, this.props.width]), new InfernoEffect(this.applyCssTextEffect, [this.props.cssText]), createReRenderEffect()];
  }

  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7, _this$_effects$8, _this$_effects$9, _this$_effects$10;

    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props._feedbackHideTimeout, this.props._feedbackShowTimeout, this.props.activeStateEnabled, this.props.activeStateUnit, this.props.disabled, this.props.onActive, this.props.onInactive]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.disabled, this.props.name, this.props.onClick]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.disabled, this.props.focusStateEnabled, this.props.name, this.props.onFocusIn, this.props.onFocusOut]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 ? void 0 : _this$_effects$4.update([this.props.activeStateUnit, this.props.disabled, this.props.hoverStateEnabled, this.props.onHoverEnd, this.props.onHoverStart, this.state.active]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 ? void 0 : _this$_effects$5.update([this.props.focusStateEnabled, this.props.onKeyDown]);
    (_this$_effects$6 = this._effects[6]) === null || _this$_effects$6 === void 0 ? void 0 : _this$_effects$6.update([this.props.name, this.props.onDimensionChanged]);
    (_this$_effects$7 = this._effects[7]) === null || _this$_effects$7 === void 0 ? void 0 : _this$_effects$7.update([this.props.onDimensionChanged]);
    (_this$_effects$8 = this._effects[8]) === null || _this$_effects$8 === void 0 ? void 0 : _this$_effects$8.update([this.props.name, this.props.onVisibilityChange]);
    (_this$_effects$9 = this._effects[9]) === null || _this$_effects$9 === void 0 ? void 0 : _this$_effects$9.update([this.props.height, this.props.width]);
    (_this$_effects$10 = this._effects[10]) === null || _this$_effects$10 === void 0 ? void 0 : _this$_effects$10.update([this.props.cssText]);
  }

  setRootElementRef() {
    var {
      onRootElementRendered,
      rootElementRef
    } = this.props;

    if (rootElementRef) {
      rootElementRef.current = this.widgetElementRef.current;
    }

    onRootElementRendered === null || onRootElementRendered === void 0 ? void 0 : onRootElementRendered(this.widgetElementRef.current);
  }

  activeEffect() {
    var {
      _feedbackHideTimeout,
      _feedbackShowTimeout,
      activeStateEnabled,
      activeStateUnit,
      disabled,
      onActive,
      onInactive
    } = this.props;
    var selector = activeStateUnit;
    var namespace = "UIFeedback";

    if (activeStateEnabled && !disabled) {
      active.on(this.widgetElementRef.current, _ref => {
        var {
          event
        } = _ref;
        this.setState(__state_argument => ({
          active: true
        }));
        onActive === null || onActive === void 0 ? void 0 : onActive(event);
      }, _ref2 => {
        var {
          event
        } = _ref2;
        this.setState(__state_argument => ({
          active: false
        }));
        onInactive === null || onInactive === void 0 ? void 0 : onInactive(event);
      }, {
        hideTimeout: _feedbackHideTimeout,
        namespace,
        selector,
        showTimeout: _feedbackShowTimeout
      });
      return () => active.off(this.widgetElementRef.current, {
        selector,
        namespace
      });
    }

    return undefined;
  }

  clickEffect() {
    var {
      disabled,
      name,
      onClick
    } = this.props;
    var namespace = name;

    if (onClick && !disabled) {
      dxClick.on(this.widgetElementRef.current, onClick, {
        namespace
      });
      return () => dxClick.off(this.widgetElementRef.current, {
        namespace
      });
    }

    return undefined;
  }

  focusEffect() {
    var {
      disabled,
      focusStateEnabled,
      name,
      onFocusIn,
      onFocusOut
    } = this.props;
    var namespace = "".concat(name, "Focus");
    var isFocusable = focusStateEnabled && !disabled;

    if (isFocusable) {
      focus.on(this.widgetElementRef.current, e => {
        if (!e.isDefaultPrevented()) {
          this.setState(__state_argument => ({
            focused: true
          }));
          onFocusIn === null || onFocusIn === void 0 ? void 0 : onFocusIn(e);
        }
      }, e => {
        if (!e.isDefaultPrevented()) {
          this.setState(__state_argument => ({
            focused: false
          }));
          onFocusOut === null || onFocusOut === void 0 ? void 0 : onFocusOut(e);
        }
      }, {
        isFocusable: focusable,
        namespace
      });
      return () => focus.off(this.widgetElementRef.current, {
        namespace
      });
    }

    return undefined;
  }

  hoverEffect() {
    var namespace = "UIFeedback";
    var {
      activeStateUnit,
      disabled,
      hoverStateEnabled,
      onHoverEnd,
      onHoverStart
    } = this.props;
    var selector = activeStateUnit;
    var isHoverable = hoverStateEnabled && !disabled;

    if (isHoverable) {
      hover.on(this.widgetElementRef.current, _ref3 => {
        var {
          event
        } = _ref3;
        !this.state.active && this.setState(__state_argument => ({
          hovered: true
        }));
        onHoverStart === null || onHoverStart === void 0 ? void 0 : onHoverStart(event);
      }, event => {
        this.setState(__state_argument => ({
          hovered: false
        }));
        onHoverEnd === null || onHoverEnd === void 0 ? void 0 : onHoverEnd(event);
      }, {
        selector,
        namespace
      });
      return () => hover.off(this.widgetElementRef.current, {
        selector,
        namespace
      });
    }

    return undefined;
  }

  keyboardEffect() {
    var {
      focusStateEnabled,
      onKeyDown
    } = this.props;

    if (focusStateEnabled && onKeyDown) {
      var id = keyboard.on(this.widgetElementRef.current, this.widgetElementRef.current, e => onKeyDown(e));
      return () => keyboard.off(id);
    }

    return undefined;
  }

  resizeEffect() {
    var namespace = "".concat(this.props.name, "VisibilityChange");
    var {
      onDimensionChanged
    } = this.props;

    if (onDimensionChanged) {
      resize.on(this.widgetElementRef.current, onDimensionChanged, {
        namespace
      });
      return () => resize.off(this.widgetElementRef.current, {
        namespace
      });
    }

    return undefined;
  }

  windowResizeEffect() {
    var {
      onDimensionChanged
    } = this.props;

    if (onDimensionChanged) {
      resizeCallbacks.add(onDimensionChanged);
      return () => {
        resizeCallbacks.remove(onDimensionChanged);
      };
    }

    return undefined;
  }

  visibilityEffect() {
    var {
      name,
      onVisibilityChange
    } = this.props;
    var namespace = "".concat(name, "VisibilityChange");

    if (onVisibilityChange) {
      visibility.on(this.widgetElementRef.current, () => onVisibilityChange(true), () => onVisibilityChange(false), {
        namespace
      });
      return () => visibility.off(this.widgetElementRef.current, {
        namespace
      });
    }

    return undefined;
  }

  checkDeprecation() {
    var {
      height,
      width
    } = this.props;

    if (isFunction(width)) {
      errors.log("W0017", "width");
    }

    if (isFunction(height)) {
      errors.log("W0017", "height");
    }
  }

  applyCssTextEffect() {
    var {
      cssText
    } = this.props;

    if (cssText !== "") {
      this.widgetElementRef.current.style.cssText = cssText;
    }
  }

  get shouldRenderConfigProvider() {
    var {
      rtlEnabled
    } = this.props;
    return resolveRtlEnabledDefinition(rtlEnabled, this.config);
  }

  get rtlEnabled() {
    var {
      rtlEnabled
    } = this.props;
    return resolveRtlEnabled(rtlEnabled, this.config);
  }

  get attributes() {
    var {
      aria,
      disabled,
      focusStateEnabled,
      visible
    } = this.props;
    var accessKey = focusStateEnabled && !disabled && this.props.accessKey;
    return _extends({}, extend({}, this.restAttributes, accessKey && {
      accessKey
    }), getAria(_extends({}, aria, {
      disabled,
      hidden: !visible
    })));
  }

  get styles() {
    var {
      height,
      width
    } = this.props;
    var style = this.restAttributes.style || {};
    var computedWidth = normalizeStyleProp("width", isFunction(width) ? width() : width);
    var computedHeight = normalizeStyleProp("height", isFunction(height) ? height() : height);
    return _extends({}, style, {
      height: computedHeight !== null && computedHeight !== void 0 ? computedHeight : style.height,
      width: computedWidth !== null && computedWidth !== void 0 ? computedWidth : style.width
    });
  }

  get cssClasses() {
    var {
      activeStateEnabled,
      addWidgetClass,
      className,
      classes,
      disabled,
      focusStateEnabled,
      hoverStateEnabled,
      onVisibilityChange,
      visible
    } = this.props;
    var isFocusable = !!focusStateEnabled && !disabled;
    var isHoverable = !!hoverStateEnabled && !disabled;
    var canBeActive = !!activeStateEnabled && !disabled;
    var classesMap = {
      "dx-widget": !!addWidgetClass,
      [String(classes)]: !!classes,
      [String(className)]: !!className,
      "dx-state-disabled": !!disabled,
      "dx-state-invisible": !visible,
      "dx-state-focused": !!this.state.focused && isFocusable,
      "dx-state-active": !!this.state.active && canBeActive,
      "dx-state-hover": !!this.state.hovered && isHoverable && !this.state.active,
      "dx-rtl": !!this.rtlEnabled,
      "dx-visibility-change-handler": !!onVisibilityChange
    };
    return combineClasses(classesMap);
  }

  get tabIndex() {
    var {
      disabled,
      focusStateEnabled,
      tabIndex
    } = this.props;
    var isFocusable = focusStateEnabled && !disabled;
    return isFocusable ? tabIndex : undefined;
  }

  get restAttributes() {
    var _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);

    return restProps;
  }

  focus() {
    focus.trigger(this.widgetElementRef.current);
  }

  blur() {
    var activeElement = domAdapter.getActiveElement();

    if (this.widgetElementRef.current === activeElement) {
      activeElement.blur();
    }
  }

  activate() {
    this.setState(__state_argument => ({
      active: true
    }));
  }

  deactivate() {
    this.setState(__state_argument => ({
      active: false
    }));
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      active: this.state.active,
      focused: this.state.focused,
      hovered: this.state.hovered,
      widgetElementRef: this.widgetElementRef,
      config: this.config,
      shouldRenderConfigProvider: this.shouldRenderConfigProvider,
      rtlEnabled: this.rtlEnabled,
      attributes: this.attributes,
      styles: this.styles,
      cssClasses: this.cssClasses,
      tabIndex: this.tabIndex,
      restAttributes: this.restAttributes
    });
  }

}
Widget.defaultProps = WidgetProps;