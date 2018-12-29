import { BaseModel } from '../base.model';
import { ValidateModel } from '../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';

export class CurrencyRatesOptionsFormModel extends BaseModel {
  public currency : string;
  public rate: number;
  public baseCurrency: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
  }


  /**
  *
  * @param data
  * @returns {CurrencyRatesOptionsFormModel}
  */
  public static toRequestModel(data: any): CurrencyRatesOptionsFormModel {
    const model = new CurrencyRatesOptionsFormModel();
    model.currency = data.currency;
    model.rate = data.rate;
    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new CurrencyRatesOptionsFormModel();
    model.currency = data.currency;
    model.rate = data.currency;
    model.baseCurrency = data.baseCurrency;
    return model;
  }
}
