
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { SchemeListModel } from '../models/merchant-scheme/scheme.list.model';
import { AddSchemeModel } from '../models/merchant-scheme/addScheme.model';
import { isArray } from 'util';
import { PaginationModel } from '../models/pagination.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class SchemeService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * Scheme List
   */
  list(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.MERCHANT_SCHEME.LIST + '?' + params, Constant.MODULE_ACTIONS.SCHEME.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Add New Scheme
   */
  addNewScheme(data: AddSchemeModel): Observable<AddSchemeModel> {
    const obj = AddSchemeModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.MERCHANT_SCHEME.NEWSCHEME, obj, Constant.MODULE_ACTIONS.SCHEME.ADD);
  }
  /**
   * Delete Scheme
   */
  deleteScheme(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.MERCHANT_SCHEME.DELETESCHEME}/` + id);
  }
  /**
   * Delete Mass Scheme
   */
  deleteMassSchemes(schemeIds: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(schemeIds)
    };
    return this.makeHttpPost(Constant.REST_API.MERCHANT_SCHEME.DELETEMASSSCHEME, obj, Constant.MODULE_ACTIONS.SCHEME.DELETE);
  }

  /**
   * Get Scheme Detail
   */
  getSchemedetail(params: string = ''): Observable<AddSchemeModel> {
    return this.makeHttpGet(Constant.REST_API.MERCHANT_SCHEME.EDITSCHEME + '/' + params, Constant.MODULE_ACTIONS.SCHEME.VIEW);
  }

  /**
 * Update Scheme
 */
  updateScheme(params: string = '', data: AddSchemeModel): Observable<AddSchemeModel> {
    const obj = AddSchemeModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.MERCHANT_SCHEME.UPDATESCHEME + '/' + params, obj, Constant.MODULE_ACTIONS.SCHEME.EDIT);
  }

  /**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(AddSchemeModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return AddSchemeModel.toResponseModel(response);
    }
  }
}
