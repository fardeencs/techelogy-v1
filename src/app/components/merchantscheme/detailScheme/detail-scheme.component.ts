import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { SchemeService } from '../../../services/scheme.service';
import * as Constant from '../../../modules/constants';
import * as _ from 'lodash';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { AddSchemeModel } from '../../../models/merchant-scheme/addScheme.model';

@Component({
  templateUrl: './detail-scheme.component.html',
  styleUrls: ['./detail-scheme.component.css']
})
export class MerchantSchemeDetailComponent extends BaseComponent implements OnInit {
  public scheme: AddSchemeModel;
  public scheme_token;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router,
    public activeRoute: ActivatedRoute,
    public schemeService: SchemeService,
    private bsModalService: BsModalService,
    protected _location: Location,
    private titleService: Title,
    private translate: TranslateService
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
    this.scheme = new AddSchemeModel();
    this.permissions = this.activeRoute.snapshot.data['permission'];
    this.scheme_token = this.activeRoute.snapshot.params['id'];
  }
  ngOnInit() {
    this.getSchemeDetail();
  }

  getSchemeDetail() {
    this.schemeService.getSchemedetail(this.scheme_token).subscribe((response) => {
      this.scheme = AddSchemeModel.toResponseModel(response);
      this.scheme.remark = this.scheme.remark.replace(/(?:\r\n|\r|\n)/g, '<br>');
    });
  }

  onEdit() {
    this.navigateByUrl('/scheme/edit/' + this.scheme_token);
  }

  onDelete() {
    this.showConfirmationDeleteModal();
  }

  showConfirmationDeleteModal(): void {
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
        this.deleteScheme();

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  deleteScheme(): void {
    try {
      this.schemeService
        .deleteScheme(this.scheme_token)
        .subscribe((response) => {
          this.setSuccess('SCHEME_DELETED_SUCCESSFULLY');
          setTimeout(() => this._router.navigate(['/scheme/view']), 500);
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  public getDurationLabel(duration: number) {
    return _.filter(Constant.DURATION_ARRAY, { value: duration })[0]['label'];
  }

  public getSchemeTypeLabel(schemeType: number) {
    return _.filter(Constant.SCHEME_TYPES_ARRAY, { value: schemeType })[0]['label'];
  }
}
