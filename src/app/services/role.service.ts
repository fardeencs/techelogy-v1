import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { AddUserModel } from '../models/user/addUser.model';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import { RoleListModel } from '../models/role/role.list.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class RoleService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  getRole(): Observable<AddUserModel> {
    return this.makeHttpGet(Constant.REST_API.ROLE.USERROLE, Constant.MODULE_ACTIONS.USER.ADD);
  }

  /**
    * Add New Role
    */
  add(data: RoleFormModel): Observable<any> {
    const obj = RoleFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.ROLE.ADD_ROLE, obj, Constant.MODULE_ACTIONS.ROLE.ADD);
  }

  permissionList(): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.PERMISSION.LIST, Constant.MODULE_ACTIONS.ROLE.VIEW);
  }

  /**
     * Role List
     */
  list(params: string = ''): Observable<PaginationModel> {
    return this
      .makeHttpGet(Constant.REST_API.ROLE.LIST_ROLE + '?' + params, Constant.MODULE_ACTIONS.ROLE.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete Role
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.ROLE.DELETE_ROLE}/` + id);
  }

  /**
   * Delete Mass Role
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.ROLE.MASS_DELETE_ROLE, obj, Constant.MODULE_ACTIONS.ROLE.DELETE);
  }

  /**
   * Role Detail
   */
  view(token: string = ''): Observable<RoleListModel> {
    return this
      .makeHttpGet(Constant.REST_API.ROLE.VIEW_ROLE + '/' + token, Constant.MODULE_ACTIONS.ROLE.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update Role
*/
  update(params: string = '', data: RoleFormModel): Observable<RoleFormModel> {
    const obj = RoleFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.ROLE.EDIT_ROLE + '/' + params, obj, Constant.MODULE_ACTIONS.ROLE.EDIT);
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
        .map(RoleListModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return RoleListModel.toResponseModel(response);
    }
  }
}
