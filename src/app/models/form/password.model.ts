import { BaseModel } from './../base.model';
import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';

export class PasswordFormModel extends BaseModel {
  public oldPassword: string;
  public newPassword: string;
  public confirmPassword: string;

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
 public static toRequestModel(data: PasswordFormModel): PasswordFormModel {
  const model = new PasswordFormModel();
  model.oldPassword = UtilHelper.setDataDefault(data.oldPassword);
  model.newPassword = UtilHelper.setDataDefault(data.newPassword);

  delete model.validateRules;
  return model;
}

  public initValidateRules(): ValidateModel {
    this.addRule('oldPassword', 'required', true, this._t('OLD_PASSWORD_REQUIRED'));
    this.addRule('newPassword', 'required', true, this._t('PASSWORD_REQUIRED'));
    this.addRule('newPassword', 'passwordPolicy', true, this._t('PASSWORD_POLICY'));
    this.addRule('confirmPassword', 'required', true, this._t('CONFIRM_PASSWORD_REQUIRED'));
    this.addRule('confirmPassword', 'equalTo', '#newPassword', this._t('PASSWORD_CONFIRM_PASSWORD_SAME'));
    return this.getRules();
  }
}
