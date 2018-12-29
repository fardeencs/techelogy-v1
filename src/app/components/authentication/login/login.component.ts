import {Component, OnInit, AfterViewInit, NgModule, NgZone} from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { LoginFormModel } from '../../../models/form/login.model';
import { UserIdentityService } from '../../../services/user_identity.service';
import { AuthService } from '../../../services/auth.service';
import { ForgotPasswordFormModel } from '../../../models/form/forget_password.model';
import { Location } from '@angular/common';
import { SESSION } from '../../../modules';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit, AfterViewInit {
  public user: LoginFormModel;
  public forget: ForgotPasswordFormModel;
  constructor(protected _router: Router, private _authenticateService: AuthService, protected _location: Location , private zone:NgZone) {
    super(_router, _location);
    this.user = new LoginFormModel();
    this.forget = new ForgotPasswordFormModel();
    if (UserIdentityService.isLoggedIn()) {
      sessionStorage.setItem(SESSION.LANGUAGE_KEYWORD, 'en');
      this.navigateByUrl('/dashboard');
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    $(function () {
      $('.preloader').fadeOut();
    });

    // TO OPEN FORGET PASSWORD SCREEN
    $('#to-recover').on('click', function () {
      $('#loginForm').hide();
      $('#forgetPasswordForm').fadeIn();
    });

    $('#backToLogin').on('click', function () {
      $('#forgetPasswordForm').hide();
      $('#loginForm').fadeIn();
    });
  }

  public login(): void {
    try {
      if (this.user.validate('loginForm')) {
        this._authenticateService
          .login(this.user)
          .subscribe((response) => {
            console.log(response);
            UserIdentityService.setCredentials(response);
            this.setSuccess(response.message);
            this.zone.run(() => {
              this.navigate(['/dashboard']);
            });
          } ,(error) => {
            this.setError(error.message);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public sendForgetPasswordEmail(): void {
    try {
      if (this.user.validate('forgetPasswordForm')) {
        this._authenticateService
          .sendForgetPassword(this.forget)
          .subscribe((response) => {
            $('#backToLogin').trigger('click');
            this.setSuccess(response.message);
          } ,(error) => {
            this.setError(error.message);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
