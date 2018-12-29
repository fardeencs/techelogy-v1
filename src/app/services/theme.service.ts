
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { isArray } from 'util';
import { PaginationModel } from '../models/pagination.model';
import { ThemeFormModel } from '../models/theme/theme.form.model';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ThemeListModel } from '../models/theme/theme.list.model';

@Injectable()
export class ThemeService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New THEMES
    */
  add(data: ThemeFormModel): Observable<any> {
    const obj = ThemeFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.THEMES.ADD, obj, Constant.MODULE_ACTIONS.THEMES.ADD);
  }

  /**
   * THEMES List
   */
  list(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.THEMES.LIST + '?' + params, Constant.MODULE_ACTIONS.THEMES.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }


  /**
   * Delete Country
   */

  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.THEMES.DELETE}/` + id);
  }

  /**
   * Delete Mass Country
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.THEMES.MASS_DELETE, obj, Constant.MODULE_ACTIONS.COUNTRY.DELETE);
  }

  /**
   * THEMES Detail
   */
  view(token: string = ''): Observable<ThemeFormModel> {
    return this
      .makeHttpGet(Constant.REST_API.THEMES.VIEW + '/' + token, Constant.MODULE_ACTIONS.THEMES.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
  * Update Country
  */
  update(params: string = '', data: ThemeFormModel): Observable<ThemeFormModel> {
    const obj = ThemeFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.THEMES.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.THEMES.EDIT);
  }

  /**
   * upload file
   */
  uploadFiles(data: any): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.THEMES.UPLOAD_FILE, 'POST', data);
  }

  /**
   * delete file
   */
  deleteFiles(data: any): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.THEMES.DELETE_IMAGE, 'POST', data);
  }

  /**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(ThemeListModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return ThemeFormModel.toResponseModel(response);
    }
  }
}
