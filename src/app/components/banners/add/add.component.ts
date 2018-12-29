import { GlobalState } from './../../../global.state';
import { STATE_EVENT, MOMENT_DATE_FORMAT } from './../../../modules/constants';
import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService, BsDatepickerConfig } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { STATUS_ARRAY } from '../../../modules';
import {filter,map,mergeMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {BannerService} from "../../../services/banners.service";
import {BannerFormModel} from "../../../models/banner/banner.model";
import {DateHelper} from "../../../helper/date.helper";
import * as Constant from '../../../modules/constants';
import { isNil, reverse } from 'lodash';


import { UserIdentityService } from '../../../services/user_identity.service';
import { TreeviewEventParser, OrderDownlineTreeviewEventParser, TreeviewConfig, DownlineTreeviewItem, TreeviewItem } from '../../../shared/dropdown/treeview-dropdown-lib';
import {UtilHelper} from "../../../helper/util.helper";

@Component({
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [
    { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
    { provide: TreeviewConfig, useClass: AddComponent }
  ]
})
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  public banner: BannerFormModel;
  public STATUS_OPTIONS: any;
  public bannerID: string;

  public permissions: Array<string> = [];
  public bannerLanguages: Array<Object> = Constant.BANNER_LANGUAGE;
  public locationArr: Array<Object> = Constant.BANNER_LOCATION;

  public webStatusArray: Array<Object> = Constant.COMMON_STATUS_ARRAY;
  public mobileStatusArray: Array<Object> = Constant.COMMON_STATUS_ARRAY;

  public parentBanners:Array<Object> = [];
  public specifiedPage:Array<Object> = [];
  public specifiedCategories:Array<Object> = [];
  public specifiedProducts:Array<Object> = [];

  public pageInfo;
  public colorTheme = 'theme-red';
  public bsConfig: Partial<BsDatepickerConfig>;
  public date    = new Date();
  public minDate = this.addMonths(new Date(), -6);
  public maxDate = this.addMonths(new Date(), +6);

  @ViewChild('bannerForm') bannerForm: ElementRef;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,private translate:TranslateService,private titleService:Title,
              private modalService: BsModalService, protected _location: Location,  private _bannerService: BannerService, private _globalState:GlobalState) {
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

    this.banner = new BannerFormModel();
    this.bannerID = this._activatedRoute.snapshot.params['id'];
    this.STATUS_OPTIONS = STATUS_ARRAY;

    //patch default value
    this.banner.FormGroup.patchValue({
      parentId:[],
      webStatus:0,
      mobileStatus:0,
      createdByName: UserIdentityService.getProfile()['email'],
      startDate: DateHelper.toFormat(this.date, MOMENT_DATE_FORMAT.DD_MM_YYYY),
      endDate: DateHelper.toFormat(this.date, MOMENT_DATE_FORMAT.DD_MM_YYYY)
    });
    this.banner.FormGroup.controls['createdByName'].disable();

    //get detail
    if (this.bannerID) {
      this.getDetail();
    }
  }

  ngOnInit() {

    this.permissions = this._activatedRoute.snapshot.data['permission'];
    //date picker config
    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme,
      dateInputFormat: MOMENT_DATE_FORMAT.DD_MM_YYYY,
      showWeekNumbers: false
    });

    //get parent banner list
    this._bannerService.getParentBanner().subscribe((res)=>{
      this.parentBanners = res['data'];
    });

    //get specified page list
    this._bannerService.getSpecifiedPage().subscribe((res)=>{
      this.specifiedPage = res['data'];
    });

    //get specified category list
    this._bannerService.getSpecifiedCategories().subscribe((res)=>{
      if(res && res['data']){
        this.specifiedCategories =  UtilHelper.mapTreeviewData(res['data'], "subcategory", "categoryName", "entityId", this.banner.FormGroup.value.categories);
      }
    });

    //get specified products list
    this._bannerService.getSpecifiedProducts().subscribe((res)=>{
      this.specifiedProducts = res['data'];
    });

  }

  ngAfterViewInit() { }

  /**
   * Get Detail of Banner
   */
  getDetail() {
    this._bannerService.view(this.bannerID).subscribe((response) => {
      this.banner.FormGroup.patchValue(BannerFormModel.toFormModel(response));
    },(error) => {
      this.setError(error.message);
    });
  }

  action() {
    if (this.bannerID !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  /**
   * Add Banner
   */
  public add() {
    try {
      if (this.banner.FormGroup.valid) {
        if(this.banner.FormGroup.value.endDate <= this.banner.FormGroup.value.startDate){
          this.setError("BANNER_DATES_ERROR");
          return;
        }
        try {
          this
            ._bannerService
            .add(this.banner.FormGroup.value)
            .subscribe((response) => {
              this.bannerForm.nativeElement.reset();
              this.setSuccess(response.message);
              this.navigateByUrl('banner/list');
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }else{
        this.banner.validateAllFields();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Update  Banner
   */
  public update() {
    try {
      if (this.banner.FormGroup.valid) {
          if(this.banner.FormGroup.value.endDate <= this.banner.FormGroup.value.startDate){
            this.setError("BANNER_DATES_ERROR");
            return
          }
          try {
            this
              ._bannerService
              .update(this.bannerID, this.banner.FormGroup.value)
              .subscribe((response) => {
                this.bannerForm.nativeElement.reset();
                this.setSuccess('BANNER_UPDATED_SUCCESSFULLY');
                this.navigateByUrl('banner/list');
              },(error) => {
                this.setError(error.message);
              });
          } catch (error) {
            console.log(error);
          }
      }else{
        this.banner.validateAllFields();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Cancel Button Handler
   */
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
          //this._router.navigate(['/banner/list']);
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
  /**
   * File upload
   * @param event
   */
  fileEvent(event) {
    const e = (event.srcElement || event.target);
    if (e.files.length > 0) {
      const file = e.files[0];
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > this.MAX_LENGTH_CONFIG.MAX_FILE_SIZE) { //file size
        e.value = null;
        this.setError('MAX_FILE_SIZE_EXCEED');
      } else if (!this.MAX_LENGTH_CONFIG.ALLOWED_BANNER_EXTENSION.exec(file.name)) { //file name
        e.value = null;
        this.setError('FILE_FORMAT_BANNER_EXPECTED');
      } else {

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tmp', '1');
        formData.append('uploadType', '5');

        // upload to server
        const self = this;
        this._bannerService.addFiles(formData).subscribe((res) => {
          //check width and height of image
          var img = new Image();
          img.src = res['location'];
          img.onload = function(){
            if(img.width < 100 || img.height < 100 || img.width > 2000 || img.height > 2000) { //file size
              self.setError('BANNER_IMAGE_SIZE');
            }else{
              self.banner.FormGroup.patchValue({
                image:res['location']
              });
            }
          }
        });

      }
    }
  }

  /**
   * Delete Functionality
   */
  public onDelete() {
    this.showConfirmationDeleteModal(this.bannerID);
  }

  /**
   * Confirm modal delete
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
      this._bannerService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('BANNER_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Add/Subtract months to given date
   * @param date
   * @param months
   * @returns {any}
   */
  public addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
  }

  /**
   * On Specified category Change
   * @param downlineItems
   */
  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    let rows = [];
    downlineItems.forEach(downlineItem => {
      const item = downlineItem.item;
      const value = item.value;
      const texts = [item.text];
      let parent = downlineItem.parent;
      while (!isNil(parent)) {
        texts.push(parent.item.text);
        parent = parent.parent;
      }
      const reverseTexts = reverse(texts);
      const row = `${reverseTexts.join(' -> ')} : ${value}`;
      rows.push(row);
    });
  }

}
