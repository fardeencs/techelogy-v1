import { MIN_LENGTHS_VALUES } from './../../modules/constants';
import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';

export class AuthsignatureModel extends BaseModel {
  public createdAt: string;
  public applicantName: number;
  public storeId?: number;
  public designtaion?: string;
  public applicantSignature = '';
  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
  *
  * @param data
  * @returns {ContactmerchantModel}
  */
  public static toRequestModel(data: AuthsignatureModel): AuthsignatureModel {
    const model = new AuthsignatureModel();
    model.createdAt = UtilHelper.setDataDefault(data.createdAt);
    model.applicantName = UtilHelper.setDataDefault(data.applicantName);
    model.designtaion = UtilHelper.setDataDefault(data.designtaion);
    model.applicantSignature = UtilHelper.setDataDefault(data.applicantSignature);
    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('applicantName', 'required', true, this._t('APPLICANT_REQUIRED'));
    this.addRule('applicantName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('APPLICANT_MIN_LENGTH'));
    this.addRule('designtaion', 'required', true, this._t('DESIGNATION_REQUIRED'));
    this.addRule('designtaion', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('DESIGNATION_MIN_LENGTH'));
   // this.addRule('applicantSignature', 'required', true, this._t('AUTHORIZED_SIGNATURE_IMAGE'));
    
    return this.getRules();
  }
}
