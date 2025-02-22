"use strict";

exports.viewFunction = exports.CellBaseProps = exports.CellBase = void 0;

var _inferno = require("inferno");

var _inferno2 = require("@devextreme/runtime/inferno");

var _utils = require("../utils");

var _excluded = ["allDay", "ariaLabel", "children", "className", "contentTemplate", "contentTemplateProps", "endDate", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "startDate", "text"];

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var viewFunction = function viewFunction(viewModel) {
  var ContentTemplate = viewModel.props.contentTemplate;
  return (0, _inferno.createVNode)(1, "td", viewModel.classes, [!viewModel.props.contentTemplate && viewModel.props.children, viewModel.props.contentTemplate && ContentTemplate(_extends({}, viewModel.props.contentTemplateProps))], 0, {
    "aria-label": viewModel.props.ariaLabel
  });
};

exports.viewFunction = viewFunction;
var CellBaseProps = Object.defineProperties({
  className: "",
  isFirstGroupCell: false,
  isLastGroupCell: false,
  allDay: false,
  text: "",
  index: 0
}, {
  startDate: {
    get: function get() {
      return new Date();
    },
    configurable: true,
    enumerable: true
  },
  endDate: {
    get: function get() {
      return new Date();
    },
    configurable: true,
    enumerable: true
  },
  contentTemplateProps: {
    get: function get() {
      return {
        data: {},
        index: 0
      };
    },
    configurable: true,
    enumerable: true
  }
});
exports.CellBaseProps = CellBaseProps;

var getTemplate = function getTemplate(TemplateProp) {
  return TemplateProp && (TemplateProp.defaultProps ? function (props) {
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)));
  } : TemplateProp);
};

var CellBase = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(CellBase, _BaseInfernoComponent);

  function CellBase(props) {
    var _this;

    _this = _BaseInfernoComponent.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = CellBase.prototype;

  _proto.render = function render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        contentTemplate: getTemplate(props.contentTemplate)
      }),
      classes: this.classes,
      restAttributes: this.restAttributes
    });
  };

  _createClass(CellBase, [{
    key: "classes",
    get: function get() {
      var _this$props = this.props,
          className = _this$props.className,
          isFirstGroupCell = _this$props.isFirstGroupCell,
          isLastGroupCell = _this$props.isLastGroupCell;
      return (0, _utils.getGroupCellClasses)(isFirstGroupCell, isLastGroupCell, className);
    }
  }, {
    key: "restAttributes",
    get: function get() {
      var _this$props2 = this.props,
          allDay = _this$props2.allDay,
          ariaLabel = _this$props2.ariaLabel,
          children = _this$props2.children,
          className = _this$props2.className,
          contentTemplate = _this$props2.contentTemplate,
          contentTemplateProps = _this$props2.contentTemplateProps,
          endDate = _this$props2.endDate,
          groupIndex = _this$props2.groupIndex,
          groups = _this$props2.groups,
          index = _this$props2.index,
          isFirstGroupCell = _this$props2.isFirstGroupCell,
          isLastGroupCell = _this$props2.isLastGroupCell,
          startDate = _this$props2.startDate,
          text = _this$props2.text,
          restProps = _objectWithoutProperties(_this$props2, _excluded);

      return restProps;
    }
  }]);

  return CellBase;
}(_inferno2.BaseInfernoComponent);

exports.CellBase = CellBase;
CellBase.defaultProps = CellBaseProps;