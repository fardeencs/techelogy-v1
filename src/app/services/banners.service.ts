import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import { BannerFormModel } from './../models/banner/banner.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class BannerService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New Banner
    */
   add(data: BannerFormModel): Observable<any> {
    const obj = BannerFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.BANNERS.ADD, obj, Constant.MODULE_ACTIONS.BANNERS.ADD);
  }

  /**
     * Banner List
     */
  list(params: string = ''): Observable<PaginationModel> {
    return this
      .makeHttpGet(Constant.REST_API.BANNERS.LIST + '?' + params, Constant.MODULE_ACTIONS.BANNERS.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete Banner
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.BANNERS.DELETE}/` + id);
  }

  /**
   * Delete Mass Banner
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.BANNERS.MASS_DELETE, obj, Constant.MODULE_ACTIONS.BANNERS.DELETE);
  }

  /**
   * Banner Detail
   */
  view(token: string = ''): Observable<BannerFormModel> {
    return this
      .makeHttpGet(Constant.REST_API.BANNERS.VIEW + '/' + token, Constant.MODULE_ACTIONS.BANNERS.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
  * Update Banner
  */
  update(params: string = '', data: BannerFormModel): Observable<BannerFormModel> {
    const obj = BannerFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.BANNERS.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.BANNERS.EDIT);
  }

  /**
   * Get Parent Banner
   */
  getParentBanner(): Observable<any> {
    return this
      .makeHttpGet(Constant.REST_API.BANNERS.PARENT_BANNER , Constant.MODULE_ACTIONS.BANNERS.VIEW);
  }

  /**
   * Get Specified Page
   */
  getSpecifiedPage(): Observable<any> {
    return this
      .makeHttpGet(Constant.REST_API.BANNERS.SPECIFIED_PAGE , Constant.MODULE_ACTIONS.BANNERS.VIEW)
  }

  /**
   * Get Specified Categories
   */
  getSpecifiedCategories(): Observable<any> {
    return this
      .makeHttpGet(Constant.REST_API.BANNERS.SPECIFIED_CATEGORIES , Constant.MODULE_ACTIONS.BANNERS.VIEW)
  }

  /**
   * Get Specified Products
   */
  getSpecifiedProducts(): Observable<any> {
    return this
      .makeHttpGet(Constant.REST_API.BANNERS.SPECIFIED_PRODUCTS , Constant.MODULE_ACTIONS.BANNERS.VIEW);
  }

  /**
   * upload file
   */
  addFiles(data: any): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.BANNERS.UPLOAD_FILE , 'POST', data);
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
        .map(BannerFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return BannerFormModel.toResponseModel(response);
    }
  }
}
