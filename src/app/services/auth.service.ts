import { isArray } from 'util';
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { TokenModel } from '../models/token.model';
import { ForgotPasswordFormModel } from '../models/form/forget_password.model';
import { LoginFormModel } from '../models/form/login.model';
import { ResetPasswordFormModel } from '../models/form/resetpassword.model';
import {Observable, throwError} from "rxjs";
import { map } from 'rxjs/operators';
import {catchError} from "rxjs/internal/operators";

@Injectable()
export class AuthService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * Login
   */

  login(data): Observable<TokenModel> {
    const obj = this.buildLoginRequest(data);

    return this.makeHttpPost(Constant.REST_API.ACCOUNT.LOGIN, obj)
      .pipe(map((res) => this.mapResponse(res)),catchError((err)=> throwError(err)));
  }

  /**
   * Logout
   */

  logout(): Observable<TokenModel> {
    return this.makeHttpDelete(Constant.REST_API.ACCOUNT.LOGOUT);
  }

  /**
   * Get Permissions
   */

  getPermissions(): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.ACCOUNT.PERMISSIONS).
    pipe(map((res)=> res), catchError((err)=> throwError(err)));
  }

  /**
   * Get Forget Password
   */

  sendForgetPassword(data): Observable<any> {
    const obj = ForgotPasswordFormModel.toRequestModel(data);

    return this.makeHttpPost(Constant.REST_API.ACCOUNT.FORGET_PASSWORD, obj);
  }

  resetPassword(data: ResetPasswordFormModel, resetPasswordToken: string): Observable<any> {
    const obj = ResetPasswordFormModel.toRequestModel(data);

    return this.makeHttpPost(Constant.REST_API.ACCOUNT.RESET_PASSWORD + '/' + resetPasswordToken, obj);
  }

  verifyResetPassword(resetPasswordToken: string): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.ACCOUNT.VERIFY_RESET_PASSWORD_TOKEN + '/' + resetPasswordToken);
  }


  /**
   *
   * @param data
   * @returns {any}
   */
  buildLoginRequest(data: LoginFormModel) {
    const model = new LoginFormModel();

    model.email = data.email;
    model.password = data.password;

    return model;
  }

  /**
   *
   * @param response
   * @returns {any}
   */
  mapResponse(response: any) {
    console.log(response);
    if (isArray(response)) {
      return response.map(TokenModel.toResponseModel);
    } else {
      return TokenModel.toResponseModel(response);
    }
  }

}
