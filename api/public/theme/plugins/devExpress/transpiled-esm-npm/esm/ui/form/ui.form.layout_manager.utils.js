import { extend } from '../../core/utils/extend';
import { isDefined } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import { captionize } from '../../core/utils/inflector';
import { inArray } from '../../core/utils/array';
import Guid from '../../core/guid';
import { SIMPLE_ITEM_TYPE } from './constants';
var EDITORS_WITH_ARRAY_VALUE = ['dxTagBox', 'dxRangeSlider'];
export function convertToRenderFieldItemOptions(_ref) {
  var {
    $parent,
    rootElementCssClassList,
    parentComponent,
    createComponentCallback,
    useFlexLayout,
    item,
    template,
    name,
    formLabelLocation,
    requiredMessageTemplate,
    validationGroup,
    editorValue,
    canAssignUndefinedValueToEditor,
    editorValidationBoundary,
    editorStylingMode,
    showColonAfterLabel,
    managerLabelLocation,
    itemId,
    managerMarkOptions,
    labelMode
  } = _ref;
  var isRequired = isDefined(item.isRequired) ? item.isRequired : !!_hasRequiredRuleInSet(item.validationRules);
  var isSimpleItem = item.itemType === SIMPLE_ITEM_TYPE;
  var helpID = item.helpText ? 'dx-' + new Guid() : null;
  var helpText = item.helpText;

  var labelOptions = _convertToLabelOptions({
    item,
    id: itemId,
    isRequired,
    managerMarkOptions,
    showColonAfterLabel,
    labelLocation: managerLabelLocation
  });

  var isOutsideLabelMode = labelMode === 'outside';
  var needRenderLabel = labelOptions.visible && labelOptions.text && isOutsideLabelMode;
  var {
    location: labelLocation,
    labelID
  } = labelOptions;
  var labelNeedBaselineAlign = labelLocation !== 'top' && (!!item.helpText && !useFlexLayout || inArray(item.editorType, ['dxTextArea', 'dxRadioGroup', 'dxCalendar', 'dxHtmlEditor']) !== -1);
  return {
    $parent,
    rootElementCssClassList,
    parentComponent,
    createComponentCallback,
    useFlexLayout,
    labelOptions,
    labelNeedBaselineAlign,
    labelLocation,
    needRenderLabel,
    item,
    isSimpleItem,
    isRequired,
    template,
    helpID,
    labelID,
    name,
    helpText,
    formLabelLocation,
    requiredMessageTemplate,
    validationGroup,
    editorOptions: _convertToEditorOptions({
      editorType: item.editorType,
      editorValue,
      defaultEditorName: item.dataField,
      canAssignUndefinedValueToEditor,
      externalEditorOptions: item.editorOptions,
      editorInputId: itemId,
      editorValidationBoundary,
      editorStylingMode,
      labelMode: isOutsideLabelMode ? 'hidden' : labelMode,
      labelText: isOutsideLabelMode ? undefined : labelOptions.text,
      labelMark: getLabelMarkText(labelOptions.markOptions)
    })
  };
}
export function getLabelMarkText(_ref2) {
  var {
    showRequiredMark,
    requiredMark,
    showOptionalMark,
    optionalMark
  } = _ref2;

  if (!showRequiredMark && !showOptionalMark) {
    return '';
  }

  return String.fromCharCode(160) + (showRequiredMark ? requiredMark : optionalMark);
}
export function convertToLabelMarkOptions(_ref3, isRequired) {
  var {
    showRequiredMark,
    requiredMark,
    showOptionalMark,
    optionalMark
  } = _ref3;
  return {
    showRequiredMark: showRequiredMark && isRequired,
    requiredMark,
    showOptionalMark: showOptionalMark && !isRequired,
    optionalMark
  };
}

function _convertToEditorOptions(_ref4) {
  var {
    editorType,
    defaultEditorName,
    editorValue,
    canAssignUndefinedValueToEditor,
    externalEditorOptions,
    editorInputId,
    editorValidationBoundary,
    editorStylingMode,
    labelMode,
    labelText,
    labelMark
  } = _ref4;
  var editorOptionsWithValue = {};

  if (editorValue !== undefined || canAssignUndefinedValueToEditor) {
    editorOptionsWithValue.value = editorValue;
  }

  if (EDITORS_WITH_ARRAY_VALUE.indexOf(editorType) !== -1) {
    editorOptionsWithValue.value = editorOptionsWithValue.value || [];
  }

  var result = extend(true, editorOptionsWithValue, externalEditorOptions, {
    inputAttr: {
      id: editorInputId
    },
    validationBoundary: editorValidationBoundary,
    stylingMode: editorStylingMode,
    label: labelText,
    labelMode: labelMode,
    labelMark
  });

  if (externalEditorOptions) {
    if (result.dataSource) {
      result.dataSource = externalEditorOptions.dataSource;
    }

    if (result.items) {
      result.items = externalEditorOptions.items;
    }
  }

  if (defaultEditorName && !result.name) {
    result.name = defaultEditorName;
  }

  return result;
}

function _hasRequiredRuleInSet(rules) {
  var hasRequiredRule;

  if (rules && rules.length) {
    each(rules, function (index, rule) {
      if (rule.type === 'required') {
        hasRequiredRule = true;
        return false;
      }
    });
  }

  return hasRequiredRule;
}

function _convertToLabelOptions(_ref5) {
  var {
    item,
    id,
    isRequired,
    managerMarkOptions,
    showColonAfterLabel,
    labelLocation
  } = _ref5;
  var labelOptions = extend({
    showColon: showColonAfterLabel,
    location: labelLocation,
    id: id,
    visible: true,
    isRequired: isRequired
  }, item ? item.label : {}, {
    markOptions: convertToLabelMarkOptions(managerMarkOptions, isRequired)
  });
  var editorsRequiringIdForLabel = ['dxRadioGroup', 'dxCheckBox', 'dxLookup', 'dxSlider', 'dxRangeSlider', 'dxSwitch', 'dxHtmlEditor']; // TODO: support "dxCalendar"

  if (inArray(item.editorType, editorsRequiringIdForLabel) !== -1) {
    labelOptions.labelID = "dx-label-".concat(new Guid());
  }

  if (!labelOptions.text && item.dataField) {
    labelOptions.text = captionize(item.dataField);
  }

  if (labelOptions.text) {
    labelOptions.text += labelOptions.showColon ? ':' : '';
  }

  return labelOptions;
}