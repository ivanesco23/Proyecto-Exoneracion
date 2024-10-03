import resizeObserverSingleton from "../../../../core/resize_observer";
import { hasWindow } from "../../../../core/utils/window";
export function subscribeToResize(element, handler) {
  if (hasWindow() && element) {
    resizeObserverSingleton.observe(element, _ref => {
      var {
        target
      } = _ref;
      handler(target);
    });
    return () => {
      resizeObserverSingleton.unobserve(element);
    };
  }

  return undefined;
}