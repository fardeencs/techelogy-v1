import {
  Component,
  OnInit,
  AfterViewInit,
  NgModule,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { RoleFormModel } from '../../../models/form/role.model';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { CategoryService } from '../../../services/category.service';
import { CategoryFormModel } from '../../../models/category/category.form.model';
import { STATUS_ARRAY, COMMON_REQUIRED_ARRAY, IMAGE_SIZE, OTHER_APPROVAL_STATUS_ARRAY, HALAL_CATEGORY_ARRAY } from '../../../modules';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";

@Component({ templateUrl: './view.component.html', styleUrls: ['./view.component.scss'] })
export class ViewComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public category: any;
  public STATUS_OPTIONS: any;
  public PAGE_OPTION: any;
  public APPROVAL_STATUS: any;
  public IMG_SIZE_OPTION: any;
  public HALAL_OPTION: any;
  public categoryToken: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute, private translate: TranslateService, private titleService: Title,
    private modalService: BsModalService, protected _location: Location, private _categoryService: CategoryService) {
    super(_router, _location);
    this.category = new CategoryFormModel();
    this.categoryToken = this._activatedRoute.snapshot.params.id;
    this.STATUS_OPTIONS = STATUS_ARRAY;
    this.PAGE_OPTION = COMMON_REQUIRED_ARRAY;
    this.IMG_SIZE_OPTION = IMAGE_SIZE;
    this.HALAL_OPTION = HALAL_CATEGORY_ARRAY;
    this.APPROVAL_STATUS = OTHER_APPROVAL_STATUS_ARRAY;
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        , map(() => this._activatedRoute)
        , map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        , filter(route => route.outlet === 'primary')
        , mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title) => {
          this.titleService.setTitle(title);
        });
        this.pageInfo = event;
      });
    this.categoryToken = this._activatedRoute.snapshot.params.id;
    if (this.categoryToken) {
      this.getDetail();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  getDetail() {
    this
      ._categoryService
      .view(this.categoryToken)
      .subscribe((response) => {
        this.category = response;
      }, (error) => {
        this.setError(error.message);
      });
  }

  onEdit(item) {
    this.navigateByUrl('/catalog/edit/' + this.categoryToken);
  }

  /**
   * delete by id
  **/
  public onDelete() {
    this.showConfirmationDeleteModal(this.categoryToken);
  }

  /**
   * confirm modal delete
  **/
  showConfirmationDeleteModal(item): void {
    const modal = this.modalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO'
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
      this._categoryService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('CATEGORY_DELETED_SUCCESSFULLY');
          this.back();
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
