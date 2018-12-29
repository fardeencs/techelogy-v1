import { TransferHttp } from '../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import { CurrencyRatesFormModel } from '../models/currency-rates/currency-rates.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CurrencyRatesService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New Currency
    */
  add(data: CurrencyRatesFormModel): Observable<any> {
    const obj = CurrencyRatesFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.CURRENCY_RATES.ADD, obj, Constant.MODULE_ACTIONS.CURRENCY_RATES.ADD);
  }

/**
* Update Currency
*/
  update(params: string = '', data: CurrencyRatesFormModel): Observable<RoleFormModel> {
    const obj = CurrencyRatesFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.CURRENCY.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.CURRENCY.EDIT);
  }

/**
* import yahoo exchange rates
*/
  import(): Observable<any> {
    return this
    .makeHttpGet(Constant.REST_API.CURRENCY_RATES.IMPORT , Constant.MODULE_ACTIONS.CURRENCY_RATES.ADD);
  }


/**
* get currency rates
*/
  getCurrencyRates(): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.CURRENCY_RATES.GET , Constant.MODULE_ACTIONS.CURRENCY_RATES.ADD).pipe(map(this.mapResponse.bind(this)));
  }


/**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response
        .data
        .map(CurrencyRatesFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return CurrencyRatesFormModel.toResponseModel(response.data);
    }
  }
}
