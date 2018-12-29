
import { TransferHttp } from '../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { isArray } from 'util';
import { PaginationModel } from '../models/pagination.model';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AttributeFormModel } from '../models/attribute/attribute.model';
import { EntityModel } from '../models/attribute/entity.model';
@Injectable()
export class AttributeService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New ATTRIBUTE
    */
  add(data: any): Observable<any> {
    const obj = AttributeFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.ATTRIBUTE.ADD, obj, Constant.MODULE_ACTIONS.ATTRIBUTE.ADD);
  }

  /**
   * ATTRIBUTE List
   */
  entityList(): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.ATTRIBUTE.ENTITY_LIST, Constant.MODULE_ACTIONS.ATTRIBUTE.VIEW)
      .pipe(map(this.mapEntityResponse.bind(this)));
  }

  /**
   * ATTRIBUTE List
   */
  list(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.ATTRIBUTE.LIST + '?' + params, Constant.MODULE_ACTIONS.ATTRIBUTE.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }


  /**
   * Delete Country
   */

  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.ATTRIBUTE.DELETE}/` + id);
  }

  /**
   * Delete Mass Country
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.ATTRIBUTE.MASS_DELETE, obj, Constant.MODULE_ACTIONS.COUNTRY.DELETE);
  }

  /**
   * ATTRIBUTE Detail
   */
  view(token: string = ''): Observable<AttributeFormModel> {
    return this
      .makeHttpGet(Constant.REST_API.ATTRIBUTE.VIEW + '/' + token, Constant.MODULE_ACTIONS.ATTRIBUTE.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
  * Update Country
  */
  update(params: string = '', data: AttributeFormModel): Observable<AttributeFormModel> {
    const obj = AttributeFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.ATTRIBUTE.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.ATTRIBUTE.EDIT);
  }

  /**
   * upload file
   */
  uploadFiles(data: any): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.ATTRIBUTE.UPLOAD_FILE, 'POST', data);
  }

  /**
   * delete file
   */
  deleteFiles(data: any): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.ATTRIBUTE.DELETE_IMAGE, 'POST', data);
  }

  /**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(AttributeFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return AttributeFormModel.toResponseModel(response);
    }
  }

  /**
*
* @param response
* @returns {any}
*/
  mapEntityResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(EntityModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return EntityModel.toResponseModel(response);
    }
  }


}
