import { TransferHttp } from '../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import { CustomerFormModel } from '../models/customer/customer.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CustomerService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New Customer
    */
  add(data: CustomerFormModel): Observable<any> {
    const obj = CustomerFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.CUSTOMER.ADD, obj, Constant.MODULE_ACTIONS.CUSTOMER.ADD);
  }

  /**
     * Customer List
     */
  list(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.CUSTOMER.LIST + '?' + params, Constant.MODULE_ACTIONS.CUSTOMER.VIEW).pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete Customer
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.CUSTOMER.DELETE}/` + id);
  }

  /**
   * Delete Mass Customer
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.CUSTOMER.MASS_DELETE, obj, Constant.MODULE_ACTIONS.CUSTOMER.DELETE);
  }

  /**
   * Customer Detail
   */
  view(token: string = ''): Observable<CustomerFormModel> {
     return this.makeHttpGet(Constant.REST_API.CUSTOMER.VIEW + '/' + token, Constant.MODULE_ACTIONS.CUSTOMER.VIEW)
     .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update Customer
*/
  update(params: string = '', data: CustomerFormModel): Observable<RoleFormModel> {
    const obj = CustomerFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.CUSTOMER.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.CUSTOMER.EDIT);
  }
/**
* upload file
*/
  uploadFiles(data: any): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.CUSTOMER.UPLOAD_FILE, 'POST', data);
  }

  /**
* delete file
*/
  deleteFiles(data: any): Observable<any> {
    return this.makeHttpPost(Constant.REST_API.CUSTOMER.DELETE_IMAGE, data, Constant.MODULE_ACTIONS.CUSTOMER.DELETE);
  }


  resetPassword(token: string = ''): Observable<any> {
    return this.makeHttpPost(Constant.REST_API.CUSTOMER.RESET_PASSWORD+ '/' + token);
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
        .map(CustomerFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return CustomerFormModel.toResponseModel(response);
    }
  }
}
