import { BaseModel } from '../base.model';
import { ValidateModel } from '../validate.model';
import { UtilHelper } from '../../helper/util.helper';

export class UserModel extends BaseModel {
  public email: string;
  public firstname: string;
  public lastname: string;
  public role: string;
  public phoneNumber1: string;
  public phoneNumber2: string;
  // public roleName?:string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
    *
    * @param data
    * @returns {UserModel}
    */
  public static toProfileModel(data: UserModel): UserModel {
    const model = new UserModel();
    model.email = UtilHelper.setDataDefault(data.email);
    model.firstname = UtilHelper.setDataDefault(data.firstname);
    model.lastname = UtilHelper.setDataDefault(data.lastname);
    model.role = UtilHelper.setDataDefault(data.role);

    delete model.validateRules;
    return model;
  }

  /**
  *
  * @param data
  * @returns {UserModel}
  */
  public static toRequestModel(data: UserModel): UserModel {
    const model = new UserModel();
    model.email = UtilHelper.setDataDefault(data.email);
    model.firstname = UtilHelper.setDataDefault(data.firstname);
    model.lastname = UtilHelper.setDataDefault(data.lastname);
    model.phoneNumber1 = UtilHelper.setDataDefault(data.phoneNumber1);
    model.phoneNumber2 = UtilHelper.setDataDefault(data.phoneNumber2);

    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('email', 'required', true, this._t('EMAIL_REQUIRED'));
    this.addRule('email', 'email', true, this._t('INVALID_EMAIL'));
    this.addRule('firstName', 'required', true, this._t('FIRST_NAME_REQUIRED'));
    this.addRule('firstName', 'alphanumeric', true, this._t('INVALID_INPUT'));
    this.addRule('lastName', 'required', true, this._t('LAST_NAME_REQUIRED'));
    this.addRule('lastName', 'alphanumeric', true, this._t('INVALID_INPUT'));
    this.addRule('phoneNumber1', 'required', true, this._t('PHONE_NO1_REQUIRED'));
    return this.getRules();
  }
}
