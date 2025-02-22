import { getOuterHeight } from '../../core/utils/size';
import $ from '../../core/renderer';
import { getWindow } from '../../core/utils/window';
import { VirtualScrollController, subscribeToExternalScrollers } from './ui.grid_core.virtual_scrolling_core';
import gridCoreUtils from './ui.grid_core.utils';
import { each } from '../../core/utils/iterator';
import { Deferred } from '../../core/utils/deferred';
import LoadIndicator from '../load_indicator';
import browser from '../../core/utils/browser';
import { getBoundingRect } from '../../core/utils/position';
import { isDefined } from '../../core/utils/type';
var BOTTOM_LOAD_PANEL_CLASS = 'bottom-load-panel';
var TABLE_CONTENT_CLASS = 'table-content';
var GROUP_SPACE_CLASS = 'group-space';
var CONTENT_CLASS = 'content';
var FREESPACE_CLASS = 'dx-freespace-row';
var COLUMN_LINES_CLASS = 'dx-column-lines';
var VIRTUAL_ROW_CLASS = 'dx-virtual-row';
var SCROLLING_MODE_INFINITE = 'infinite';
var SCROLLING_MODE_VIRTUAL = 'virtual';
var LOAD_TIMEOUT = 300;
var LEGACY_SCROLLING_MODE = 'scrolling.legacyMode';
var VISIBLE_PAGE_INDEX = 'paging.pageIndex';

var isVirtualMode = function isVirtualMode(that) {
  return that.option('scrolling.mode') === SCROLLING_MODE_VIRTUAL;
};

var isAppendMode = function isAppendMode(that) {
  return that.option('scrolling.mode') === SCROLLING_MODE_INFINITE;
};

var isVirtualPaging = function isVirtualPaging(that) {
  return isVirtualMode(that) || isAppendMode(that);
};

var _correctCount = function correctCount(items, count, fromEnd, isItemCountableFunc) {
  for (var i = 0; i < count + 1; i++) {
    var item = items[fromEnd ? items.length - 1 - i : i];

    if (item && !isItemCountableFunc(item, i === count, fromEnd)) {
      count++;
    }
  }

  return count;
};

var isItemCountableByDataSource = function isItemCountableByDataSource(item, dataSource) {
  return item.rowType === 'data' && !item.isNewRow || item.rowType === 'group' && dataSource.isGroupItemCountable(item.data);
};

var updateItemIndices = function updateItemIndices(items) {
  items.forEach(function (item, index) {
    item.rowIndex = index;
  });
  return items;
};

var VirtualScrollingDataSourceAdapterExtender = function () {
  var _updateLoading = function updateLoading(that) {
    var beginPageIndex = that._virtualScrollController.beginPageIndex(-1);

    if (isVirtualMode(that)) {
      if (beginPageIndex < 0 || that.viewportSize() >= 0 && that.getViewportItemIndex() >= 0 && (beginPageIndex * that.pageSize() > that.getViewportItemIndex() || beginPageIndex * that.pageSize() + that.itemsCount() < that.getViewportItemIndex() + that.viewportSize()) && that._dataSource.isLoading()) {
        if (!that._isLoading) {
          that._isLoading = true;
          that.loadingChanged.fire(true);
        }
      } else {
        if (that._isLoading) {
          that._isLoading = false;
          that.loadingChanged.fire(false);
        }
      }
    }
  };

  var result = {
    init: function init() {
      this.callBase.apply(this, arguments);
      this._items = [];
      this._isLoaded = true;
      this._loadPageCount = 1;
      this._virtualScrollController = new VirtualScrollController(this.component, this._getVirtualScrollDataOptions());
    },
    _getVirtualScrollDataOptions: function _getVirtualScrollDataOptions() {
      var that = this;
      return {
        pageSize: function pageSize() {
          return that.pageSize();
        },
        totalItemsCount: function totalItemsCount() {
          return that.totalItemsCount();
        },
        hasKnownLastPage: function hasKnownLastPage() {
          return that.hasKnownLastPage();
        },
        pageIndex: function pageIndex(index) {
          return that._dataSource.pageIndex(index);
        },
        isLoading: function isLoading() {
          return that._dataSource.isLoading() && !that.isCustomLoading();
        },
        pageCount: function pageCount() {
          return that.pageCount();
        },
        load: function load() {
          return that._dataSource.load();
        },
        updateLoading: function updateLoading() {
          _updateLoading(that);
        },
        itemsCount: function itemsCount() {
          return that.itemsCount(true);
        },
        items: function items() {
          return that._dataSource.items();
        },
        viewportItems: function viewportItems(items) {
          if (items) {
            that._items = items;
          }

          return that._items;
        },
        onChanged: function onChanged(e) {
          that.changed.fire(e);
        },
        changingDuration: function changingDuration(e) {
          if (that.isLoading()) {
            return LOAD_TIMEOUT;
          }

          return that._renderTime || 0;
        }
      };
    },
    _handleLoadingChanged: function _handleLoadingChanged(isLoading) {
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        this.callBase.apply(this, arguments);
        return;
      }

      if (!isVirtualMode(this) || this._isLoadingAll) {
        this._isLoading = isLoading;
        this.callBase.apply(this, arguments);
      }

      if (isLoading) {
        this._startLoadTime = new Date();
      } else {
        this._startLoadTime = undefined;
      }
    },
    _handleLoadError: function _handleLoadError() {
      if (this.option(LEGACY_SCROLLING_MODE) !== false) {
        this._isLoading = false;
        this.loadingChanged.fire(false);
      }

      this.callBase.apply(this, arguments);
    },
    _handleDataChanged: function _handleDataChanged(e) {
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        this._items = this._dataSource.items().slice();
        this.callBase.apply(this, arguments);
        return;
      }

      var callBase = this.callBase.bind(this);

      this._virtualScrollController.handleDataChanged(callBase, e);
    },
    _customizeRemoteOperations: function _customizeRemoteOperations(options, operationTypes) {
      var newMode = this.option(LEGACY_SCROLLING_MODE) === false;
      var renderAsync = this.option('scrolling.renderAsync');

      if (!isDefined(renderAsync)) {
        renderAsync = this._renderTime >= this.option('scrolling.renderingThreshold');
      }

      if ((isVirtualMode(this) || isAppendMode(this) && newMode) && !operationTypes.reload && (operationTypes.skip || newMode) && !renderAsync) {
        options.delay = undefined;
      }

      this.callBase.apply(this, arguments);
    },
    items: function items() {
      return this._items;
    },
    itemsCount: function itemsCount(isBase) {
      if (isBase || this.option(LEGACY_SCROLLING_MODE) === false) {
        return this.callBase();
      }

      return this._virtualScrollController.itemsCount();
    },
    load: function load(loadOptions) {
      if (this.option(LEGACY_SCROLLING_MODE) === false || loadOptions) {
        return this.callBase(loadOptions);
      }

      return this._virtualScrollController.load();
    },
    isLoading: function isLoading() {
      return this.option(LEGACY_SCROLLING_MODE) === false ? this._dataSource.isLoading() : this._isLoading;
    },
    isLoaded: function isLoaded() {
      return this._dataSource.isLoaded() && this._isLoaded;
    },
    resetPagesCache: function resetPagesCache(isLiveUpdate) {
      if (!isLiveUpdate) {
        this._virtualScrollController.reset(true);
      }

      this.callBase.apply(this, arguments);
    },
    _changeRowExpandCore: function _changeRowExpandCore() {
      var result = this.callBase.apply(this, arguments);

      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        return result;
      }

      this.resetPagesCache();

      _updateLoading(this);

      return result;
    },
    reload: function reload() {
      this._dataSource.pageIndex(this.pageIndex());

      var virtualScrollController = this._virtualScrollController;

      if (this.option(LEGACY_SCROLLING_MODE) !== false && virtualScrollController) {
        var d = new Deferred();
        this.callBase.apply(this, arguments).done(function (r) {
          var delayDeferred = virtualScrollController.getDelayDeferred();

          if (delayDeferred) {
            delayDeferred.done(d.resolve).fail(d.reject);
          } else {
            d.resolve(r);
          }
        }).fail(d.reject);
        return d;
      } else {
        return this.callBase.apply(this, arguments);
      }
    },
    refresh: function refresh(options, operationTypes) {
      if (this.option(LEGACY_SCROLLING_MODE) !== false) {
        var storeLoadOptions = options.storeLoadOptions;
        var dataSource = this._dataSource;

        if (operationTypes.reload) {
          this._virtualScrollController.reset();

          dataSource.items().length = 0;
          this._isLoaded = false;

          _updateLoading(this);

          this._isLoaded = true;

          if (isAppendMode(this)) {
            this.pageIndex(0);
            dataSource.pageIndex(0);
            storeLoadOptions.pageIndex = 0;
            options.pageIndex = 0;
            storeLoadOptions.skip = 0;
          } else {
            dataSource.pageIndex(this.pageIndex());

            if (dataSource.paginate()) {
              options.pageIndex = this.pageIndex();
              storeLoadOptions.skip = this.pageIndex() * this.pageSize();
            }
          }
        } else if (isAppendMode(this) && storeLoadOptions.skip && this._totalCountCorrection < 0) {
          storeLoadOptions.skip += this._totalCountCorrection;
        }
      }

      return this.callBase.apply(this, arguments);
    },
    dispose: function dispose() {
      this._virtualScrollController.dispose();

      this.callBase.apply(this, arguments);
    },
    loadPageCount: function loadPageCount(count) {
      if (!isDefined(count)) {
        return this._loadPageCount;
      }

      this._loadPageCount = count;
    },
    _handleDataLoading: function _handleDataLoading(options) {
      var loadPageCount = this.loadPageCount();
      options.loadPageCount = loadPageCount;

      if (this.option(LEGACY_SCROLLING_MODE) === false && loadPageCount > 1) {
        options.storeLoadOptions.take = loadPageCount * this.pageSize();
      }

      this.callBase.apply(this, arguments);
    },
    _loadPageSize: function _loadPageSize() {
      return this.callBase.apply(this, arguments) * this.loadPageCount();
    }
  };
  ['beginPageIndex', 'endPageIndex'].forEach(function (name) {
    result[name] = function () {
      if (this.option(LEGACY_SCROLLING_MODE) === false) {
        var dataSource = this._dataSource;
        return dataSource.pageIndex.apply(dataSource, arguments);
      }

      var virtualScrollController = this._virtualScrollController;
      return virtualScrollController[name].apply(virtualScrollController, arguments);
    };
  });
  ['virtualItemsCount', 'getContentOffset', 'getVirtualContentSize', 'setContentItemSizes', 'setViewportPosition', 'getViewportItemIndex', 'setViewportItemIndex', 'getItemIndexByPosition', 'viewportSize', 'viewportItemSize', 'getItemSize', 'getItemSizes', 'pageIndex', 'loadIfNeed'].forEach(function (name) {
    result[name] = function () {
      var virtualScrollController = this._virtualScrollController;
      return virtualScrollController[name].apply(virtualScrollController, arguments);
    };
  });
  return result;
}();

var VirtualScrollingRowsViewExtender = function () {
  var removeEmptyRows = function removeEmptyRows($emptyRows, className) {
    var getRowParent = row => $(row).parent('.' + className).get(0);

    var tBodies = $emptyRows.toArray().map(getRowParent).filter(row => row);

    if (tBodies.length) {
      $emptyRows = $(tBodies);
    }

    var rowCount = className === FREESPACE_CLASS ? $emptyRows.length - 1 : $emptyRows.length;

    for (var i = 0; i < rowCount; i++) {
      $emptyRows.eq(i).remove();
    }
  };

  return {
    init: function init() {
      var _dataController$state;

      var dataController = this.getController('data');
      this.callBase();
      dataController.pageChanged.add(() => {
        this.scrollToPage(dataController.pageIndex());
      });
      dataController.dataSourceChanged.add(() => {
        !this._scrollTop && this._scrollToCurrentPageOnResize();
      });
      (_dataController$state = dataController.stateLoaded) === null || _dataController$state === void 0 ? void 0 : _dataController$state.add(() => {
        this._scrollToCurrentPageOnResize();
      });

      this._scrollToCurrentPageOnResize();
    },
    _scrollToCurrentPageOnResize: function _scrollToCurrentPageOnResize() {
      var dataController = this.getController('data');

      if (dataController.pageIndex() > 0) {
        var resizeHandler = () => {
          this.resizeCompleted.remove(resizeHandler);
          this.scrollToPage(dataController.pageIndex());
        };

        this.resizeCompleted.add(resizeHandler);
      }
    },
    scrollToPage: function scrollToPage(pageIndex) {
      var that = this;
      var dataController = that._dataController;
      var pageSize = dataController ? dataController.pageSize() : 0;
      var scrollPosition;

      if (isVirtualMode(that) || isAppendMode(that)) {
        var itemSize = dataController.getItemSize();
        var itemSizes = dataController.getItemSizes();
        var itemIndex = pageIndex * pageSize;
        scrollPosition = itemIndex * itemSize;

        for (var index in itemSizes) {
          if (index < itemIndex) {
            scrollPosition += itemSizes[index] - itemSize;
          }
        }
      } else {
        scrollPosition = 0;
      }

      that.scrollTo({
        y: scrollPosition,
        x: that._scrollLeft
      });
    },
    renderDelayedTemplates: function renderDelayedTemplates(e) {
      this._updateContentPosition(true);

      this.callBase.apply(this, arguments);
    },
    _renderCore: function _renderCore(e) {
      var startRenderTime = new Date();
      this.callBase.apply(this, arguments);
      var dataSource = this._dataController._dataSource;

      if (dataSource && e) {
        var itemCount = e.items ? e.items.length : 20;
        var viewportSize = this._dataController.viewportSize() || 20;

        if (gridCoreUtils.isVirtualRowRendering(this) && itemCount > 0 && this.option(LEGACY_SCROLLING_MODE) !== false) {
          dataSource._renderTime = (new Date() - startRenderTime) * viewportSize / itemCount;
        } else {
          dataSource._renderTime = new Date() - startRenderTime;
        }
      }
    },
    _getRowElements: function _getRowElements(tableElement) {
      var $rows = this.callBase(tableElement);
      return $rows && $rows.not('.' + VIRTUAL_ROW_CLASS);
    },
    _removeRowsElements: function _removeRowsElements(contentTable, removeCount, changeType) {
      var rowElements = this._getRowElements(contentTable).toArray();

      if (changeType === 'append') {
        rowElements = rowElements.slice(0, removeCount);
      } else {
        rowElements = rowElements.slice(-removeCount);
      }

      var errorHandlingController = this.getController('errorHandling');
      rowElements.map(rowElement => {
        var $rowElement = $(rowElement);
        errorHandlingController && errorHandlingController.removeErrorRow($rowElement.next());
        $rowElement.remove();
      });
    },
    _updateContent: function _updateContent(tableElement, change) {
      var $freeSpaceRowElements;

      var contentElement = this._findContentElement();

      var changeType = change && change.changeType;
      var contentTable = contentElement.children().first();

      if (changeType === 'append' || changeType === 'prepend') {
        var $tBodies = this._getBodies(tableElement);

        if ($tBodies.length === 1) {
          this._getBodies(contentTable)[changeType === 'append' ? 'append' : 'prepend']($tBodies.children());
        } else {
          $tBodies[changeType === 'append' ? 'appendTo' : 'prependTo'](contentTable);
        }

        tableElement.remove();
        $freeSpaceRowElements = this._getFreeSpaceRowElements(contentTable);
        removeEmptyRows($freeSpaceRowElements, FREESPACE_CLASS);

        if (change.removeCount) {
          this._removeRowsElements(contentTable, change.removeCount, changeType);
        }

        this._restoreErrorRow(contentTable);
      } else {
        this.callBase.apply(this, arguments);

        if (changeType === 'update') {
          this._restoreErrorRow(contentTable);
        }
      }

      this._updateBottomLoading();
    },
    _addVirtualRow: function _addVirtualRow($table, isFixed, location, position) {
      if (!position) return;

      var $virtualRow = this._createEmptyRow(VIRTUAL_ROW_CLASS, isFixed, position);

      $virtualRow = this._wrapRowIfNeed($table, $virtualRow);

      this._appendEmptyRow($table, $virtualRow, location);
    },
    _getRowHeights: function _getRowHeights() {
      var rowHeights = this._getRowElements(this._tableElement).toArray().map(function (row) {
        return getBoundingRect(row).height;
      });

      return rowHeights;
    },
    _correctRowHeights: function _correctRowHeights(rowHeights) {
      var dataController = this._dataController;
      var dataSource = dataController._dataSource;
      var correctedRowHeights = [];
      var visibleRows = dataController.getVisibleRows();
      var itemSize = 0;
      var firstCountableItem = true;
      var lastLoadIndex = -1;

      for (var i = 0; i < rowHeights.length; i++) {
        var currentItem = visibleRows[i];

        if (!isDefined(currentItem)) {
          continue;
        }

        if (this.option(LEGACY_SCROLLING_MODE) === false) {
          if (lastLoadIndex >= 0 && lastLoadIndex !== currentItem.loadIndex) {
            correctedRowHeights.push(itemSize);
            itemSize = 0;
          }

          lastLoadIndex = currentItem.loadIndex;
        } else {
          if (isItemCountableByDataSource(currentItem, dataSource)) {
            if (firstCountableItem) {
              firstCountableItem = false;
            } else {
              correctedRowHeights.push(itemSize);
              itemSize = 0;
            }
          }
        }

        itemSize += rowHeights[i];
      }

      itemSize > 0 && correctedRowHeights.push(itemSize);
      return correctedRowHeights;
    },
    _updateContentPosition: function _updateContentPosition(isRender) {
      var dataController = this._dataController;
      var rowHeight = this._rowHeight || 20;
      dataController.viewportItemSize(rowHeight);

      if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
        if (!isRender) {
          var rowHeights = this._getRowHeights();

          var correctedRowHeights = this._correctRowHeights(rowHeights);

          dataController.setContentItemSizes(correctedRowHeights);
        }

        var top = dataController.getContentOffset('begin');
        var bottom = dataController.getContentOffset('end');
        var $tables = this.getTableElements();
        var $virtualRows = $tables.children('tbody').children('.' + VIRTUAL_ROW_CLASS);
        removeEmptyRows($virtualRows, VIRTUAL_ROW_CLASS);
        $tables.each((index, element) => {
          var isFixed = index > 0;
          this._isFixedTableRendering = isFixed;

          this._addVirtualRow($(element), isFixed, 'top', top);

          this._addVirtualRow($(element), isFixed, 'bottom', bottom);

          this._isFixedTableRendering = false;
        });
      }
    },
    _isTableLinesDisplaysCorrect: function _isTableLinesDisplaysCorrect(table) {
      var hasColumnLines = table.find('.' + COLUMN_LINES_CLASS).length > 0;
      return hasColumnLines === this.option('showColumnLines');
    },
    _isColumnElementsEqual: function _isColumnElementsEqual($columns, $virtualColumns) {
      var result = $columns.length === $virtualColumns.length;

      if (result) {
        each($columns, function (index, element) {
          if (element.style.width !== $virtualColumns[index].style.width) {
            result = false;
            return result;
          }
        });
      }

      return result;
    },
    _getCellClasses: function _getCellClasses(column) {
      var classes = [];
      var cssClass = column.cssClass;
      var isExpandColumn = column.command === 'expand';
      cssClass && classes.push(cssClass);
      isExpandColumn && classes.push(this.addWidgetPrefix(GROUP_SPACE_CLASS));
      return classes;
    },
    _findBottomLoadPanel: function _findBottomLoadPanel($contentElement) {
      var $element = $contentElement || this.element();
      var $bottomLoadPanel = $element && $element.find('.' + this.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS));

      if ($bottomLoadPanel && $bottomLoadPanel.length) {
        return $bottomLoadPanel;
      }
    },
    _updateBottomLoading: function _updateBottomLoading() {
      var that = this;
      var virtualMode = isVirtualMode(this);
      var appendMode = isAppendMode(this);
      var showBottomLoading = !that._dataController.hasKnownLastPage() && that._dataController.isLoaded() && (virtualMode || appendMode);

      var $contentElement = that._findContentElement();

      var bottomLoadPanelElement = that._findBottomLoadPanel($contentElement);

      if (showBottomLoading) {
        if (!bottomLoadPanelElement) {
          $('<div>').addClass(that.addWidgetPrefix(BOTTOM_LOAD_PANEL_CLASS)).append(that._createComponent($('<div>'), LoadIndicator).$element()).appendTo($contentElement);
        }
      } else if (bottomLoadPanelElement) {
        bottomLoadPanelElement.remove();
      }
    },
    _handleScroll: function _handleScroll(e) {
      var that = this;

      if (that._hasHeight && that._rowHeight) {
        that._dataController.setViewportPosition(e.scrollOffset.top);
      }

      that.callBase.apply(that, arguments);
    },
    _needUpdateRowHeight: function _needUpdateRowHeight(itemsCount) {
      return this.callBase.apply(this, arguments) || itemsCount > 0 && isAppendMode(this) && !gridCoreUtils.isVirtualRowRendering(this);
    },
    _updateRowHeight: function _updateRowHeight() {
      this.callBase.apply(this, arguments);

      if (this._rowHeight) {
        this._updateContentPosition();

        var viewportHeight = this._hasHeight ? getOuterHeight(this.element()) : getOuterHeight(getWindow());
        var dataController = this._dataController;

        if (this.option(LEGACY_SCROLLING_MODE) === false) {
          dataController.viewportHeight(viewportHeight);
          dataController.updateViewport();
        } else {
          dataController.viewportSize(Math.ceil(viewportHeight / this._rowHeight));
        }
      }
    },
    updateFreeSpaceRowHeight: function updateFreeSpaceRowHeight() {
      var result = this.callBase.apply(this, arguments);

      if (result) {
        this._updateContentPosition();
      }

      return result;
    },
    setLoading: function setLoading(isLoading, messageText) {
      var dataController = this._dataController;
      var hasBottomLoadPanel = dataController.pageIndex() > 0 && dataController.isLoaded() && !!this._findBottomLoadPanel();

      if (this.option(LEGACY_SCROLLING_MODE) === false && isLoading && dataController.isViewportChanging()) {
        return;
      }

      if (hasBottomLoadPanel) {
        isLoading = false;
      }

      this.callBase.call(this, isLoading, messageText);
    },
    _resizeCore: function _resizeCore() {
      var that = this;
      var $element = that.element();
      that.callBase();

      if (that.component.$element() && !that._windowScroll && $element.closest(getWindow().document).length) {
        that._windowScroll = subscribeToExternalScrollers($element, function (scrollPos) {
          if (!that._hasHeight && that._rowHeight) {
            that._dataController.setViewportPosition(scrollPos);
          }
        }, that.component.$element());
        that.on('disposing', function () {
          that._windowScroll.dispose();
        });
      }

      that.loadIfNeed();
    },
    loadIfNeed: function loadIfNeed() {
      var _dataController$loadI;

      var dataController = this._dataController;
      dataController === null || dataController === void 0 ? void 0 : (_dataController$loadI = dataController.loadIfNeed) === null || _dataController$loadI === void 0 ? void 0 : _dataController$loadI.call(dataController);
    },
    setColumnWidths: function setColumnWidths(widths) {
      var scrollable = this.getScrollable();
      var $content;
      this.callBase.apply(this, arguments);

      if (this.option('scrolling.mode') === 'virtual') {
        $content = scrollable ? $(scrollable.content()) : this.element();
        this.callBase(widths, $content.children('.' + this.addWidgetPrefix(CONTENT_CLASS)).children(':not(.' + this.addWidgetPrefix(TABLE_CONTENT_CLASS) + ')'));
      }
    },
    dispose: function dispose() {
      clearTimeout(this._scrollTimeoutID);
      this.callBase();
    }
  };
}();

export var virtualScrollingModule = {
  defaultOptions: function defaultOptions() {
    return {
      scrolling: {
        timeout: 300,
        updateTimeout: 300,
        minTimeout: 0,
        renderingThreshold: 100,
        removeInvisiblePages: true,
        rowPageSize: 5,
        prerenderedRowChunkSize: 1,
        mode: 'standard',
        preloadEnabled: false,
        rowRenderingMode: 'standard',
        loadTwoPagesOnStart: false,
        legacyMode: false,
        prerenderedRowCount: 1
      }
    };
  },
  extenders: {
    dataSourceAdapter: VirtualScrollingDataSourceAdapterExtender,
    controllers: {
      data: function () {
        var members = {
          _refreshDataSource: function _refreshDataSource() {
            var baseResult = this.callBase.apply(this, arguments) || new Deferred().resolve().promise();
            baseResult.done(this.initVirtualRows.bind(this));
            return baseResult;
          },
          getRowPageSize: function getRowPageSize() {
            var rowPageSize = this.option('scrolling.rowPageSize');
            var pageSize = this.pageSize();
            return pageSize && pageSize < rowPageSize ? pageSize : rowPageSize;
          },
          reload: function reload() {
            var rowsScrollController = this._rowsScrollController || this._dataSource;
            var itemIndex = rowsScrollController && rowsScrollController.getItemIndexByPosition();
            var result = this.callBase.apply(this, arguments);
            return result && result.done(() => {
              if (isVirtualMode(this) || gridCoreUtils.isVirtualRowRendering(this)) {
                var rowIndexOffset = this.getRowIndexOffset();
                var rowIndex = Math.floor(itemIndex) - rowIndexOffset;
                var component = this.component;
                var scrollable = component.getScrollable && component.getScrollable();
                var isSortingOperation = this.dataSource().operationTypes().sorting;

                if (scrollable && !isSortingOperation) {
                  var rowElement = component.getRowElement(rowIndex);
                  var $rowElement = rowElement && rowElement[0] && $(rowElement[0]);
                  var top = $rowElement && $rowElement.position().top;
                  var isChromeLatest = browser.chrome && browser.version >= 91;
                  var allowedTopOffset = browser.mozilla || isChromeLatest ? 1 : 0; // T884308

                  if (top > allowedTopOffset) {
                    top = Math.round(top + getOuterHeight($rowElement) * (itemIndex % 1));
                    scrollable.scrollTo({
                      y: top
                    });
                  }
                }
              }
            });
          },
          initVirtualRows: function initVirtualRows() {
            var virtualRowsRendering = gridCoreUtils.isVirtualRowRendering(this);
            this._allItems = null;
            this._loadViewportParams = null;

            if (this.option('scrolling.mode') !== 'virtual' && virtualRowsRendering !== true || virtualRowsRendering === false || this.option(LEGACY_SCROLLING_MODE) !== false && !this.option('scrolling.rowPageSize')) {
              this._visibleItems = null;
              this._rowsScrollController = null;
              return;
            }

            var pageIndex = !isVirtualMode(this) && this.pageIndex() >= this.pageCount() ? this.pageCount() - 1 : this.pageIndex();
            this._rowPageIndex = Math.ceil(pageIndex * this.pageSize() / this.getRowPageSize());
            this._visibleItems = this.option(LEGACY_SCROLLING_MODE) === false ? null : [];
            this._rowsScrollController = new VirtualScrollController(this.component, this._getRowsScrollDataOptions(), true);
            this._viewportChanging = false;
            this._needUpdateViewportAfterLoading = false;

            this._rowsScrollController.positionChanged.add(() => {
              var _this$_dataSource;

              if (this.option(LEGACY_SCROLLING_MODE) === false) {
                this._viewportChanging = true;
                this.loadViewport();
                this._viewportChanging = false;
                return;
              }

              (_this$_dataSource = this._dataSource) === null || _this$_dataSource === void 0 ? void 0 : _this$_dataSource.setViewportItemIndex(this._rowsScrollController.getViewportItemIndex());
            });

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              this._updateLoadViewportParams();
            }

            if (this.isLoaded() && this.option(LEGACY_SCROLLING_MODE) !== false) {
              this._rowsScrollController.load();
            }
          },
          isViewportChanging: function isViewportChanging() {
            return this._viewportChanging;
          },
          _getRowsScrollDataOptions: function _getRowsScrollDataOptions() {
            var that = this;

            var isItemCountable = function isItemCountable(item) {
              return isItemCountableByDataSource(item, that._dataSource);
            };

            return {
              pageSize: function pageSize() {
                return that.getRowPageSize();
              },
              loadedOffset: function loadedOffset() {
                var _that$_dataSource;

                return isVirtualMode(that) && ((_that$_dataSource = that._dataSource) === null || _that$_dataSource === void 0 ? void 0 : _that$_dataSource.lastLoadOptions().skip) || 0;
              },
              loadedItemCount: function loadedItemCount() {
                var _that$_allItems;

                var insertRowCount = ((_that$_allItems = that._allItems) === null || _that$_allItems === void 0 ? void 0 : _that$_allItems.filter(it => it.isNewRow).length) || 0;
                return that._itemCount + insertRowCount;
              },
              totalItemsCount: function totalItemsCount() {
                if (isVirtualMode(that)) {
                  var _that$getController$g, _that$getController;

                  var insertRowCount = (_that$getController$g = (_that$getController = that.getController('editing')) === null || _that$getController === void 0 ? void 0 : _that$getController.getInsertRowCount()) !== null && _that$getController$g !== void 0 ? _that$getController$g : 0;
                  return that.totalItemsCount() + insertRowCount;
                }

                return that.option(LEGACY_SCROLLING_MODE) === false ? that._itemCount : that._items.filter(isItemCountable).length;
              },
              hasKnownLastPage: function hasKnownLastPage() {
                return true;
              },
              pageIndex: function pageIndex(index) {
                if (index !== undefined) {
                  that._rowPageIndex = index;
                }

                return that._rowPageIndex;
              },
              isLoading: function isLoading() {
                return that.isLoading();
              },
              pageCount: function pageCount() {
                var pageCount = Math.ceil(this.totalItemsCount() / this.pageSize());
                return pageCount ? pageCount : 1;
              },
              load: function load() {
                if (that._rowsScrollController.pageIndex() >= this.pageCount()) {
                  that._rowPageIndex = this.pageCount() - 1;

                  that._rowsScrollController.pageIndex(that._rowPageIndex);
                }

                if (!this.items().length && this.totalItemsCount()) return;

                that._rowsScrollController.handleDataChanged(change => {
                  change = change || {};
                  change.changeType = change.changeType || 'refresh';
                  change.items = change.items || that._visibleItems;

                  that._visibleItems.forEach((item, index) => {
                    item.rowIndex = index;
                  });

                  that._fireChanged(change);
                });
              },
              updateLoading: function updateLoading() {},
              itemsCount: function itemsCount() {
                return this.items().filter(isItemCountable).length;
              },
              correctCount: function correctCount(items, count, fromEnd) {
                return _correctCount(items, count, fromEnd, (item, isNextAfterLast, fromEnd) => {
                  if (item.isNewRow) {
                    return isNextAfterLast && !fromEnd;
                  }

                  if (isNextAfterLast && fromEnd) {
                    return !item.isNewRow;
                  }

                  return isItemCountable(item);
                });
              },
              items: function items(countableOnly) {
                var dataSource = that.dataSource();
                var virtualItemsCount = dataSource && dataSource.virtualItemsCount();
                var begin = virtualItemsCount ? virtualItemsCount.begin : 0;
                var rowPageSize = that.getRowPageSize();
                var skip = that._rowPageIndex * rowPageSize - begin;
                var take = rowPageSize;
                var result = that._items;

                if (skip < 0) {
                  return [];
                }

                if (skip) {
                  skip = this.correctCount(result, skip);
                  result = result.slice(skip);
                }

                if (take) {
                  take = this.correctCount(result, take);
                  result = result.slice(0, take);
                }

                return countableOnly ? result.filter(isItemCountable) : result;
              },
              viewportItems: function viewportItems(items) {
                if (items && that.option(LEGACY_SCROLLING_MODE) !== false) {
                  that._visibleItems = items;
                }

                return that._visibleItems;
              },
              onChanged: function onChanged() {},
              changingDuration: function changingDuration(e) {
                var dataSource = that.dataSource();

                if (dataSource !== null && dataSource !== void 0 && dataSource.isLoading() && that.option(LEGACY_SCROLLING_MODE) !== false) {
                  return LOAD_TIMEOUT;
                }

                return (dataSource === null || dataSource === void 0 ? void 0 : dataSource._renderTime) || 0;
              }
            };
          },
          _updateItemsCore: function _updateItemsCore(change) {
            var delta = this.getRowIndexDelta();
            this.callBase.apply(this, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false && gridCoreUtils.isVirtualRowRendering(this)) {
              if (change.changeType === 'update' && change.rowIndices.length === 0 && change.cancelEmptyChanges) {
                change.cancel = true;
              }

              return;
            }

            var rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              var visibleItems = this._visibleItems;
              var isRefresh = change.changeType === 'refresh' || change.isLiveUpdate;
              if (change.changeType === 'append' && change.items && !change.items.length) return;

              if (isRefresh || change.changeType === 'append' || change.changeType === 'prepend') {
                change.cancel = true;
                isRefresh && rowsScrollController.reset(true);
                rowsScrollController.load();
              } else {
                if (change.changeType === 'update') {
                  change.rowIndices.forEach((rowIndex, index) => {
                    var changeType = change.changeTypes[index];
                    var newItem = change.items[index];

                    if (changeType === 'update') {
                      visibleItems[rowIndex] = newItem;
                    } else if (changeType === 'insert') {
                      visibleItems.splice(rowIndex, 0, newItem);
                    } else if (changeType === 'remove') {
                      visibleItems.splice(rowIndex, 1);
                    }
                  });
                } else {
                  visibleItems.forEach((item, index) => {
                    visibleItems[index] = this._items[index + delta] || visibleItems[index];
                  });
                  change.items = visibleItems;
                }

                updateItemIndices(visibleItems);
              }
            }
          },
          _updateLoadViewportParams: function _updateLoadViewportParams() {
            var viewportParams = this._rowsScrollController.getViewportParams();

            var pageSize = this.pageSize();

            if (viewportParams && !isVirtualPaging(this) && pageSize > 0) {
              var pageOffset = this.pageIndex() * pageSize;
              viewportParams.skip += pageOffset;
            }

            this._loadViewportParams = viewportParams;
          },
          _processItems: function _processItems(items) {
            var newItems = this.callBase.apply(this, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              var _dataSource$lastLoadO;

              var dataSource = this._dataSource;
              var currentIndex = (_dataSource$lastLoadO = dataSource === null || dataSource === void 0 ? void 0 : dataSource.lastLoadOptions().skip) !== null && _dataSource$lastLoadO !== void 0 ? _dataSource$lastLoadO : 0;
              var prevCountable;
              var prevRowType;
              newItems.forEach(item => {
                var rowType = item.rowType;
                var itemCountable = isItemCountableByDataSource(item, dataSource);

                if (!item.isNewRow && isDefined(prevCountable)) {
                  var isNextGroupItem = rowType === 'group' && (prevCountable || itemCountable || prevRowType !== 'group' && currentIndex > 0);
                  var isNextDataItem = rowType === 'data' && itemCountable && (prevCountable || prevRowType !== 'group');

                  if (isNextGroupItem || isNextDataItem) {
                    currentIndex++;
                  }
                }

                item.loadIndex = currentIndex;
                prevCountable = itemCountable;
                prevRowType = rowType;
              });
            }

            return newItems;
          },
          _afterProcessItems: function _afterProcessItems(items) {
            this._itemCount = items.filter(item => isItemCountableByDataSource(item, this._dataSource)).length;

            if (isDefined(this._loadViewportParams)) {
              this._updateLoadViewportParams();

              var result = items;
              this._allItems = items;

              if (items.length) {
                var {
                  skipForCurrentPage
                } = this.getLoadPageParams(true);
                var startLoadIndex = items[0].loadIndex + skipForCurrentPage;
                result = items.filter(it => (it.loadIndex >= startLoadIndex || it.isNewRow && it.loadIndex >= startLoadIndex - 1) && it.loadIndex < startLoadIndex + this._loadViewportParams.take);
              }

              return result;
            }

            return this.callBase.apply(this, arguments);
          },
          _applyChange: function _applyChange(change) {
            var that = this;
            var items = change.items;
            var changeType = change.changeType;
            var removeCount = change.removeCount;

            if (removeCount) {
              var fromEnd = changeType === 'prepend';
              removeCount = _correctCount(that._items, removeCount, fromEnd, function (item, isNextAfterLast) {
                return item.rowType === 'data' && !item.isNewRow || item.rowType === 'group' && (that._dataSource.isGroupItemCountable(item.data) || isNextAfterLast);
              });
              change.removeCount = removeCount;
            }

            switch (changeType) {
              case 'prepend':
                that._items.unshift.apply(that._items, items);

                if (removeCount) {
                  that._items.splice(-removeCount);
                }

                break;

              case 'append':
                that._items.push.apply(that._items, items);

                if (removeCount) {
                  that._items.splice(0, removeCount);
                }

                break;

              default:
                that.callBase(change);
                break;
            }
          },
          items: function items(allItems) {
            return allItems ? this._allItems || this._items : this._visibleItems || this._items;
          },
          getRowIndexDelta: function getRowIndexDelta() {
            var visibleItems = this._visibleItems;
            var delta = 0;

            if (visibleItems && visibleItems[0]) {
              delta = this._items.indexOf(visibleItems[0]);
            }

            return delta < 0 ? 0 : delta;
          },
          getRowIndexOffset: function getRowIndexOffset(byLoadedRows) {
            var offset = 0;
            var dataSource = this.dataSource();
            var rowsScrollController = this._rowsScrollController;
            var virtualMode = isVirtualMode(this);
            var appendMode = isAppendMode(this);
            var newMode = this.option(LEGACY_SCROLLING_MODE) === false;

            if (rowsScrollController && !byLoadedRows) {
              if (newMode && isDefined(this._loadViewportParams)) {
                var {
                  skipForCurrentPage,
                  pageIndex
                } = this.getLoadPageParams(true);
                offset = pageIndex * this.pageSize() + skipForCurrentPage;
              } else {
                offset = rowsScrollController.beginPageIndex() * rowsScrollController.pageSize();
              }
            } else if ((virtualMode || appendMode) && newMode && dataSource) {
              var _dataSource$lastLoadO2;

              offset = (_dataSource$lastLoadO2 = dataSource.lastLoadOptions().skip) !== null && _dataSource$lastLoadO2 !== void 0 ? _dataSource$lastLoadO2 : 0;
            } else if (virtualMode && dataSource) {
              offset = dataSource.beginPageIndex() * dataSource.pageSize();
            }

            return offset;
          },
          viewportSize: function viewportSize() {
            var rowsScrollController = this._rowsScrollController;
            var dataSource = this._dataSource;
            var result = rowsScrollController === null || rowsScrollController === void 0 ? void 0 : rowsScrollController.viewportSize.apply(rowsScrollController, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return result;
            }

            return dataSource === null || dataSource === void 0 ? void 0 : dataSource.viewportSize.apply(dataSource, arguments);
          },
          viewportHeight: function viewportHeight(height) {
            var _this$_rowsScrollCont;

            (_this$_rowsScrollCont = this._rowsScrollController) === null || _this$_rowsScrollCont === void 0 ? void 0 : _this$_rowsScrollCont.viewportHeight(height);
          },
          viewportItemSize: function viewportItemSize() {
            var rowsScrollController = this._rowsScrollController;
            var dataSource = this._dataSource;
            var result = rowsScrollController === null || rowsScrollController === void 0 ? void 0 : rowsScrollController.viewportItemSize.apply(rowsScrollController, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return result;
            }

            return dataSource === null || dataSource === void 0 ? void 0 : dataSource.viewportItemSize.apply(dataSource, arguments);
          },
          setViewportPosition: function setViewportPosition() {
            var rowsScrollController = this._rowsScrollController;
            var dataSource = this._dataSource;

            if (rowsScrollController) {
              rowsScrollController.setViewportPosition.apply(rowsScrollController, arguments);
            } else {
              dataSource === null || dataSource === void 0 ? void 0 : dataSource.setViewportPosition.apply(dataSource, arguments);
            }
          },
          setContentItemSizes: function setContentItemSizes(sizes) {
            var rowsScrollController = this._rowsScrollController;
            var dataSource = this._dataSource;
            var result = rowsScrollController === null || rowsScrollController === void 0 ? void 0 : rowsScrollController.setContentItemSizes(sizes);

            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return result;
            }

            return dataSource === null || dataSource === void 0 ? void 0 : dataSource.setContentItemSizes(sizes);
          },
          getPreloadedRowCount: function getPreloadedRowCount() {
            var preloadCount = this.option('scrolling.preloadedRowCount');
            var preloadEnabled = this.option('scrolling.preloadEnabled');

            if (isDefined(preloadCount)) {
              return preloadCount;
            }

            var viewportSize = this.viewportSize();
            return preloadEnabled ? 2 * viewportSize : viewportSize;
          },
          getLoadPageParams: function getLoadPageParams(byLoadedPage) {
            var _this$_dataSource2, _this$_dataSource3;

            var viewportParams = this._loadViewportParams;
            var lastLoadOptions = (_this$_dataSource2 = this._dataSource) === null || _this$_dataSource2 === void 0 ? void 0 : _this$_dataSource2.lastLoadOptions();
            var loadedPageIndex = (lastLoadOptions === null || lastLoadOptions === void 0 ? void 0 : lastLoadOptions.pageIndex) || 0;
            var loadedTake = (lastLoadOptions === null || lastLoadOptions === void 0 ? void 0 : lastLoadOptions.take) || 0;

            var isScrollingBack = this._rowsScrollController.isScrollingBack();

            var topPreloadCount = isScrollingBack ? this.getPreloadedRowCount() : 0;
            var bottomPreloadCount = isScrollingBack ? 0 : this.getPreloadedRowCount();
            var totalCountCorrection = ((_this$_dataSource3 = this._dataSource) === null || _this$_dataSource3 === void 0 ? void 0 : _this$_dataSource3.totalCountCorrection()) || 0;
            var skipWithPreload = Math.max(0, viewportParams.skip - topPreloadCount);
            var pageIndex = byLoadedPage ? loadedPageIndex : Math.floor(skipWithPreload / this.pageSize());
            var pageOffset = pageIndex * this.pageSize();
            var skipForCurrentPage = viewportParams.skip - pageOffset;
            var loadingTake = viewportParams.take + skipForCurrentPage + bottomPreloadCount - totalCountCorrection;
            var take = byLoadedPage ? loadedTake : loadingTake;
            var loadPageCount = Math.ceil(take / this.pageSize());
            return {
              pageIndex,
              loadPageCount: Math.max(1, loadPageCount),
              skipForCurrentPage: Math.max(0, skipForCurrentPage)
            };
          },
          _updateVisiblePageIndex: function _updateVisiblePageIndex(currentPageIndex) {
            if (!this._rowsScrollController) {
              return;
            }

            if (isDefined(currentPageIndex)) {
              this._silentOption(VISIBLE_PAGE_INDEX, currentPageIndex);

              this.pageChanged.fire();
              return;
            }

            var viewPortItemIndex = this._rowsScrollController.getViewportItemIndex();

            var newPageIndex = Math.floor(viewPortItemIndex / this.pageSize());

            if (this.pageIndex() !== newPageIndex) {
              this._silentOption(VISIBLE_PAGE_INDEX, newPageIndex);

              this.updateItems({
                changeType: 'pageIndex'
              });
            }
          },
          _getChangedLoadParams: function _getChangedLoadParams() {
            var loadedPageParams = this.getLoadPageParams(true);
            var {
              pageIndex,
              loadPageCount
            } = this.getLoadPageParams();
            var result = null;

            if (!this._isLoading && (pageIndex !== loadedPageParams.pageIndex || loadPageCount !== loadedPageParams.loadPageCount)) {
              result = {
                pageIndex,
                loadPageCount
              };
            }

            return result;
          },
          _loadItems: function _loadItems(checkLoading) {
            var virtualPaging = isVirtualPaging(this);
            var dataSourceAdapter = this._dataSource;

            var changedParams = this._getChangedLoadParams();

            var result = false;

            if (virtualPaging && checkLoading && changedParams && changedParams.pageIndex > dataSourceAdapter.pageIndex()) {
              return result;
            }

            if (virtualPaging && this._isLoading) {
              this._needUpdateViewportAfterLoading = true;
            }

            if (virtualPaging && changedParams) {
              result = true;
              dataSourceAdapter.pageIndex(changedParams.pageIndex);
              dataSourceAdapter.loadPageCount(changedParams.loadPageCount);
              this._repaintChangesOnly = true;
              this._needUpdateDimensions = true;
              var viewportChanging = this._viewportChanging;
              this.load().always(() => {
                this._repaintChangesOnly = undefined;
                this._needUpdateDimensions = undefined;
              }).done(() => {
                var isLastPage = this.pageCount() > 0 && this.pageIndex() === this.pageCount() - 1;
                (viewportChanging || isLastPage) && this._updateVisiblePageIndex();

                if (this._needUpdateViewportAfterLoading) {
                  this._needUpdateViewportAfterLoading = false;
                  this.loadViewport({
                    checkLoadedParamsOnly: true
                  });
                }
              });
            }

            return result;
          },
          loadViewport: function loadViewport(params) {
            var {
              checkLoadedParamsOnly,
              checkLoading
            } = params !== null && params !== void 0 ? params : {};
            var virtualPaging = isVirtualPaging(this);

            if (virtualPaging || gridCoreUtils.isVirtualRowRendering(this)) {
              this._updateLoadViewportParams();

              var loadingItemsStarted = this._loadItems(checkLoading);

              if (!loadingItemsStarted && !(this._isLoading && checkLoading) && !checkLoadedParamsOnly) {
                this.updateItems({
                  repaintChangesOnly: true,
                  needUpdateDimensions: true,
                  cancelEmptyChanges: true
                });
              }
            }
          },
          updateViewport: function updateViewport() {
            var _this$_loadViewportPa, _this$_loadViewportPa2, _this$_rowsScrollCont2;

            var viewportSize = this.viewportSize();
            var itemCount = this.items().length;
            var viewportIsNotFilled = viewportSize > itemCount;
            var currentTake = (_this$_loadViewportPa = (_this$_loadViewportPa2 = this._loadViewportParams) === null || _this$_loadViewportPa2 === void 0 ? void 0 : _this$_loadViewportPa2.take) !== null && _this$_loadViewportPa !== void 0 ? _this$_loadViewportPa : 0;
            var newTake = (_this$_rowsScrollCont2 = this._rowsScrollController) === null || _this$_rowsScrollCont2 === void 0 ? void 0 : _this$_rowsScrollCont2.getViewportParams().take;
            (viewportIsNotFilled || currentTake < newTake) && itemCount && this.loadViewport({
              checkLoading: true
            });
          },
          loadIfNeed: function loadIfNeed() {
            if (this.option(LEGACY_SCROLLING_MODE) === false) {
              return;
            }

            var rowsScrollController = this._rowsScrollController;
            rowsScrollController && rowsScrollController.loadIfNeed();
            var dataSource = this._dataSource;
            return dataSource && dataSource.loadIfNeed();
          },
          getItemSize: function getItemSize() {
            var rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              return rowsScrollController.getItemSize.apply(rowsScrollController, arguments);
            }

            var dataSource = this._dataSource;
            return dataSource && dataSource.getItemSize.apply(dataSource, arguments);
          },
          getItemSizes: function getItemSizes() {
            var rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              return rowsScrollController.getItemSizes.apply(rowsScrollController, arguments);
            }

            var dataSource = this._dataSource;
            return dataSource && dataSource.getItemSizes.apply(dataSource, arguments);
          },
          getContentOffset: function getContentOffset() {
            var rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              return rowsScrollController.getContentOffset.apply(rowsScrollController, arguments);
            }

            var dataSource = this._dataSource;
            return dataSource && dataSource.getContentOffset.apply(dataSource, arguments);
          },
          refresh: function refresh(options) {
            var dataSource = this._dataSource;

            if (dataSource && options && options.load && isAppendMode(this)) {
              dataSource.resetCurrentTotalCount();
            }

            return this.callBase.apply(this, arguments);
          },
          dispose: function dispose() {
            var rowsScrollController = this._rowsScrollController;
            rowsScrollController && rowsScrollController.dispose();
            this.callBase.apply(this, arguments);
          },
          topItemIndex: function topItemIndex() {
            var _this$_loadViewportPa3;

            return (_this$_loadViewportPa3 = this._loadViewportParams) === null || _this$_loadViewportPa3 === void 0 ? void 0 : _this$_loadViewportPa3.skip;
          },
          bottomItemIndex: function bottomItemIndex() {
            var viewportParams = this._loadViewportParams;
            return viewportParams && viewportParams.skip + viewportParams.take;
          },
          virtualItemsCount: function virtualItemsCount() {
            var rowsScrollController = this._rowsScrollController;

            if (rowsScrollController) {
              return rowsScrollController.virtualItemsCount.apply(rowsScrollController, arguments);
            }

            var dataSource = this._dataSource;
            return dataSource === null || dataSource === void 0 ? void 0 : dataSource.virtualItemsCount.apply(dataSource, arguments);
          },
          pageIndex: function pageIndex(_pageIndex) {
            var virtualPaging = isVirtualPaging(this);
            var rowsScrollController = this._rowsScrollController;

            if (this.option(LEGACY_SCROLLING_MODE) === false && virtualPaging && rowsScrollController) {
              if (_pageIndex === undefined) {
                var _this$option;

                return (_this$option = this.option(VISIBLE_PAGE_INDEX)) !== null && _this$option !== void 0 ? _this$option : 0;
              }
            }

            return this.callBase.apply(this, arguments);
          },
          _fireChanged: function _fireChanged(e) {
            this.callBase.apply(this, arguments);
            var {
              operationTypes
            } = e;

            if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this) && operationTypes) {
              if (e.isDataChanged && operationTypes.pageIndex && !operationTypes.fullReload) {
                this._updateVisiblePageIndex(this._dataSource.pageIndex());
              }
            }
          },
          _getPagingOptionValue: function _getPagingOptionValue(optionName) {
            var result = this.callBase.apply(this, arguments);

            if (this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this)) {
              result = this[optionName]();
            }

            return result;
          },
          isEmpty: function isEmpty() {
            return this.option(LEGACY_SCROLLING_MODE) === false && isVirtualPaging(this) ? !this._itemCount : this.callBase(this, arguments);
          }
        };
        gridCoreUtils.proxyMethod(members, 'getVirtualContentSize');
        gridCoreUtils.proxyMethod(members, 'setViewportItemIndex');
        return members;
      }(),
      resizing: {
        resize: function resize() {
          var that = this;
          var callBase = that.callBase;
          var result;

          if (isVirtualMode(that) || gridCoreUtils.isVirtualRowRendering(that)) {
            clearTimeout(that._resizeTimeout);
            var diff = new Date() - that._lastTime;
            var updateTimeout = that.option('scrolling.updateTimeout');

            if (that._lastTime && diff < updateTimeout) {
              result = new Deferred();
              that._resizeTimeout = setTimeout(function () {
                callBase.apply(that).done(result.resolve).fail(result.reject);
                that._lastTime = new Date();
              }, updateTimeout);
              that._lastTime = new Date();
            } else {
              result = callBase.apply(that);

              if (that._dataController.isLoaded()) {
                that._lastTime = new Date();
              }
            }
          } else {
            result = callBase.apply(that);
          }

          return result;
        },
        dispose: function dispose() {
          this.callBase.apply(this, arguments);
          clearTimeout(this._resizeTimeout);
        }
      }
    },
    views: {
      rowsView: VirtualScrollingRowsViewExtender
    }
  }
};