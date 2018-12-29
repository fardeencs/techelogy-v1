import { BaseModel } from './../base.model';
import { ValidateModel } from './../validate.model';

export class LoginFormModel extends BaseModel {
  public email: string;
  public password: boolean;
  public platform = 1;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }
  public initValidateRules(): ValidateModel {
    this.addRule('email', 'required', true, this._t('EMAIL_REQUIRED'));
    this.addRule('password', 'required', true, this._t('PASSWORD_REQUIRED'));
    this.addRule('email', 'email', true, this._t('INVALID_EMAIL'));
    return this.getRules();
  }
}
