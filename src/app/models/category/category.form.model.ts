import { BaseModel } from './../base.model';
import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';

export class CategoryFormModel extends BaseModel {
  public countryIds: string;
  public categoryId: number;
  public sortOrder: number;
  public isHalal: string = '2';
  public primaryImageSize: number;
  public landingPage: string = '1';
  public parentId: number = 0;
  public level: number = 1;
  public isApproved: number = 0;
  public iconImageName: string;
  public backgroundImageName: string;
  public mobileImageName: string;
  public primaryImageName: string;
  public approvalStatus: string = '0';
  public isActive: string = '1';
  public categoryName: string;
  public selctedCountryIds: string;
  public iconImage: string;
  public backgroundColor: string;
  public backgroundImage: string;
  public primaryImageArr: any = [];
  public primaryImage: string;
  public primaryImageUrl: string;
  public mobileImage: string;
  public isActiveKey: string;
  public status: string;
  public rid: string;
  public createdByName: string;
  public parentName: string;
  public imageUpload: any = { iconImage: "", backgroundImage: "", primaryImage: "", mobileImage: "" }

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }




  /**
  *
  * @param data
  * @returns {CountryFormModel}
  */
  public static toRequestModel(data: CategoryFormModel): CategoryFormModel {

    const model = new CategoryFormModel();
    model.countryIds = data.countryIds;
    model.categoryName = data.categoryName;
    model.categoryId = data.categoryId;
    model.sortOrder = (data.sortOrder);
    model.isHalal = data.isHalal;
    model.approvalStatus = data.isApproved.toString();
    model.backgroundColor = UtilHelper.setDataDefault(data.backgroundColor);
    model.backgroundImage = data.imageUpload.backgroundImage ? UtilHelper.setDataDefault(data.imageUpload.backgroundImage) : "";
    model.iconImage = data.imageUpload.iconImage ? UtilHelper.setDataDefault(data.imageUpload.iconImage) : "";
    model.parentId = (data.parentId);
    model.level = UtilHelper.setDataDefault(data.level);
    model.primaryImage = data.imageUpload.primaryImage ? UtilHelper.setDataDefault(data.imageUpload.primaryImage) : "";
    model.primaryImageSize = UtilHelper.setDataDefault(data.primaryImageSize);
    model.primaryImageUrl = UtilHelper.setDataDefault(data.primaryImageUrl);
    model.landingPage = data.landingPage;
    model.mobileImage = data.imageUpload.mobileImage ? UtilHelper.setDataDefault(data.imageUpload.mobileImage) : "";
    model.status = data.isActive;
    model.isActive = data.isActive;
    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new CategoryFormModel();
    model.rid = data.rid,
    model.countryIds = UtilHelper.setDataDefault(data.countryIds);
    model.categoryName = data.categoryName;
    model.categoryId = data.categoryId;
    model.sortOrder = (data.sortOrder);
    model.isHalal = (data.isHalal);
    model.isApproved = (data.isApproved);
    model.backgroundColor = UtilHelper.setDataDefault(data.backgroundColor);
    model.backgroundImage = UtilHelper.setDataDefault(data.backgroundImage);
    model.iconImage = UtilHelper.setDataDefault(data.iconImage);
    model.parentId = data.parentId;
    model.level = (data.level);
    model.backgroundImageName = UtilHelper.setDataDefault(data.backgroundImageName);
    model.iconImageName = UtilHelper.setDataDefault(data.iconImageName);
    model.mobileImageName = UtilHelper.setDataDefault(data.mobileImageName);
    model.primaryImageName = UtilHelper.setDataDefault(data.primaryImageName);
    model.primaryImageArr = (data.primaryImage) ? JSON.parse(data.primaryImage) : [];
    model.primaryImageSize = (data.primaryImageSize);
    model.primaryImageUrl = UtilHelper.setDataDefault(data.primaryImageUrl);
    model.landingPage = data.landingPage;
    model.createdByName = UtilHelper.setDataDefault(data.createdByName);
    model.parentName = UtilHelper.setDataDefault(data.parentName);
    model.mobileImage = UtilHelper.setDataDefault(data.mobileImage);
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = (data.isActive);
    model.isActiveKey = data.isActiveKey;
    return model;
  }

  public initValidateRules(): ValidateModel {

    this.addRule('categoryName', 'required', true, this._t('CATEGORY_NAME_REQUIRED'));
    this.addRule('categoryName', 'categoryName', true, this._t('CATEGORY_NAME_ALPHANUMERIC'));
    this.addRule('categoryName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('CATEGORY_NAME_MIN_LENGTH'));

    this.addRule('backgroundColor', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_7, this._t('CATEGORY_BG_COLOR'));
    this.addRule('primaryImageUrl', 'validate-url', true, this._t('INVALID_WEBSITE_ADDRESS'));

    this.addRule('sortOrder', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('CATEGORY_SORTORDER_MIN_LENGTH'));
    this.addRule('isHalal', 'required', true, this._t('HALAL_REQUIRED'));
    this.addRule('isApproved', 'required', true, this._t('STATUS_REQUIRED'));
    this.addRule('isActive', 'required', true, this._t('STATUS_REQUIRED'));
    this.addRule('countryIds', 'required', true, this._t('COUNTRIES_IS_REQUIRED'));

    return this.getRules();
  }
}
