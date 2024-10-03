import _extends from "@babel/runtime/helpers/esm/extends";
var VIEW_SWITCHER_CLASS = "dx-scheduler-view-switcher";
var VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS = "dx-scheduler-view-switcher-dropdown-button";
var VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT_CLASS = "dx-scheduler-view-switcher-dropdown-button-content";
export var getViewSwitcher = (item, selectedView, views, setCurrentView) => _extends({
  widget: "dxButtonGroup",
  locateInMenu: "auto",
  cssClass: VIEW_SWITCHER_CLASS,
  options: {
    items: views,
    keyExpr: "name",
    selectedItemKeys: [selectedView],
    stylingMode: "contained",
    onItemClick: e => {
      setCurrentView(e.itemData);
    }
  }
}, item);
export var getDropDownViewSwitcher = (item, selectedView, views, setCurrentView) => _extends({
  widget: "dxDropDownButton",
  locateInMenu: "never",
  cssClass: VIEW_SWITCHER_CLASS,
  options: {
    items: views,
    useSelectMode: true,
    keyExpr: "name",
    selectedItemKey: selectedView,
    displayExpr: "text",
    elementAttr: {
      class: VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS
    },
    onItemClick: e => {
      setCurrentView(e.itemData);
    },
    dropDownOptions: {
      width: "max-content",
      wrapperAttr: {
        class: VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT_CLASS
      }
    }
  }
}, item);