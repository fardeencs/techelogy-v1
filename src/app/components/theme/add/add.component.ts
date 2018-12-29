import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService, BsDatepickerConfig } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { ThemeFormModel } from '../../../models/theme/theme.form.model';
import { ThemeService } from '../../../services/theme.service';
import { MerchantService } from '../../../services/merchant.service';
import { STATUS_ARRAY, COMMON_REQUIRED_ARRAY, MOMENT_DATE_FORMAT } from '../../../modules';
import { Title } from "@angular/platform-browser";
import { filter, map, mergeMap } from 'rxjs/operators';
import { TranslateService } from "@ngx-translate/core";
import { DateHelper } from '../../../helper/date.helper';
import { FormGroup } from '@angular/forms';

@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.scss'] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public theme: any;
  public STATUS_OPTIONS: any;
  public DEFAULT_OPTION: any;
  public themeToken: string;
  public permissions: Array<string> = [];
  public countries: Array<Object> = [];
  public selectedCountries: any;
  public minDate = new Date();
  public endMinDate = new Date();
  public themeName = '';
  public pageInfo;
  public parentCategories: Array<Object> = [];
  public ImageTypes: Object = { productPlaceholder: "2", backgroundImage: "1", otherPlaceholder: "3" }

  @ViewChild('themeForm') themeForm: ElementRef;
  // DatePicker
  colorTheme = 'theme-red';
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute, private translate: TranslateService,
    private modalService: BsModalService, protected _location: Location, private titleService: Title,
    private _themeService: ThemeService, private _merchantService: MerchantService) {
    super(_router, _location);
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

    this.theme = new ThemeFormModel();
    this.STATUS_OPTIONS = STATUS_ARRAY;
    this.DEFAULT_OPTION = COMMON_REQUIRED_ARRAY;
    if(!this.themeToken){
      this.endMinDate.setDate(this.minDate.getDate());
    }
    this.themeToken = this._activatedRoute.snapshot.params.id;

  }

  ngOnInit() {
    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme,
      dateInputFormat: MOMENT_DATE_FORMAT.DD_MM_YYYY,
      showWeekNumbers: false
    });
    this.theme.themeFormGroup.patchValue({ isActive: this.theme.isActive, isDefault: this.theme.isDefault });
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    if (this.themeToken) {
      this.getDetail();
    }
  }

  ngAfterViewInit() { }


  getDetail() {
    this._themeService.view(this.themeToken).subscribe((response:any) => {
      this.theme.backgroundImageName = response.backgroundImageName;
      this.theme.productPlaceholderName = response.productPlaceholderName;
      this.theme.otherPlaceholderName = response.otherPlaceholderName;
      this.endMinDate = new Date(response.sDate);
      this.theme.themeFormGroup.patchValue(ThemeFormModel.toFormModel(response));
    }, (error) => {
      this.setError(error.message);
    });
  }


  action() {
    if (this.themeToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.theme.themeFormGroup.valid) {
        try {
          this.theme.themeFormGroup.value.imageUpload = this.theme.imageUpload;
          this
            ._themeService
            .add(this.theme.themeFormGroup.value)
            .subscribe((response) => {
              this.themeForm.nativeElement.reset();
              this.setSuccess(response.message);
              this.navigateByUrl('themes/list');
            }
              , (error) => {
                this.setError(error.message);
              });
        } catch (error) {
          console.log(error);
        }
      } else {
        this.theme.validateAllFields();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public update() {
    try {
      if (this.theme.themeFormGroup.valid) {
        try {
          this.theme.themeFormGroup.value.imageUpload = this.theme.imageUpload;
          this
            ._themeService
            .update(this.themeToken, this.theme.themeFormGroup.value)
            .subscribe((response) => {
              this.themeForm.nativeElement.reset();
              this.setSuccess('THEME_UPDATED_SUCCESSFULLY');
              this.back();
            }, (error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        this.theme.validateAllFields();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public cancelButtonAction() {
    try {
      const modal = this.modalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.CANCEL',
        'COMMON.MODALS.CHANGES_NOT_SAVED',
        'COMMON.BUTTONS.OK',
        'COMMON.BUTTONS.CANCEL'
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
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
   *Delete functionality
 */
  public onDelete() {
    this.showConfirmationDeleteModal(this.themeToken);
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
      this._themeService
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

  /**set End date max values */
  setEndDate(StartDate) {
    try {
      if (StartDate) {
        this.endMinDate = new Date(DateHelper.parseDate(StartDate));
        this.theme.themeFormGroup.patchValue({ endDate: DateHelper.toFormat(this.endMinDate, MOMENT_DATE_FORMAT.DD_MM_YYYY) });
      }
    } catch (error) {
      console.log(error);
    }

  }

  /** color picker value update */

  setColorCode(colorVaue: object = {}) {
    this.theme.themeFormGroup.patchValue(colorVaue);
  }

  /**
   *  after file upload response
   */
  onSelect(event, imageFiledName) {
    switch (imageFiledName) {
      case "otherPlaceholder": {
        this.theme.otherPlaceholderName = event.files[0].name;
        break;
      }
      case "productPlaceholder": {
        this.theme.productPlaceholderName = event.files[0].name;
        break;
      }
      case "backgroundImage": {
        this.theme.backgroundImageName = event.files[0].name;
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
    this.theme.imageUpload[imageFiledName] = event.files[0].objectURL;
  }

  /**
   *  custom file upload 
   */
  onFileUpload(fileData, imageFiledName) {
    const formData = new FormData();
    formData.append('file', fileData.files[0]);
    formData.append('uploadType', this.ImageTypes[imageFiledName]);
    formData.append('tmp', "1");
    let obj: any = {};
    try {
      this._themeService.uploadFiles(formData).subscribe((res: any) => {
        this.theme.imageUpload[imageFiledName] = res.location;
      }, (error) => {
        this.setError(error.message);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * file upload error 
   */

  onError(event) {
    console.log('ev', event);
  }

  /**
   * file remove from server  
   */
  onRemove(imageFiledName) {

    const modal = this.modalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO'
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        let fileName: string = "";
        if (this.theme.imageUpload[imageFiledName]) {
          fileName = this.theme.imageUpload[imageFiledName];
        } else {
          fileName = this.theme.themeFormGroup.value[imageFiledName]; //this.theme[imageFiledName];
        }

        // when pressed Yes
        let params: Object = { fileName: fileName, rid: this.themeToken, uploadType: this.ImageTypes[imageFiledName] }
        try {
          this._themeService.deleteFiles(params).subscribe((res: any) => {
            this.theme.themeFormGroup.controls[imageFiledName].setValue("", { onlySelf: true });
            this.theme.imageUpload[imageFiledName] = "";
            this.theme.themeFormGroup.controls[imageFiledName].updateValueAndValidity();
          }, (error) => {
            this.setError(error.message);
          });
        } catch (error) {
          console.log(error);
        }

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });


  }


}
