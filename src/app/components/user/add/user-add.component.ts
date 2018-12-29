import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AddUserModel } from '../../../models/user/addUser.model';
import { RoleService } from '../../../services/role.service';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import {TranslateService} from '@ngx-translate/core';
import { Location } from '@angular/common';
import * as Constant from '../../../modules/constants';
import * as _ from 'lodash';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';

@Component({
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})

export class UserAddComponent extends BaseComponent implements OnInit {
  public user: AddUserModel;
  public userRole;
  public user_token: string;
  public actionName: string;
  public STATUS_ARRAY  = Constant.STATUS_ARRAY;
  public permissions: Array<string> = [];
  public pageInfo;

  @ViewChild('addUserForm') addUserForm: ElementRef;

  constructor(
    protected _router: Router,
    public _roleList: RoleService,
    public _userService: UserService,
    public activeRoute: ActivatedRoute,
    private bsModalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    protected _location: Location,
    private titleService: Title) {
    super(_router, _location);

    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        ,map(() => this.activeRoute)
        ,map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        ,filter(route => route.outlet === 'primary')
        ,mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title)=>{
          this.titleService.setTitle(title);
        });
        this.pageInfo = event;
      });

    this.permissions = this.activatedRoute.snapshot.data['permission'];
    this.user = new AddUserModel();
    this.user.status = this.STATUS_ARRAY[0]['value'];
    this.user_token = this.activeRoute.snapshot.params['id'];
    this.getRoleList();
  }

  ngOnInit() {}

  /*
    Get Role List
  */
  getRoleList() {
    try {
      this._roleList.getRole().subscribe((response) => {
        this.userRole = response.data;
        this.user.roleId = this.userRole[0].roleId;
        if (this.user_token !== undefined) {
          this.getUserDetail();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /*
    Get user Detail
  */
  getUserDetail() {
    this._userService.getUserdetail(this.user_token).subscribe((response) => {
     _.extend(this.user , response);
    });
  }
  /*
    Add user functionality
  */
  public userAction(): void {
    try {
      if (this.user_token !== undefined) {
        if (this.user.validate('addUserForm')) {
          this._userService.updateUser(this.user_token, this.user).subscribe((response) => {
            this.setSuccess('USER_UPDATED_SUCCESSFULLY');
            setTimeout(() => this._router.navigate(['/user/view']), 500);
          }
          ,(error) => {
            this.setError(error.message);
          });
        }
      } else {
        if (this.user.validate('addUserForm')) {
          this._userService
            .addNewUser(this.user)
            .subscribe((response) => {
              this.addUserForm.nativeElement.reset();
              this.user.roleId = this.userRole[0].roleId;
              this.setSuccess('USER_ADDED_SUCCESSFULLY');
              setTimeout(() => this._router.navigate(['/user/view']), 500);
            },(error) => {
              this.setError(error.message);
            });
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  /*
   Reset button functionality
   */
  public cancelButtonAction() {
    try {
      const modal = this.bsModalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.CANCEL',
      'COMMON.MODALS.CHANGES_NOT_SAVED',
      'COMMON.BUTTONS.OK',
      'COMMON.BUTTONS.CANCEL',
    );
  (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
    if (result === true) {
      // when pressed Yes
      // this._router.navigate(['/user/view']);
      this.back();
      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
    } catch (error) {
      console.log(error);
    }
  }

  /*
    Delete User functionality
  */
 public onDeleteUser() {
   this.showConfirmationDeleteModal(this.user_token);
  }
  /**
   * confirm modal delete
  **/
 showConfirmationDeleteModal(item): void {
  const modal = this.bsModalService.show(ConfirmDialogComponent);
  (<ConfirmDialogComponent>modal.content).showConfirmationModal(
    'COMMON.BUTTONS.DELETE',
    'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
    'COMMON.BUTTONS.YES',
    'COMMON.BUTTONS.NO',
  );

  (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
    if (result === true) {
      // when pressed Yes
      this.deleteUser(item);

    } else if (result === false) {
      // when pressed No
    } else {
      // When closing the modal without no or yes
    }
  });
}

  /**
   * delete user by id
   */
  deleteUser(id): void {
    try {
      this._userService
        .deleteUser(id)
        .subscribe((response) => {
          this.setSuccess('USER_DELETED_SUCCESSFULLY');
          this.back();
        }
        ,(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

}
