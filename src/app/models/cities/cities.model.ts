import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormBaseModel } from '../reactive.form.base.model';
import { ReactiveFormValidateModel } from '../reactive.form.validate.model';

export class CitiesFormModel extends ReactiveFormBaseModel {
  public cityId: number;
  public cityName: string;
  public stateId: number;
  public stateName: string;
  public countryName: string;
  public isActive: string;
  public isActiveKey: string;
  public rid: string;
  public createdDate: string;
  public updatedDate: string;
  public citiesFormGroup : FormGroup;

  constructor() {
    super();
    this.validateRules = new ReactiveFormValidateModel();
    this.initValidateRules();
  }

  /**
  *
  * @param data
  * @returns {CitiesFormModel}
  */
  public static toRequestModel(data: CitiesFormModel): CitiesFormModel {
    const model = new CitiesFormModel();
    model.cityName = UtilHelper.setDataDefault(data.cityName);
    model.stateId = UtilHelper.setDataDefault(data.stateId);
    model.stateName = UtilHelper.setDataDefault(data.stateName);
    model.countryName = UtilHelper.setDataDefault(data.countryName);
    model.isActive = data.isActive;

    delete model.validateRules;
    delete model.citiesFormGroup;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new CitiesFormModel();
    model.rid = data.rid;
    model.cityId = data.cityId
    model.cityName = data.cityName;
    model.stateId = data.stateId;
    model.stateName = data.stateName;
    model.countryName = data.countryName;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    
    delete model.validateRules;
    delete model.citiesFormGroup;
    return model;
  }

  static toFormModel(data : CitiesFormModel) {
    const model = new CitiesFormModel();
    model.cityName = UtilHelper.setDataDefault(data.cityName);
    model.stateId = UtilHelper.setDataDefault(data.stateId);
    model.countryName = UtilHelper.setDataDefault(data.countryName);
    model.isActive = UtilHelper.setDataDefault(data.isActive, "1");

    delete model.validateRules;
    delete model.citiesFormGroup;
    return model;
  }

  public validateAllFields(){
    Object.keys(this.citiesFormGroup.controls).forEach(field => {
      const control = this.citiesFormGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  public initValidateRules() {
    this.addRule('countryName', 'required', Validators.required, 'SELECT_COUNTRY');
    this.addRule('stateId', 'required', Validators.required, 'STATE_REQUIRED');
    this.addRule('cityName', 'required', Validators.required, 'CITY_NAME_REQUIRED');
    this.addRule('cityName', 'countryName', ReactiveFormValidateModel.countryName, 'CITY_NAME_ALPHANUMERIC');
    this.addRule('cityName', 'minlength', Validators.minLength(MIN_LENGTHS_VALUES.CITY_NAME), 'CITY_NAME_LENGTH');
    this.addRule('isActive', 'required', Validators.required, 'STATUS_REQUIRED');
    this.citiesFormGroup = this.getFormGroup();
  }
}
