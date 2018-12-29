import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import {FormGroup, Validators} from "@angular/forms";
import {ReactiveFormValidateModel} from "../reactive.form.validate.model";
import {ReactiveFormBaseModel} from "../reactive.form.base.model";
import * as _ from 'lodash';

export class BannerFormModel extends ReactiveFormBaseModel {
  public rid: string;
  public entityId: number;
  public bannerName: string;
  public image: any;
  public startDate: any;
  public endDate: any;
  public location: any;
  public specifiedPage:any;
  public categories:any;
  public products:any;
  public webStatus:number = 1;
  public mobileStatus:number = 1;
  public sortOrder:number;
  public parentId:any = '';
  public isActive:number;
  public webStatusKey:string;
  public mobileStatusKey:string;
  public createdByName:string;
  public createdDate: string;
  public updatedDate: string;
  public parentName:string;
  public bannerLanguage:any;
  public FormGroup : FormGroup;


  constructor() {
    super();
    this.validateRules = new ReactiveFormValidateModel();
    this.initValidateRules();
  }


  /**
  *
  * @param data
  * @returns {BannerFormModel}
  */
  public static toRequestModel(data: BannerFormModel): BannerFormModel {
    const model = new BannerFormModel();
    data.bannerLanguage = data.bannerLanguage ? data.bannerLanguage.join(',') : '';
    data.location = data.location ? data.location.join(',') : '';
    data.specifiedPage = data.specifiedPage ? data.specifiedPage.join(',') : '';
    data.categories = data.categories ? data.categories.join(',') : '';
    data.products = data.products ? data.products.join(',') : '';


    model.bannerName = UtilHelper.setDataDefault(data.bannerName);
    model.image = UtilHelper.setDataDefault(data.image);
    model.startDate = DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.YYYY_MM_DD);
    model.endDate = DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.YYYY_MM_DD);
    model.location = UtilHelper.setDataDefault(data.location);
    model.specifiedPage = UtilHelper.setDataDefault(data.specifiedPage);
    model.categories = UtilHelper.setDataDefault(data.categories);
    model.products = UtilHelper.setDataDefault(data.products);
    model.webStatus = (data.webStatus);
    model.mobileStatus = (data.mobileStatus);
    model.sortOrder = UtilHelper.setDataDefault(data.sortOrder);
    model.parentId = UtilHelper.setDataDefault(data.parentId);
    model.bannerLanguage = UtilHelper.setDataDefault(data.bannerLanguage);
    model.createdByName = UtilHelper.setDataDefault(data.createdByName);

    delete model.validateRules;
    delete model.FormGroup;
    return model;
  }

  /**
   *
   * @param data
   * @returns {BannerFormModel}
   */
  public static toFormModel(data: BannerFormModel): BannerFormModel {
    const model = new BannerFormModel();
    data.bannerLanguage = data['bannerLanguage'] ? data['bannerLanguage'].toString().split(',') : [];
    data.location =  data['location'] ? data['location'].toString().split(',') : [];
    data.specifiedPage =  _.map(data['specifiedPage'],'pageId');
    data.categories = _.map(data['categories'],'catalogId');
    data.products =  _.map(data['products'],'productId');



    model.bannerName = UtilHelper.setDataDefault(data.bannerName);
    model.image = UtilHelper.setDataDefault(data.image);
    model.startDate = data.startDate; //DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.YYYY_MM_DD);
    model.endDate = data.endDate; //DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.YYYY_MM_DD);
    model.location = UtilHelper.setDataDefault(data.location);
    model.specifiedPage = UtilHelper.setDataDefault(data.specifiedPage);
    model.categories = UtilHelper.setDataDefault(data.categories);
    model.products = UtilHelper.setDataDefault(data.products);
    model.webStatus = (data.webStatus);
    model.mobileStatus = (data.mobileStatus);
    model.sortOrder = UtilHelper.setDataDefault(data.sortOrder);
    model.parentId = UtilHelper.setDataDefault(data.parentId);
    model.bannerLanguage = UtilHelper.setDataDefault(data.bannerLanguage);
    model.createdByName = UtilHelper.setDataDefault(data.createdByName);

    delete model.validateRules;
    delete model.FormGroup;
    return model;
  }

  public static toResponseModel(data: any) {
    const model = new BannerFormModel();
    model.rid = data.rid;
    model.entityId = data.entityId,
    model.bannerName = data.bannerName;
    model.image = data.image;
    model.startDate = DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.endDate = DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.location = data.location ;
    model.specifiedPage = data.specifiedPage;
    model.categories = data.categories;
    model.products = data.products;
    model.webStatus = data.webStatus;
    model.mobileStatus = data.mobileStatus;
    model.sortOrder = data.sortOrder;
    model.parentId = data.parentId;
    model.parentName = data.parentName;
    model.bannerLanguage = data.bannerLanguage;
    model.isActive = data.isActive;
    model.webStatusKey = data.webStatusKey;
    model.mobileStatusKey = data.mobileStatusKey;
    model.createdByName = data.createdByName;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);

    return model;
  }

  public validateAllFields(){
    Object.keys(this.FormGroup.controls).forEach(field => {
      const control = this.FormGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  public initValidateRules() {

    this.addFormControl('location');
    this.addFormControl('specifiedPage');
    this.addFormControl('categories');
    this.addFormControl('products');
    this.addFormControl('image');
    this.addFormControl('parentId');
    this.addFormControl('bannerLanguage');
    this.addFormControl('createdByName');

    this.addRule('bannerName', 'required', Validators.required, 'BANNER_NAME_REQUIRED');
    this.addRule('bannerName', 'minlength', Validators.minLength(MIN_LENGTHS_VALUES.MIN_LENGTH_3), 'BANNER_NAME_LENGTH');
    this.addRule('startDate', 'required', Validators.required, 'BANNER_START_DATE_REQUIRED');
    this.addRule('endDate', 'required', Validators.required, 'BANNER_END_DATE_REQUIRED');
    this.addRule('webStatus', 'required', Validators.required, 'BANNER_WEB_STATUS_REQUIRED');
    this.addRule('mobileStatus', 'required', Validators.required, 'BANNER_MOBILE_STATUS_REQUIRED');
    this.addRule('sortOrder', 'minlength', Validators.minLength(MIN_LENGTHS_VALUES.MIN_LENGTH_1), 'BANNER_SORT_ORDER_LENGTH');

    this.FormGroup = this.getFormGroup();
  }
}
