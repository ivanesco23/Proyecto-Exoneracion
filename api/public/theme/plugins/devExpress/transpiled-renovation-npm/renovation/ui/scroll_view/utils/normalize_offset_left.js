"use strict";

exports.getScrollSign = getScrollSign;
exports.normalizeOffsetLeft = normalizeOffsetLeft;

var _scroll_rtl_behavior = _interopRequireDefault(require("../../../../core/utils/scroll_rtl_behavior"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isScrollInverted(rtlEnabled) {
  var _getScrollRtlBehavior = (0, _scroll_rtl_behavior.default)(),
      decreasing = _getScrollRtlBehavior.decreasing,
      positive = _getScrollRtlBehavior.positive;

  return rtlEnabled && decreasing !== positive;
}

function getScrollSign(rtlEnabled) {
  return isScrollInverted(rtlEnabled) && (0, _scroll_rtl_behavior.default)().positive ? -1 : 1;
}

function normalizeOffsetLeft(scrollLeft, maxLeftOffset, rtlEnabled) {
  if (isScrollInverted(rtlEnabled)) {
    if ((0, _scroll_rtl_behavior.default)().positive) {
      return maxLeftOffset - scrollLeft;
    }

    return maxLeftOffset + scrollLeft;
  }

  return scrollLeft;
}