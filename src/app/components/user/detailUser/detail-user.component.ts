import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AddUserModel } from '../../../models/user/addUser.model';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import * as Constant from '../../../modules/constants';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';

@Component({
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent extends BaseComponent implements OnInit {
  public user: AddUserModel;
  public user_token;
  private userRole;
  public STATUS_ARRAY = Constant.STATUS_ARRAY;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router,
    public activeRoute: ActivatedRoute,
    public _roleList: RoleService,
    public _userService: UserService,
    private activatedRoute: ActivatedRoute,
    protected _location: Location,
    private translate: TranslateService,
    private _modalService: BsModalService,
    private titleService: Title
  ) {
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
    this.user = new AddUserModel();
    this.permissions = this.activatedRoute.snapshot.data['permission'];
    this.user_token = this.activeRoute.snapshot.params['id'];
    this.getRoleList();
  }
  ngOnInit() {

  }

  getRoleList() {
    try {
      this._roleList.getRole().subscribe((response) => {
        this.userRole = response.data;
        this.user.roleId = this.userRole[0];
        if (this.user_token !== undefined) {
          this.getUserDetail();
        }
      });
    } catch (error) {

    }
  }

/*
Get user Detail
*/
  getUserDetail() {
    this._userService.getUserdetail(this.user_token).subscribe((response) => {
      _.extend(this.user, response);
    });
  }

  public onDelete() {
    this.showConfirmationDeleteModal();
  }

    /**
   * confirm modal delete
  **/
 showConfirmationDeleteModal(): void {
  const modal = this._modalService.show(ConfirmDialogComponent);
  (<ConfirmDialogComponent>modal.content).showConfirmationModal(
    'COMMON.BUTTONS.DELETE',
    'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
    'COMMON.BUTTONS.YES',
    'COMMON.BUTTONS.NO',
  );

  (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
    if (result === true) {
      // when pressed Yes
      this.delete();

    } else if (result === false) {
      // when pressed No
    } else {
      // When closing the modal without no or yes
    }
  });
}

  onEdit() {
    this.navigateByUrl('user/edit/' + this.user_token);
  }

  delete(): void {
    try {
      this._userService
        .deleteUser(this.user_token)
        .subscribe((response) => {
          this.setSuccess('USER_DELETED_SUCCESSFULLY');
          this.navigateByUrl('user/view');
        }
        ,(error) => {
          this.setError(error.message);
        });
    } catch (error) {
    }
  }

  /**
   * Get status name
   */
  public getStatusName(id) {
    const arr = _.filter(this.STATUS_ARRAY, { value: id });
    return arr.length > 0 ? arr[0]['label'] : 'NA';
  }
}
