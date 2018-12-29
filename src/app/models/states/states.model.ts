import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormBaseModel } from '../reactive.form.base.model';
import { ReactiveFormValidateModel } from '../reactive.form.validate.model';


export class States extends ReactiveFormBaseModel {
  public countryId: string;
  public stateName: string;
  public isActive: string;
  public rid: string;
  public stateId?: number;
  public isActiveKey: string;
  public countryName: string;
  public formGroup : FormGroup;

  constructor() {
    super();
    this.validateRules = new ReactiveFormValidateModel();
    this.initValidateRules();
  }

  /**
  *
  * @param data
  * @returns {States}
  */
  public static toRequestModel(data: States): States {
    const model = new States();
    model.stateName = data.stateName;
    model.stateId = data.stateId;
    model.countryId = data.countryId;
    model.isActive = data.isActive;

    delete model.validateRules;
    delete model.formGroup;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new States();
    model.rid = data.rid,
    model.countryId = data.countryId;
    model.stateName = data.stateName;
    model.stateId = data.stateId;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    model.countryName = data.countryName;
    
    delete model.validateRules;
    delete model.formGroup;
    return model;
  }

  static toFormModel(data : States) {
    
    const model = new States();
    model.countryId = UtilHelper.setDataDefault(data.countryId);
    model.stateName = UtilHelper.setDataDefault(data.stateName);
    model.isActive = UtilHelper.setDataDefault(data.isActive, "1");

    delete model.validateRules;
    delete model.formGroup;
    return model;
  }


  public initValidateRules() {
    this.addRule('countryId', 'required', Validators.required, 'SELECT_COUNTRY');
    this.addRule('stateName', 'required', Validators.required, 'STATE_NAME_REQUIRED');
    this.addRule('stateName', 'countryName', ReactiveFormValidateModel.countryName, 'STATE_NAME_ALPHANUMERIC');
    this.addRule('stateName', 'minlength', Validators.minLength(MIN_LENGTHS_VALUES.CITY_NAME), 'STATE_NAME_LENGTH');
    this.addRule('isActive', 'required', Validators.required, 'STATUS_REQUIRED');
    this.formGroup = this.getFormGroup();
  }
}
