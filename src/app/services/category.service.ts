
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { CategoryListModel } from '../models/category/category.list.model';
import { isArray } from 'util';
import { PaginationModel } from '../models/pagination.model';
import { CategoryFormModel } from '../models/category/category.form.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CategoryService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New Category
    */
   add(data: CategoryFormModel): Observable<any> {
    const obj = CategoryFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.CATEGORY.ADD, obj, Constant.MODULE_ACTIONS.CATEGORY.ADD);
  }

  /**
   * Category List
   */
  list(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.CATEGORY.LIST + '?' + params, Constant.MODULE_ACTIONS.CATEGORY.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Parent Category List
   */
  parentList(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.CATEGORY.PARENT_CATEGORY + '?' + params, Constant.MODULE_ACTIONS.CATEGORY.VIEW)
    .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete Country
   */

  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.CATEGORY.DELETE}/` + id);
  }

  /**
   * Delete Mass Country
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.CATEGORY.MASS_DELETE, obj, Constant.MODULE_ACTIONS.CATEGORY.DELETE);
  }

  /**
   * Category Detail
   */
  view(token: string = ''): Observable<CategoryFormModel> {
    return this
      .makeHttpGet(Constant.REST_API.CATEGORY.VIEW + '/' + token, Constant.MODULE_ACTIONS.CATEGORY.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update Country
*/
  update(params: string = '', data: CategoryFormModel): Observable<CategoryFormModel> {
    const obj = CategoryFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.CATEGORY.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.CATEGORY.EDIT);
  }

  /**
   * upload file
   */
  uploadFiles(data: any): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.CATEGORY.UPLOAD_FILE, 'POST', data);
  }

  /**
   * delete file
   */
  deleteFiles(data: any): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.CATEGORY.DELETE_IMAGE, 'POST', data);
  }

  /**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(CategoryListModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return CategoryFormModel.toResponseModel(response);
    }
  }
}
