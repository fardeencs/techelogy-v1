import { UserIdentityService } from './user_identity.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import {AUTHORIZATION} from "../modules/constants";




@Injectable()
export class HttpService {
  errorMessage: string = "Server Error";
  // Resolve HTTP using the constructor
  constructor(private http: HttpClient) {}

  /**
  * @name - get
  * @desc - get request
  * @param url - url of API
  * @param action - action/role to be append in headers
  */
  get(url,action = ''): Observable<any> {
    // using get request
    return this.http.get(url, {
      headers: this.setHeaders(action)
    }).pipe( map((res: any) => res) , catchError((err: any) => {
        return throwError({
          Error: err['error'] || this.errorMessage
        });
      }));

  }

  /**
   * @name - post
   * @desc - post request
   * @param url - url of API
   * @param obj - object to be send
   * @param action - action/role to be append in headers
   */
  post(url, obj: Object,action = ''): Observable<any> {
    const body = obj;
    // using post request
    return this.http.post(url, body, {
      headers: this.setHeaders(action)
    }) // using post request
      .pipe(
        map((res: any) => res),catchError((err: any) => {
        return throwError({
          Error: err['error'] || this.errorMessage
        });
      })); // errors if any
  }

  /**
   * @name - put
   * @desc - put request
   * @param url - url of API
   * @param obj - object to be send
   * @param action - action/role to be append in headers
   */
  put(url, obj: Object,action = ''): Observable<any> {
    // Create a option
    const body = JSON.stringify(obj); // Stringify payload
    // using put request
    return this.http.put(url, body, {
      headers: this.setHeaders()
    }) // using put request
      .pipe(
        map((res: any) => res) ,catchError((err: any) => throwError({
        Error: err['error'] || this.errorMessage
      }))); // errors if any
  }

  /**
   * @name - delete
   * @desc - delete request
   * @param url - url of API
   * @param id - id to be send for delete
   * @param action - action/role to be append in headers
   */
  delete(url, id: string,action = ''): Observable<any> {

    return this.http.delete(`${url}/` + id, {
      headers: this.setHeaders(action)
    }) // using delete request
      .pipe( map((res: any) => res) , catchError((err: any) => throwError({
        Error: err['error'] || this.errorMessage
      }))); // errors if any
  }

  /**
   * @name - setHeaders
   * @desc - setting response headers
   */
  setHeaders(action: string = ''){
    let obj = {
      'Content-Type':  'application/json'
    };

    const token = UserIdentityService.getToken();
    if (token) {
      obj[AUTHORIZATION.TYPE] = `${AUTHORIZATION.METHOD} ${token}`;
    }
    if (action) {
      obj[AUTHORIZATION.ACTION] = action;
    }
    let header = new HttpHeaders(obj);
    return header;
  }

}
