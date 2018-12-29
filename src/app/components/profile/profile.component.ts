import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { log } from 'util';
import { UserIdentityService } from '../../services/user_identity.service';
import { GlobalState } from '../../global.state';
import { STATE_EVENT } from '../../modules';
import { UserModel } from '../../models/user/user.model';
import { PasswordFormModel } from '../../models/form/password.model';
import { Location } from '@angular/common';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends BaseComponent implements OnInit {
  public user: UserModel;
  public profile: UserModel;
  public password: PasswordFormModel;
  constructor(
    protected _router: Router,
    public _profileService: ProfileService,
    private _globalState: GlobalState,
    protected _location: Location) {
    super(_router, _location);
    this.user = new UserModel();
    this.getMyProfile();
    this.profile = UserIdentityService.getProfile();
    this.password = new PasswordFormModel();
  }

  ngOnInit() {
  }

  public getMyProfile(): void {
    try {
      this._profileService
        .profile()
        .subscribe((response) => {
          this.user = jQuery.extend({}, this.user, response);
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  public updateProfile(): void {
    try {
      if (this.user.validate('profileForm')) {
        this._profileService
          .updateProfile(this.user)
          .subscribe((response) => {
            response.role = this.profile.role;
            UserIdentityService.setProfile(response);
            this._globalState.notifyDataChanged(STATE_EVENT.UPDATE_PROFILE, UserModel.toProfileModel(response));
            this.setSuccess('PROFILE_SUCCESSFULLY');
          },(error) => {
            this.setError(error.message);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public updatePassword(): void {
    try {
      if (this.password.validate('passwordForm')) {
        this._profileService
          .updatePassword(this.password)
          .subscribe((response) => {
            this.password = new PasswordFormModel();
            this.setSuccess(response.message);
          },(error) => {
            this.setError(error.message);
          });
      }
    } catch (error) {
      this.setError(error.message);
    }
  }
}
