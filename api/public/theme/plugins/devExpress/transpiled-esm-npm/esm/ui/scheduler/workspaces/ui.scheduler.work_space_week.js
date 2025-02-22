import registerComponent from '../../../core/component_registrator';
import { VIEWS } from '../constants';
import SchedulerWorkSpaceVertical from './ui.scheduler.work_space_vertical';
import { calculateViewStartDate } from '../../../renovation/ui/scheduler/view_model/to_test/views/utils/week';
var WEEK_CLASS = 'dx-scheduler-work-space-week';

class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
  get type() {
    return VIEWS.WEEK;
  }

  _getElementClass() {
    return WEEK_CLASS;
  }

  _calculateViewStartDate() {
    return calculateViewStartDate(this.option('startDate'), this._firstDayOfWeek());
  }

  _isApplyCompactAppointmentOffset() {
    if (this.invoke('isAdaptive') && this.invoke('getMaxAppointmentCountPerCellByType') === 0) {
      return false;
    }

    return super._isApplyCompactAppointmentOffset();
  }

}

registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek);
export default SchedulerWorkSpaceWeek;