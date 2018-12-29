import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import { CitiesFormModel } from '../models/cities/cities.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CitiesService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New City
    */
  add(data: CitiesFormModel): Observable<any> {
    const obj = CitiesFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.CITIES.ADD, obj, Constant.MODULE_ACTIONS.CITIES.ADD);
  }

  /**
     * Cities List
     */
  list(params: string = ''): Observable<PaginationModel> {
    return this
      .makeHttpGet(Constant.REST_API.CITIES.LIST + '?' + params, Constant.MODULE_ACTIONS.CITIES.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

 /**
   * Get country list
   */
  getCountryList(): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.CITIES.GET_COUNTRY_LIST, Constant.MODULE_ACTIONS.CITIES.ADD);
  }

  /**
   * Get state list
   */
  getStateList(param: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.CITIES.GET_STATE_LIST + '/' + param,Constant.MODULE_ACTIONS.CITIES.ADD);
  }

  /**
   * Delete Cities
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.CITIES.DELETE}/` + id);
  }

  /**
   * Delete Mass Cities
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.CITIES.MASS_DELETE, obj, Constant.MODULE_ACTIONS.CITIES.DELETE);
  }

  /**
   * Cities Detail
   */
  view(token: string = ''): Observable<CitiesFormModel> {
    return this
      .makeHttpGet(Constant.REST_API.CITIES.VIEW + '/' + token, Constant.MODULE_ACTIONS.CITIES.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update Cities
*/
  update(params: string = '', data: CitiesFormModel): Observable<RoleFormModel> {
    const obj = CitiesFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.CITIES.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.COUNTRY.EDIT);
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
        .map(CitiesFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return CitiesFormModel.toResponseModel(response);
    }
  }
}
