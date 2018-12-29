import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray, log } from 'util';
//import { CountryFormModel } from '../models/country/country.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { Brands } from '../models/brand/brands.model';

@Injectable()
export class BrandService extends BaseService {
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
    return this.makeHttpGet(Constant.REST_API.BRANDS.SPECIFIED_PAGE, Constant.MODULE_ACTIONS.USER.ADD);
  }

  getProductList(): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.BRANDS.PRODUCTS_LIST, Constant.MODULE_ACTIONS.USER.ADD);
  }

  getCategoriesList(): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.BRANDS.CATEGORIES_LIST, Constant.MODULE_ACTIONS.USER.VIEW);
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
    * Add New States
    */
  add(data: Brands): Observable<any> {
    const obj = Brands.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.BRANDS.ADD, obj, Constant.MODULE_ACTIONS.BRANDS.ADD);
  }

  /**
     * States List
     */
  list(params: string = ''): Observable<PaginationModel> {
     
    return this
      .makeHttpGet(Constant.REST_API.BRANDS.LIST + '?' + params, Constant.MODULE_ACTIONS.BRANDS.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete States
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.BRANDS.DELETE}/` + id);
  }

  /**
   * Delete Mass Brands
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.BRANDS.MASS_DELETE, obj, Constant.MODULE_ACTIONS.BRANDS.DELETE);
  }

  /**
   * Brands Detail
   */
  // view(token: string = ''): Observable<Brands> {
  //   return this
  //     .makeHttpGet(Constant.REST_API.BRANDS.VIEW + '/' + token, Constant.MODULE_ACTIONS.BRANDS.VIEW)
  //     .pipe(map(this.mapResponse.bind(this)));
  // }
  view(token: string = ''): Observable<Brands> {
    return this
      .makeHttpGet(Constant.REST_API.BRANDS.VIEW + '/' + token, Constant.MODULE_ACTIONS.BRANDS.VIEW);
  }

/**
* Update Brands
*/
  update(params: string = '', data: Brands): Observable<RoleFormModel> {
    const obj = Brands.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.BRANDS.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.BRANDS.EDIT);
  }

/**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      console.log('map_response',response.data)
      const ret = response
        .data
        .map(Brands.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return Brands.toResponseModel(response);
    }
  }
}
