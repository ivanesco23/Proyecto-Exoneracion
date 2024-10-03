import { addToStyles } from "../workspaces/utils";
export var getAppointmentStyles = item => {
  var {
    geometry: {
      height,
      left,
      top,
      width
    },
    info: {
      resourceColor
    }
  } = item;
  var result = addToStyles([{
    attr: "height",
    value: height || 50
  }, {
    attr: "width",
    value: width || 50
  }, {
    attr: "top",
    value: top
  }, {
    attr: "left",
    value: left
  }]);

  if (resourceColor) {
    result = addToStyles([{
      attr: "backgroundColor",
      value: resourceColor
    }], result);
  }

  return result;
};
export var getAppointmentKey = item => {
  var {
    geometry: {
      height,
      left,
      leftVirtualWidth,
      top,
      topVirtualHeight,
      width
    },
    info: {
      appointment: {
        endDate,
        startDate
      },
      sourceAppointment: {
        groupIndex
      }
    }
  } = item;
  var startTime = startDate.getTime();
  var endTime = endDate.getTime();
  var leftOffset = left + leftVirtualWidth;
  var topOffset = top + topVirtualHeight;
  return "".concat(groupIndex, "-").concat(startTime, "-").concat(endTime, "_").concat(leftOffset, "-").concat(topOffset, "-").concat(width, "-").concat(height);
};