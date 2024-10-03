import getScrollRtlBehavior from "../../../../core/utils/scroll_rtl_behavior";

function isScrollInverted(rtlEnabled) {
  var {
    decreasing,
    positive
  } = getScrollRtlBehavior();
  return rtlEnabled && decreasing !== positive;
}

export function getScrollSign(rtlEnabled) {
  return isScrollInverted(rtlEnabled) && getScrollRtlBehavior().positive ? -1 : 1;
}
export function normalizeOffsetLeft(scrollLeft, maxLeftOffset, rtlEnabled) {
  if (isScrollInverted(rtlEnabled)) {
    if (getScrollRtlBehavior().positive) {
      return maxLeftOffset - scrollLeft;
    }

    return maxLeftOffset + scrollLeft;
  }

  return scrollLeft;
}