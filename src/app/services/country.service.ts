import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import { CountryFormModel } from '../models/country/country.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CountryService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New Country
    */
  add(data: CountryFormModel): Observable<any> {
    const obj = CountryFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.COUNTRY.ADD, obj, Constant.MODULE_ACTIONS.COUNTRY.ADD);
  }

  /**
     * Country List
     */
  list(params: string = ''): Observable<PaginationModel> {
    return this
      .makeHttpGet(Constant.REST_API.COUNTRY.LIST + '?' + params, Constant.MODULE_ACTIONS.COUNTRY.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete Country
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.COUNTRY.DELETE}/` + id);
  }

  /**
   * Delete Mass Country
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.COUNTRY.MASS_DELETE, obj, Constant.MODULE_ACTIONS.COUNTRY.DELETE);
  }

  /**
   * Country Detail
   */
  view(token: string = ''): Observable<CountryFormModel> {
    return this
      .makeHttpGet(Constant.REST_API.COUNTRY.VIEW + '/' + token, Constant.MODULE_ACTIONS.COUNTRY.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update Country
*/
  update(params: string = '', data: CountryFormModel): Observable<RoleFormModel> {
    const obj = CountryFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.COUNTRY.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.COUNTRY.EDIT);
  }

/**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      console.log('1')
      const ret = response
        .data
        .map(CountryFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      console.log('2')
      return CountryFormModel.toResponseModel(response);
    }
  }
}
