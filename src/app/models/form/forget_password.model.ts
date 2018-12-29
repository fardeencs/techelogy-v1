import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { BaseModel } from '../base.model';

export class ForgotPasswordFormModel extends BaseModel {
    public email: string;

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
 public static toRequestModel(data: ForgotPasswordFormModel): ForgotPasswordFormModel {
  const model = new ForgotPasswordFormModel();
  model.email = UtilHelper.setDataDefault(data.email);

  delete model.validateRules;
  return model;
}

  /**
  * init validate rule
  * @returns {ValidateModel}
  */
    public initValidateRules(): ValidateModel {
        this.addRule('email', 'required', true, this._t('EMAIL_REQUIRED'));
        this.addRule('email', 'email', true, this._t('INVALID_EMAIL'));
        return this.getRules();
    }

}
