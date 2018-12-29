import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TransferHttp } from '../modules/transfer-http/transfer-http';
import { BaseService } from './base.service';
import * as Constant from '../modules/constants';
import {map, catchError} from "rxjs/operators";
import {Observable, throwError} from "rxjs";



@Injectable()
export class PermissionResolver extends BaseService implements Resolve<any> {

  constructor(protected http: TransferHttp, private _router: Router) {
    super(http);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const moduleName = route.data['moduleID'];
    const url = Constant.REST_API.MODULE_PERMISSIONS + '/' + moduleName;
     return this.makeHttpGet(url)
        .pipe(
          map((res: any) => (res['action'] || [])),
          catchError((err: any) => throwError(err))
        );
  }
}
