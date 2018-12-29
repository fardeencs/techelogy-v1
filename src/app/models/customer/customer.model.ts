import { BaseModel } from '../base.model';
import { ValidateModel } from '../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';

export class CustomerFormModel extends BaseModel {
  public entityId : number;
  public firstname: string;
  public lastname: string;
  public email: string;
  public signUpPlatform :number;
  public signUpMethod : number;
  public kycDocument : string;
  public upload : string;
  public createdBy : string;
  public isActive: number;
  public isActiveKey: string;
  public rid: string;
  public kycDocumentName : string;
  public referralCode : string;
  public referalCode : string;
  public createdByName : string;
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
  * @returns {CustomerFormModel}
  */
  public static toRequestModel(data: CustomerFormModel): CustomerFormModel {
    const model = new CustomerFormModel();
    model.firstname = data.firstname;
    model.lastname = data.lastname;
    model.email = data.email;
    model.referralCode = data.referralCode;
    model.isActive = data.isActive;
    model.kycDocument = data.upload ? UtilHelper.setDataDefault(data.upload) : "";
    model.signUpMethod = data.signUpMethod;
    model.signUpPlatform = data.signUpPlatform;
    model.createdBy = data.createdBy;
    model.referalCode = data.referalCode;
    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new CustomerFormModel();
    model.rid = data.rid,
    model.entityId = data.entityId;
    model.firstname = data.firstname;
    model.lastname = data.lastname;
    model.email = data.email;
    model.kycDocument = data.kycDocument;
    model.referralCode = data.referralCode;
    model.signUpMethod = data.signUpMethod;
    model.referalCode = data.referalCode;
    model.signUpPlatform = data.signUpPlatform;
    model.kycDocumentName = data.kycDocumentName;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    model.createdByName = data.createdByName;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('email', 'required', true, this._t('EMAIL_REQUIRED'));
    this.addRule('email', 'formatEmail', true, this._t('INVALID_EMAIL'));
    this.addRule('firstname', 'required', true, this._t('FIRST_NAME_REQUIRED'));
    this.addRule('firstname', 'alphanumericOnly', true, this._t('FIRST_NAME_MUST_CONTAIN'));
    this.addRule('firstname', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('FIRST_NAME_MIN_LENGTH'));
    this.addRule('lastname', 'required', true, this._t('LAST_NAME_REQUIRED'));
    this.addRule('lastname', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('LAST_NAME_MIN_LENGTH'));
    this.addRule('lastname', 'alphanumericOnly', true, this._t('LAST_NAME_MUST_CONTAIN'));  
    this.addRule('referalCode', 'alphanumericOnly', true, this._t('CUSTOMER_REFERRAL_CODE')); 
    this.addRule('referalCode', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('CUSTOMER_REFERRAL_CODE_MIN_LENGTH')); 
    this.addRule('platform', 'required', true, this._t('PLATFORM_REQUIRED'));  
    this.addRule('isActive', 'required', true, this._t('STATUS_REQUIRED'));
    return this.getRules();
  }
}
