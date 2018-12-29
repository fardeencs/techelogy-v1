import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { Location } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { RoleListModel } from '../../../models/role/role.list.model';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent extends BaseComponent implements OnInit {
  public role: RoleListModel;
  public roleToken: string;
  public masterPermissions: Array<any>;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router,
    protected _location: Location,
     private _roleService: RoleService,
    private _modalService: BsModalService,
    public _activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translate: TranslateService) {
    super(_router, _location);
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        ,map(() => this._activatedRoute)
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
    this.role = new RoleListModel();
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.roleToken = this._activatedRoute.snapshot.params.id;
    this.getDetail();
  }

  ngOnInit() {
  }

  getDetail() {
    this._roleService.view(this.roleToken).subscribe((response) => {
      this.role = response;
      this.masterPermissions = this.role.permission;
    });
  }

  onEdit() {
    this.navigateByUrl('role/edit/' + this.roleToken);
  }

  /*
  Delete functionality
*/
  public onDelete() {
    this.showConfirmationDeleteModal(this.roleToken);
  }

  /**
   * confirm modal delete
  **/
  showConfirmationDeleteModal(item): void {
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
        this.delete(item);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }
  /**
   * delete by id
   */
  delete(id): void {
    try {
      this._roleService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('ROLE_DELETED_SUCCESSFULLY');
          this.navigateByUrl('role/view');
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
