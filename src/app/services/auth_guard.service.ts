import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { UserIdentityService } from './user_identity.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    let isValid = true;
    const profile = UserIdentityService.getProfile();
    const routeData: any = route.data;
    if (!UserIdentityService.isLoggedIn()) {
      this._router.navigateByUrl('/');
      isValid = false;
    } else if (profile) {
      if (profile) {
        isValid = true;
      } else {
        isValid = false;
      }

      if (isValid === false) {
        this._router.navigateByUrl('/');
      }
    }

    return isValid;

  }
}
