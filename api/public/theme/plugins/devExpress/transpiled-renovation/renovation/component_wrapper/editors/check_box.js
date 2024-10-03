"use strict";

exports.default = void 0;

var _editor = _interopRequireDefault(require("./editor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CheckBox = /*#__PURE__*/function (_Editor) {
  _inheritsLoose(CheckBox, _Editor);

  function CheckBox() {
    return _Editor.apply(this, arguments) || this;
  }

  var _proto = CheckBox.prototype;

  _proto._useTemplates = function _useTemplates() {
    return false;
  };

  _proto.getSupportedKeyNames = function getSupportedKeyNames() {
    return ["space"];
  };

  return CheckBox;
}(_editor.default);

exports.default = CheckBox;
module.exports = exports.default;
module.exports.default = exports.default;