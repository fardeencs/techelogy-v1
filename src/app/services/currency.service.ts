import { TransferHttp } from '../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import { CurrencyFormModel } from '../models/currency/currency.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CurrencyService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New Currency
    */
  add(data: CurrencyFormModel): Observable<any> {
    const obj = CurrencyFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.CURRENCY.ADD, obj, Constant.MODULE_ACTIONS.CURRENCY.ADD);
  }

  /**
     * Currency List
     */
  list(params: string = ''): Observable<PaginationModel> {
    return this
      .makeHttpGet(Constant.REST_API.CURRENCY.LIST + '?' + params, Constant.MODULE_ACTIONS.CURRENCY.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete Currency
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.CURRENCY.DELETE}/` + id);
  }

  /**
   * Delete Mass Currency
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.CURRENCY.MASS_DELETE, obj, Constant.MODULE_ACTIONS.CURRENCY.DELETE);
  }

  /**
   * Currency Detail
   */
  view(token: string = ''): Observable<CurrencyFormModel> {
    return this
      .makeHttpGet(Constant.REST_API.CURRENCY.VIEW + '/' + token, Constant.MODULE_ACTIONS.CURRENCY.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update Currency
*/
  update(params: string = '', data: CurrencyFormModel): Observable<RoleFormModel> {
    const obj = CurrencyFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.CURRENCY.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.CURRENCY.EDIT);
  }

  /**
* get Currency code
*/
getCode(): Observable<any> {
  return this
  .makeHttpGet(Constant.REST_API.CURRENCY.CODE , Constant.MODULE_ACTIONS.CURRENCY.VIEW);
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
        .map(CurrencyFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return CurrencyFormModel.toResponseModel(response);
    }
  }
}
