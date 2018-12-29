import { Component, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbPanelChangeEvent, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BaseComponent } from '../../components/base.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserIdentityService } from '../../services/user_identity.service';
import { UserModel } from '../../models/user/user.model';
import {GlobalState} from '../../global.state';
import {STATE_EVENT, SESSION} from '../../modules/constants';
import { Location } from '@angular/common';
declare var $:any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent extends BaseComponent implements AfterViewInit {
  name: string;
  profile: UserModel;
  public config: PerfectScrollbarConfigInterface = {};
  constructor(private _authService: AuthService, public _router: Router , private _globalState: GlobalState,
  protected _location: Location) {
    super(_router, _location);
    if (UserIdentityService.getProfile()) {
      this.profile = UserIdentityService.getProfile();
    }
  }

  ngAfterViewInit() {
    const set = function () {
      const width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
      const topOffset = 0;
      if (width < 1170) {
        $('#main-wrapper').addClass('mini-sidebar');
      } else {
        $('#main-wrapper').removeClass('mini-sidebar');
      }
    };
    $(window).ready(set);
    //$(window).on('resize', set);
    //$('body').trigger('resize');
  }

  /**
     * Logout
     * @returns {Promise<void>}
     */
  public logout() {
    try {
      return Promise.resolve()
        .then(() => {
          return this._authService.logout();
        })
        .then(() => {
          UserIdentityService.clearCredentials();
          this.navigateByUrl('/');
        })
        .catch((error) => {
          if (error) {
            this.setError(error.message);
          }
        });
    } catch (error) {
      this.setError(error.message);
    }
  }
  /**
   *  language change event
   */
  public setLanguage(language: string) {
    sessionStorage.setItem(SESSION.LANGUAGE_KEYWORD, language);
    this._globalState.notifyDataChanged(STATE_EVENT.LANGUAGE_CHANGED, language);
  }
}
