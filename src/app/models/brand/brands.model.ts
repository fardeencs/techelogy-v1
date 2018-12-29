import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT, STATUS_ARRAY, MAX_LENGTHS_VALUES } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReactiveFormBaseModel } from '../reactive.form.base.model';
import { ReactiveFormValidateModel } from '../reactive.form.validate.model';
import '../../helper/custom-extension';

export class Brands extends ReactiveFormBaseModel {
    entityId: number;
    brandName: string;
    startDate: string;
    endDate: string;
    icon: string;
    image: string;
    location: number;
    landingPage: string;
    specifiedPage: any;  //Comma  separated  
    categories: any;  //Comma  separated  
    products: any;  //Comma  separated  
    topBrands: number;
    latestBrands: number;
    monthBrand: number;
    sortOrder: number;
    public isActive: string;
    public isActiveKey: string;
    public rid: string;
    iconName : string;
    imageName : string;


    public formGroup: FormGroup;

    constructor() {
        super();
        this.validateRules = new ReactiveFormValidateModel();
        this.initValidateRules();
    }

    /**
    *
    * @param data
    * @returns {Brands}
    */
    public static toRequestModel(data: Brands): Brands {
        const model = new Brands();
        model.brandName = UtilHelper.setDataDefault(data.brandName);
        model.startDate = DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.YYYY_MM_DD);
        model.endDate = DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.YYYY_MM_DD);
        model.icon = data.icon;
        model.image = data.image;
        model.location = data.location;
        model.landingPage = data.landingPage;
        model.specifiedPage = data.specifiedPage ? data.specifiedPage.join(",") : data.specifiedPage;
        model.categories = data.categories ? data.categories.join(",") : data.categories;
        model.products = data.products ? data.products.join(",") : data.products;
        model.sortOrder = data.sortOrder;
        model.monthBrand = data.monthBrand;
        model.latestBrands = data.latestBrands;
        model.topBrands = data.topBrands;
        model.isActive = data.isActive;

        delete model.validateRules;
        delete model.formGroup;
        return model;
    }

    static toResponseModel(data: Brands, filters: any = []) {
        const model = new Brands();
        model.rid = data.rid;
        model.entityId = data.entityId;
        model.brandName = data.brandName
        //model.startDate = data.startDate;
        //model.endDate = data.endDate;
        model.startDate = DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
        model.endDate = DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
        model.icon = data.icon;
        model.image = data.image;
        model.iconName = data.iconName;
        model.imageName = data.imageName;
        model.location = data.location;
        model.landingPage = data.landingPage;
        model.specifiedPage = data.specifiedPage;
        model.categories = data.categories;
        model.products = data.products;
        model.topBrands = data.topBrands;
        model.latestBrands = data.latestBrands;
        model.monthBrand = data.monthBrand;
        model.sortOrder = data.sortOrder;
        model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
        model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
        model.isActive = data.isActive;
        model.isActiveKey = data.isActiveKey;

        delete model.validateRules;
        delete model.formGroup;
        return model;
    }

    static toFormModel(data: Brands) {
        
        let something = DateHelper.toFormatDate
        const model = new Brands();
        model.brandName = UtilHelper.setDataDefault(data.brandName, "");
        model.startDate = UtilHelper.setDataDefault(data.startDate ? new Date(data.startDate) : data.startDate, new Date());
        model.endDate = UtilHelper.setDataDefault(data.endDate ? new Date(data.endDate) : data.endDate, new Date());
        model.icon = UtilHelper.setDataDefault(data.icon, "");
        model.image = UtilHelper.setDataDefault(data.image, "");
        model.location = UtilHelper.setDataDefault(data.location, null);
        //data.location ? UtilHelper.setDataDefault(_.map(data.location, d => d.pageId), []) : [];//
        model.landingPage = UtilHelper.setDataDefault(data.landingPage, "0");
        model.latestBrands = UtilHelper.setDataDefault(data.latestBrands, "0");
        model.specifiedPage = data.specifiedPage ? UtilHelper.setDataDefault(_.map(data.specifiedPage, d => d.pageId), []) : [];
        model.categories = data.categories ? UtilHelper.setDataDefault(_.map(data.categories, d => d.catalogId), []) : []; //UtilHelper.setDataDefault(data.categories,[]);
        model.products = data.products ? UtilHelper.setDataDefault(_.map(data.products, d => d.productId), [])  : [];
        model.topBrands = UtilHelper.setDataDefault(data.topBrands, "0");
        model.sortOrder = UtilHelper.setDataDefault(data.sortOrder, null);
        model.monthBrand = UtilHelper.setDataDefault(data.monthBrand, "0");
        model.isActive = UtilHelper.setDataDefault(data.isActive, "1");

        delete model.validateRules;
        delete model.formGroup;
        return model;
    }

    static convertArrayToJoinText(data: any) {
        data.productsName = data.products ? data.products.convertArrayToJoinText('productName') : "";
        data.specifiedPageTitle = data.specifiedPage ? data.specifiedPage.convertArrayToJoinText('pageTitle'): "";
        data.categoriesName = data.categories ?data.categories.convertArrayToJoinText('categoryName'): "";
    }

    static getBoolText(value : string): string {
        if (value){
            return (value == "1") ? "YES" :  "NO";
            //return (value == "1" || value == 1) ? "COMMON.LABELS.YES" :  "COMMON.LABELS.NO";
        }
        else
            return "";
    }

    static getLocationText(value: string): string {
        if (value){
            return (value == "1") ? "TOP" :  "BOTTOM";
           // return (value == "1") ? "COMMON.LABELS.TOP" :  "COMMON.LABELS.BOTTOM";
        }
        else
            return "";
    }

    public initValidateRules() {
        this.addFormControl('location');
        this.addFormControl('specifiedPage');
        this.addFormControl('categories');
        this.addFormControl('products');
        this.addFormControl('icon');
        this.addFormControl('image');
        this.addRule('brandName', 'required', Validators.required, 'BRAND_NAME_REQUIRED');
        this.addRule('brandName', 'countryName', ReactiveFormValidateModel.countryName, 'BRAND_NAME_ALPHANUMERIC');
        this.addRule('brandName', 'minlength', Validators.minLength(MIN_LENGTHS_VALUES.BRAND_NAME), 'BRAND_NAME_LENGTH')
        this.addRule('brandName', 'maxlength', Validators.maxLength(MAX_LENGTHS_VALUES.BRAND_NAME), 'BRAND_NAME_LENGTH')
        this.addRule('startDate', 'required', Validators.required, 'BRAND_START_DATE_REQUIRED');
        this.addRule('endDate', 'required', Validators.required, 'BRAND_END_DATE_REQUIRED');
        this.addRule('landingPage', 'required', Validators.required, 'COMMON.PLEASE_SELECT');
        this.addRule('topBrands', 'required', Validators.required, 'COMMON.PLEASE_SELECT');
        this.addRule('latestBrands', 'required', Validators.required, 'COMMON.PLEASE_SELECT');
        this.addRule('monthBrand', 'required', Validators.required, 'COMMON.PLEASE_SELECT');
        //this.addRule('sortOrder', 'numbers', ReactiveFormValidateModel.numbersOnly, 'CATEGORY_SORTORDER_NUMERIC');
        this.addRule('sortOrder', 'minlength', Validators.minLength(MIN_LENGTHS_VALUES.SORT_ORDER), 'CATEGORY_SORTORDER_MIN_LENGTH');
        this.addRule('sortOrder', 'maxlength', Validators.maxLength(MAX_LENGTHS_VALUES.SORT_ORDER), 'CATEGORY_SORTORDER_MIN_LENGTH');
        this.addRule('isActive', 'required', Validators.required, 'STATUS_REQUIRED');
        this.formGroup = this.getFormGroup();
    }
}
