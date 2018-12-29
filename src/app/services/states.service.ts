import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
//import { CountryFormModel } from '../models/country/country.model';
import { States } from '../models/states/states.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class StatesService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  // getLookup(): Observable<any> {
  //   // return this
  //   // .makeHttpGet(Constant.REST_API.COUNTRY.LIST, Constant.MODULE_ACTIONS.STATES.VIEW)
  //   // .then(this.mapResponse.bind(this));
  //   return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_COUNTRY_LIST, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  // }
  getLookup(): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_COUNTRY_LIST, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }

  /**
    * Add New States
    */
  add(data: States): Observable<any> {
    const obj = States.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.STATES.ADD, obj, Constant.MODULE_ACTIONS.STATES.ADD);
  }

  /**
     * States List
     */
  list(params: string = ''): Observable<PaginationModel> {
      //debugger;
    return this
      .makeHttpGet(Constant.REST_API.STATES.LIST + '?' + params, Constant.MODULE_ACTIONS.STATES.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete States
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.STATES.DELETE}/` + id);
  }

  /**
   * Delete Mass States
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.STATES.MASS_DELETE, obj, Constant.MODULE_ACTIONS.STATES.DELETE);
  }

  /**
   * States Detail
   */
  view(token: string = ''): Observable<States> {
    return this
      .makeHttpGet(Constant.REST_API.STATES.VIEW + '/' + token, Constant.MODULE_ACTIONS.STATES.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update States
*/
  update(params: string = '', data: States): Observable<RoleFormModel> {
    const obj = States.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.STATES.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.STATES.EDIT);
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
        .map(States.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return States.toResponseModel(response);
    }
  }
}
