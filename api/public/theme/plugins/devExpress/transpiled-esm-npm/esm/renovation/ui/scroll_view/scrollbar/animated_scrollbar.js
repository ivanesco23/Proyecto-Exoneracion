import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["bottomPocketSize", "bounceEnabled", "containerHasSizes", "containerSize", "contentPaddingBottom", "contentSize", "direction", "forceGeneratePockets", "inertiaEnabled", "maxOffset", "minOffset", "onBounce", "onEnd", "onLock", "onPullDown", "onReachBottom", "onUnlock", "pullDownEnabled", "pulledDown", "reachBottomEnabled", "rtlEnabled", "scrollByThumb", "scrollLocation", "scrollLocationChange", "showScrollbar", "visible"];
import { createComponentVNode } from "inferno";
import { InfernoEffect, InfernoComponent } from "@devextreme/runtime/inferno";
import { BaseWidgetProps } from "../../common/base_props";
import { Scrollbar } from "./scrollbar";
import { requestAnimationFrame, cancelAnimationFrame } from "../../../../animation/frame";
import { ScrollableSimulatedProps } from "../common/simulated_strategy_props";
import { inRange } from "../../../../core/utils/math";
import { clampIntoRange } from "../utils/clamp_into_range";
import { AnimatedScrollbarProps } from "../common/animated_scrollbar_props";
import { isDxMouseWheelEvent } from "../../../../events/utils/index";
export var OUT_BOUNDS_ACCELERATION = 0.5;
export var ACCELERATION = 0.92;
export var MIN_VELOCITY_LIMIT = 1;
export var BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;
var FRAME_DURATION = 17;
var BOUNCE_DURATION = 400;
var BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
export var BOUNCE_ACCELERATION_SUM = (1 - ACCELERATION ** BOUNCE_FRAMES) / (1 - ACCELERATION);
export var viewFunction = viewModel => {
  var {
    props: {
      bounceEnabled,
      containerHasSizes,
      containerSize,
      contentSize,
      direction,
      maxOffset,
      minOffset,
      rtlEnabled,
      scrollByThumb,
      scrollLocation,
      scrollLocationChange,
      showScrollbar,
      visible
    },
    scrollbarRef
  } = viewModel;
  return createComponentVNode(2, Scrollbar, {
    "direction": direction,
    "contentSize": contentSize,
    "containerSize": containerSize,
    "containerHasSizes": containerHasSizes,
    "visible": visible,
    "minOffset": minOffset,
    "maxOffset": maxOffset,
    "scrollLocation": scrollLocation,
    "scrollLocationChange": scrollLocationChange,
    "scrollByThumb": scrollByThumb,
    "bounceEnabled": bounceEnabled,
    "showScrollbar": showScrollbar,
    "rtlEnabled": rtlEnabled
  }, null, scrollbarRef);
};
var AnimatedScrollbarPropsType = {
  get pulledDown() {
    return AnimatedScrollbarProps.pulledDown;
  },

  get bottomPocketSize() {
    return AnimatedScrollbarProps.bottomPocketSize;
  },

  get contentPaddingBottom() {
    return AnimatedScrollbarProps.contentPaddingBottom;
  },

  get direction() {
    return AnimatedScrollbarProps.direction;
  },

  get containerHasSizes() {
    return AnimatedScrollbarProps.containerHasSizes;
  },

  get containerSize() {
    return AnimatedScrollbarProps.containerSize;
  },

  get contentSize() {
    return AnimatedScrollbarProps.contentSize;
  },

  get visible() {
    return AnimatedScrollbarProps.visible;
  },

  get scrollLocation() {
    return AnimatedScrollbarProps.scrollLocation;
  },

  get minOffset() {
    return AnimatedScrollbarProps.minOffset;
  },

  get maxOffset() {
    return AnimatedScrollbarProps.maxOffset;
  },

  get rtlEnabled() {
    return BaseWidgetProps.rtlEnabled;
  },

  get inertiaEnabled() {
    return ScrollableSimulatedProps.inertiaEnabled;
  },

  get showScrollbar() {
    return ScrollableSimulatedProps.showScrollbar;
  },

  get scrollByThumb() {
    return ScrollableSimulatedProps.scrollByThumb;
  },

  get bounceEnabled() {
    return ScrollableSimulatedProps.bounceEnabled;
  },

  get pullDownEnabled() {
    return ScrollableSimulatedProps.pullDownEnabled;
  },

  get reachBottomEnabled() {
    return ScrollableSimulatedProps.reachBottomEnabled;
  },

  get forceGeneratePockets() {
    return ScrollableSimulatedProps.forceGeneratePockets;
  }

};
import { createRef as infernoCreateRef } from "inferno";
export class AnimatedScrollbar extends InfernoComponent {
  constructor(props) {
    super(props);
    this.scrollbarRef = infernoCreateRef();
    this.thumbScrolling = false;
    this.crossThumbScrolling = false;
    this.stepAnimationFrame = 0;
    this.finished = true;
    this.stopped = false;
    this.velocity = 0;
    this.animator = "inertia";
    this.refreshing = false;
    this.loading = false;
    this.state = {
      forceAnimationToBottomBound: false,
      pendingRefreshing: false,
      pendingLoading: false,
      pendingBounceAnimator: false,
      pendingInertiaAnimator: false,
      needRiseEnd: false,
      wasRelease: false
    };
    this.isThumb = this.isThumb.bind(this);
    this.isScrollbar = this.isScrollbar.bind(this);
    this.reachedMin = this.reachedMin.bind(this);
    this.reachedMax = this.reachedMax.bind(this);
    this.initHandler = this.initHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);
    this.endHandler = this.endHandler.bind(this);
    this.stopHandler = this.stopHandler.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.releaseHandler = this.releaseHandler.bind(this);
    this.disposeAnimationFrame = this.disposeAnimationFrame.bind(this);
    this.risePullDown = this.risePullDown.bind(this);
    this.riseEnd = this.riseEnd.bind(this);
    this.riseReachBottom = this.riseReachBottom.bind(this);
    this.bounceAnimatorStart = this.bounceAnimatorStart.bind(this);
    this.updateLockedState = this.updateLockedState.bind(this);
    this.resetThumbScrolling = this.resetThumbScrolling.bind(this);
    this.start = this.start.bind(this);
    this.cancel = this.cancel.bind(this);
    this.stepCore = this.stepCore.bind(this);
    this.getStepAnimationFrame = this.getStepAnimationFrame.bind(this);
    this.step = this.step.bind(this);
    this.setupBounce = this.setupBounce.bind(this);
    this.complete = this.complete.bind(this);
    this.suppressInertia = this.suppressInertia.bind(this);
    this.crossBoundOnNextStep = this.crossBoundOnNextStep.bind(this);
    this.scrollStep = this.scrollStep.bind(this);
    this.moveTo = this.moveTo.bind(this);
    this.stopAnimator = this.stopAnimator.bind(this);
    this.calcThumbScrolling = this.calcThumbScrolling.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.disposeAnimationFrame, []), new InfernoEffect(this.risePullDown, [this.props.forceGeneratePockets, this.state.needRiseEnd, this.props.scrollLocation, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.props.pulledDown, this.state.pendingRefreshing, this.props.onPullDown]), new InfernoEffect(this.riseEnd, [this.props.scrollLocation, this.props.forceGeneratePockets, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.props.pulledDown, this.props.pullDownEnabled, this.state.wasRelease, this.state.pendingRefreshing, this.state.pendingLoading, this.props.onUnlock, this.props.onEnd, this.props.direction]), new InfernoEffect(this.riseReachBottom, [this.props.forceGeneratePockets, this.state.needRiseEnd, this.props.scrollLocation, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingLoading, this.props.onReachBottom]), new InfernoEffect(this.bounceAnimatorStart, [this.props.scrollLocation, this.props.forceGeneratePockets, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.onBounce, this.props.inertiaEnabled, this.props.bounceEnabled]), new InfernoEffect(this.updateLockedState, [this.state.pendingBounceAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.onLock])];
  }

  updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5;

    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.forceGeneratePockets, this.state.needRiseEnd, this.props.scrollLocation, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.props.pulledDown, this.state.pendingRefreshing, this.props.onPullDown]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.scrollLocation, this.props.forceGeneratePockets, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.props.pulledDown, this.props.pullDownEnabled, this.state.wasRelease, this.state.pendingRefreshing, this.state.pendingLoading, this.props.onUnlock, this.props.onEnd, this.props.direction]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.forceGeneratePockets, this.state.needRiseEnd, this.props.scrollLocation, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingLoading, this.props.onReachBottom]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 ? void 0 : _this$_effects$4.update([this.props.scrollLocation, this.props.forceGeneratePockets, this.props.reachBottomEnabled, this.state.forceAnimationToBottomBound, this.props.maxOffset, this.props.bottomPocketSize, this.props.contentPaddingBottom, this.props.minOffset, this.state.needRiseEnd, this.state.pendingBounceAnimator, this.state.pendingInertiaAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.onBounce, this.props.inertiaEnabled, this.props.bounceEnabled]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 ? void 0 : _this$_effects$5.update([this.state.pendingBounceAnimator, this.state.pendingRefreshing, this.state.pendingLoading, this.props.onLock]);
  }

  disposeAnimationFrame() {
    return () => {
      this.cancel();
    };
  }

  risePullDown() {
    if (this.props.forceGeneratePockets && this.state.needRiseEnd && this.inRange && !(this.state.pendingBounceAnimator || this.state.pendingInertiaAnimator) && this.props.pulledDown && !this.state.pendingRefreshing && !this.refreshing && -this.props.maxOffset > 0) {
      var _this$props$onPullDow, _this$props;

      this.refreshing = true;
      this.setState(__state_argument => ({
        pendingRefreshing: true
      }));
      (_this$props$onPullDow = (_this$props = this.props).onPullDown) === null || _this$props$onPullDow === void 0 ? void 0 : _this$props$onPullDow.call(_this$props);
    }
  }

  riseEnd() {
    if (this.inBounds && this.state.needRiseEnd && this.finished && !(this.state.pendingBounceAnimator || this.state.pendingInertiaAnimator) && !this.pendingRelease && !(this.state.pendingRefreshing || this.state.pendingLoading)) {
      var _this$props$onUnlock, _this$props2, _this$props$onEnd, _this$props3;

      this.setState(__state_argument => ({
        needRiseEnd: false
      }));
      this.setState(__state_argument => ({
        wasRelease: false
      }));
      (_this$props$onUnlock = (_this$props2 = this.props).onUnlock) === null || _this$props$onUnlock === void 0 ? void 0 : _this$props$onUnlock.call(_this$props2);
      this.setState(__state_argument => ({
        forceAnimationToBottomBound: false
      }));
      (_this$props$onEnd = (_this$props3 = this.props).onEnd) === null || _this$props$onEnd === void 0 ? void 0 : _this$props$onEnd.call(_this$props3, this.props.direction);
    }
  }

  riseReachBottom() {
    if (this.props.forceGeneratePockets && this.state.needRiseEnd && this.inRange && !(this.state.pendingBounceAnimator || this.state.pendingInertiaAnimator) && this.isReachBottom && !this.state.pendingLoading && !this.loading && -this.props.maxOffset > 0) {
      var _this$props$onReachBo, _this$props4;

      this.loading = true;
      this.setState(__state_argument => ({
        pendingLoading: true
      }));
      (_this$props$onReachBo = (_this$props4 = this.props).onReachBottom) === null || _this$props$onReachBo === void 0 ? void 0 : _this$props$onReachBo.call(_this$props4);
    }
  }

  bounceAnimatorStart() {
    if (!this.inRange && this.state.needRiseEnd && !(this.state.pendingBounceAnimator || this.state.pendingInertiaAnimator) && !(this.state.pendingRefreshing || this.state.pendingLoading) && -this.props.maxOffset > 0) {
      this.start("bounce");
    }
  }

  updateLockedState() {
    if (this.state.pendingBounceAnimator || this.state.pendingRefreshing || this.state.pendingLoading) {
      var _this$props$onLock, _this$props5;

      (_this$props$onLock = (_this$props5 = this.props).onLock) === null || _this$props$onLock === void 0 ? void 0 : _this$props$onLock.call(_this$props5);
    }
  }

  get pendingRelease() {
    return (this.props.pulledDown && this.props.pullDownEnabled || this.isReachBottom && this.props.reachBottomEnabled) && !this.state.wasRelease;
  }

  resetThumbScrolling() {
    this.thumbScrolling = false;
    this.crossThumbScrolling = false;
  }

  get inRange() {
    return inRange(this.props.scrollLocation, this.maxOffset, this.props.minOffset);
  }

  get inBounds() {
    return inRange(this.props.scrollLocation, this.props.maxOffset, 0);
  }

  get isReachBottom() {
    return this.props.reachBottomEnabled && Math.round(this.props.scrollLocation - this.props.maxOffset) <= 1;
  }

  start(animatorName, receivedVelocity, thumbScrolling, crossThumbScrolling) {
    this.animator = animatorName;

    if (this.isBounceAnimator) {
      var _this$props$onBounce, _this$props6;

      this.setState(__state_argument => ({
        pendingBounceAnimator: true
      }));
      (_this$props$onBounce = (_this$props6 = this.props).onBounce) === null || _this$props$onBounce === void 0 ? void 0 : _this$props$onBounce.call(_this$props6);
      this.setupBounce();
    } else {
      this.setState(__state_argument => ({
        pendingInertiaAnimator: true
      }));

      if (!thumbScrolling && crossThumbScrolling) {
        this.velocity = 0;
      } else {
        this.velocity = receivedVelocity !== null && receivedVelocity !== void 0 ? receivedVelocity : 0;
      }

      this.suppressInertia(thumbScrolling);
    }

    this.stopped = false;
    this.finished = false;
    this.stepCore();
  }

  cancel() {
    this.setState(__state_argument => ({
      pendingBounceAnimator: false
    }));
    this.setState(__state_argument => ({
      pendingInertiaAnimator: false
    }));
    this.stopped = true;
    cancelAnimationFrame(this.stepAnimationFrame);
  }

  stepCore() {
    if (this.stopped) {
      return;
    }

    if (this.isFinished) {
      this.finished = true;
      this.complete();
      return;
    }

    this.step();
    this.stepAnimationFrame = this.getStepAnimationFrame();
  }

  getStepAnimationFrame() {
    return requestAnimationFrame(this.stepCore.bind(this));
  }

  step() {
    if (!this.props.bounceEnabled && (this.reachedMin() || this.reachedMax())) {
      this.velocity = 0;
    }

    this.scrollStep(this.velocity, this.props.minOffset, this.maxOffset);
    this.velocity *= this.acceleration;
  }

  setupBounce() {
    var {
      scrollLocation
    } = this.props;
    var bounceDistance = clampIntoRange(scrollLocation, this.props.minOffset, this.maxOffset) - scrollLocation;
    this.velocity = bounceDistance / BOUNCE_ACCELERATION_SUM;
  }

  complete() {
    if (this.isBounceAnimator) {
      var boundaryLocation = clampIntoRange(this.props.scrollLocation, this.props.minOffset, this.maxOffset);
      this.moveTo(boundaryLocation);
    }

    this.stopAnimator();
  }

  get isBounceAnimator() {
    return this.animator === "bounce";
  }

  get isFinished() {
    if (this.isBounceAnimator) {
      return this.crossBoundOnNextStep() || Math.abs(this.velocity) <= BOUNCE_MIN_VELOCITY_LIMIT;
    }

    return Math.abs(this.velocity) <= MIN_VELOCITY_LIMIT;
  }

  get inProgress() {
    return !(this.stopped || this.finished);
  }

  get acceleration() {
    return this.isBounceAnimator || this.inRange ? ACCELERATION : OUT_BOUNDS_ACCELERATION;
  }

  get maxOffset() {
    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled && !this.state.forceAnimationToBottomBound) {
      return this.props.maxOffset - this.props.bottomPocketSize - this.props.contentPaddingBottom;
    }

    return this.props.maxOffset;
  }

  suppressInertia(thumbScrolling) {
    if (!this.props.inertiaEnabled || thumbScrolling) {
      this.velocity = 0;
    }
  }

  crossBoundOnNextStep() {
    var location = this.props.scrollLocation;
    var nextLocation = location + this.velocity;
    return location <= this.maxOffset && nextLocation >= this.maxOffset || location >= this.props.minOffset && nextLocation <= this.props.minOffset;
  }

  scrollStep(delta, minOffset, maxOffset) {
    this.scrollbarRef.current.scrollStep(delta, minOffset, maxOffset);
  }

  moveTo(location) {
    this.scrollbarRef.current.moveTo(location);
  }

  stopAnimator() {
    this.setState(__state_argument => ({
      pendingBounceAnimator: false
    }));
    this.setState(__state_argument => ({
      pendingInertiaAnimator: false
    }));
  }

  calcThumbScrolling(event, currentCrossThumbScrolling) {
    var {
      target
    } = event.originalEvent;
    var scrollbarClicked = this.props.scrollByThumb && this.isScrollbar(target);
    this.thumbScrolling = scrollbarClicked || this.props.scrollByThumb && this.isThumb(target);
    this.crossThumbScrolling = !this.thumbScrolling && currentCrossThumbScrolling;
  }

  get restAttributes() {
    var _this$props7 = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props7, _excluded);

    return restProps;
  }

  isThumb(element) {
    return this.scrollbarRef.current.isThumb(element);
  }

  isScrollbar(element) {
    return this.scrollbarRef.current.isScrollbar(element);
  }

  reachedMin() {
    return this.props.scrollLocation <= this.maxOffset;
  }

  reachedMax() {
    return this.props.scrollLocation >= this.props.minOffset;
  }

  initHandler(event, crossThumbScrolling, offset) {
    this.cancel();
    this.refreshing = false;
    this.loading = false;

    if (!isDxMouseWheelEvent(event.originalEvent)) {
      this.calcThumbScrolling(event, crossThumbScrolling);
      this.scrollbarRef.current.initHandler(event, this.thumbScrolling, offset);
    }
  }

  moveHandler(delta) {
    if (this.crossThumbScrolling) {
      return;
    }

    this.scrollbarRef.current.moveHandler(delta, this.props.minOffset, this.maxOffset, this.thumbScrolling);
  }

  endHandler(velocity, needRiseEnd) {
    this.start("inertia", velocity, this.thumbScrolling, this.crossThumbScrolling);
    this.setState(__state_argument => ({
      needRiseEnd: needRiseEnd
    }));
    this.resetThumbScrolling();
  }

  stopHandler() {
    if (this.thumbScrolling) {
      this.setState(__state_argument => ({
        needRiseEnd: true
      }));
    }

    this.resetThumbScrolling();
  }

  scrollTo(value) {
    this.loading = false;
    this.refreshing = false;
    this.scrollbarRef.current.moveTo(-clampIntoRange(value, -this.maxOffset, 0));
    this.setState(__state_argument => ({
      needRiseEnd: true
    }));
  }

  releaseHandler() {
    if (this.props.forceGeneratePockets && this.props.reachBottomEnabled && inRange(this.props.scrollLocation, this.maxOffset, this.props.maxOffset)) {
      this.setState(__state_argument => ({
        forceAnimationToBottomBound: true
      }));
    }

    this.setState(__state_argument => ({
      wasRelease: true
    }));
    this.setState(__state_argument => ({
      needRiseEnd: true
    }));
    this.resetThumbScrolling();
    this.setState(__state_argument => ({
      pendingRefreshing: false
    }));
    this.setState(__state_argument => ({
      pendingLoading: false
    }));
  }

  render() {
    var props = this.props;
    return viewFunction({
      props: _extends({}, props),
      forceAnimationToBottomBound: this.state.forceAnimationToBottomBound,
      pendingRefreshing: this.state.pendingRefreshing,
      pendingLoading: this.state.pendingLoading,
      pendingBounceAnimator: this.state.pendingBounceAnimator,
      pendingInertiaAnimator: this.state.pendingInertiaAnimator,
      needRiseEnd: this.state.needRiseEnd,
      wasRelease: this.state.wasRelease,
      scrollbarRef: this.scrollbarRef,
      pendingRelease: this.pendingRelease,
      resetThumbScrolling: this.resetThumbScrolling,
      inRange: this.inRange,
      inBounds: this.inBounds,
      isReachBottom: this.isReachBottom,
      start: this.start,
      cancel: this.cancel,
      stepCore: this.stepCore,
      getStepAnimationFrame: this.getStepAnimationFrame,
      step: this.step,
      setupBounce: this.setupBounce,
      complete: this.complete,
      isBounceAnimator: this.isBounceAnimator,
      isFinished: this.isFinished,
      inProgress: this.inProgress,
      acceleration: this.acceleration,
      maxOffset: this.maxOffset,
      suppressInertia: this.suppressInertia,
      crossBoundOnNextStep: this.crossBoundOnNextStep,
      scrollStep: this.scrollStep,
      moveTo: this.moveTo,
      stopAnimator: this.stopAnimator,
      calcThumbScrolling: this.calcThumbScrolling,
      restAttributes: this.restAttributes
    });
  }

}
AnimatedScrollbar.defaultProps = AnimatedScrollbarPropsType;