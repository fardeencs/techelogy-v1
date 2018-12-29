
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { UserListModel } from '../models/user/user.list.model';
import { AddUserModel } from '../models/user/addUser.model';
import {Observable} from "rxjs";


@Injectable()
export class UserService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * User List
   */
  list(params: string = ''): Observable<UserListModel> {
    return this.makeHttpGet(Constant.REST_API.USER.LIST + '?' + params, Constant.MODULE_ACTIONS.USER.VIEW);
  }

  /**
   * Add New User
   */
  addNewUser(data: AddUserModel): Observable<AddUserModel> {
    const obj = AddUserModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.USER.NEWUSER, obj, Constant.MODULE_ACTIONS.USER.ADD);
  }
  /**
   * Delete User
   */
  deleteUser(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.USER.DELETEUSER}/` + id);
  }
  /**
   * Delete Mass User
   */
  deleteMassUsers(userIds: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(userIds)
    };
    return this.makeHttpPost(Constant.REST_API.USER.DELETEMASSUSER, obj, Constant.MODULE_ACTIONS.USER.DELETE);
  }

  /**
   * Get User Detail
   */
  getUserdetail(params: string = ''): Observable<AddUserModel> {
    return this.makeHttpGet(Constant.REST_API.USER.EDITUSER + '/' + params, Constant.MODULE_ACTIONS.USER.VIEW);
  }

  /**
 * Update User
 */
  updateUser(params: string = '', data: AddUserModel): Observable<AddUserModel> {
    const obj = AddUserModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.USER.UPDATEUSER + '/' + params, obj, Constant.MODULE_ACTIONS.USER.EDIT);
  }
}
