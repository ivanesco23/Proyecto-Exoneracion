"use strict";

exports.viewFunction = exports.AllDayPanelTitleProps = exports.AllDayPanelTitle = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _message = _interopRequireDefault(require("../../../../../../../localization/message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var viewFunction = function viewFunction(viewModel) {
  return (0, _inferno.createVNode)(1, "div", "dx-scheduler-all-day-title", viewModel.text, 0);
};

exports.viewFunction = viewFunction;
var AllDayPanelTitleProps = {};
exports.AllDayPanelTitleProps = AllDayPanelTitleProps;

var AllDayPanelTitle = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(AllDayPanelTitle, _InfernoWrapperCompon);

  function AllDayPanelTitle(props) {
    var _this;

    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = AllDayPanelTitle.prototype;

  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      text: this.text,
      restAttributes: this.restAttributes
    });
  };

  _createClass(AllDayPanelTitle, [{
    key: "text",
    get: function get() {
      return _message.default.format("dxScheduler-allDay");
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var restProps = _extends({}, this.props);

      return restProps;
    }
  }]);

  return AllDayPanelTitle;
}(_inferno2.InfernoWrapperComponent);

exports.AllDayPanelTitle = AllDayPanelTitle;
AllDayPanelTitle.defaultProps = AllDayPanelTitleProps;