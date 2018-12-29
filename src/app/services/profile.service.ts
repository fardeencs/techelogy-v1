import { isArray } from 'util';
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { UserModel } from '../models/user/user.model';
import { PasswordFormModel } from '../models/form/password.model';
import {Observable} from "rxjs";

@Injectable()
export class ProfileService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * My Profile
   */

  profile(): Observable<UserModel> {
    return this.makeHttpGet(Constant.REST_API.ME.PROFILE);
  }

  updateProfile(data: UserModel): Observable<UserModel> {
    const obj = UserModel.toRequestModel(data);

    return this.makeHttpPut(Constant.REST_API.ME.PROFILE, obj);
  }

  updatePassword(data: PasswordFormModel): Observable<any> {
    const obj = PasswordFormModel.toRequestModel(data);

    return this.makeHttpPut(Constant.REST_API.ME.UPDATE_PASSWORD, obj);
  }
}
