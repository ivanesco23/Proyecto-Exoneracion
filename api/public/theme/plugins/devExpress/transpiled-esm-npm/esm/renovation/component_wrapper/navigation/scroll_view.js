import Component from "../common/component";
import { Deferred } from "../../../core/utils/deferred";
export class ScrollViewWrapper extends Component {
  update() {
    var _this$viewRef;

    (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.updateHandler();
    return Deferred().resolve();
  }

  release(preventScrollBottom) {
    this.viewRef.release(preventScrollBottom);
    return Deferred().resolve();
  }

  _optionChanged(option) {
    var {
      name
    } = option;

    if (name === "useNative") {
      this._isNodeReplaced = false;
    }

    super._optionChanged(option);
  }

}