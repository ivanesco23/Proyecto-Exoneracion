import { isDefined } from "../../../core/utils/type";
import Component from "../common/component";
import ValidationEngine from "../../../ui/validation_engine";
import { extend } from "../../../core/utils/extend";
import $ from "../../../core/renderer";
import { data } from "../../../core/element_data";
import Callbacks from "../../../core/utils/callbacks";
import OldEditor from "../../../ui/editor/editor";
var INVALID_MESSAGE_AUTO = "dx-invalid-message-auto";
var VALIDATION_TARGET = "dx-validation-target";
export default class Editor extends Component {
  getProps() {
    var props = super.getProps();

    props.onFocusIn = () => {
      var isValidationMessageShownOnFocus = this.option("validationMessageMode") === "auto";

      if (isValidationMessageShownOnFocus) {
        var $validationMessageWrapper = $(".dx-invalid-message.dx-overlay-wrapper");
        $validationMessageWrapper === null || $validationMessageWrapper === void 0 ? void 0 : $validationMessageWrapper.removeClass(INVALID_MESSAGE_AUTO);
        var timeToWaitBeforeShow = 150;

        if (this.showValidationMessageTimeout) {
          clearTimeout(this.showValidationMessageTimeout);
        }

        this.showValidationMessageTimeout = setTimeout(() => {
          $validationMessageWrapper === null || $validationMessageWrapper === void 0 ? void 0 : $validationMessageWrapper.addClass(INVALID_MESSAGE_AUTO);
        }, timeToWaitBeforeShow);
      }
    };

    props.saveValueChangeEvent = e => {
      this._valueChangeEventInstance = e;
    };

    return props;
  }

  _createElement(element) {
    super._createElement(element);

    this.showValidationMessageTimeout = undefined;
    this.validationRequest = Callbacks();
    data(this.$element()[0], VALIDATION_TARGET, this);
  }

  _init() {
    super._init();

    this._valueChangeAction = this._createActionByOption("onValueChanged", {
      excludeValidators: ["disabled", "readOnly"]
    });
  }

  _initOptions(options) {
    super._initOptions(options);

    this.option(ValidationEngine.initValidationOptions(options));
  }

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      validationMessageOffset: {
        h: 0,
        v: 0
      },
      validationTooltipOptions: {}
    });
  }

  _bindInnerWidgetOptions(innerWidget, optionsContainer) {
    var innerWidgetOptions = extend({}, innerWidget.option());

    var syncOptions = () => this._silent(optionsContainer, innerWidgetOptions);

    syncOptions();
    innerWidget.on("optionChanged", syncOptions);
  }

  _raiseValidation(value, previousValue) {
    var areValuesEmpty = !isDefined(value) && !isDefined(previousValue);

    if (value !== previousValue && !areValuesEmpty) {
      this.validationRequest.fire({
        value,
        editor: this
      });
    }
  }

  _raiseValueChangeAction(value, previousValue) {
    var _this$_valueChangeAct;

    (_this$_valueChangeAct = this._valueChangeAction) === null || _this$_valueChangeAct === void 0 ? void 0 : _this$_valueChangeAct.call(this, {
      element: this.$element(),
      previousValue,
      value,
      event: this._valueChangeEventInstance
    });
    this._valueChangeEventInstance = undefined;
  }

  _optionChanged(option) {
    var {
      name,
      previousValue,
      value
    } = option;

    if (name && this._getActionConfigs()[name] !== undefined) {
      this._addAction(name);
    }

    switch (name) {
      case "value":
        this._raiseValidation(value, previousValue);

        this._raiseValueChangeAction(value, previousValue);

        break;

      case "onValueChanged":
        this._valueChangeAction = this._createActionByOption("onValueChanged", {
          excludeValidators: ["disabled", "readOnly"]
        });
        break;

      case "isValid":
      case "validationError":
      case "validationErrors":
      case "validationStatus":
        this.option(ValidationEngine.synchronizeValidationOptions(option, this.option()));
        break;

      default:
        break;
    }

    super._optionChanged(option);
  }

  reset() {
    var {
      value
    } = this._getDefaultOptions();

    this.option({
      value
    });
  }

  _dispose() {
    super._dispose();

    data(this.element(), VALIDATION_TARGET, null);

    if (this.showValidationMessageTimeout) {
      clearTimeout(this.showValidationMessageTimeout);
    }
  }

}
var prevIsEditor = OldEditor.isEditor;

var newIsEditor = instance => prevIsEditor(instance) || instance instanceof Editor;

Editor.isEditor = newIsEditor;
OldEditor.isEditor = newIsEditor;