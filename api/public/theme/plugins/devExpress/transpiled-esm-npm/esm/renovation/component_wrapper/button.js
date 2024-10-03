import _extends from "@babel/runtime/helpers/esm/extends";
import ValidationEngine from "../../ui/validation_engine";
import Component from "./common/component";
export default class ButtonWrapper extends Component {
  get _validationGroupConfig() {
    return ValidationEngine.getGroupConfig(this._findGroup());
  }

  getDefaultTemplateNames() {
    return ["content"];
  }

  getSupportedKeyNames() {
    return ["space", "enter"];
  }

  getProps() {
    var props = super.getProps();
    props.validationGroup = this._validationGroupConfig;
    return props;
  }

  get _templatesInfo() {
    return {
      template: "content"
    };
  }

  _toggleActiveState(_, value) {
    var button = this.viewRef;
    value ? button.activate() : button.deactivate();
  }

  _getSubmitAction() {
    var needValidate = true;
    var validationStatus = "valid";
    return this._createAction(_ref => {
      var {
        event,
        submitInput
      } = _ref;

      if (needValidate) {
        var validationGroup = this._validationGroupConfig;

        if (validationGroup !== undefined && validationGroup !== "") {
          var {
            complete,
            status
          } = validationGroup.validate();
          validationStatus = status;

          if (status === "pending") {
            needValidate = false;
            this.option("disabled", true);
            complete.then(() => {
              needValidate = true;
              this.option("disabled", false);
              validationStatus = status;
              validationStatus === "valid" && submitInput.click();
            });
          }
        }
      }

      validationStatus !== "valid" && event.preventDefault();
      event.stopPropagation();
    });
  }

  _init() {
    super._init();

    this._addAction("onSubmit", this._getSubmitAction());
  }

  _initMarkup() {
    super._initMarkup();

    var $content = this.$element().find(".dx-button-content");
    var $template = $content.children().filter(".dx-template-wrapper");

    if ($template.length) {
      $template.addClass("dx-button-content");
      $content.replaceWith($template);
    }
  }

  _patchOptionValues(options) {
    return super._patchOptionValues(_extends({}, options, {
      templateData: options._templateData
    }));
  }

  _findGroup() {
    var $element = this.$element();
    var validationGroup = this.option("validationGroup");
    return validationGroup !== undefined && validationGroup !== "" ? validationGroup : ValidationEngine.findGroup($element, this._modelByElement($element));
  }

}