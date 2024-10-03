"use strict";

exports.getBoundaryProps = getBoundaryProps;
exports.isReachedBottom = isReachedBottom;
exports.isReachedRight = isReachedRight;

var _get_scroll_left_max = require("./get_scroll_left_max");

var _get_scroll_top_max = require("./get_scroll_top_max");

var _scroll_direction = require("./scroll_direction");

function isReachedRight(element, scrollOffsetLeft) {
  return Math.round((0, _get_scroll_left_max.getScrollLeftMax)(element) - scrollOffsetLeft) <= 0;
}

function isReachedBottom(element, scrollOffsetTop, pocketHeight) {
  return Math.round((0, _get_scroll_top_max.getScrollTopMax)(element) - scrollOffsetTop - pocketHeight) <= 0;
}

function getBoundaryProps(direction, scrollOffset, element, pocketHeight) {
  var left = scrollOffset.left,
      top = scrollOffset.top;
  var boundaryProps = {};

  var _ScrollDirection = new _scroll_direction.ScrollDirection(direction),
      isHorizontal = _ScrollDirection.isHorizontal,
      isVertical = _ScrollDirection.isVertical;

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