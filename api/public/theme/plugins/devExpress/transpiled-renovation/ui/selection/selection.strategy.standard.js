"use strict";

exports.default = void 0;

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _array = require("../../core/utils/array");

var _array_compare = require("../../core/utils/array_compare");

var _query = _interopRequireDefault(require("../../data/query"));

var _deferred = require("../../core/utils/deferred");

var _selection_filter = require("../../core/utils/selection_filter");

var _ui = _interopRequireDefault(require("../widget/ui.errors"));

var _selection = _interopRequireDefault(require("./selection.strategy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _selection.default.inherit({
  ctor: function ctor(options) {
    this.callBase(options);

    this._initSelectedItemKeyHash();
  },
  _initSelectedItemKeyHash: function _initSelectedItemKeyHash() {
    this._setOption('keyHashIndices', this.options.equalByReference ? null : {});
  },
  getSelectedItemKeys: function getSelectedItemKeys() {
    return this.options.selectedItemKeys.slice(0);
  },
  getSelectedItems: function getSelectedItems() {
    return this.options.selectedItems.slice(0);
  },
  _preserveSelectionUpdate: function _preserveSelectionUpdate(items, isDeselect) {
    var keyOf = this.options.keyOf;
    var keyIndicesToRemoveMap;
    var keyIndex;
    var i;
    if (!keyOf) return;
    var isBatchDeselect = isDeselect && items.length > 1 && !this.options.equalByReference;

    if (isBatchDeselect) {
      keyIndicesToRemoveMap = {};
    }

    for (i = 0; i < items.length; i++) {
      var item = items[i];
      var key = keyOf(item);

      if (isDeselect) {
        keyIndex = this.removeSelectedItem(key, keyIndicesToRemoveMap);

        if (keyIndicesToRemoveMap && keyIndex >= 0) {
          keyIndicesToRemoveMap[keyIndex] = true;
        }
      } else {
        this.addSelectedItem(key, item);
      }
    }

    if (isBatchDeselect) {
      this._batchRemoveSelectedItems(keyIndicesToRemoveMap);
    }
  },
  _batchRemoveSelectedItems: function _batchRemoveSelectedItems(keyIndicesToRemoveMap) {
    var selectedItemKeys = this.options.selectedItemKeys.slice(0);
    var selectedItems = this.options.selectedItems.slice(0);
    this.options.selectedItemKeys.length = 0;
    this.options.selectedItems.length = 0;

    for (var i = 0; i < selectedItemKeys.length; i++) {
      if (!keyIndicesToRemoveMap[i]) {
        this.options.selectedItemKeys.push(selectedItemKeys[i]);
        this.options.selectedItems.push(selectedItems[i]);
      }
    }

    this._initSelectedItemKeyHash();

    this.updateSelectedItemKeyHash(this.options.selectedItemKeys);
  },
  _loadSelectedItemsCore: function _loadSelectedItemsCore(keys, isDeselect, isSelectAll) {
    var deferred = new _deferred.Deferred();
    var key = this.options.key();

    if (!keys.length && !isSelectAll) {
      deferred.resolve([]);
      return deferred;
    }

    var filter = this.options.filter();

    if (isSelectAll && isDeselect && !filter) {
      deferred.resolve(this.getSelectedItems());
      return deferred;
    }

    var selectionFilterCreator = new _selection_filter.SelectionFilterCreator(keys, isSelectAll);
    var combinedFilter = selectionFilterCreator.getCombinedFilter(key, filter);
    var deselectedItems = [];

    if (isDeselect) {
      var selectedItems = this.options.selectedItems;
      deselectedItems = combinedFilter && keys.length !== selectedItems.length ? (0, _query.default)(selectedItems).filter(combinedFilter).toArray() : selectedItems.slice(0);
    }

    var filteredItems = deselectedItems.length ? deselectedItems : this.options.plainItems(true).filter(this.options.isSelectableItem).map(this.options.getItemData);
    var localFilter = selectionFilterCreator.getLocalFilter(this.options.keyOf, this.equalKeys.bind(this), this.options.equalByReference, key);
    filteredItems = filteredItems.filter(localFilter);

    if (deselectedItems.length || !isSelectAll && filteredItems.length === keys.length) {
      deferred.resolve(filteredItems);
    } else {
      deferred = this._loadFilteredData(combinedFilter, localFilter, null, isSelectAll);
    }

    return deferred;
  },
  _replaceSelectionUpdate: function _replaceSelectionUpdate(items) {
    var internalKeys = [];
    var keyOf = this.options.keyOf;
    if (!keyOf) return;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var key = keyOf(item);
      internalKeys.push(key);
    }

    this.setSelectedItems(internalKeys, items);
  },
  _warnOnIncorrectKeys: function _warnOnIncorrectKeys(keys) {
    var allowNullValue = this.options.allowNullValue;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if ((!allowNullValue || key !== null) && !this.isItemKeySelected(key)) {
        _ui.default.log('W1002', key);
      }
    }
  },
  _isMultiSelectEnabled: function _isMultiSelectEnabled() {
    var mode = this.options.mode;
    return mode === 'all' || mode === 'multiple';
  },
  _requestInProgress: function _requestInProgress() {
    var _this$_lastLoadDeferr;

    return ((_this$_lastLoadDeferr = this._lastLoadDeferred) === null || _this$_lastLoadDeferr === void 0 ? void 0 : _this$_lastLoadDeferr.state()) === 'pending';
  },
  _concatRequestsItems: function _concatRequestsItems(keys, isDeselect, oldRequestItems, updatedKeys) {
    var selectedItems;
    var deselectedItems = isDeselect ? keys : [];

    if (updatedKeys) {
      selectedItems = updatedKeys;
    } else {
      selectedItems = (0, _array.removeDuplicates)(keys, this.options.selectedItemKeys);
    }

    return {
      addedItems: oldRequestItems.added.concat(selectedItems),
      removedItems: oldRequestItems.removed.concat(deselectedItems),
      keys: keys
    };
  },
  _collectLastRequestData: function _collectLastRequestData(keys, isDeselect, isSelectAll, updatedKeys) {
    var isDeselectAll = isDeselect && isSelectAll;
    var oldRequestItems = {
      added: [],
      removed: []
    };

    var multiSelectEnabled = this._isMultiSelectEnabled();

    var lastRequestData = multiSelectEnabled ? this._lastRequestData : {};

    if (multiSelectEnabled) {
      if (this._shouldMergeWithLastRequest) {
        if (isDeselectAll) {
          this._lastLoadDeferred.reject();

          lastRequestData = {};
        } else if (!(0, _array_compare.isKeysEqual)(keys, this.options.selectedItemKeys)) {
          oldRequestItems.added = lastRequestData.addedItems;
          oldRequestItems.removed = lastRequestData.removedItems;

          if (!isDeselect) {
            this._lastLoadDeferred.reject();
          }
        }
      }

      lastRequestData = this._concatRequestsItems(keys, isDeselect, oldRequestItems, this._shouldMergeWithLastRequest ? undefined : updatedKeys);
    }

    return lastRequestData;
  },
  _updateKeysByLastRequestData: function _updateKeysByLastRequestData(keys, isDeselect, isSelectAll) {
    var currentKeys = keys;

    if (this._isMultiSelectEnabled() && this._shouldMergeWithLastRequest && !isDeselect && !isSelectAll) {
      var _this$_lastRequestDat, _this$_lastRequestDat2;

      currentKeys = (0, _array.removeDuplicates)(keys.concat((_this$_lastRequestDat = this._lastRequestData) === null || _this$_lastRequestDat === void 0 ? void 0 : _this$_lastRequestDat.addedItems), (_this$_lastRequestDat2 = this._lastRequestData) === null || _this$_lastRequestDat2 === void 0 ? void 0 : _this$_lastRequestDat2.removedItems);
      currentKeys = (0, _array.uniqueValues)(currentKeys);
    }

    return currentKeys;
  },
  _loadSelectedItems: function _loadSelectedItems(keys, isDeselect, isSelectAll, updatedKeys) {
    var that = this;
    var deferred = new _deferred.Deferred();
    this._shouldMergeWithLastRequest = this._requestInProgress();
    this._lastRequestData = this._collectLastRequestData(keys, isDeselect, isSelectAll, updatedKeys);
    (0, _deferred.when)(that._lastLoadDeferred).always(function () {
      var currentKeys = that._updateKeysByLastRequestData(keys, isDeselect, isSelectAll);

      that._shouldMergeWithLastRequest = false;

      that._loadSelectedItemsCore(currentKeys, isDeselect, isSelectAll).done(deferred.resolve).fail(deferred.reject);
    });
    that._lastLoadDeferred = deferred;
    return deferred;
  },
  selectedItemKeys: function selectedItemKeys(keys, preserve, isDeselect, isSelectAll, updatedKeys) {
    var that = this;

    var deferred = that._loadSelectedItems(keys, isDeselect, isSelectAll, updatedKeys);

    deferred.done(function (items) {
      if (preserve) {
        that._preserveSelectionUpdate(items, isDeselect);
      } else {
        that._replaceSelectionUpdate(items);
      } ///#DEBUG


      if (!isSelectAll && !isDeselect) {
        that._warnOnIncorrectKeys(keys);
      } ///#ENDDEBUG


      that.onSelectionChanged();
    });
    return deferred;
  },
  addSelectedItem: function addSelectedItem(key, itemData) {
    if ((0, _type.isDefined)(itemData) && !this.options.ignoreDisabledItems && itemData.disabled) {
      if (this.options.disabledItemKeys.indexOf(key) === -1) {
        this.options.disabledItemKeys.push(key);
      }

      return;
    }

    var keyHash = this._getKeyHash(key);

    if (this._indexOfSelectedItemKey(keyHash) === -1) {
      if (!(0, _type.isObject)(keyHash) && this.options.keyHashIndices) {
        this.options.keyHashIndices[keyHash] = [this.options.selectedItemKeys.length];
      }

      this.options.selectedItemKeys.push(key);
      this.options.addedItemKeys.push(key);
      this.options.addedItems.push(itemData);
      this.options.selectedItems.push(itemData);
    }
  },
  _getSelectedIndexByKey: function _getSelectedIndexByKey(key, ignoreIndicesMap) {
    var selectedItemKeys = this.options.selectedItemKeys;

    for (var index = 0; index < selectedItemKeys.length; index++) {
      if ((!ignoreIndicesMap || !ignoreIndicesMap[index]) && this.equalKeys(selectedItemKeys[index], key)) {
        return index;
      }
    }

    return -1;
  },
  _getSelectedIndexByHash: function _getSelectedIndexByHash(key, ignoreIndicesMap) {
    var indices = this.options.keyHashIndices[key];

    if (indices && indices.length > 1 && ignoreIndicesMap) {
      indices = indices.filter(function (index) {
        return !ignoreIndicesMap[index];
      });
    }

    return indices && indices[0] >= 0 ? indices[0] : -1;
  },
  _indexOfSelectedItemKey: function _indexOfSelectedItemKey(key, ignoreIndicesMap) {
    var selectedIndex;

    if (this.options.equalByReference) {
      selectedIndex = this.options.selectedItemKeys.indexOf(key);
    } else if ((0, _type.isObject)(key)) {
      selectedIndex = this._getSelectedIndexByKey(key, ignoreIndicesMap);
    } else {
      selectedIndex = this._getSelectedIndexByHash(key, ignoreIndicesMap);
    }

    return selectedIndex;
  },
  _shiftSelectedKeyIndices: function _shiftSelectedKeyIndices(keyIndex) {
    for (var currentKeyIndex = keyIndex; currentKeyIndex < this.options.selectedItemKeys.length; currentKeyIndex++) {
      var currentKey = this.options.selectedItemKeys[currentKeyIndex];
      var currentKeyHash = (0, _common.getKeyHash)(currentKey);
      var currentKeyIndices = this.options.keyHashIndices[currentKeyHash];
      if (!currentKeyIndices) continue;

      for (var i = 0; i < currentKeyIndices.length; i++) {
        if (currentKeyIndices[i] > keyIndex) {
          currentKeyIndices[i]--;
        }
      }
    }
  },
  removeSelectedItem: function removeSelectedItem(key, keyIndicesToRemoveMap) {
    var keyHash = this._getKeyHash(key);

    var isBatchDeselect = !!keyIndicesToRemoveMap;

    var keyIndex = this._indexOfSelectedItemKey(keyHash, keyIndicesToRemoveMap);

    if (keyIndex < 0) {
      return keyIndex;
    }

    this.options.removedItemKeys.push(key);
    this.options.removedItems.push(this.options.selectedItems[keyIndex]);

    if (isBatchDeselect) {
      return keyIndex;
    }

    this.options.selectedItemKeys.splice(keyIndex, 1);
    this.options.selectedItems.splice(keyIndex, 1);

    if ((0, _type.isObject)(keyHash) || !this.options.keyHashIndices) {
      return keyIndex;
    }

    var keyIndices = this.options.keyHashIndices[keyHash];

    if (!keyIndices) {
      return keyIndex;
    }

    keyIndices.shift();

    if (!keyIndices.length) {
      delete this.options.keyHashIndices[keyHash];
    }

    this._shiftSelectedKeyIndices(keyIndex);

    return keyIndex;
  },
  _updateAddedItemKeys: function _updateAddedItemKeys(keys, items) {
    for (var i = 0; i < keys.length; i++) {
      if (!this.isItemKeySelected(keys[i])) {
        this.options.addedItemKeys.push(keys[i]);
        this.options.addedItems.push(items[i]);
      }
    }
  },
  _updateRemovedItemKeys: function _updateRemovedItemKeys(keys, oldSelectedKeys, oldSelectedItems) {
    for (var i = 0; i < oldSelectedKeys.length; i++) {
      if (!this.isItemKeySelected(oldSelectedKeys[i])) {
        this.options.removedItemKeys.push(oldSelectedKeys[i]);
        this.options.removedItems.push(oldSelectedItems[i]);
      }
    }
  },
  _isItemSelectionInProgress: function _isItemSelectionInProgress(key, checkPending) {
    var shouldCheckPending = checkPending && this._lastRequestData && this._requestInProgress();

    if (shouldCheckPending) {
      var _this$_lastRequestDat3;

      return ((_this$_lastRequestDat3 = this._lastRequestData.addedItems) === null || _this$_lastRequestDat3 === void 0 ? void 0 : _this$_lastRequestDat3.indexOf(key)) !== -1;
    } else {
      return false;
    }
  },
  _getKeyHash: function _getKeyHash(key) {
    return this.options.equalByReference ? key : (0, _common.getKeyHash)(key);
  },
  setSelectedItems: function setSelectedItems(keys, items) {
    this._updateAddedItemKeys(keys, items);

    var oldSelectedKeys = this.options.selectedItemKeys;
    var oldSelectedItems = this.options.selectedItems;

    if (!this.options.equalByReference) {
      this._initSelectedItemKeyHash();

      this.updateSelectedItemKeyHash(keys);
    }

    this._setOption('selectedItemKeys', keys);

    this._setOption('selectedItems', items);

    this._updateRemovedItemKeys(keys, oldSelectedKeys, oldSelectedItems);
  },
  isItemDataSelected: function isItemDataSelected(itemData) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = this.options.keyOf(itemData);
    return this.isItemKeySelected(key, options);
  },
  isItemKeySelected: function isItemKeySelected(key) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = this._isItemSelectionInProgress(key, options.checkPending);

    if (!result) {
      var keyHash = this._getKeyHash(key);

      var index = this._indexOfSelectedItemKey(keyHash);

      result = index !== -1;
    }

    return result;
  },
  getSelectAllState: function getSelectAllState(visibleOnly) {
    if (visibleOnly) {
      return this._getVisibleSelectAllState();
    } else {
      return this._getFullSelectAllState();
    }
  }
});

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;