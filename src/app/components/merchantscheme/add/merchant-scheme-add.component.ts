import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SchemeService } from '../../../services/scheme.service';
import { AddSchemeModel } from '../../../models/merchant-scheme/addScheme.model';
import { BsModalService, BsDatepickerConfig } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { SCHEME_TYPES_ARRAY, STATUS_ARRAY, COMMON_STATUS_ARRAY, DURATION_ARRAY, MOMENT_DATE_FORMAT } from '../../../modules';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {DateHelper} from "../../../helper/date.helper";

@Component({
  templateUrl: './merchant-scheme-add.component.html',
  styleUrls: ['./merchant-scheme-add.component.css']
})

export class MerchantSchemeAddComponent extends BaseComponent implements OnInit {
  public scheme: AddSchemeModel;
  public scheme_token: string;
  public actionName: string;
  public STATUS_OPTIONS: any;
  public SCHEME_TYPES_OPTINS: any;
  public DURATION_OPTIONS: any;
  public minDate = this.addMonths(new Date(), -6);
  public permissions: Array<string> = [];
  public pageInfo;

  @ViewChild('addSchemeForm') addSchemeForm: ElementRef;
  // DatePicker
  colorTheme = 'theme-red';
  bsConfig: Partial<BsDatepickerConfig>;
  // constructor
  constructor(
    protected _router: Router,
    public schemeService: SchemeService,
    public activeRoute: ActivatedRoute,
    private bsModalService: BsModalService,
    protected _location: Location,
    private titleService: Title,
    private translate: TranslateService) {
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
    this.STATUS_OPTIONS = COMMON_STATUS_ARRAY;
    this.SCHEME_TYPES_OPTINS = SCHEME_TYPES_ARRAY;
    this.DURATION_OPTIONS = DURATION_ARRAY;
    this.scheme.isActive = 1;
    if (this.scheme_token) {
      this.getSchemeDetail();
    }
  }

  ngOnInit() {
    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme,
      dateInputFormat: MOMENT_DATE_FORMAT.DD_MM_YYYY,
      showWeekNumbers: false
    });
    this.scheme.duration = 1;
    this.scheme.schemeType = 3;
    this.scheme.validity = new Date();
  }

  getSchemeDetail() {
    this.schemeService.getSchemedetail(this.scheme_token).subscribe((response) => {
      this.scheme = AddSchemeModel.toResponseModel(response);

      //manipulating date to show for date picker
      const schemeValidityArr = this.scheme['validity'].toString().split('/');
      const changedDateFormat = schemeValidityArr[1]+'/'+schemeValidityArr[0]+'/'+schemeValidityArr[2];
      this.scheme['validity'] = DateHelper.toRawMoment(changedDateFormat)._d;

    });
  }

  public schemeAction(): void {
    // const schemevalidity = this.momentDateFormat(MOMENT_DATE_FORMAT.YYYY_MM_DD, this.scheme.validity);
    try {
      if (this.scheme_token !== undefined) {
        if (this.scheme.validate('addSchemeForm')) {
          this.schemeService.updateScheme(this.scheme_token, this.scheme).subscribe((response) => {
            this.setSuccess('SCHEME_UPDATED_SUCCESSFULLY');
            setTimeout(() => this._router.navigate(['/scheme/view']), 500);
          },(error) => {
            this.setError(error.message);
          });
        }
      } else {
        if (this.scheme.validate('addSchemeForm')) {
          this.schemeService
            .addNewScheme(this.scheme)
            .subscribe((response) => {
              this.addSchemeForm.nativeElement.reset();
              this.setSuccess('SCHEME_SAVED_SUCCESSFULLY');
              setTimeout(() => this._router.navigate(['/scheme/view']), 500);
            },(error) => {
              this.setError(error.message);
            });
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  public cancelButtonAction(): void {
    try {
      const modal = this.bsModalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.CANCEL',
        'COMMON.MODALS.CHANGES_NOT_SAVED',
        'COMMON.BUTTONS.OK',
        'COMMON.BUTTONS.CANCEL'
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          // this._router.navigate(['/scheme/view']);
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

  public onDeleteScheme() {
    this.showConfirmationDeleteModal(this.scheme_token);
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
        this.deleteScheme(item);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete scheme by id
   */
  deleteScheme(id): void {
    try {
      this.schemeService
        .deleteScheme(id)
        .subscribe((response) => {
          this.setSuccess('SCHEME_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
