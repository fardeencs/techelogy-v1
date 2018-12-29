import { ValidateModel } from '../validate.model';
import { BaseModel } from '../base.model';
import { UtilHelper } from '../../helper/util.helper';

export class AddUserModel extends BaseModel {
  public userId: number;
  public email: string;
  public firstname: string;
  public lastname: string;
  public roleId: string;
  public status: number;
  public data?: string;
  public roleName: string;
  public createdByName: string;
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
  public static toAddUserModel(data: AddUserModel): AddUserModel {
    const model = new AddUserModel();
    model.email = UtilHelper.setDataDefault(data.email);
    model.firstname = UtilHelper.setDataDefault(data.firstname);
    model.lastname = UtilHelper.setDataDefault(data.lastname);
    model.status = UtilHelper.setDataDefault(data.status);
    model.roleId = UtilHelper.setDataDefault(data.roleId);

    delete model.validateRules;
    return model;
  }

  /**
  *
  * @param data
  * @returns {AddUserModel}
  */
  public static toRequestModel(data: AddUserModel): AddUserModel {
    const model = new AddUserModel();
    model.email = UtilHelper.setDataDefault(data.email);
    model.firstname = UtilHelper.setDataDefault(data.firstname);
    model.lastname = UtilHelper.setDataDefault(data.lastname);
    model.status = UtilHelper.setDataDefault(data.status);
    model.roleId = UtilHelper.setDataDefault(data.roleId);
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
    this.addRule('roleId', 'required', true, this._t('ROLE_REQUIRED'));
    this.addRule('status', 'required', true, this._t('STATUS_REQUIRED'));
    return this.getRules();
  }
}
