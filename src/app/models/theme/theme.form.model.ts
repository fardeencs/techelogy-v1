
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormBaseModel } from '../reactive.form.base.model';
import { ReactiveFormValidateModel } from '../reactive.form.validate.model';

export class ThemeFormModel extends ReactiveFormBaseModel {

  public name: string;
  public currentDate:string = DateHelper.toFormat(new Date(), MOMENT_DATE_FORMAT.DD_MM_YYYY);
  public entityId:number;
  public themeId:number;
  public startDate: string;
  public endDate: string;
  public eDate:Date;
  public sDate:Date;
  public isDefault: string = '1';
  public headerBackgroundColor: string;
  public headerFontColor: string;
  public productPlaceholder: string;
  public otherPlaceholder: string;
  public isActive: string = '0';
  public backgroundColor: string;
  public backgroundImage: string;
  public backgroundImageName: string;
  public productPlaceholderName: string;
  public otherPlaceholderName: string;
  public isActiveKey: string;
  public status: string;
  public rid: string;
  public createdByName: string;
  public imageUpload: any = { backgroundImage: "",productPlaceholder:"",otherPlaceholder:"" };
  public themeFormGroup : FormGroup;
  constructor() {
    super();
    this.validateRules = new ReactiveFormValidateModel(); 
    this.initValidateRules(); ;
  }

  /**
  *
  * @param data
  * @returns {ThemeFormModel}
  */
  public static toRequestModel(data: ThemeFormModel): ThemeFormModel {
    const model = new ThemeFormModel();
    model.name = UtilHelper.setDataDefault(data.name);
    model.startDate = DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.YYYY_MM_DD); 
    model.endDate = DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.YYYY_MM_DD); 
    model.headerBackgroundColor = UtilHelper.setDataDefault(data.headerBackgroundColor);
    model.headerFontColor = UtilHelper.setDataDefault(data.headerFontColor);
    model.backgroundColor = UtilHelper.setDataDefault(data.backgroundColor);
    model.backgroundImage = data.imageUpload.backgroundImage ? UtilHelper.setDataDefault(data.imageUpload.backgroundImage) : "";
    model.otherPlaceholder = data.imageUpload.otherPlaceholder ? UtilHelper.setDataDefault(data.imageUpload.otherPlaceholder) : "";   
    model.productPlaceholder = data.imageUpload.productPlaceholder ? UtilHelper.setDataDefault(data.imageUpload.productPlaceholder) : "";      
    model.isActive = data.isActive.toString();
    model.isDefault = (data.isDefault).toString();
    delete model.imageUpload;
    delete model.validateRules;
    delete model.themeFormGroup;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new ThemeFormModel();
    model.rid = data.rid,   
    model.name = data.name;
    model.entityId = data.entityId;
    model.startDate = DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.endDate = DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.eDate = data.endDate;
    model.sDate = data.startDate;
    model.headerBackgroundColor = UtilHelper.setDataDefault(data.headerBackgroundColor);
    model.backgroundColor = UtilHelper.setDataDefault(data.backgroundColor);
    model.headerFontColor = UtilHelper.setDataDefault(data.headerFontColor);
    model.backgroundImage = UtilHelper.setDataDefault(data.backgroundImage);
    model.productPlaceholder = UtilHelper.setDataDefault(data.productPlaceholder); 
    model.otherPlaceholder = UtilHelper.setDataDefault(data.otherPlaceholder); 
    model.backgroundImageName = UtilHelper.setDataDefault(data.backgroundImageName);
    model.productPlaceholderName = UtilHelper.setDataDefault(data.productPlaceholderName); 
    model.otherPlaceholderName= UtilHelper.setDataDefault(data.otherPlaceholderName);
    model.createdByName = UtilHelper.setDataDefault(data.createdByName);
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = (data.isActive);
    model.isDefault = (data.isDefault);
    model.isActiveKey = data.isActiveKey;
    delete model.validateRules;
    delete model.themeFormGroup;
    return model;
  }

  static toFormModel(data : ThemeFormModel) {
    const model = new ThemeFormModel();
    model.name = data.name;
    model.entityId = data.entityId;
    model.startDate = DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.endDate = DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.headerBackgroundColor = UtilHelper.setDataDefault(data.headerBackgroundColor);
    model.backgroundColor = UtilHelper.setDataDefault(data.backgroundColor);
    model.backgroundImage = UtilHelper.setDataDefault(data.backgroundImage);
    model.headerFontColor = UtilHelper.setDataDefault(data.headerFontColor);
    model.otherPlaceholder = UtilHelper.setDataDefault(data.otherPlaceholder);    
    model.productPlaceholder = UtilHelper.setDataDefault(data.productPlaceholder); 
    model.createdByName = UtilHelper.setDataDefault(data.createdByName);
    model.isActive = (data.isActive);
    model.isDefault = (data.isDefault);
    delete model.validateRules;
    delete model.themeFormGroup;
    return model;
  }

  public validateAllFields(){
    Object.keys(this.themeFormGroup.controls).forEach(field => {
      const control = this.themeFormGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  public initValidateRules() {  
    this.addFormControl('createdByName');
    this.addFormControl('backgroundImage'); 
    this.addFormControl('otherPlaceholder');
    this.addFormControl('productPlaceholder');
    this.addRule('name', 'required', Validators.required, 'THEME_NAME_REQUIRED');
    this.addRule('name', 'minlength', Validators.minLength(MIN_LENGTHS_VALUES.MIN_LENGTH_3), 'THEME_NAME_LENGTH');
    this.addRule('startDate', 'required', Validators.required, 'THEME_START_DATE_REQUIRED');
    this.addRule('endDate', 'required', Validators.required, 'THEME_END_DATE_REQUIRED');
    this.addRule('backgroundColor', 'required', Validators.required, 'THEME_BGCOLOR_REQUIRED');
    this.addRule('isDefault', 'required', Validators.required, 'THEME_STATUS_REQUIRED');
    this.addRule('isActive', 'required', Validators.required, 'STATUS_REQUIRED');
    this.addRule('headerBackgroundColor', 'required', Validators.required, 'THEME_HBGCOLOR_REQUIRED');
    this.addRule('headerFontColor', 'required', Validators.required, 'THEME_FBGCOLOR_REQUIRED');
    this.themeFormGroup = this.getFormGroup();
  }
}
