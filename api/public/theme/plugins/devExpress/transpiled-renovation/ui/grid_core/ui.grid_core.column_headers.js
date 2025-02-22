"use strict";

exports.columnHeadersModule = void 0;

var _size = require("../../core/utils/size");

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _uiGrid_core = require("./ui.grid_core.columns_view");

var _message = _interopRequireDefault(require("../../localization/message"));

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _extend = require("../../core/utils/extend");

var _uiGrid_core2 = require("./ui.grid_core.accessibility");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CELL_CONTENT_CLASS = 'text-content';
var HEADERS_CLASS = 'headers';
var NOWRAP_CLASS = 'nowrap';
var ROW_CLASS_SELECTOR = '.dx-row';
var HEADER_ROW_CLASS = 'dx-header-row';
var COLUMN_LINES_CLASS = 'dx-column-lines';
var CONTEXT_MENU_SORT_ASC_ICON = 'context-menu-sort-asc';
var CONTEXT_MENU_SORT_DESC_ICON = 'context-menu-sort-desc';
var CONTEXT_MENU_SORT_NONE_ICON = 'context-menu-sort-none';
var CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
var VISIBILITY_HIDDEN_CLASS = 'dx-visibility-hidden';
var TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX = 'dx-text-content-alignment-';
var SORT_INDICATOR_CLASS = 'dx-sort-indicator';
var SORT_INDEX_INDICATOR_CLASS = 'dx-sort-index-indicator';
var HEADER_FILTER_CLASS_SELECTOR = '.dx-header-filter';
var HEADER_FILTER_INDICATOR_CLASS = 'dx-header-filter-indicator';
var MULTI_ROW_HEADER_CLASS = 'dx-header-multi-row';
var columnHeadersModule = {
  defaultOptions: function defaultOptions() {
    return {
      showColumnHeaders: true,
      cellHintEnabled: true
    };
  },
  views: {
    columnHeadersView: _uiGrid_core.ColumnsView.inherit(function () {
      var createCellContent = function createCellContent(that, $cell, options) {
        var $cellContent = (0, _renderer.default)('<div>').addClass(that.addWidgetPrefix(CELL_CONTENT_CLASS));
        that.setAria('role', 'presentation', $cellContent);
        addCssClassesToCellContent(that, $cell, options.column, $cellContent);
        var showColumnLines = that.option('showColumnLines');
        var contentAlignment = that.getController('columns').getHeaderContentAlignment(options.column.alignment);
        return $cellContent[showColumnLines || contentAlignment === 'right' ? 'appendTo' : 'prependTo']($cell);
      };

      function addCssClassesToCellContent(that, $cell, column, $cellContent) {
        var $indicatorElements = that._getIndicatorElements($cell, true);

        var $visibleIndicatorElements = that._getIndicatorElements($cell);

        var indicatorCount = $indicatorElements && $indicatorElements.length;

        var columnAlignment = that._getColumnAlignment(column.alignment);

        var sortIndicatorClassName = ".".concat(that._getIndicatorClassName('sort'));
        var sortIndexIndicatorClassName = ".".concat(that._getIndicatorClassName('sortIndex'));
        var $sortIndicator = $visibleIndicatorElements.filter(sortIndicatorClassName);
        var $sortIndexIndicator = $visibleIndicatorElements.children().filter(sortIndexIndicatorClassName);
        $cellContent = $cellContent || $cell.children('.' + that.addWidgetPrefix(CELL_CONTENT_CLASS));
        $cellContent.toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + columnAlignment, indicatorCount > 0).toggleClass(TEXT_CONTENT_ALIGNMENT_CLASS_PREFIX + (columnAlignment === 'left' ? 'right' : 'left'), indicatorCount > 0 && column.alignment === 'center').toggleClass(SORT_INDICATOR_CLASS, !!$sortIndicator.length).toggleClass(SORT_INDEX_INDICATOR_CLASS, !!$sortIndexIndicator.length).toggleClass(HEADER_FILTER_INDICATOR_CLASS, !!$visibleIndicatorElements.filter('.' + that._getIndicatorClassName('headerFilter')).length);
      }

      return {
        _createTable: function _createTable() {
          var $table = this.callBase.apply(this, arguments);

          _events_engine.default.on($table, 'mousedown selectstart', this.createAction(function (e) {
            var event = e.event;

            if (event.shiftKey) {
              event.preventDefault();
            }
          }));

          return $table;
        },
        _isLegacyKeyboardNavigation: function _isLegacyKeyboardNavigation() {
          return this.option('useLegacyKeyboardNavigation');
        },
        _getDefaultTemplate: function _getDefaultTemplate(column) {
          var that = this;
          return function ($container, options) {
            var $content = column.command ? $container : createCellContent(that, $container, options);
            var caption = column.command !== 'expand' && column.caption;

            if (caption) {
              $content.text(caption);
            } else if (column.command) {
              $container.html('&nbsp;');
            }
          };
        },
        _getHeaderTemplate: function _getHeaderTemplate(column) {
          return column.headerCellTemplate || {
            allowRenderToDetachedContainer: true,
            render: this._getDefaultTemplate(column)
          };
        },
        _processTemplate: function _processTemplate(template, options) {
          var that = this;
          var resultTemplate;
          var column = options.column;
          var renderingTemplate = that.callBase(template);

          if (options.rowType === 'header' && renderingTemplate && column.headerCellTemplate && !column.command) {
            resultTemplate = {
              render: function render(options) {
                var $content = createCellContent(that, options.container, options.model);
                renderingTemplate.render((0, _extend.extend)({}, options, {
                  container: $content
                }));
              }
            };
          } else {
            resultTemplate = renderingTemplate;
          }

          return resultTemplate;
        },
        _handleDataChanged: function _handleDataChanged(e) {
          if (e.changeType !== 'refresh') return;

          if (this._isGroupingChanged || this._requireReady) {
            this._isGroupingChanged = false;
            this.render();
          }
        },
        _renderCell: function _renderCell($row, options) {
          var $cell = this.callBase($row, options);

          if (options.row.rowType === 'header') {
            $cell.addClass(CELL_FOCUS_DISABLED_CLASS);

            if (!this._isLegacyKeyboardNavigation()) {
              if (options.column && !options.column.type) {
                $cell.attr('tabindex', this.option('tabindex') || 0);
              }
            }
          }

          return $cell;
        },
        _setCellAriaAttributes: function _setCellAriaAttributes($cell, cellOptions) {
          this.callBase($cell, cellOptions);

          if (cellOptions.rowType === 'header') {
            this.setAria('role', 'columnheader', $cell);

            if (cellOptions.column && !cellOptions.column.command && !cellOptions.column.isBand) {
              $cell.attr('id', cellOptions.column.headerId);
              this.setAria('label', _message.default.format('dxDataGrid-ariaColumn') + ' ' + cellOptions.column.caption, $cell);
            }
          }
        },
        _createRow: function _createRow(row) {
          var $row = this.callBase.apply(this, arguments);
          $row.toggleClass(COLUMN_LINES_CLASS, this.option('showColumnLines'));

          if (row.rowType === 'header') {
            $row.addClass(HEADER_ROW_CLASS);

            if (!this._isLegacyKeyboardNavigation()) {
              (0, _uiGrid_core2.registerKeyboardAction)('columnHeaders', this, $row, 'td', this._handleActionKeyDown.bind(this));
            }
          }

          return $row;
        },
        _handleActionKeyDown: function _handleActionKeyDown(args) {
          var event = args.event;
          var $target = (0, _renderer.default)(event.target);
          this._lastActionElement = event.target;

          if ($target.is(HEADER_FILTER_CLASS_SELECTOR)) {
            var headerFilterController = this.getController('headerFilter');
            var $column = $target.closest('td');
            var columnIndex = this.getColumnIndexByElement($column);

            if (columnIndex >= 0) {
              headerFilterController.showHeaderFilterMenu(columnIndex, false);
            }
          } else {
            var $row = $target.closest(ROW_CLASS_SELECTOR);

            this._processHeaderAction(event, $row);
          }

          event.preventDefault();
        },
        _renderCore: function _renderCore() {
          var that = this;
          var $container = that.element();

          if (that._tableElement && !that._dataController.isLoaded() && !that._hasRowElements) {
            return;
          }

          $container.addClass(that.addWidgetPrefix(HEADERS_CLASS)).toggleClass(that.addWidgetPrefix(NOWRAP_CLASS), !that.option('wordWrapEnabled')).empty();
          that.setAria('role', 'presentation', $container);

          that._updateContent(that._renderTable());

          if (that.getRowCount() > 1) {
            $container.addClass(MULTI_ROW_HEADER_CLASS);
          }

          that.callBase.apply(that, arguments);
        },
        _renderRows: function _renderRows() {
          var that = this;

          if (that._dataController.isLoaded() || that._hasRowElements) {
            that.callBase.apply(that, arguments);
            that._hasRowElements = true;
          }
        },
        _getRowVisibleColumns: function _getRowVisibleColumns(rowIndex) {
          return this._columnsController.getVisibleColumns(rowIndex);
        },
        _renderRow: function _renderRow($table, options) {
          options.columns = this._getRowVisibleColumns(options.row.rowIndex);
          this.callBase($table, options);
        },
        _createCell: function _createCell(options) {
          var column = options.column;
          var $cellElement = this.callBase.apply(this, arguments);
          column.rowspan > 1 && options.rowType === 'header' && $cellElement.attr('rowSpan', column.rowspan);
          return $cellElement;
        },
        _getRows: function _getRows() {
          var result = [];
          var rowCount = this.getRowCount();

          if (this.option('showColumnHeaders')) {
            for (var i = 0; i < rowCount; i++) {
              result.push({
                rowType: 'header',
                rowIndex: i
              });
            }
          }

          return result;
        },
        _getCellTemplate: function _getCellTemplate(options) {
          if (options.rowType === 'header') {
            return this._getHeaderTemplate(options.column);
          }
        },
        _columnOptionChanged: function _columnOptionChanged(e) {
          var changeTypes = e.changeTypes;
          var optionNames = e.optionNames;

          if (changeTypes.grouping) {
            this._isGroupingChanged = true;
            return;
          }

          this.callBase(e);

          if (optionNames.width || optionNames.visible) {
            this.resizeCompleted.fire();
          }
        },
        _isElementVisible: function _isElementVisible(elementOptions) {
          return elementOptions && elementOptions.visible;
        },
        _alignCaptionByCenter: function _alignCaptionByCenter($cell) {
          var $indicatorsContainer = this._getIndicatorContainer($cell, true);

          if ($indicatorsContainer && $indicatorsContainer.length) {
            $indicatorsContainer.filter('.' + VISIBILITY_HIDDEN_CLASS).remove();
            $indicatorsContainer = this._getIndicatorContainer($cell);
            $indicatorsContainer.clone().addClass(VISIBILITY_HIDDEN_CLASS).css('float', '').insertBefore($cell.children('.' + this.addWidgetPrefix(CELL_CONTENT_CLASS)));
          }
        },
        _updateCell: function _updateCell($cell, options) {
          if (options.rowType === 'header' && options.column.alignment === 'center') {
            this._alignCaptionByCenter($cell);
          }

          this.callBase.apply(this, arguments);
        },
        _updateIndicator: function _updateIndicator($cell, column, indicatorName) {
          var $indicatorElement = this.callBase.apply(this, arguments);

          if (column.alignment === 'center') {
            this._alignCaptionByCenter($cell);
          }

          addCssClassesToCellContent(this, $cell, column);
          return $indicatorElement;
        },
        _getIndicatorContainer: function _getIndicatorContainer($cell, returnAll) {
          var $indicatorsContainer = this.callBase($cell);
          return returnAll ? $indicatorsContainer : $indicatorsContainer.filter(':not(.' + VISIBILITY_HIDDEN_CLASS + ')');
        },
        _isSortableElement: function _isSortableElement() {
          return true;
        },
        getHeadersRowHeight: function getHeadersRowHeight() {
          var $tableElement = this.getTableElement();
          var $headerRows = $tableElement && $tableElement.find('.' + HEADER_ROW_CLASS);
          return $headerRows && $headerRows.toArray().reduce(function (sum, headerRow) {
            return sum + (0, _size.getHeight)(headerRow);
          }, 0) || 0;
        },
        getHeaderElement: function getHeaderElement(index) {
          var columnElements = this.getColumnElements();
          return columnElements && columnElements.eq(index);
        },
        getColumnElements: function getColumnElements(index, bandColumnIndex) {
          var that = this;
          var $cellElement;
          var columnsController = that._columnsController;
          var rowCount = that.getRowCount();

          if (that.option('showColumnHeaders')) {
            if (rowCount > 1 && (!(0, _type.isDefined)(index) || (0, _type.isDefined)(bandColumnIndex))) {
              var result = [];
              var visibleColumns = (0, _type.isDefined)(bandColumnIndex) ? columnsController.getChildrenByBandColumn(bandColumnIndex, true) : columnsController.getVisibleColumns();
              (0, _iterator.each)(visibleColumns, function (_, column) {
                var rowIndex = (0, _type.isDefined)(index) ? index : columnsController.getRowIndex(column.index);
                $cellElement = that._getCellElement(rowIndex, columnsController.getVisibleIndex(column.index, rowIndex));
                $cellElement && result.push($cellElement.get(0));
              });
              return (0, _renderer.default)(result);
            } else if (!index || index < rowCount) {
              return that.getCellElements(index || 0);
            }
          }
        },
        getColumnIndexByElement: function getColumnIndexByElement($cell) {
          var cellIndex = this.getCellIndex($cell);
          var $row = $cell.closest('.dx-row');
          var rowIndex = $row[0].rowIndex;
          var column = this.getColumns(rowIndex)[cellIndex];
          return column ? column.index : -1;
        },
        getVisibleColumnIndex: function getVisibleColumnIndex(columnIndex, rowIndex) {
          var column = this.getColumns()[columnIndex];
          return column ? this._columnsController.getVisibleIndex(column.index, rowIndex) : -1;
        },
        getColumnWidths: function getColumnWidths() {
          var $columnElements = this.getColumnElements();

          if ($columnElements && $columnElements.length) {
            return this._getWidths($columnElements);
          }

          return this.callBase.apply(this, arguments);
        },
        allowDragging: function allowDragging(column, sourceLocation, draggingPanels) {
          var i;
          var draggableColumnCount = 0;

          var rowIndex = column && this._columnsController.getRowIndex(column.index);

          var columns = this.getColumns(rowIndex === 0 ? 0 : null);
          var canHideColumn = (column === null || column === void 0 ? void 0 : column.allowHiding) && columns.length > 1;

          var allowDrag = function allowDrag(column) {
            return column.allowReordering || column.allowGrouping || column.allowHiding;
          };

          for (i = 0; i < columns.length; i++) {
            if (allowDrag(columns[i])) {
              draggableColumnCount++;
            }
          }

          if (draggableColumnCount <= 1 && !canHideColumn) {
            return false;
          } else if (!draggingPanels) {
            return (this.option('allowColumnReordering') || this._columnsController.isColumnOptionUsed('allowReordering')) && column && column.allowReordering;
          }

          for (i = 0; i < draggingPanels.length; i++) {
            var draggingPanel = draggingPanels[i];

            if (draggingPanel && draggingPanel.allowDragging(column, sourceLocation)) {
              return true;
            }
          }

          return false;
        },
        getBoundingRect: function getBoundingRect() {
          var that = this;
          var $columnElements = that.getColumnElements();

          if ($columnElements && $columnElements.length) {
            var offset = that.getTableElement().offset();
            return {
              top: offset.top
            };
          }

          return null;
        },
        getName: function getName() {
          return 'headers';
        },
        getColumnCount: function getColumnCount() {
          var $columnElements = this.getColumnElements();
          return $columnElements ? $columnElements.length : 0;
        },
        isVisible: function isVisible() {
          return this.option('showColumnHeaders');
        },
        optionChanged: function optionChanged(args) {
          var that = this;

          switch (args.name) {
            case 'showColumnHeaders':
            case 'wordWrapEnabled':
            case 'showColumnLines':
              that._invalidate(true, true);

              args.handled = true;
              break;

            default:
              that.callBase(args);
          }
        },
        getHeight: function getHeight() {
          return this.getElementHeight();
        },
        getContextMenuItems: function getContextMenuItems(options) {
          var that = this;
          var column = options.column;

          if (options.row && (options.row.rowType === 'header' || options.row.rowType === 'detailAdaptive')) {
            var sortingOptions = that.option('sorting');

            if (sortingOptions && sortingOptions.mode !== 'none' && column && column.allowSorting) {
              var onItemClick = function onItemClick(params) {
                setTimeout(function () {
                  that._columnsController.changeSortOrder(column.index, params.itemData.value);
                });
              };

              return [{
                text: sortingOptions.ascendingText,
                value: 'asc',
                disabled: column.sortOrder === 'asc',
                icon: CONTEXT_MENU_SORT_ASC_ICON,
                onItemClick: onItemClick
              }, {
                text: sortingOptions.descendingText,
                value: 'desc',
                disabled: column.sortOrder === 'desc',
                icon: CONTEXT_MENU_SORT_DESC_ICON,
                onItemClick: onItemClick
              }, {
                text: sortingOptions.clearText,
                value: 'none',
                disabled: !column.sortOrder,
                icon: CONTEXT_MENU_SORT_NONE_ICON,
                onItemClick: onItemClick
              }];
            }
          }
        },
        getRowCount: function getRowCount() {
          return this._columnsController && this._columnsController.getRowCount();
        },
        setRowsOpacity: function setRowsOpacity(columnIndex, value, rowIndex) {
          var that = this;
          var i;
          var columnElements;
          var rowCount = that.getRowCount();

          var columns = that._columnsController.getColumns();

          var column = columns && columns[columnIndex];
          var columnID = column && column.isBand && column.index;

          var setColumnOpacity = function setColumnOpacity(index, column) {
            if (column.ownerBand === columnID) {
              columnElements.eq(index).css({
                opacity: value
              });

              if (column.isBand) {
                that.setRowsOpacity(column.index, value, i + 1);
              }
            }
          };

          if ((0, _type.isDefined)(columnID)) {
            rowIndex = rowIndex || 0;

            for (i = rowIndex; i < rowCount; i++) {
              columnElements = that.getCellElements(i);
              (0, _iterator.each)(that.getColumns(i), setColumnOpacity);
            }
          }
        }
      };
    }())
  }
};
exports.columnHeadersModule = columnHeadersModule;