"use strict";

exports.TemplateWrapper = void 0;

var _inferno = require("@devextreme/runtime/inferno");

var _inferno2 = require("inferno");

var _shallow_equals = require("../../utils/shallow_equals");

var _dom = require("../../../core/utils/dom");

var _renderer = _interopRequireDefault(require("../../../core/renderer"));

var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));

var _element = require("../../../core/element");

var _utils = require("../utils/utils");

var _number = _interopRequireDefault(require("../../../core/polyfills/number"));

var _type = require("../../../core/utils/type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TemplateWrapper = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(TemplateWrapper, _InfernoComponent);

  function TemplateWrapper(props) {
    var _this;

    _this = _InfernoComponent.call(this, props) || this;
    _this.renderTemplate = _this.renderTemplate.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = TemplateWrapper.prototype;

  _proto.renderTemplate = function renderTemplate() {
    var _this$props$model;

    var node = (0, _inferno2.findDOMfromVNode)(this.$LI, true);
    var parentNode = node.parentNode;
    var $parent = (0, _renderer.default)(parentNode);
    var $children = $parent.contents();

    var _ref = (_this$props$model = this.props.model) !== null && _this$props$model !== void 0 ? _this$props$model : {
      data: {}
    },
        data = _ref.data,
        index = _ref.index;

    Object.keys(data).forEach(function (name) {
      if (data[name] && _dom_adapter.default.isNode(data[name])) {
        data[name] = (0, _element.getPublicElement)((0, _renderer.default)(data[name]));
      }
    });
    var $result = (0, _renderer.default)(this.props.template.render(_extends({
      container: (0, _element.getPublicElement)($parent),
      transclude: this.props.transclude
    }, !this.props.transclude ? {
      model: data
    } : {}, !this.props.transclude && _number.default.isFinite(index) ? {
      index: index
    } : {})));
    (0, _dom.replaceWith)((0, _renderer.default)(node), $result);
    return function () {
      (0, _utils.removeDifferentElements)($children, $parent.contents());
      parentNode.appendChild(node);
    };
  };

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var _this$props = this.props,
        model = _this$props.model,
        template = _this$props.template;
    var nextModel = nextProps.model,
        nextTemplate = nextProps.template;
    var sameTemplate = template === nextTemplate;

    if (!sameTemplate) {
      return true;
    }

    if ((0, _type.isDefined)(model) && (0, _type.isDefined)(nextModel)) {
      var data = model.data,
          index = model.index;
      var nextData = nextModel.data,
          nextIndex = nextModel.index;
      return index !== nextIndex || !(0, _shallow_equals.shallowEquals)(data, nextData);
    }

    var sameModel = model === nextModel;
    return !sameModel;
  };

  _proto.createEffects = function createEffects() {
    return [new _inferno.InfernoEffect(this.renderTemplate, [this.props.template, this.props.model])];
  };

  _proto.updateEffects = function updateEffects() {
    this._effects[0].update([this.props.template, this.props.model]);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {};

  _proto.render = function render() {
    return null;
  };

  return TemplateWrapper;
}(_inferno.InfernoComponent);

exports.TemplateWrapper = TemplateWrapper;