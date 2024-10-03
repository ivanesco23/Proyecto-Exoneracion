import { isDefined } from '../../core/utils/type';
import { ModelProvider } from './modelProvider';
import { TimeZoneCalculator } from '../../renovation/ui/scheduler/timeZoneCalculator/utils';
import timeZoneUtils from './utils.timeZone';
var Names = {
  timeZoneCalculator: 'timeZoneCalculator',
  appointmentDataProvider: 'appointmentDataProvider',
  model: 'model',
  modelProvider: 'modelProvider'
};
var factoryInstances = {};
var tailIndex = -1;
export var generateKey = key => {
  return isDefined(key) ? key : ++tailIndex;
};
export var createFactoryInstances = options => {
  var key = generateKey(options.key);
  createModelProvider(key, options.model);
  createTimeZoneCalculator(key, options.timeZone);
  return key;
};
export var createInstance = (name, key, callback) => {
  if (!isDefined(factoryInstances[name])) {
    factoryInstances[name] = {};
  }

  var result = callback();
  factoryInstances[name][key] = result;
  return result;
};

var getInstance = (name, key) => {
  return factoryInstances[name] ? factoryInstances[name][key] : undefined;
};

var removeInstance = (name, key) => {
  if (getInstance(name, key)) {
    factoryInstances[name] = null;
  }
};

var createTimeZoneCalculator = (key, currentTimeZone) => {
  return createInstance(Names.timeZoneCalculator, key, () => {
    return new TimeZoneCalculator({
      getClientOffset: date => timeZoneUtils.getClientTimezoneOffset(date),
      getCommonOffset: (date, timeZone) => timeZoneUtils.calculateTimezoneByValue(timeZone || currentTimeZone, date),
      getAppointmentOffset: (date, appointmentTimezone) => timeZoneUtils.calculateTimezoneByValue(appointmentTimezone, date)
    });
  });
};

export var createModelProvider = (key, model) => {
  return createInstance(Names.modelProvider, key, () => {
    var modelProvider = getInstance(Names.modelProvider, key);
    return isDefined(modelProvider) ? modelProvider : new ModelProvider(model);
  });
};
export var disposeFactoryInstances = key => {
  Object.getOwnPropertyNames(Names).forEach(name => {
    removeInstance(name, key);
  });
};
export var getTimeZoneCalculator = key => getInstance(Names.timeZoneCalculator, key);
export var getModelProvider = key => getInstance(Names.modelProvider, key);