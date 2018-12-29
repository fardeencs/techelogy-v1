import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';
import { MIN_LENGTHS_VALUES} from '../../modules';

export class ContactmerchantModel extends BaseModel {
  public email: string;
  public designation: string;
  public phoneNumber1: string;
  public phoneNumber2: string;
  public extensionNumber: string;
  public telephone: string;
  public contactPerson: string;
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
  public static toRequestModel(data: ContactmerchantModel): ContactmerchantModel {
    const model = new ContactmerchantModel();
    model.email = UtilHelper.setDataDefault(data.email);
    model.designation = UtilHelper.setDataDefault(data.designation);
    model.phoneNumber1 = UtilHelper.setDataDefault(data.phoneNumber1);
    model.phoneNumber2 = UtilHelper.setDataDefault(data.phoneNumber2);
    model.telephone = UtilHelper.setDataDefault(data.telephone);
    model.extensionNumber = UtilHelper.setDataDefault(data.extensionNumber);
    model.contactPerson = UtilHelper.setDataDefault(data.contactPerson);

    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('contactPerson', 'required', true, this._t('CONTACT_PERSON_REQUIRED'));
    this.addRule('contactPerson', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('CONTACT_PERSON_MIN_LENGTH'));

    this.addRule('designation', 'required', true, this._t('DESIGNATION_REQUIRED'));
    this.addRule('designation', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('DESIGNATION_MIN_LENGTH'));

    this.addRule('telephone', 'required', true, this._t('TELEPHONE_REQUIRED'));
    this.addRule('telephone', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_5, this._t('TELEPHONE_MIN_LENGTH'));

    this.addRule('extensionNumber', 'required', true, this._t('EXTENSION_REQUIRED'));
    this.addRule('extensionNumber', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('EXTENSION_MIN_LENGTH'));

    this.addRule('email', 'required', true, this._t('EMAIL_REQUIRED'));
    this.addRule('email', 'email', true, this._t('INVALID_EMAIL'));

    this.addRule('phoneNumber1', 'required', true, this._t('PHONE1_REQUIRED'));
    this.addRule('phoneNumber1', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_5, this._t('PHONE1_MIN_LENGTH'));

    this.addRule('phoneNumber2', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_5, this._t('PHONE2_MIN_LENGTH'));

    return this.getRules();
  }
}
