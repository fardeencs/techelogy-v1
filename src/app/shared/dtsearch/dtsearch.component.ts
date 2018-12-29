import { Component, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import * as Constant from '../../modules/constants';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'dt-search',
  templateUrl: './dtsearch.component.html',
})
export class DTSearchComponent implements OnChanges {

  @Input() collapse = false;
  @Input() options: Array<Object>;
  @Output() onDTSearch: EventEmitter<any> = new EventEmitter();
  public selectedValues: string;

  // DatePicker
  colorTheme = 'theme-red';
  bsConfig: Partial<BsDatepickerConfig>;
  // constructor
  constructor() {
    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme,
      dateInputFormat: Constant.MOMENT_DATE_FORMAT.DD_MM_YYYY,
      showWeekNumbers: false
    });
  }

  /**
   * on change event
   */
  ngOnChanges(changes: SimpleChanges) {
    const options = changes['options'] || [];
    if (options) {
      if (options['currentValue'] !== options['previousValue']) {
        setTimeout(() => {
          this.options = options['currentValue'];
        }, 0);
        this.setDefaultValue();
      }
    }
  }

  /**
   * search button handler
   */
  onSearch() {
    const searchObj = {};
    _.each(this.options, (val, key) => {
      let k: string = (val['fieldName']);
      let v = '';
      if (val['type'] === 'datepicker') {
        v = val['fieldValue'] ? moment(val['fieldValue']).format(val['format']) : '';
      } else if (val['type'] === 'multipleKeyValueDropdown') {
        v = this.selectedValues ? this.selectedValues : '';
      } else {
        v = val['fieldValue'] ? val['fieldValue'] : '';
      }
      searchObj[k] = v;
    });
    this.onDTSearch.emit(searchObj);
  }

  /**
  ** clear button handler
  */
  onClear() {
    const searchObj = {};
    _.each(this.options, function (val, key) {
      let k: string = val['fieldName'];
      if (k === 'merchantStatus') {
        k = 'approvalStatus';
      }
      searchObj[k] = '';
      val['fieldValue'] = '';
    });
    this.onDTSearch.emit(searchObj);
  }

  setDefaultValue() {
    _.each(this.options, function (val, key) {
      val['fieldValue'] = val['defaultValue'];
    });
  }

  onMultipleValueChange (selectedArr) {
    this.selectedValues = (_.map(selectedArr, 'value')).toString();
  }
}
