"use strict";

exports.viewFunction = exports.Form = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _form = _interopRequireDefault(require("../../../../ui/form"));

var _dom_component_wrapper = require("../../common/dom_component_wrapper");

var _form_props = require("./form_props");

var _excluded = ["accessKey", "activeStateEnabled", "className", "disabled", "focusStateEnabled", "formData", "height", "hint", "hoverStateEnabled", "items", "labelLocation", "onClick", "onKeyDown", "rtlEnabled", "scrollingEnabled", "showColonAfterLabel", "showValidationSummary", "tabIndex", "visible", "width"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(_ref) {
  var props = _ref.props,
      restAttributes = _ref.restAttributes;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _form.default,
    "componentProps": props,
    "templateNames": []
  }, restAttributes)));
};

exports.viewFunction = viewFunction;

var Form = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(Form, _InfernoWrapperCompon);

  function Form(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = Form.prototype;

  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      restAttributes: this.restAttributes
    });
  };

  _createClass(Form, [{
    key: "restAttributes",
    get: function get() {
      var _this$props = this.props,
          accessKey = _this$props.accessKey,
          activeStateEnabled = _this$props.activeStateEnabled,
          className = _this$props.className,
          disabled = _this$props.disabled,
          focusStateEnabled = _this$props.focusStateEnabled,
          formData = _this$props.formData,
          height = _this$props.height,
          hint = _this$props.hint,
          hoverStateEnabled = _this$props.hoverStateEnabled,
          items = _this$props.items,
          labelLocation = _this$props.labelLocation,
          onClick = _this$props.onClick,
          onKeyDown = _this$props.onKeyDown,
          rtlEnabled = _this$props.rtlEnabled,
          scrollingEnabled = _this$props.scrollingEnabled,
          showColonAfterLabel = _this$props.showColonAfterLabel,
          showValidationSummary = _this$props.showValidationSummary,
          tabIndex = _this$props.tabIndex,
          visible = _this$props.visible,
          width = _this$props.width,
          restProps = _objectWithoutProperties(_this$props, _excluded);

      return restProps;
    }
  }]);

  return Form;
}(_inferno2.InfernoWrapperComponent);

exports.Form = Form;
Form.defaultProps = _form_props.FormProps;