import { BaseModel } from './../base.model';
import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';

export class GroupFormModel extends BaseModel {
  public groupId: number;
  public countryIds: string; // For Add Request
  public countries: any; // For List Response
  public groupName: string;
  public isActive: any;
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
  public static toRequestModel(data: GroupFormModel): GroupFormModel {
    const model = new GroupFormModel();
    model.countryIds = data.countryIds;
    model.groupName = UtilHelper.setDataDefault(data.groupName);
    model.isActive = data.isActive;

    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new GroupFormModel();
    let countrystr = '';
    model.groupId = data.groupId;
    model.rid = data.rid,
    model.countries = data.countries;
    model.groupName = data.groupName;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    // Process Countries Array For List / View
    model.countries.forEach(element => {
      countrystr += element.countryName + ' (' + element.countryCode + ')<br>';
    });
    model.countryIds = countrystr;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('groupName', 'required', true, this._t('GROUP_NAME_REQUIRED'));
    this.addRule('groupName', 'groupName', true, this._t('GROUP_NAME_ALPHANUMERIC'));
    this.addRule('groupName', 'minlength', MIN_LENGTHS_VALUES.GROUP_NAME, this._t('GROUP_NAME_MIN_LENGTH'));
    this.addRule('groupName', 'required', true, this._t('GROUP_NAME_REQUIRED'));
    this.addRule('isActive', 'required', true, this._t('STATUS_REQUIRED'));
    return this.getRules();
  }
}
