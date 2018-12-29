import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { PermissionResolver } from './permission-resolver.service';
import { FlashMessage } from '../shared/flash_message';
import { UtilHelper } from '../helper/util.helper';
import {Observable, throwError ,of} from "rxjs";
import {catchError,map} from "rxjs/operators";

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(private _router: Router, public _permissionResolver: PermissionResolver) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return  this._permissionResolver.resolve(route)
      .pipe(
        map((res: any) =>  {
          if (res.indexOf(route.data.action) >= 0) {
            return true;
          } else {
            //return false;
            FlashMessage.setError(UtilHelper.translate('ACCESS_DENIED'));
            setTimeout(() => {
              this._router.navigate(['/']);
            }, 500);
          }
        }),
        catchError((err: any) => throwError(false))
      );
     /*this._permissionResolver.resolve(route)
        .subscribe((res) => {
          console.log(route.data);
          if (res.indexOf(route.data.action) >= 0) {
            console.log(res.indexOf(route.data.action) );
            return (true);
          } else {
            return (false);
            FlashMessage.setError(UtilHelper.translate('ACCESS_DENIED'));
            setTimeout(() => {
              this._router.navigate(['/']);
            }, 500);
          }
        }),catchError((err: any) => console.log(throwError(false))));

        return of(true);*/

  }
}
