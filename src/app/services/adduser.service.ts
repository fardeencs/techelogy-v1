import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import {AddUserModel} from '../models/user/addUser.model';
import {Observable} from "rxjs";


@Injectable()
export class AddUserService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }
  ACTION = 'USERS_ADD';
  addNewUser(data: AddUserModel): Observable<AddUserModel> {
    const obj = AddUserModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.USER.NEWUSER, obj, this.ACTION);
  }
}
