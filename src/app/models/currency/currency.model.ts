import { BaseModel } from './../base.model';
import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';

export class CurrencyFormModel extends BaseModel {
  public currencyId: number;
  public currency: string;
  public symbol: string;
  public isActive: number;
  public isActiveKey: string;
  public rid: string;
  public createdDate: string;
  public updatedDate: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }


  /**
  *
  * @param data
  * @returns {CurrencyFormModel}
  */
  public static toRequestModel(data: CurrencyFormModel): CurrencyFormModel {
    const model = new CurrencyFormModel();
    model.currency = data.currency;
    model.symbol = data.symbol;
    model.isActive = data.isActive;
    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new CurrencyFormModel();
    model.rid = data.rid,
    model.currencyId = data.currencyId;
    model.currency = data.currency;
    model.symbol = data.symbol;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('currency', 'required', true, this._t('CURRENCY_NAME_REQUIRED'));
    this.addRule('symbol', 'required', true, this._t('CURRENCY_SYMBOL_REQUIRED'));
    this.addRule('symbol', 'minlength', MIN_LENGTHS_VALUES.CURRENCY_SYMBOL, this._t('CURRENCY_MIN_LENGTH'));
    this.addRule('symbol', 'symbol', true, this._t('CURRENCY_SYMBOL_INVALID'));    
    this.addRule('isActive', 'required', true, this._t('STATUS_REQUIRED'));
    return this.getRules();
  }
}
