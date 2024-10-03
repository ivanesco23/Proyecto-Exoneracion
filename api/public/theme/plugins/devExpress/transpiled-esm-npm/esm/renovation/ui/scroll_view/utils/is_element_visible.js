export function isElementVisible(element) {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}