import { ConfigService } from '@ngx-config/core';
// import { ThemeSpinner } from './../../themes/services/theme_spinner/theme_spinner.service';
import { HTTP_CONNNECTION_TIMEOUT } from './../constants';
import { Injectable } from '@angular/core';
import {
  ConnectionBackend, Http, Request, RequestOptions,
  RequestOptionsArgs, Response
} from '@angular/http';
import {Subject, Observable, throwError ,of} from 'rxjs';
import { TransferState } from '../transfer-state/transfer-state';
import { environment } from '../../../environments/environment';
import { ThemeSpinner } from '../../shared/theme_spinner.service';
import { map, filter, catchError } from 'rxjs/operators';

@Injectable()
export class TransferHttp {
  public isShowSpinner = true;
  public restURL: string;
  public restxURL:string;

  constructor(private http: Http,
    protected transferState: TransferState,
    private spinner: ThemeSpinner
  ) {
    this.restURL = environment.REST_URL;
    this.restxURL = environment.REST_X_URL;
  }

  /**
   * Performs a request with http method.
   * @param uri
   * @param options
   */
  public request(url: string | Request, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.request(this.restURL + '/' + url, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
         return res;
       }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));

     /* .subscribe((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return of(res);
      } ,(err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      });*/


  }
  /**
   * Performs a request with `get` http method.
   */
  public get(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.get(this.restURL + '/' + url, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));
     /* .toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/

  }

  public get1(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.get(url, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));
      /*.toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/

  }
  /**
   * Performs a request with `post` http method.
   */
  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.post(this.restURL + '/' + url, body, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));

      /*.toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/

  }
  /**
   * Performs a request with `put` http method.
   */
  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.put(this.restURL + '/' + url, body, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));
     /* .toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/

  }
  /**
   * Performs a request with `delete` http method.
   */
  public delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.delete(this.restURL + '/' + url, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));
      /*.toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/

  }
  /**
   * Performs a request with `patch` http method.
   */
  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.patch(this.restURL + '/' + url, body.options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));
      /*.toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/

  }
  /**
   * Performs a request with `head` http method.
   */
  public head(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.head(this.restURL + '/' + url, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));
      /*.toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/

  }
  /**
   * Performs a request with `options` http method.
   */
  public options(url: string, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.options(this.restURL + '/' + url, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));
      /*.toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/
  }

  /**
   * Get Data From Cache
   * @param uri
   * @param options
   * @param callback
   */
  private getData(uri: string | Request, options: RequestOptionsArgs, callback: (uri: string | Request, options?: RequestOptionsArgs) => Observable<any>) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const key = url + JSON.stringify(options);

    try {
      return this.resolveData(key);
    } catch (e) {
      return callback(uri, options)
        .pipe(map((res) => {
          this.setCache(key, res);
          return res;
        }));
    }
  }
  /**
   * Get Data From Cache
   * @param uri
   * @param body
   * @param options
   * @param callback
   */
  private getPostData(uri: string | Request, body: any, options: RequestOptionsArgs, callback: (uri: string | Request, body: any, options?: RequestOptionsArgs) => Observable<any>) {

    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const key = url + JSON.stringify(body) + JSON.stringify(options);

    try {
      return this.resolveData(key);
    } catch (e) {
      return callback(uri, body, options)
        .pipe(map((res) => {
          this.setCache(key, res);
          return res;
        }));
    }
  }
  /**
   * Resolve data
   * @param key
   */
  private resolveData(key: string) {
    const data = this.getFromCache(key);

    if (!data) {
      throw new Error();
    }
    return throwError(data);
  }
  /**
   * Reject Data
   * @param error
   */
  private rejectData(error: any) {
    return throwError(error);
  }
  /**
   * Set Cache
   * @param key
   * @param data
   */
  private setCache(key, data) {
    return this.transferState.set(key, data);
  }
  /**
   * Get Cache
   * @param key
   */
  private getFromCache(key): any {
    return this.transferState.get(key);
  }
  /**
   * Performs a request with http method.
   * @param uri
   * @param options
   */
  public requestx(url: string | Request, options?: RequestOptionsArgs): Observable<any> {
    if (this.isShowSpinner) {
      this.spinner.show();
    }
    return this.http.request(this.restxURL + '/' + url, options)
      .pipe( map((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      }) , catchError((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return throwError(err);
      }));
      /*.toPromise()
      .then((res: any) =>{
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return res;
      })
      .catch((err: any) => {
        if (this.isShowSpinner) {
          this.spinner.hide(1000);
        }
        return Promise.reject(err);
      });*/

  }
}
