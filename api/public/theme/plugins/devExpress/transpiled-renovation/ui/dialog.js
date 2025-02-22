"use strict";

exports.title = exports.custom = exports.confirm = exports.alert = exports.FakeDialogComponent = exports.DEBUG_set_title = void 0;

var _size = require("../core/utils/size");

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _component = require("../core/component");

var _action = _interopRequireDefault(require("../core/action"));

var _devices = _interopRequireDefault(require("../core/devices"));

var _config = _interopRequireDefault(require("../core/config"));

var _dom = require("../core/utils/dom");

var _deferred = require("../core/utils/deferred");

var _type = require("../core/utils/type");

var _iterator = require("../core/utils/iterator");

var _extend = require("../core/utils/extend");

var _window = require("../core/utils/window");

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _view_port = require("../core/utils/view_port");

var _message = _interopRequireDefault(require("../localization/message"));

var _ui = _interopRequireDefault(require("./widget/ui.errors"));

var _popup = _interopRequireDefault(require("./popup"));

var _common = require("../core/utils/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var window = (0, _window.getWindow)();
var DEFAULT_BUTTON = {
  text: 'OK',
  onClick: function onClick() {
    return true;
  }
};
/**
 * @name ui.dialog
 */

var DX_DIALOG_CLASSNAME = 'dx-dialog';
var DX_DIALOG_WRAPPER_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-wrapper");
var DX_DIALOG_ROOT_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-root");
var DX_DIALOG_CONTENT_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-content");
var DX_DIALOG_MESSAGE_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-message");
var DX_DIALOG_BUTTONS_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-buttons");
var DX_DIALOG_BUTTON_CLASSNAME = "".concat(DX_DIALOG_CLASSNAME, "-button");
var DX_BUTTON_CLASSNAME = 'dx-button';

var FakeDialogComponent = _component.Component.inherit({
  ctor: function ctor(element, options) {
    this.callBase(options);
  },
  _defaultOptionsRules: function _defaultOptionsRules() {
    return this.callBase().concat([{
      device: {
        platform: 'ios'
      },
      options: {
        width: 276
      }
    }, {
      device: {
        platform: 'android'
      },
      options: {
        lWidth: '60%',
        pWidth: '80%'
      }
    }]);
  }
});

exports.FakeDialogComponent = FakeDialogComponent;
var title = '';
exports.title = title;

var custom = function custom(options) {
  var deferred = new _deferred.Deferred();
  var defaultOptions = new FakeDialogComponent().option();
  options = (0, _extend.extend)(defaultOptions, options);
  var $element = (0, _renderer.default)('<div>').addClass(DX_DIALOG_CLASSNAME).appendTo((0, _view_port.value)());
  var isMessageDefined = ('message' in options);
  var isMessageHtmlDefined = ('messageHtml' in options);

  if (isMessageDefined) {
    _ui.default.log('W1013');
  }

  var messageHtml = String(isMessageHtmlDefined ? options.messageHtml : options.message);
  var $message = (0, _renderer.default)('<div>').addClass(DX_DIALOG_MESSAGE_CLASSNAME).html(messageHtml);
  var popupToolbarItems = [];
  (0, _iterator.each)(options.buttons || [DEFAULT_BUTTON], function () {
    var action = new _action.default(this.onClick, {
      context: popupInstance
    });
    popupToolbarItems.push({
      toolbar: 'bottom',
      location: _devices.default.current().android ? 'after' : 'center',
      widget: 'dxButton',
      options: (0, _extend.extend)({}, this, {
        onClick: function onClick() {
          var result = action.execute.apply(action, arguments);
          hide(result);
        }
      })
    });
  });
  var popupInstance = new _popup.default($element, (0, _extend.extend)({
    title: options.title || title,
    showTitle: (0, _common.ensureDefined)(options.showTitle, true),
    dragEnabled: (0, _common.ensureDefined)(options.dragEnabled, true),
    height: 'auto',
    width: function width() {
      var isPortrait = (0, _size.getHeight)(window) > (0, _size.getWidth)(window);
      var key = (isPortrait ? 'p' : 'l') + 'Width';
      var widthOption = Object.prototype.hasOwnProperty.call(options, key) ? options[key] : options['width'];
      return (0, _type.isFunction)(widthOption) ? widthOption() : widthOption;
    },
    showCloseButton: options.showCloseButton || false,
    ignoreChildEvents: false,
    onContentReady: function onContentReady(args) {
      args.component.$content().addClass(DX_DIALOG_CONTENT_CLASSNAME).append($message);
    },
    onShowing: function onShowing(e) {
      e.component.bottomToolbar().addClass(DX_DIALOG_BUTTONS_CLASSNAME).find(".".concat(DX_BUTTON_CLASSNAME)).addClass(DX_DIALOG_BUTTON_CLASSNAME);
      (0, _dom.resetActiveElement)();
    },
    onShown: function onShown(e) {
      var $firstButton = e.component.bottomToolbar().find(".".concat(DX_BUTTON_CLASSNAME)).first();

      _events_engine.default.trigger($firstButton, 'focus');
    },
    onHiding: function onHiding() {
      deferred.reject();
    },
    toolbarItems: popupToolbarItems,
    animation: {
      show: {
        type: 'pop',
        duration: 400
      },
      hide: {
        type: 'pop',
        duration: 400,
        to: {
          opacity: 0,
          scale: 0
        },
        from: {
          opacity: 1,
          scale: 1
        }
      }
    },
    rtlEnabled: (0, _config.default)().rtlEnabled,
    position: {
      boundaryOffset: {
        h: 10,
        v: 0
      }
    }
  }, options.popupOptions));
  popupInstance.$wrapper().addClass(DX_DIALOG_WRAPPER_CLASSNAME);

  if (options.position) {
    popupInstance.option('position', options.position);
  }

  popupInstance.$wrapper().addClass(DX_DIALOG_ROOT_CLASSNAME);

  function show() {
    popupInstance.show();
    return deferred.promise();
  }

  function hide(value) {
    deferred.resolve(value);
    popupInstance.hide().done(function () {
      popupInstance.$element().remove();
    });
  }

  return {
    show: show,
    hide: hide
  };
};

exports.custom = custom;

var alert = function alert(messageHtml, title, showTitle) {
  var options = (0, _type.isPlainObject)(messageHtml) ? messageHtml : {
    title: title,
    messageHtml: messageHtml,
    showTitle: showTitle,
    dragEnabled: showTitle
  };
  return custom(options).show();
};

exports.alert = alert;

var confirm = function confirm(messageHtml, title, showTitle) {
  var options = (0, _type.isPlainObject)(messageHtml) ? messageHtml : {
    title: title,
    messageHtml: messageHtml,
    showTitle: showTitle,
    buttons: [{
      text: _message.default.format('Yes'),
      onClick: function onClick() {
        return true;
      }
    }, {
      text: _message.default.format('No'),
      onClick: function onClick() {
        return false;
      }
    }],
    dragEnabled: showTitle
  };
  return custom(options).show();
}; ///#DEBUG


exports.confirm = confirm;

var DEBUG_set_title = function DEBUG_set_title(value) {
  exports.title = title = value;
}; ///#ENDDEBUG


exports.DEBUG_set_title = DEBUG_set_title;