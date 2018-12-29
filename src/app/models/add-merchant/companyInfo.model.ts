import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';
import { MIN_LENGTHS_VALUES} from '../../modules';

export class CompanyinfoModel extends BaseModel {
  public businessLegalName: string;
  public companyNumber: string;
  public mobileNumber: string;
  public storeName: string;
  public natureOfBusiness: string;
  public annualTurnover: number= 0;
  public addressLine1: string;
  public addressLine2: string;
  public countryId: string;
  public state: string = "";
  public city: string = "";
  public zipcode: string;
  public websiteUrl: string;
  public storeId?: number;
  public merchantRepresentativeName: string;
  public email: string;
  public sellInOtherWebsite = '0';
  public otherWebsiteUrl: string;
  public firstname?: string;
  public lastname?: string;
  public salesPersonName?: string;
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
  public static toRequestModel(data: CompanyinfoModel): CompanyinfoModel {
    const model = new CompanyinfoModel();
    model.businessLegalName = UtilHelper.setDataDefault(data.businessLegalName);
    model.companyNumber = UtilHelper.setDataDefault(data.companyNumber);
    model.mobileNumber = UtilHelper.setDataDefault(data.mobileNumber);
    model.storeName = UtilHelper.setDataDefault(data.storeName);
    model.email = UtilHelper.setDataDefault(data.email);
    model.natureOfBusiness = UtilHelper.setDataDefault(data.natureOfBusiness);
    model.annualTurnover = UtilHelper.setDataDefault(data.annualTurnover);
    model.addressLine1 = UtilHelper.setDataDefault(data.addressLine1);
    model.addressLine2 = UtilHelper.setDataDefault(data.addressLine2);
    model.countryId = UtilHelper.setDataDefault(data.countryId);
    model.state = UtilHelper.setDataDefault(data.state);
    model.city = UtilHelper.setDataDefault(data.city);
    model.zipcode = UtilHelper.setDataDefault(data.zipcode);
    model.websiteUrl = UtilHelper.setDataDefault(data.websiteUrl);
    model.sellInOtherWebsite = UtilHelper.setDataDefault(data.sellInOtherWebsite);
    model.otherWebsiteUrl = UtilHelper.setDataDefault(data.otherWebsiteUrl);
    model.merchantRepresentativeName = UtilHelper.setDataDefault(data.merchantRepresentativeName);
    model.firstname = UtilHelper.setDataDefault(data.firstname);
    model.lastname = UtilHelper.setDataDefault(data.lastname);
    model.salesPersonName = UtilHelper.setDataDefault(data.salesPersonName);

    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {

    this.addRule('businessLegalName', 'required', true, this._t('LEGAL_NAME_REQUIRED'));
    this.addRule('businessLegalName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('LEGAL_NAME_MIN_LENGTH'));

    this.addRule('companyNumber', 'required', true, this._t('COMPANY_NAME_REQUIRED'));
    this.addRule('companyNumber', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('COMPANY_NAME_MIN_LENGTH'));

    this.addRule('merchantRepresentativeName', 'required', true, this._t('REPRESENTATIVE_NAME_REQUIRED'));
    this.addRule('merchantRepresentativeName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('REPRESENTATIVE_NAME_MIN_LENGTH'));

    this.addRule('mobileNumber', 'required', true, this._t('MOBILE_NO_REQUIRED'));
    this.addRule('mobileNumber', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_5, this._t('MOBILE_NO_MIN_LENGTH'));

    this.addRule('storeName', 'required', true, this._t('STORE_NAME_REQUIRED'));
    this.addRule('storeName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('STORE_NAME_MIN_LENGTH'));

    this.addRule('email', 'required', true, this._t('STORE_LOGIN_EMAIL_REQUIRED'));
    this.addRule('email', 'email', true, this._t('INVALID_EMAIL'));

    this.addRule('natureOfBusiness', 'required', true, this._t('NATURE_OF_BUSSINNESS_REQUIRED'));
    this.addRule('natureOfBusiness', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('NATURE_OF_BUSSINNESS_MIN_LENGTH'));

    this.addRule('addressLine1', 'required', true, this._t('ADDRESS_REQUIRED'));
    this.addRule('addressLine1', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('ADDRESS_REQUIRED_MIN_LENGTH'));

    this.addRule('addressLine2', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('ADDRESS_2_REQUIRED_MIN_LENGTH'));

    this.addRule('countryId', 'required', true, this._t('COUNTRY_REQUIRED'));
    this.addRule('state', 'required', true, this._t('STATE_REQUIRED'));
    this.addRule('city', 'required', true, this._t('CITY_REQUIRED'));

    this.addRule('zipcode', 'required', true, this._t('ZIP_CODE_REQUIRED'));
    this.addRule('zipcode', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('ZIP_CODE_MIN_LENGTH'));

    this.addRule('websiteUrl', 'validate-url', true, this._t('INVALID_WEBSITE_ADDRESS'));

    this.addRule('sellInOtherWebsite', 'required', true, this._t('SELL_SELECT_OTHER_WEBSITE_REQUIRED'));
    this.addRule('otherWebsiteUrl', 'required', true, this._t('VALID_WEBSITE_REQUIRED'));
    this.addRule('otherWebsiteUrl', 'validate-url', true, this._t('INVALID_WEBSITE_ADDRESS'));
    return this.getRules();
  }
}
