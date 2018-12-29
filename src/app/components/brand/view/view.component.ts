import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location, NgSwitch } from '@angular/common';
import { BrandService } from '../../../services/brands.service';
import { Brands } from '../../../models/brand/brands.model';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TranslateService } from "@ngx-translate/core";
import { Title } from "@angular/platform-browser";
import { log } from 'util';
import '../../../helper/custom-extension';
import * as _ from 'lodash';
import { DateHelper } from '../../../helper/date.helper';
import { MOMENT_DATE_FORMAT } from '../../../modules/constants';


@Component({ templateUrl: './view.component.html', styleUrls: ['./view.component.css'] })
export class ViewComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public data: any;
  public lookups: any;
  public STATUS_OPTIONS: any;
  public token: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router
    , public _activatedRoute: ActivatedRoute
    , private modalService: BsModalService
    , protected _location: Location
    , private _brandService: BrandService
    , private translate: TranslateService
    , private titleService: Title) {
    super(_router, _location);
    this.data = new Brands();
    this.token = this._activatedRoute.snapshot.params.id;
    this._router.events
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
    if (this.token) {
      //this.getLookup();
      this.getDetail();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  getLookup() {
    this._brandService.getLookup().subscribe((response) => {
      this.lookups = response;
    }, (error) => {
      this.setError(error.message);
    });
  }

  getDetail() {
    this
      ._brandService
      .view(this.token)
      .subscribe((response) => {
        this.data = response;
        if (this.data) {
          Brands.convertArrayToJoinText(this.data);
          this.data.locationText = Brands.getLocationText(this.data.location.toString());
          this.data.landingPageText= Brands.getBoolText(this.data.landingPage.toString());
          this.data.latestBrandsText= Brands.getBoolText(this.data.latestBrands.toString());
          this.data.monthBrandText= Brands.getBoolText(this.data.monthBrand.toString());
          this.data.topBrandText = Brands.getBoolText(this.data.topBrands.toString());
          this.data.createdDate = DateHelper.toFormat(this.data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
          this.data.updatedDate = DateHelper.toFormat(this.data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
          this.data.startDate = DateHelper.toFormat(this.data.startDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
          this.data.endDate = DateHelper.toFormat(this.data.endDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
        }
      
      }, (error) => {
        this.setError(error.message);
      });
  }

  onEdit(item) {
    this.navigateByUrl('/brand/edit/' + this.token);
  }

  /**
   * delete by id
  **/
  public onDelete() {
    this.showConfirmationDeleteModal(this.token);
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
      this._brandService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('COUNTRY_DELETED_SUCCESSFULLY');
          this.back();
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getBoolText(value): string{
    return value || (value == 1 ? "Yes" : "No") ;         
  }

  getLocationText(value): string{
    if(value)
        return value == "1" ? "Top" : "Bottom";
    else
       return "";
         
  }


}
