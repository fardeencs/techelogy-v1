import { BaseModel } from './../base.model';
import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';

export class CountryFormModel extends BaseModel {
  public countryId: number;
  public countryCode: string;
  public countryName: string;
  public isActive: string;
  public isActiveKey: string;
  public rid: string;
  public createdDate: string;
  public updatedDate: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }


  /**
  *
  * @param data
  * @returns {CountryFormModel}
  */
  public static toRequestModel(data: CountryFormModel): CountryFormModel {
    const model = new CountryFormModel();
    model.countryCode = UtilHelper.setDataDefault(data.countryCode.toUpperCase());
    model.countryName = UtilHelper.setDataDefault(data.countryName);
    model.isActive = data.isActive;

    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new CountryFormModel();
    model.rid = data.rid,
    model.countryId = data.countryId;
    model.countryCode = data.countryCode;
    model.countryName = data.countryName;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('countryCode', 'required', true, this._t('COUNTRY_CODE_REQUIRED'));
    this.addRule('countryCode', 'alphabets', true, this._t('COUNTRY_CODE_ALPHANUMERIC'));
    this.addRule('countryCode', 'minlength', MIN_LENGTHS_VALUES.COUNTRY_CODE, this._t('COUNTRY_CODE_MIN_LENGTH'));
    this.addRule('countryName', 'required', true, this._t('COUNTRY_NAME_REQUIRED'));
    this.addRule('countryName', 'minlength', MIN_LENGTHS_VALUES.COUNTRY_NAME, this._t('COUNTRY_NAME_MIN_LENGTH'));
    this.addRule('countryName', 'countryName', true, this._t('COUNTRY_NAME_ALPHANUMERIC'));    
    this.addRule('isActive', 'required', true, this._t('STATUS_REQUIRED'));
    return this.getRules();
  }
}
