"use strict";

exports.subscribeToResize = subscribeToResize;

var _resize_observer = _interopRequireDefault(require("../../../../core/resize_observer"));

var _window = require("../../../../core/utils/window");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function subscribeToResize(element, handler) {
  if ((0, _window.hasWindow)() && element) {
    _resize_observer.default.observe(element, function (_ref) {
      var target = _ref.target;
      handler(target);
    });

    return function () {
      _resize_observer.default.unobserve(element);
    };
  }

  return undefined;
}