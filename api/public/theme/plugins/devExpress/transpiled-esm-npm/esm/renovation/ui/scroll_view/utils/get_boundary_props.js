import { getScrollLeftMax } from "./get_scroll_left_max";
import { getScrollTopMax } from "./get_scroll_top_max";
import { ScrollDirection } from "./scroll_direction";
export function isReachedRight(element, scrollOffsetLeft) {
  return Math.round(getScrollLeftMax(element) - scrollOffsetLeft) <= 0;
}
export function isReachedBottom(element, scrollOffsetTop, pocketHeight) {
  return Math.round(getScrollTopMax(element) - scrollOffsetTop - pocketHeight) <= 0;
}
export function getBoundaryProps(direction, scrollOffset, element, pocketHeight) {
  var {
    left,
    top
  } = scrollOffset;
  var boundaryProps = {};
  var {
    isHorizontal,
    isVertical
  } = new ScrollDirection(direction);

  if (isHorizontal) {
    boundaryProps.reachedLeft = Math.round(left) <= 0;
    boundaryProps.reachedRight = isReachedRight(element, left);
  }

  if (isVertical) {
    boundaryProps.reachedTop = Math.round(top) <= 0;
    boundaryProps.reachedBottom = isReachedBottom(element, top, pocketHeight);
  }

  return boundaryProps;
}