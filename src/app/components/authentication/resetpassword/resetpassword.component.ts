import { Component, OnInit, AfterViewInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { AuthService } from '../../../services/auth.service';
import { ResetPasswordFormModel } from '../../../models/form/resetpassword.model';
import { Location } from '@angular/common';

@Component({
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit, AfterViewInit {
  public resetpassword: ResetPasswordFormModel;
  public resetPasswordToken: string;
  constructor(protected _router: Router, private _authenticateService: AuthService,
    protected _location: Location, public activeRoute: ActivatedRoute) {
    super(_router, _location);
    this.resetPasswordToken = this.activeRoute.snapshot.params.token;
    this.resetpassword = new ResetPasswordFormModel();
    this.validateResetPasswordToken();
  }

  ngOnInit() { }

  ngAfterViewInit() {
    $(function () {
      $('.preloader').fadeOut();
    });
  }

  validateResetPasswordToken() {
    try {
        this._authenticateService
          .verifyResetPassword(this.resetPasswordToken)
          .subscribe((response) => {
          } ,(error) => {
            this.setError(error.message);
            this.navigateByUrl('/');
          });
    } catch (error) {
      console.log(error);
    }
  }

  sendResetPasswordEmail() {
    try {
      if (this.resetpassword.validate('resetPasswordForm')) {
        this._authenticateService
          .resetPassword(this.resetpassword, this.resetPasswordToken)
          .subscribe((response) => {
            this.resetpassword = new ResetPasswordFormModel();
            this.setSuccess(response.message);
            this.navigateByUrl('/');
          } ,(error) => {
            this.setError(error.message);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
