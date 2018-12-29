import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';
import { MIN_LENGTHS_VALUES} from '../../modules';

export class ContactFinanceModel extends BaseModel {
  public email: string;
  public contactDesignation: string;
  public mobileNumber1: string;
  public mobileNumber2: string;
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
  public static toRequestModel(data: ContactFinanceModel): ContactFinanceModel {
    const model = new ContactFinanceModel();
    model.email = UtilHelper.setDataDefault(data.email);
    model.contactPerson = UtilHelper.setDataDefault(data.contactPerson);
    model.contactDesignation = UtilHelper.setDataDefault(data.contactDesignation);
    model.mobileNumber1 = UtilHelper.setDataDefault(data.mobileNumber1);
    model.mobileNumber2 = UtilHelper.setDataDefault(data.mobileNumber2);
    model.telephone = UtilHelper.setDataDefault(data.telephone);
    model.extensionNumber = UtilHelper.setDataDefault(data.extensionNumber);


    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {

    this.addRule('contactPerson', 'required', true, this._t('CONTACT_PERSON_REQUIRED'));
    this.addRule('contactPerson', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('CONTACT_PERSON_MIN_LENGTH'));

    this.addRule('contactDesignation', 'required', true, this._t('CONTACT_DESIGNATION_REQUIRED'));
    this.addRule('contactDesignation', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('CONTACT_DESIGNATION_MIN_LENGTH'));

    this.addRule('telephone', 'required', true, this._t('TELEPHONE_REQUIRED'));
    this.addRule('telephone', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_5, this._t('TELEPHONE_MIN_LENGTH'));

    this.addRule('extensionNumber', 'required', true, this._t('EXTENSION_REQUIRED'));
    this.addRule('extensionNumber', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('EXTENSION_MIN_LENGTH'));

    this.addRule('email', 'required', true, this._t('EMAIL_REQUIRED'));
    this.addRule('email', 'email', true, this._t('INVALID_EMAIL'));

    this.addRule('mobileNumber1', 'required', true, this._t('MOBILE1_REQUIRED'));
    this.addRule('mobileNumber1', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_5, this._t('MOBILE1_MIN_LENGTH'));

    this.addRule('mobileNumber2', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_5, this._t('MOBILE2_MIN_LENGTH'));


    return this.getRules();
  }
}
