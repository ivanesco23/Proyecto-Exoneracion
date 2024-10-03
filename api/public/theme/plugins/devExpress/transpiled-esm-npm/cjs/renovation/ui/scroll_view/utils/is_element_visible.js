"use strict";

exports.isElementVisible = isElementVisible;

function isElementVisible(element) {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}