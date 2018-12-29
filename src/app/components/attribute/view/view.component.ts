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
import { ATTRIBUTE_INPUT_TYPE, COMMON_REQUIRED_ARRAY, } from '../../../modules';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { AttributeFormModel } from '../../../models/attribute/attribute.model';
import { AttributeService } from '../../../services/attribute.service';
AttributeService

@Component({ templateUrl: './view.component.html', styleUrls: ['./view.component.scss'] })
export class ViewComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public attribute: any;
  public INPUT_OPTION: any;
  public IS_REQUIRED: any;
  public attributeToken: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute, private translate: TranslateService, private titleService: Title,
    private modalService: BsModalService, protected _location: Location, private _attributeService: AttributeService) {
    super(_router, _location);
    this.attribute = new AttributeFormModel();
    this.attributeToken = this._activatedRoute.snapshot.params.id;
    this.INPUT_OPTION = ATTRIBUTE_INPUT_TYPE;
    this.IS_REQUIRED = COMMON_REQUIRED_ARRAY;
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
    this.attributeToken = this._activatedRoute.snapshot.params.id;
    if (this.attributeToken) {
      this.getDetail();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  getDetail() {
    this
      ._attributeService
      .view(this.attributeToken)
      .subscribe((response) => {
        this.attribute = response;
      }, (error) => {
        this.setError(error.message);
      });
  }

  onEdit(item) {
    this.navigateByUrl('/attributes/edit/' + this.attributeToken);
  }

  /**
   * delete by id
  **/
  public onDelete() {
    this.showConfirmationDeleteModal(this.attributeToken);
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
    let rids:any = [id];
    try {
      this._attributeService
        .massDelete(rids)
        .subscribe((response) => {
          this.setSuccess('THEME_DELETED_SUCCESSFULLY');
          this.back();
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
