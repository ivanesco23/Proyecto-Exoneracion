import _extends from "@babel/runtime/helpers/esm/extends";
import Callbacks from '../../core/utils/callbacks';
import gridCore from '../data_grid/ui.data_grid.core';
import { executeAsync, getKeyHash } from '../../core/utils/common';
import { isDefined, isPlainObject, isFunction } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import ArrayStore from '../../data/array_store';
import { applyBatch } from '../../data/array_utils';
import { when, Deferred } from '../../core/utils/deferred';
export default gridCore.Controller.inherit(function () {
  function cloneItems(items, groupCount) {
    if (items) {
      items = items.slice(0);

      if (groupCount) {
        for (var i = 0; i < items.length; i++) {
          items[i] = extend({
            key: items[i].key
          }, items[i]);
          items[i].items = cloneItems(items[i].items, groupCount - 1);
        }
      }
    }

    return items;
  }

  function calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload) {
    var operationTypes = {
      reload: true,
      fullReload: true
    };

    if (lastLoadOptions) {
      operationTypes = {
        sorting: !gridCore.equalSortParameters(loadOptions.sort, lastLoadOptions.sort),
        grouping: !gridCore.equalSortParameters(loadOptions.group, lastLoadOptions.group, true),
        groupExpanding: !gridCore.equalSortParameters(loadOptions.group, lastLoadOptions.group) || lastLoadOptions.groupExpand,
        filtering: !gridCore.equalFilterParameters(loadOptions.filter, lastLoadOptions.filter),
        pageIndex: loadOptions.pageIndex !== lastLoadOptions.pageIndex,
        skip: loadOptions.skip !== lastLoadOptions.skip,
        take: loadOptions.take !== lastLoadOptions.take,
        pageSize: loadOptions.pageSize !== lastLoadOptions.pageSize,
        fullReload: isFullReload
      };
      operationTypes.reload = isFullReload || operationTypes.sorting || operationTypes.grouping || operationTypes.filtering;
      operationTypes.paging = operationTypes.pageIndex || operationTypes.pageSize || operationTypes.take;
    }

    return operationTypes;
  }

  function executeTask(action, timeout) {
    if (isDefined(timeout)) {
      executeAsync(action, timeout);
    } else {
      action();
    }
  }

  function createEmptyCachedData() {
    return {
      items: {}
    };
  }

  function getPageDataFromCache(options, updatePaging) {
    var groupCount = gridCore.normalizeSortingInfo(options.group || options.storeLoadOptions.group || options.loadOptions.group).length;
    var items = [];

    if (fillItemsFromCache(items, options, groupCount)) {
      return items;
    } else if (updatePaging) {
      updatePagingOptionsByCache(items, options, groupCount);
    }
  }

  function fillItemsFromCache(items, options, groupCount, fromEnd) {
    var _ref, _options$take, _options$cachedData;

    var {
      storeLoadOptions
    } = options;
    var take = (_ref = (_options$take = options.take) !== null && _options$take !== void 0 ? _options$take : storeLoadOptions.take) !== null && _ref !== void 0 ? _ref : 0;
    var cachedItems = (_options$cachedData = options.cachedData) === null || _options$cachedData === void 0 ? void 0 : _options$cachedData.items;

    if (take && cachedItems) {
      var _ref2, _options$skip;

      var skip = (_ref2 = (_options$skip = options.skip) !== null && _options$skip !== void 0 ? _options$skip : storeLoadOptions.skip) !== null && _ref2 !== void 0 ? _ref2 : 0;

      for (var i = 0; i < take; i++) {
        var localIndex = fromEnd ? take - 1 - i : i;
        var cacheItem = cachedItems[localIndex + skip];
        var item = getItemFromCache(options, cacheItem, groupCount, localIndex, take);

        if (item) {
          items.push(item);
        } else {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  function getItemFromCache(options, cacheItem, groupCount, index, take) {
    if (groupCount && cacheItem) {
      var skips = index === 0 && options.skips || [];
      var takes = index === take - 1 && options.takes || [];
      return getGroupItemFromCache(cacheItem, groupCount, skips, takes);
    } else {
      return cacheItem;
    }
  }

  function getGroupItemFromCache(cacheItem, groupCount, skips, takes) {
    if (groupCount && cacheItem) {
      var result = _extends({}, cacheItem);

      var skip = skips[0] || 0;
      var take = takes[0];
      var items = cacheItem.items;

      if (items) {
        if (take === undefined && !items[skip]) {
          return;
        }

        result.items = [];

        if (skips.length) {
          result.isContinuation = true;
        }

        if (takes.length) {
          result.isContinuationOnNextPage = true;
        }

        for (var i = 0; take === undefined ? items[i + skip] : i < take; i++) {
          var childCacheItem = items[i + skip];
          var item = getGroupItemFromCache(childCacheItem, groupCount - 1, skips.slice(1), takes.slice(1));

          if (item !== undefined) {
            result.items.push(item);
          } else {
            return;
          }
        }
      }

      return result;
    }

    return cacheItem;
  }

  function updatePagingOptionsByCache(cacheItemsFromBegin, options, groupCount) {
    var cacheItemBeginCount = cacheItemsFromBegin.length;
    var {
      storeLoadOptions
    } = options;

    if (storeLoadOptions.skip !== undefined && storeLoadOptions.take && !groupCount) {
      var cacheItemsFromEnd = [];
      fillItemsFromCache(cacheItemsFromEnd, options, groupCount, true);
      var cacheItemEndCount = cacheItemsFromEnd.length;

      if (cacheItemBeginCount || cacheItemEndCount) {
        var _options$skip2, _options$take2;

        options.skip = (_options$skip2 = options.skip) !== null && _options$skip2 !== void 0 ? _options$skip2 : storeLoadOptions.skip;
        options.take = (_options$take2 = options.take) !== null && _options$take2 !== void 0 ? _options$take2 : storeLoadOptions.take;
      }

      if (cacheItemBeginCount) {
        storeLoadOptions.skip += cacheItemBeginCount;
        storeLoadOptions.take -= cacheItemBeginCount;
        options.cachedDataPartBegin = cacheItemsFromBegin;
      }

      if (cacheItemEndCount) {
        storeLoadOptions.take -= cacheItemEndCount;
        options.cachedDataPartEnd = cacheItemsFromEnd.reverse();
      }
    }
  }

  function setPageDataToCache(options, data, groupCount) {
    var _ref3, _options$skip3, _ref4, _options$take3;

    var {
      storeLoadOptions
    } = options;
    var skip = (_ref3 = (_options$skip3 = options.skip) !== null && _options$skip3 !== void 0 ? _options$skip3 : storeLoadOptions.skip) !== null && _ref3 !== void 0 ? _ref3 : 0;
    var take = (_ref4 = (_options$take3 = options.take) !== null && _options$take3 !== void 0 ? _options$take3 : storeLoadOptions.take) !== null && _ref4 !== void 0 ? _ref4 : 0;

    for (var i = 0; i < take; i++) {
      var globalIndex = i + skip;
      var cacheItems = options.cachedData.items;
      var skips = i === 0 && options.skips || [];
      cacheItems[globalIndex] = getCacheItem(cacheItems[globalIndex], data[i], groupCount, skips);
    }
  }

  function getCacheItem(cacheItem, loadedItem, groupCount, skips) {
    if (groupCount && loadedItem) {
      var result = _extends({}, loadedItem);

      delete result.isContinuation;
      delete result.isContinuationOnNextPage;
      var skip = skips[0] || 0;

      if (loadedItem.items) {
        result.items = (cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.items) || {};
        loadedItem.items.forEach((item, index) => {
          var globalIndex = index + skip;
          var childSkips = index === 0 ? skips.slice(1) : [];
          result.items[globalIndex] = getCacheItem(result.items[globalIndex], item, groupCount - 1, childSkips);
        });
      }

      return result;
    }

    return loadedItem;
  }

  return {
    init: function init(dataSource, remoteOperations) {
      var that = this;
      that._dataSource = dataSource;
      that._remoteOperations = remoteOperations || {};
      that._isLastPage = !dataSource.isLastPage();
      that._hasLastPage = false;
      that._currentTotalCount = 0;
      that._cachedData = createEmptyCachedData();
      that._lastOperationTypes = {};
      that._eventsStrategy = dataSource._eventsStrategy;
      that._totalCountCorrection = 0;
      that._isLoadingAll = false;
      that.changed = Callbacks();
      that.loadingChanged = Callbacks();
      that.loadError = Callbacks();
      that.customizeStoreLoadOptions = Callbacks();
      that.changing = Callbacks();
      that._dataChangedHandler = that._handleDataChanged.bind(that);
      that._customizeStoreLoadOptionsHandler = that._handleCustomizeStoreLoadOptions.bind(that);
      that._dataLoadedHandler = that._handleDataLoaded.bind(that);
      that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
      that._loadErrorHandler = that._handleLoadError.bind(that);
      that._pushHandler = that._handlePush.bind(that);
      that._changingHandler = that._handleChanging.bind(that);
      dataSource.on('changed', that._dataChangedHandler);
      dataSource.on('customizeStoreLoadOptions', that._customizeStoreLoadOptionsHandler);
      dataSource.on('customizeLoadResult', that._dataLoadedHandler);
      dataSource.on('loadingChanged', that._loadingChangedHandler);
      dataSource.on('loadError', that._loadErrorHandler);
      dataSource.on('changing', that._changingHandler);
      dataSource.store().on('push', that._pushHandler);
      each(dataSource, function (memberName, member) {
        if (!that[memberName] && isFunction(member)) {
          that[memberName] = function () {
            return this._dataSource[memberName].apply(this._dataSource, arguments);
          };
        }
      });
    },
    remoteOperations: function remoteOperations() {
      return this._remoteOperations;
    },
    dispose: function dispose(isSharedDataSource) {
      var that = this;
      var dataSource = that._dataSource;
      var store = dataSource.store();
      dataSource.off('changed', that._dataChangedHandler);
      dataSource.off('customizeStoreLoadOptions', that._customizeStoreLoadOptionsHandler);
      dataSource.off('customizeLoadResult', that._dataLoadedHandler);
      dataSource.off('loadingChanged', that._loadingChangedHandler);
      dataSource.off('loadError', that._loadErrorHandler);
      dataSource.off('changing', that._changingHandler);
      store && store.off('push', that._pushHandler);

      if (!isSharedDataSource) {
        dataSource.dispose();
      }
    },
    refresh: function refresh(options, operationTypes) {
      var that = this;
      var dataSource = that._dataSource;

      if (operationTypes.reload) {
        that.resetCurrentTotalCount();
        that._isLastPage = !dataSource.paginate();
        that._hasLastPage = that._isLastPage;
      }
    },
    resetCurrentTotalCount: function resetCurrentTotalCount() {
      this._currentTotalCount = 0;
      this._totalCountCorrection = 0;
    },
    resetCache: function resetCache() {
      this._cachedStoreData = undefined;
      this._cachedPagingData = undefined;
    },
    resetPagesCache: function resetPagesCache() {
      this._cachedData = createEmptyCachedData();
    },
    _needClearStoreDataCache: function _needClearStoreDataCache() {
      var remoteOperations = this.remoteOperations();
      var operationTypes = calculateOperationTypes(this._lastLoadOptions || {}, {});
      var isLocalOperations = Object.keys(remoteOperations).every(operationName => !operationTypes[operationName] || !remoteOperations[operationName]);
      return !isLocalOperations;
    },
    push: function push(changes, fromStore) {
      var store = this.store();

      if (this._needClearStoreDataCache()) {
        this._cachedStoreData = undefined;
      }

      this._cachedPagingData = undefined;
      this.resetPagesCache(true);

      if (this._cachedStoreData) {
        applyBatch({
          keyInfo: store,
          data: this._cachedStoreData,
          changes
        });
      }

      if (!fromStore) {
        this._applyBatch(changes);
      }
    },
    getDataIndexGetter: function getDataIndexGetter() {
      if (!this._dataIndexGetter) {
        var indexByKey;
        var storeData;
        var store = this.store();

        this._dataIndexGetter = data => {
          var isCacheUpdated = storeData && storeData !== this._cachedStoreData;

          if (!indexByKey || isCacheUpdated) {
            storeData = this._cachedStoreData || [];
            indexByKey = {};

            for (var i = 0; i < storeData.length; i++) {
              indexByKey[getKeyHash(store.keyOf(storeData[i]))] = i;
            }
          }

          return indexByKey[getKeyHash(store.keyOf(data))];
        };
      }

      return this._dataIndexGetter;
    },
    _getKeyInfo: function _getKeyInfo() {
      return this.store();
    },
    _applyBatch: function _applyBatch(changes) {
      var keyInfo = this._getKeyInfo();

      var dataSource = this._dataSource;
      var groupCount = gridCore.normalizeSortingInfo(this.group()).length;
      var totalCount = this.totalCount();
      var isVirtualMode = this.option('scrolling.mode') === 'virtual';
      changes = changes.filter(function (change) {
        return !dataSource.paginate() || change.type !== 'insert' || change.index !== undefined;
      });

      var getItemCount = () => groupCount ? this.itemsCount() : this.items().length;

      var oldItemCount = getItemCount();
      applyBatch({
        keyInfo,
        data: this._items,
        changes,
        groupCount: groupCount,
        useInsertIndex: true
      });
      applyBatch({
        keyInfo,
        data: dataSource.items(),
        changes,
        groupCount: groupCount,
        useInsertIndex: true
      });

      if (this._currentTotalCount > 0 || isVirtualMode && totalCount === oldItemCount) {
        this._totalCountCorrection += getItemCount() - oldItemCount;
      }

      changes.splice(0, changes.length);
    },
    _handlePush: function _handlePush(changes) {
      this.push(changes, true);
    },
    _handleChanging: function _handleChanging(e) {
      this.changing.fire(e);

      this._applyBatch(e.changes);
    },
    _needCleanCacheByOperation: function _needCleanCacheByOperation(operationType, remoteOperations) {
      var operationTypesByOrder = ['filtering', 'sorting', 'paging'];
      var operationTypeIndex = operationTypesByOrder.indexOf(operationType);
      var currentOperationTypes = operationTypeIndex >= 0 ? operationTypesByOrder.slice(operationTypeIndex) : [operationType];
      return currentOperationTypes.some(operationType => remoteOperations[operationType]);
    },
    _customizeRemoteOperations: function _customizeRemoteOperations(options, operationTypes) {
      var cachedStoreData = this._cachedStoreData;
      var cachedPagingData = this._cachedPagingData;
      var cachedData = this._cachedData;

      if (options.storeLoadOptions.filter && !options.remoteOperations.filtering || options.storeLoadOptions.sort && !options.remoteOperations.sorting) {
        options.remoteOperations = {
          filtering: options.remoteOperations.filtering
        };
      }

      if (operationTypes.fullReload) {
        cachedStoreData = undefined;
        cachedPagingData = undefined;
        cachedData = createEmptyCachedData();
      } else {
        if (operationTypes.reload) {
          cachedPagingData = undefined;
          cachedData = createEmptyCachedData();
        } else if (operationTypes.groupExpanding) {
          cachedData = createEmptyCachedData();
        }

        each(operationTypes, (operationType, value) => {
          if (value && this._needCleanCacheByOperation(operationType, options.remoteOperations)) {
            cachedStoreData = undefined;
            cachedPagingData = undefined;
          }
        });
      }

      if (cachedPagingData) {
        options.remoteOperations.paging = false;
      }

      options.cachedStoreData = cachedStoreData;
      options.cachedPagingData = cachedPagingData;
      options.cachedData = cachedData;

      if (!options.isCustomLoading) {
        this._cachedStoreData = cachedStoreData;
        this._cachedPagingData = cachedPagingData;
        this._cachedData = cachedData;
      }
    },

    _handleCustomizeStoreLoadOptions(options) {
      this._handleDataLoading(options);

      options.data = getPageDataFromCache(options, true) || options.cachedStoreData;
    },

    _handleDataLoading: function _handleDataLoading(options) {
      var dataSource = this._dataSource;
      var lastLoadOptions = this._lastLoadOptions;
      this.customizeStoreLoadOptions.fire(options);
      options.delay = this.option('loadingTimeout');
      options.originalStoreLoadOptions = options.storeLoadOptions;
      options.remoteOperations = extend({}, this.remoteOperations());
      var isFullReload = !this.isLoaded() && !this._isRefreshing;

      if (this.option('integrationOptions.renderedOnServer') && !this.isLoaded()) {
        options.delay = undefined;
      }

      var loadOptions = extend({
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize()
      }, options.storeLoadOptions);
      var operationTypes = calculateOperationTypes(loadOptions, lastLoadOptions, isFullReload);

      this._customizeRemoteOperations(options, operationTypes);

      if (!options.isCustomLoading) {
        var isRefreshing = this._isRefreshing;
        options.pageIndex = dataSource.pageIndex();
        options.lastLoadOptions = loadOptions;
        options.operationTypes = operationTypes;
        this._loadingOperationTypes = operationTypes;
        this._isRefreshing = true;
        when(isRefreshing || this._isRefreshed || this.refresh(options, operationTypes)).done(() => {
          if (this._lastOperationId === options.operationId) {
            this._isRefreshed = true;
            this.load().always(() => {
              this._isRefreshed = false;
            });
          }
        }).fail(() => {
          dataSource.cancel(options.operationId);
        }).always(() => {
          this._isRefreshing = false;
        });
        dataSource.cancel(this._lastOperationId);
        this._lastOperationId = options.operationId;

        if (this._isRefreshing) {
          dataSource.cancel(this._lastOperationId);
        }
      }

      this._handleDataLoadingCore(options);
    },
    _handleDataLoadingCore: function _handleDataLoadingCore(options) {
      var remoteOperations = options.remoteOperations;
      options.loadOptions = {};
      var cachedExtra = options.cachedData.extra;
      var localLoadOptionNames = {
        filter: !remoteOperations.filtering,
        sort: !remoteOperations.sorting,
        group: !remoteOperations.grouping,
        summary: !remoteOperations.summary,
        skip: !remoteOperations.paging,
        take: !remoteOperations.paging,
        requireTotalCount: cachedExtra && 'totalCount' in cachedExtra || !remoteOperations.paging
      };
      each(options.storeLoadOptions, function (optionName, optionValue) {
        if (localLoadOptionNames[optionName]) {
          options.loadOptions[optionName] = optionValue;
          delete options.storeLoadOptions[optionName];
        }
      });

      if (cachedExtra) {
        options.extra = cachedExtra;
      }
    },
    _handleDataLoaded: function _handleDataLoaded(options) {
      var loadOptions = options.loadOptions;
      var localPaging = options.remoteOperations && !options.remoteOperations.paging;
      var cachedData = options.cachedData;
      var storeLoadOptions = options.storeLoadOptions;
      var needCache = this.option('cacheEnabled') !== false && storeLoadOptions;
      var needPageCache = needCache && !options.isCustomLoading && cachedData && (!localPaging || storeLoadOptions.group);
      var needPagingCache = needCache && localPaging;
      var needStoreCache = needPagingCache && !options.isCustomLoading;

      if (!loadOptions) {
        this._dataSource.cancel(options.operationId);

        return;
      }

      if (localPaging) {
        options.skip = loadOptions.skip;
        options.take = loadOptions.take;
        delete loadOptions.skip;
        delete loadOptions.take;
      }

      if (loadOptions.group) {
        loadOptions.group = options.group || loadOptions.group;
      }

      var groupCount = gridCore.normalizeSortingInfo(options.group || storeLoadOptions.group || loadOptions.group).length;

      if (options.cachedDataPartBegin) {
        options.data = options.cachedDataPartBegin.concat(options.data);
      }

      if (options.cachedDataPartEnd) {
        options.data = options.data.concat(options.cachedDataPartEnd);
      }

      if (!needPageCache || !getPageDataFromCache(options)) {
        if (needPagingCache && options.cachedPagingData) {
          options.data = cloneItems(options.cachedPagingData, groupCount);
        } else {
          if (needStoreCache) {
            if (!this._cachedStoreData) {
              this._cachedStoreData = cloneItems(options.data, gridCore.normalizeSortingInfo(storeLoadOptions.group).length);
            } else if (options.mergeStoreLoadData) {
              options.data = this._cachedStoreData = this._cachedStoreData.concat(options.data);
            }
          }

          new ArrayStore(options.data).load(loadOptions).done(data => {
            options.data = data;

            if (needStoreCache) {
              this._cachedPagingData = cloneItems(options.data, groupCount);
            }
          }).fail(error => {
            options.data = new Deferred().reject(error);
          });
        }

        if (loadOptions.requireTotalCount && localPaging) {
          options.extra = isPlainObject(options.extra) ? options.extra : {};
          options.extra.totalCount = options.data.length;
        }

        if (options.extra && options.extra.totalCount >= 0 && (storeLoadOptions.requireTotalCount === false || loadOptions.requireTotalCount === false)) {
          options.extra.totalCount = -1;
        }

        this._handleDataLoadedCore(options);

        if (needPageCache) {
          cachedData.extra = cachedData.extra || extend({}, options.extra);
          when(options.data).done(data => {
            setPageDataToCache(options, data, groupCount);
          });
        }
      }

      when(options.data).done(() => {
        if (options.lastLoadOptions) {
          this._lastLoadOptions = options.lastLoadOptions;
          Object.keys(options.operationTypes).forEach(operationType => {
            this._lastOperationTypes[operationType] = this._lastOperationTypes[operationType] || options.operationTypes[operationType];
          });
        }
      });
      options.storeLoadOptions = options.originalStoreLoadOptions;
    },
    _handleDataLoadedCore: function _handleDataLoadedCore(options) {
      if (options.remoteOperations && !options.remoteOperations.paging && Array.isArray(options.data)) {
        if (options.skip !== undefined) {
          options.data = options.data.slice(options.skip);
        }

        if (options.take !== undefined) {
          options.data = options.data.slice(0, options.take);
        }
      }
    },
    _handleLoadingChanged: function _handleLoadingChanged(isLoading) {
      this.loadingChanged.fire(isLoading);
    },
    _handleLoadError: function _handleLoadError(error) {
      this.loadError.fire(error);
      this.changed.fire({
        changeType: 'loadError',
        error: error
      });
    },
    _loadPageSize: function _loadPageSize() {
      return this.pageSize();
    },
    _handleDataChanged: function _handleDataChanged(args) {
      var currentTotalCount;
      var dataSource = this._dataSource;
      var isLoading = false;
      var itemsCount = this.itemsCount();
      this._isLastPage = !itemsCount || !this._loadPageSize() || itemsCount < this._loadPageSize();

      if (this._isLastPage) {
        this._hasLastPage = true;
      }

      if (dataSource.totalCount() >= 0) {
        if (dataSource.pageIndex() >= this.pageCount()) {
          dataSource.pageIndex(this.pageCount() - 1);
          this.pageIndex(dataSource.pageIndex());
          this.resetPagesCache();
          dataSource.load();
          isLoading = true;
        }
      } else if (!args || isDefined(args.changeType)) {
        currentTotalCount = dataSource.pageIndex() * this.pageSize() + itemsCount;

        if (currentTotalCount > this._currentTotalCount) {
          this._currentTotalCount = currentTotalCount;
          this._totalCountCorrection = 0;
        }

        if (itemsCount === 0 && dataSource.pageIndex() >= this.pageCount()) {
          dataSource.pageIndex(this.pageCount() - 1);

          if (this.option('scrolling.mode') !== 'infinite') {
            dataSource.load();
            isLoading = true;
          }
        }
      }

      if (!isLoading) {
        this._operationTypes = this._lastOperationTypes;
        this._lastOperationTypes = {};
        this.component._optionCache = {};
        this.changed.fire(args);
        this.component._optionCache = undefined;
      }
    },
    _scheduleCustomLoadCallbacks: function _scheduleCustomLoadCallbacks(deferred) {
      var that = this;
      that._isCustomLoading = true;
      deferred.always(function () {
        that._isCustomLoading = false;
      });
    },
    loadingOperationTypes: function loadingOperationTypes() {
      return this._loadingOperationTypes;
    },
    operationTypes: function operationTypes() {
      return this._operationTypes;
    },
    lastLoadOptions: function lastLoadOptions() {
      return this._lastLoadOptions || {};
    },
    isLastPage: function isLastPage() {
      return this._isLastPage;
    },
    totalCount: function totalCount() {
      return parseInt((this._currentTotalCount || this._dataSource.totalCount()) + this._totalCountCorrection);
    },
    totalCountCorrection: function totalCountCorrection() {
      return this._totalCountCorrection;
    },
    itemsCount: function itemsCount() {
      return this._dataSource.items().length;
    },
    totalItemsCount: function totalItemsCount() {
      return this.totalCount();
    },
    pageSize: function pageSize() {
      var dataSource = this._dataSource;

      if (!arguments.length && !dataSource.paginate()) {
        return 0;
      }

      return dataSource.pageSize.apply(dataSource, arguments);
    },
    pageCount: function pageCount() {
      var that = this;

      var count = that.totalItemsCount() - that._totalCountCorrection;

      var pageSize = that.pageSize();

      if (pageSize && count > 0) {
        return Math.max(1, Math.ceil(count / pageSize));
      }

      return 1;
    },
    hasKnownLastPage: function hasKnownLastPage() {
      return this._hasLastPage || this._dataSource.totalCount() >= 0;
    },
    loadFromStore: function loadFromStore(loadOptions, store) {
      var dataSource = this._dataSource;
      var d = new Deferred();
      if (!dataSource) return;
      store = store || dataSource.store();
      store.load(loadOptions).done(function (data, extra) {
        if (data && !Array.isArray(data) && Array.isArray(data.data)) {
          extra = data;
          data = data.data;
        }

        d.resolve(data, extra);
      }).fail(d.reject);
      return d;
    },
    isCustomLoading: function isCustomLoading() {
      return !!this._isCustomLoading;
    },
    load: function load(options) {
      var that = this;
      var dataSource = that._dataSource;
      var d = new Deferred();

      if (options) {
        var store = dataSource.store();
        var dataSourceLoadOptions = dataSource.loadOptions();
        var loadResult = {
          storeLoadOptions: options,
          isCustomLoading: true
        };
        each(store._customLoadOptions() || [], function (_, optionName) {
          if (!(optionName in loadResult.storeLoadOptions)) {
            loadResult.storeLoadOptions[optionName] = dataSourceLoadOptions[optionName];
          }
        });
        this._isLoadingAll = options.isLoadingAll;

        that._scheduleCustomLoadCallbacks(d);

        dataSource._scheduleLoadCallbacks(d);

        that._handleCustomizeStoreLoadOptions(loadResult);

        executeTask(function () {
          if (!dataSource.store()) {
            return d.reject('canceled');
          }

          when(loadResult.data || that.loadFromStore(loadResult.storeLoadOptions)).done(function (data, extra) {
            loadResult.data = data;
            loadResult.extra = extra || {};

            that._handleDataLoaded(loadResult);

            if (options.requireTotalCount && loadResult.extra.totalCount === undefined) {
              loadResult.extra.totalCount = store.totalCount(loadResult.storeLoadOptions);
            } // TODO map function??


            when(loadResult.data, loadResult.extra.totalCount).done(function (data, totalCount) {
              loadResult.extra.totalCount = totalCount;
              d.resolve(data, loadResult.extra);
            }).fail(d.reject);
          }).fail(d.reject);
        }, that.option('loadingTimeout'));
        return d.fail(function () {
          that._eventsStrategy.fireEvent('loadError', arguments);
        }).always(() => {
          this._isLoadingAll = false;
        }).promise();
      } else {
        return dataSource.load();
      }
    },
    reload: function reload(full) {
      return full ? this._dataSource.reload() : this._dataSource.load();
    },
    getCachedStoreData: function getCachedStoreData() {
      return this._cachedStoreData;
    }
  };
}());