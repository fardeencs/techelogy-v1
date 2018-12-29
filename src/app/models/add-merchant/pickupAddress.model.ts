import { MIN_LENGTHS_VALUES } from './../../modules/constants';
import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';

export class PickupaddressModel extends BaseModel {
  public addressLine1: string;
  public addressLine2?: string;
  public countryId: string = "";
  public stateId: string = "";
  public cityId: string = "";
  public zipcode: string;
  public warehouseId: string;
  public contactName: string;
  public contactNumber: string;
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
  public static toRequestModel(data: PickupaddressModel): PickupaddressModel {
    const model = new PickupaddressModel();
    model.contactName = UtilHelper.setDataDefault(data.contactName);
    model.contactNumber = UtilHelper.setDataDefault(data.contactNumber);
    model.addressLine1 = UtilHelper.setDataDefault(data.addressLine1);
    model.addressLine2 = UtilHelper.setDataDefault(data.addressLine2);
    model.countryId = UtilHelper.setDataDefault(data.countryId);
    model.stateId = UtilHelper.setDataDefault(data.stateId);
    model.cityId = UtilHelper.setDataDefault(data.cityId);
    model.zipcode = UtilHelper.setDataDefault(data.zipcode);
    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('contactName', 'required', true, this._t('CONTACT_NAME_REQUIRED'));
    this.addRule('contactName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('CONTACT_NAME_MIN_LENGTH'));

    this.addRule('contactNumber', 'required', true, this._t('CONTACT_NUMBER_REQUIRED'));
    this.addRule('contactNumber', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_5, this._t('CONTACT_NUMBER_MIN_LENGTH'));
    this.addRule('addressLine1', 'required', true, this._t('ADDRESS_REQUIRED'));
    this.addRule('addressLine1', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('ADDRESS_REQUIRED_MIN_LENGTH'));
    this.addRule('addressLine2', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('ADDRESS_2_REQUIRED_MIN_LENGTH'));
    this.addRule('countryId', 'required', true, this._t('COUNTRY_REQUIRED'));
    this.addRule('stateId', 'required', true, this._t('STATE_REQUIRED'));
    this.addRule('cityId', 'required', true, this._t('CITY_REQUIRED'));
    this.addRule('zipcode', 'required', true, this._t('ZIP_CODE_REQUIRED'));
    this.addRule('zipcode', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('ZIP_CODE_MIN_LENGTH'));
    return this.getRules();
  }
}
