"use strict";

exports.default = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _extend = require("../../core/utils/extend");

var _deferred = require("../../core/utils/deferred");

var _window = require("../../core/utils/window");

var _guid = _interopRequireDefault(require("../../core/guid"));

var _ui = _interopRequireDefault(require("../widget/ui.widget"));

var _file_uploader = _interopRequireDefault(require("../file_uploader"));

var _uiFile_manager = require("./ui.file_manager.common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FILE_MANAGER_FILE_UPLOADER_CLASS = 'dx-filemanager-fileuploader';
var FILE_MANAGER_FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS = 'dx-filemanager-fileuploader-dropzone-placeholder';

var FileManagerFileUploader = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerFileUploader, _Widget);

  function FileManagerFileUploader() {
    return _Widget.apply(this, arguments) || this;
  }

  var _proto = FileManagerFileUploader.prototype;

  _proto._initMarkup = function _initMarkup() {
    this._initActions();

    this.$element().addClass(FILE_MANAGER_FILE_UPLOADER_CLASS);
    this._uploaderInfos = [];

    this._createInternalFileUploader();

    this._createDropZonePlaceholder();

    this._setDropZonePlaceholderVisible(false);

    _Widget.prototype._initMarkup.call(this);
  };

  _proto._createInternalFileUploader = function _createInternalFileUploader() {
    var _this = this;

    var chunkSize = this._getController().chunkSize;

    var $fileUploader = (0, _renderer.default)('<div>').appendTo(this.$element());

    var fileUploader = this._createComponent($fileUploader, _file_uploader.default, {
      name: 'file',
      multiple: true,
      showFileList: false,
      activeStateEnabled: false,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      labelText: '',
      readyToUploadMessage: '',
      accept: '*',
      chunkSize: chunkSize,
      dropZone: this.option('dropZone'),
      onValueChanged: function onValueChanged(e) {
        return _this._onFileUploaderValueChanged(e);
      },
      onProgress: function onProgress(e) {
        return _this._onFileUploaderProgress(e);
      },
      onUploaded: function onUploaded(e) {
        return _this._onFileUploaderUploaded(e);
      },
      onUploadAborted: function onUploadAborted(e) {
        return _this._onFileUploaderUploadAborted(e);
      },
      onUploadError: function onUploadError(e) {
        return _this._onFileUploaderUploadError(e);
      },
      onDropZoneEnter: function onDropZoneEnter() {
        return _this._setDropZonePlaceholderVisible(true);
      },
      onDropZoneLeave: function onDropZoneLeave() {
        return _this._setDropZonePlaceholderVisible(false);
      }
    });

    fileUploader.option({
      uploadChunk: function uploadChunk(file, chunksData) {
        return _this._fileUploaderUploadChunk(fileUploader, file, chunksData);
      },
      abortUpload: function abortUpload(file, chunksData) {
        return _this._fileUploaderAbortUpload(fileUploader, file, chunksData);
      }
    });
    var uploaderInfo = {
      fileUploader: fileUploader
    };

    this._uploaderInfos.push(uploaderInfo);
  };

  _proto.tryUpload = function tryUpload() {
    var info = this._findAndUpdateAvailableUploaderInfo();

    if (info) {
      info.fileUploader._selectButtonClickHandler();
    }
  };

  _proto.cancelUpload = function cancelUpload(sessionId) {
    this._cancelUpload(sessionId);
  };

  _proto.cancelFileUpload = function cancelFileUpload(sessionId, fileIndex) {
    this._cancelUpload(sessionId, fileIndex);
  };

  _proto._cancelUpload = function _cancelUpload(sessionId, fileIndex) {
    var _this$_findUploaderIn = this._findUploaderInfoBySessionId(sessionId),
        fileUploader = _this$_findUploaderIn.fileUploader;

    fileUploader.abortUpload(fileIndex);
  };

  _proto._fileUploaderUploadChunk = function _fileUploaderUploadChunk(fileUploader, file, chunksInfo) {
    var _this$_findSessionByF = this._findSessionByFile(fileUploader, file),
        session = _this$_findSessionByF.session,
        fileIndex = _this$_findSessionByF.fileIndex;

    var controller = session.controller;
    chunksInfo.fileIndex = fileIndex;
    return controller.uploadFileChunk(file, chunksInfo);
  };

  _proto._fileUploaderAbortUpload = function _fileUploaderAbortUpload(fileUploader, file, chunksInfo) {
    var _this$_findSessionByF2 = this._findSessionByFile(fileUploader, file),
        session = _this$_findSessionByF2.session,
        fileIndex = _this$_findSessionByF2.fileIndex;

    var controller = session.controller;
    chunksInfo.fileIndex = fileIndex;
    return controller.abortFileUpload(file, chunksInfo);
  };

  _proto._onFileUploaderValueChanged = function _onFileUploaderValueChanged(_ref) {
    var _this2 = this;

    var component = _ref.component,
        value = _ref.value;

    if (value.length === 0) {
      return;
    }

    var files = value.slice();

    var uploaderInfo = this._findUploaderInfo(component);

    this._uploadFiles(uploaderInfo, files);

    setTimeout(function () {
      if (!_this2._findAndUpdateAvailableUploaderInfo()) {
        _this2._createInternalFileUploader();
      }
    });
  };

  _proto._onFileUploaderProgress = function _onFileUploaderProgress(_ref2) {
    var component = _ref2.component,
        file = _ref2.file,
        bytesLoaded = _ref2.bytesLoaded,
        bytesTotal = _ref2.bytesTotal;

    var _this$_findSessionByF3 = this._findSessionByFile(component, file),
        session = _this$_findSessionByF3.session,
        fileIndex = _this$_findSessionByF3.fileIndex;

    var fileValue = bytesTotal !== 0 ? bytesLoaded / bytesTotal : 1;
    var commonValue = component.option('progress') / 100;
    var args = {
      sessionId: session.id,
      fileIndex: fileIndex,
      commonValue: commonValue,
      fileValue: fileValue
    };

    this._raiseUploadProgress(args);
  };

  _proto._onFileUploaderUploaded = function _onFileUploaderUploaded(_ref3) {
    var component = _ref3.component,
        file = _ref3.file;

    var deferred = this._getDeferredForFile(component, file);

    deferred.resolve();
  };

  _proto._onFileUploaderUploadAborted = function _onFileUploaderUploadAborted(_ref4) {
    var component = _ref4.component,
        file = _ref4.file;

    var deferred = this._getDeferredForFile(component, file);

    deferred.resolve({
      canceled: true
    });
  };

  _proto._onFileUploaderUploadError = function _onFileUploaderUploadError(_ref5) {
    var component = _ref5.component,
        file = _ref5.file,
        error = _ref5.error;

    var deferred = this._getDeferredForFile(component, file);

    deferred.reject(error);
  };

  _proto._createDropZonePlaceholder = function _createDropZonePlaceholder() {
    this._$dropZonePlaceholder = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS).appendTo(this.option('dropZonePlaceholderContainer'));
  };

  _proto._adjustDropZonePlaceholder = function _adjustDropZonePlaceholder() {
    if (!(0, _window.hasWindow)()) {
      return;
    }

    var $dropZoneTarget = this.option('dropZone');
    var placeholderBorderTopWidth = parseFloat(this._$dropZonePlaceholder.css('borderTopWidth'));
    var placeholderBorderLeftWidth = parseFloat(this._$dropZonePlaceholder.css('borderLeftWidth'));
    var $placeholderContainer = this.option('dropZonePlaceholderContainer');
    var containerBorderBottomWidth = parseFloat($placeholderContainer.css('borderBottomWidth'));
    var containerBorderLeftWidth = parseFloat($placeholderContainer.css('borderLeftWidth'));
    var containerHeight = (0, _size.getInnerHeight)($placeholderContainer);
    var containerOffset = $placeholderContainer.offset();
    var dropZoneOffset = $dropZoneTarget.offset();

    this._$dropZonePlaceholder.css({
      top: dropZoneOffset.top - containerOffset.top - containerHeight - containerBorderBottomWidth,
      left: dropZoneOffset.left - containerOffset.left - containerBorderLeftWidth
    });

    (0, _size.setHeight)(this._$dropZonePlaceholder, $dropZoneTarget.get(0).offsetHeight - placeholderBorderTopWidth * 2);
    (0, _size.setWidth)(this._$dropZonePlaceholder, $dropZoneTarget.get(0).offsetWidth - placeholderBorderLeftWidth * 2);
  };

  _proto._setDropZonePlaceholderVisible = function _setDropZonePlaceholderVisible(visible) {
    if (visible) {
      this._adjustDropZonePlaceholder();

      this._$dropZonePlaceholder.css('display', '');
    } else {
      this._$dropZonePlaceholder.css('display', 'none');
    }
  };

  _proto._uploadFiles = function _uploadFiles(uploaderInfo, files) {
    this._setDropZonePlaceholderVisible(false);

    var sessionId = new _guid.default().toString();

    var controller = this._getController();

    var deferreds = files.map(function () {
      return new _deferred.Deferred();
    });
    var session = {
      id: sessionId,
      controller: controller,
      files: files,
      deferreds: deferreds
    };
    uploaderInfo.session = session;
    var sessionInfo = {
      sessionId: sessionId,
      deferreds: deferreds,
      files: files
    };

    this._raiseUploadSessionStarted(sessionInfo);

    return (0, _uiFile_manager.whenSome)(deferreds).always(function () {
      return setTimeout(function () {
        uploaderInfo.fileUploader.reset();
        uploaderInfo.session = null;
      });
    });
  };

  _proto._getDeferredForFile = function _getDeferredForFile(fileUploader, file) {
    var _this$_findSessionByF4 = this._findSessionByFile(fileUploader, file),
        session = _this$_findSessionByF4.session,
        fileIndex = _this$_findSessionByF4.fileIndex;

    return session.deferreds[fileIndex];
  };

  _proto._findSessionByFile = function _findSessionByFile(fileUploader, file) {
    var uploaderInfo = this._findUploaderInfo(fileUploader);

    var session = uploaderInfo.session;
    var fileIndex = session.files.indexOf(file);
    return {
      session: session,
      fileIndex: fileIndex
    };
  };

  _proto._findUploaderInfoBySessionId = function _findUploaderInfoBySessionId(sessionId) {
    for (var i = 0; i < this._uploaderInfos.length; i++) {
      var uploaderInfo = this._uploaderInfos[i];
      var session = uploaderInfo.session;

      if (session && session.id === sessionId) {
        return uploaderInfo;
      }
    }

    return null;
  };

  _proto._findAndUpdateAvailableUploaderInfo = function _findAndUpdateAvailableUploaderInfo() {
    var _info;

    var info = null;

    for (var i = 0; i < this._uploaderInfos.length; i++) {
      var currentInfo = this._uploaderInfos[i];
      currentInfo.fileUploader.option('dropZone', '');

      if (!info && !currentInfo.session) {
        info = currentInfo;
      }
    }

    (_info = info) === null || _info === void 0 ? void 0 : _info.fileUploader.option('dropZone', this.option('dropZone'));
    return info;
  };

  _proto._findUploaderInfo = function _findUploaderInfo(fileUploader) {
    for (var i = 0; i < this._uploaderInfos.length; i++) {
      var info = this._uploaderInfos[i];

      if (info.fileUploader === fileUploader) {
        return info;
      }
    }

    return null;
  };

  _proto._getController = function _getController() {
    var controllerGetter = this.option('getController');
    return controllerGetter();
  };

  _proto._raiseUploadSessionStarted = function _raiseUploadSessionStarted(sessionInfo) {
    this._actions.onUploadSessionStarted({
      sessionInfo: sessionInfo
    });
  };

  _proto._raiseUploadProgress = function _raiseUploadProgress(args) {
    this._actions.onUploadProgress(args);
  };

  _proto._initActions = function _initActions() {
    this._actions = {
      onUploadSessionStarted: this._createActionByOption('onUploadSessionStarted'),
      onUploadProgress: this._createActionByOption('onUploadProgress')
    };
  };

  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      getController: null,
      onUploadSessionStarted: null,
      onUploadProgress: null
    });
  };

  _proto._optionChanged = function _optionChanged(args) {
    var name = args.name;

    switch (name) {
      case 'getController':
        this.repaint();
        break;

      case 'onUploadSessionStarted':
      case 'onUploadProgress':
        this._actions[name] = this._createActionByOption(name);
        break;

      case 'dropZone':
        this._findAndUpdateAvailableUploaderInfo();

        this._adjustDropZonePlaceholder();

        break;

      case 'dropZonePlaceholderContainer':
        this._$dropZonePlaceholder.detach();

        this._$dropZonePlaceholder.appendTo(args.value);

        break;

      default:
        _Widget.prototype._optionChanged.call(this, args);

    }
  };

  return FileManagerFileUploader;
}(_ui.default);

var _default = FileManagerFileUploader;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;