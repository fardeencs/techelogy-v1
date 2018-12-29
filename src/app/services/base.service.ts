import { UserIdentityService } from './user_identity.service';
import { StateModel } from './../models/state.model';
import { HTTP, ERROR_CODE, SESSION, AUTHORIZATION, HTTP_METHOD } from './../modules/constants';
import { PaginationModel } from './../models/pagination.model';
import { HEADERS } from './../modules/constants';
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import * as _ from 'lodash';
import * as fileSaver from 'file-saver';
import * as moment from 'moment';
import {Observable,throwError,of,} from "rxjs";
import { catchError ,map} from 'rxjs/operators';

@Injectable()
export class BaseService {
  public headers = new Headers();

  constructor(protected http: TransferHttp) { }
  /**
   * Set Header
   * @param key
   * @param value
   */
  public setHeader(key, value) {
    if (this.headers.has(key)) {
      this
        .headers
        .set(key, value);
    } else {
      this
        .headers
        .append(key, value);
    }
  }

  /**
  * @param header
  */
  public removeHeader(header) {
    this
      .headers
      .delete(header);
  }

  /**
   * Get Header Options
   * @returns {RequestOptions}
   */
  private headerOptions(action: string = ''): RequestOptions {
    this.setHeader(HEADERS.CONTENT_TYPE, HTTP.CONTENT_TYPE.JSON);
    let token = UserIdentityService.getToken();
    if (token) {
      this.setHeader(AUTHORIZATION.TYPE, `${AUTHORIZATION.METHOD} ${token}`);
    }
    if (action) {
      this.setHeader(AUTHORIZATION.ACTION, action);
    }
    return new RequestOptions({ headers: this.headers });
  }

  /**
   * Parse Data From Server Reponse
   * @param res
   * @returns {any|{}}
   */
  public parseData(res: any):any {
    let headers = res.headers;
    let totalItems = 0;
    let itemsPerPage = 0;
    let ret: any;
    let contentType = headers.get(HEADERS.CONTENT_TYPE)
      ? headers.get(HEADERS.CONTENT_TYPE)
      : headers.get(HEADERS.CONTENT_TYPE.toLowerCase());
    if (contentType == HTTP.CONTENT_TYPE.JSON) {
      let obj: any = res.json();
      if (res.status === 200) {
        if (obj.status === false) {
          return (this.parseError(obj));
        }

        if (obj.status === true) {
          return (this.parseInfo(obj));
        }

        if (_.isArray(obj)) {
          if (headers.has(HEADERS.TOTAL_ITEMS) || headers.has(HEADERS.TOTAL_ITEMS.toLowerCase())) {
            let total = headers.get(HEADERS.TOTAL_ITEMS)
              ? headers.get(HEADERS.TOTAL_ITEMS)
              : headers.get(HEADERS.TOTAL_ITEMS.toLowerCase());
            totalItems = total
              ? parseInt(total)
              : 0;
          }
          if (headers.has(HEADERS.ITEM_PER_PAGE) || headers.has(HEADERS.ITEM_PER_PAGE.toLowerCase())) {
            itemsPerPage = parseInt(headers.get(HEADERS.ITEM_PER_PAGE))
              ? parseInt(headers.get(HEADERS.ITEM_PER_PAGE))
              : parseInt(headers.get(HEADERS.ITEM_PER_PAGE.toLowerCase()));
          }
          ret = PaginationModel.toResponse(totalItems, itemsPerPage, obj);
        } else {
          if (headers.has(HEADERS.TOTAL_ITEMS) || headers.has(HEADERS.TOTAL_ITEMS.toLowerCase())) {
            let total = headers.get(HEADERS.TOTAL_ITEMS)
              ? headers.get(HEADERS.TOTAL_ITEMS)
              : headers.get(HEADERS.TOTAL_ITEMS.toLowerCase());
            totalItems = total
              ? parseInt(total)
              : 0;
            ret = PaginationModel.toResponse(totalItems, itemsPerPage, obj);
          } else {
            ret = obj;
          }
        }
      }
    } else {
      ret = res.text();
    }
    return (ret);
  }

  /**
   * Handle Error
   * @param error
   * @returns {ErrorObservable}
   */
  public handleError(error: any): any {
    if (error && error._body != null) {
      if(!navigator.onLine){
        error = {
          code:0,
          message:"Sorry, something went wrong.Please try again",
          title:"Network Error"
        };
      }else{
        error = JSON.parse(error._body);
      }
    }
    return (this.parseError(error));
  }

  /**
     *
     * @param error
     */
  private parseError(error: any): StateModel {
    if (error && error.code) {
      switch (error.code) {
        case ERROR_CODE.AUTHENTICATION.GENERIC:
        case ERROR_CODE.AUTHENTICATION.VIOLATE_RFC6750:
        case ERROR_CODE.AUTHENTICATION.TOKEN_EXPIRED_CODE:
        case ERROR_CODE.AUTHENTICATION.NOT_AUTHORIZED_CODE:
        case ERROR_CODE.AUTHENTICATION.INVALID_ACCESS_TOKEN_CODE:
        case ERROR_CODE.AUTHENTICATION.TOKEN_NOT_FOUND_CODE:
          UserIdentityService.clearCredentials();
          window.location.href = '/';
          break;
      }
    }


    return StateModel
      .getInstances()
      .init(error.code, error.message, undefined, error.title);
  }

  /**
   *
   * @param info
   */
  private parseInfo(info: any): StateModel {
    return StateModel
      .getInstances()
      .init(undefined, info.message, info.value, info.title);
  }

  /**
   * Make Http Get
   * @param url
   */
  public makeHttpGet(url: string, action: string = ''): Observable<any> {
    return this
      .http
      .get(url, this.headerOptions(action))
      .pipe(map((res)=> this.parseData(res))
        ,catchError((err)=> throwError(this.handleError(err))));
  }

  /**
   * Make Http Post
   * @param url
   * @param body
   */
  public makeHttpPost(url: string, body?: any, action: string = ''): Observable<any> {

    return this
      .http
      .post(url, body, this.headerOptions(action))
      .pipe(map((res)=> this.parseData(res))
        ,catchError((err)=> throwError(this.handleError(err))));
  }
  /**
   * Make Http Put
   * @param url
   * @param body
   */
  public makeHttpPut(url: string, body?: any, action: string = ''): Observable<any> {

    return this
      .http
      .put(url, body, this.headerOptions(action))
      .pipe(map((res)=> this.parseData(res))
        ,catchError((err)=> throwError(this.handleError(err))));
  }

  /**
   * Make Http Delete
   * @param url
   * @param body
   */
  public makeHttpDelete(url: string, body?: any): Observable<any> {
    return this.makeHttpRequest(HTTP_METHOD.DELETE, url, body);
  }
  /**
   * Make Http Request
   * @param method
   * @param url
   * @param body
   */
  public makeHttpRequest(method: string, url: string, body: any): Observable<any> {
    this.headerOptions();
    let options = new RequestOptions({ headers: this.headers, method: method, body: body });
    return this
      .http
      .request(url, options)
      .pipe(map((res)=> this.parseData(res))
        ,catchError((err)=> throwError(this.handleError(err))));
  }

  /**
   *
   * @param res
   * @returns {Observable<void>|Observable<T>}
   */
  public handleDownloadFile(res: Response) {
    let response: any;
    let headers = res.headers;
    let contentType = headers.get(HEADERS.CONTENT_TYPE)
      ? headers.get(HEADERS.CONTENT_TYPE)
      : headers.get(HEADERS.CONTENT_TYPE.toLowerCase());

    if (contentType.indexOf('application/pdf') === -1) {
      response = res.json();
      if (response.status == false) {
        return Promise.reject(this.parseError(response));
      }
    } else {
      response = res.blob();

      let filename = '';
      let disposition = headers.get(HEADERS.CONTENT_DISPOSITION)
        ? headers.get(HEADERS.CONTENT_DISPOSITION)
        : headers.get(HEADERS.CONTENT_DISPOSITION.toLowerCase());
      if (disposition && disposition.indexOf('attachment') !== -1) {
        let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        let matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1])
          filename = matches[1].replace(/['"]/g, '');
      }

      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window
          .navigator
          .msSaveBlob(response, filename);
      } else {
        if (!filename) {
          filename = `${moment().unix()}.pdf`;
        }
        fileSaver.saveAs(response, filename);
      }
    }

    return Promise.resolve();
  }
  /**
 *
 * @param data
 * @returns {FormData}
 */
  protected toUploadFields(data: any = {}) {
    let formData = new FormData();
    _.forEach(data, (value, key) => {
      if (value instanceof FileList) {
        formData.append(key, value[0], value[0].name);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }

  /**
   *
   * @param url
   * @param method
   * @param body
   * @returns {Observable<Response>}
   */
  public requestHttpFormData(url: string, method: string, body: any = {}): Observable<any> {
    this.headerOptions();
    this.removeHeader(HEADERS.CONTENT_TYPE);
    let options = {
      method: method,
      body: body,
      headers: this.headers
    };

    return this
      .http
      .request(url, options)
      .pipe(map((res)=> this.parseData(res))
        ,catchError((err)=> throwError(this.handleError(err))));
  }
 /**
  *
  * @param url
  * @param method
  * @param body
  * @returns {Observable<Response>}
  */
  public httpxFormData(url: string, method: string, body: any = {}): Observable<any> {
    this.headerOptions();
    this.removeHeader(HEADERS.CONTENT_TYPE);
    let options = {
      method: method,
      body: body,
      headers: this.headers
    };

    return this.http.requestx(url, options)
      .pipe(map((res)=> this.parseData(res))
        ,catchError((err)=> throwError(this.handleError(err))));
  }
}
