import { BaseModel } from '../base.model';
import { ValidateModel } from '../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';
import { CurrencyRatesOptionsFormModel } from '../currency-rates/currency-rates.options';

export class CurrencyRatesFormModel extends BaseModel {
  public rates : any;
  public baseCurrency: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
  }


  /**
  *
  * @param data
  * @returns {CurrencyRatesFormModel}
  */
  public static toRequestModel(data: any): CurrencyRatesFormModel {
    const model = new CurrencyRatesFormModel();
    model.baseCurrency = data.baseCurrency;
    model.rates = JSON.stringify(data.rates.map(CurrencyRatesOptionsFormModel.toRequestModel));
    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new CurrencyRatesFormModel();
    model.baseCurrency = data.baseCurrency;
    model.rates = data.rates;
    return model;
  }

}
