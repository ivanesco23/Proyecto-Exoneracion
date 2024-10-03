"use strict";

exports.default = void 0;

var _validation_engine = _interopRequireDefault(require("../../ui/validation_engine"));

var _component = _interopRequireDefault(require("./common/component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ButtonWrapper = /*#__PURE__*/function (_Component) {
  _inheritsLoose(ButtonWrapper, _Component);

  function ButtonWrapper() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = ButtonWrapper.prototype;

  _proto.getDefaultTemplateNames = function getDefaultTemplateNames() {
    return ["content"];
  };

  _proto.getSupportedKeyNames = function getSupportedKeyNames() {
    return ["space", "enter"];
  };

  _proto.getProps = function getProps() {
    var props = _Component.prototype.getProps.call(this);

    props.validationGroup = this._validationGroupConfig;
    return props;
  };

  _proto._toggleActiveState = function _toggleActiveState(_, value) {
    var button = this.viewRef;
    value ? button.activate() : button.deactivate();
  };

  _proto._getSubmitAction = function _getSubmitAction() {
    var _this = this;

    var needValidate = true;
    var validationStatus = "valid";
    return this._createAction(function (_ref) {
      var event = _ref.event,
          submitInput = _ref.submitInput;

      if (needValidate) {
        var validationGroup = _this._validationGroupConfig;

        if (validationGroup !== undefined && validationGroup !== "") {
          var _validationGroup$vali = validationGroup.validate(),
              complete = _validationGroup$vali.complete,
              status = _validationGroup$vali.status;

          validationStatus = status;

          if (status === "pending") {
            needValidate = false;

            _this.option("disabled", true);

            complete.then(function () {
              needValidate = true;

              _this.option("disabled", false);

              validationStatus = status;
              validationStatus === "valid" && submitInput.click();
            });
          }
        }
      }

      validationStatus !== "valid" && event.preventDefault();
      event.stopPropagation();
    });
  };

  _proto._init = function _init() {
    _Component.prototype._init.call(this);

    this._addAction("onSubmit", this._getSubmitAction());
  };

  _proto._initMarkup = function _initMarkup() {
    _Component.prototype._initMarkup.call(this);

    var $content = this.$element().find(".dx-button-content");
    var $template = $content.children().filter(".dx-template-wrapper");

    if ($template.length) {
      $template.addClass("dx-button-content");
      $content.replaceWith($template);
    }
  };

  _proto._patchOptionValues = function _patchOptionValues(options) {
    return _Component.prototype._patchOptionValues.call(this, _extends({}, options, {
      templateData: options._templateData
    }));
  };

  _proto._findGroup = function _findGroup() {
    var $element = this.$element();
    var validationGroup = this.option("validationGroup");
    return validationGroup !== undefined && validationGroup !== "" ? validationGroup : _validation_engine.default.findGroup($element, this._modelByElement($element));
  };

  _createClass(ButtonWrapper, [{
    key: "_validationGroupConfig",
    get: function get() {
      return _validation_engine.default.getGroupConfig(this._findGroup());
    }
  }, {
    key: "_templatesInfo",
    get: function get() {
      return {
        template: "content"
      };
    }
  }]);

  return ButtonWrapper;
}(_component.default);

exports.default = ButtonWrapper;
module.exports = exports.default;
module.exports.default = exports.default;