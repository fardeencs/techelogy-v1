import { MIN_LENGTHS_VALUES } from './../../modules/constants';
import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';

export class FinanceinfoModel extends BaseModel {
  public bankName: string;
  public branchName: string;
  public accountNumber: string;
  public routing: string;
  public bankAddress: string;
  public swiftCode: string;
  public paypal?: string;
  public companyName: string;
  public taxState: string;
  public taxNumber: string;
  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
  *
  * @param data
  * @returns {FinanceinfoModel}
  */
  public static toRequestModel(data: FinanceinfoModel): FinanceinfoModel {
    const model = new FinanceinfoModel();
    model.bankName = UtilHelper.setDataDefault(data.bankName);
    model.accountNumber = UtilHelper.setDataDefault(data.accountNumber);
    model.routing = UtilHelper.setDataDefault(data.routing);
    model.bankAddress = UtilHelper.setDataDefault(data.bankAddress);
    model.swiftCode = UtilHelper.setDataDefault(data.swiftCode);
    model.paypal = UtilHelper.setDataDefault(data.paypal);
    model.companyName = UtilHelper.setDataDefault(data.companyName);
    model.taxNumber = UtilHelper.setDataDefault(data.taxNumber);
    model.taxState = UtilHelper.setDataDefault(data.taxState);
    model.branchName = UtilHelper.setDataDefault(data.branchName);
    
    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('bankName', 'required', true, this._t('BANK_NAME_REQUIRED'));
    this.addRule('bankName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('BANK_NAME_MIN_LENGTH'));
    
    this.addRule('branchName', 'required', true, this._t('BRANCH_NAME_REQUIRED'));
    this.addRule('branchName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('BRANCH_NAME_MIN_LENGTH'));
    
    this.addRule('accountNumber', 'required', true, this._t('ACCOUNT_NUMBER_REQUIRED'));
    this.addRule('accountNumber', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('ACCOUNT_NUMBER_MIN_LENGTH'));
    // this.addRule('routing', 'required', true, this._t('ROUTING_NUMBER_REQUIRED'));
    this.addRule('bankAddress', 'required', true, this._t('BANK_ADDRESS_REQUIRED'));
    this.addRule('bankAddress', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('BANK_ADDRESS_MIN_LENGTH'));
    
    this.addRule('routing', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('ROUTING_NUMBER_MIN_LENGTH'));
    
    this.addRule('swiftCode', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('SWIFT_CODE_LENGTH'));
    
    this.addRule('paypal', 'email', true, this._t('INVALID_EMAIL'));
    
    this.addRule('companyName', 'required', true, this._t('COMPANY_NAME_UNDER_BANK_REQUIRED'));
    this.addRule('companyName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('COMPANY_NAME_UNDER_BANK_MIN_LENGTH'));

    this.addRule('taxState', 'required', true, this._t('GST_VALUE_REQUIRED'));
    this.addRule('taxState', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('GST_VALUE_MIN_LENGTH'));
    
    this.addRule('taxNumber', 'required', true, this._t('GST_VAT_REQUIRED'));
    this.addRule('taxNumber', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('GST_VAT_MIN_LENGTH'));

    
    return this.getRules();
  }
}
