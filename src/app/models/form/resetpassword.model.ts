import { BaseModel } from './../base.model';
import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';

export class ResetPasswordFormModel extends BaseModel {
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
 public static toRequestModel(data: ResetPasswordFormModel): ResetPasswordFormModel {
  const model = new ResetPasswordFormModel();
  model.newPassword = UtilHelper.setDataDefault(data.newPassword);

  delete model.validateRules;
  return model;
}

  public initValidateRules(): ValidateModel {
    this.addRule('newPassword', 'required', true, this._t('PASSWORD_REQUIRED'));
    this.addRule('newPassword', 'passwordPolicy', true, this._t('PASSWORD_POLICY'));
    this.addRule('confirmPassword', 'required', true, this._t('CONFIRM_PASSWORD_REQUIRED'));
    this.addRule('confirmPassword', 'equalTo', '#newPassword', this._t('PASSWORD_CONFIRM_PASSWORD_SAME'));
    return this.getRules();
  }
}
