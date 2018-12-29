
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import { FormBuilder, Validators, FormGroup, FormArray, } from '@angular/forms';
import * as _ from 'lodash';
import { ReactiveFormBaseModel } from '../reactive.form.base.model';
import { ReactiveFormValidateModel } from '../reactive.form.validate.model';
import { AttributeOptionsModel } from './attribute.options.model';

export class AttributeFormModel extends ReactiveFormBaseModel {

  public name: string;
  public entityId: number;
  public isActive: string;
  public isActiveKey: string;
  public isRequired: string;
  public entityType: number;
  public inputType: string;
  public inputTypeKey: number;
  public createdByName: string;
  public entityTypeKey:string;
  public rid: string;
  public createdDate: string;
  public updatedDate: string;
  public imageUpload: any = { backgroundImage: "", productPlaceholder: "", otherPlaceholder: "" };
  public options: string;
  public attributeOptions: Array<object> = [];
  public attributeFormGroup: FormGroup;
  public _fb = new FormBuilder();
  constructor() {
    super();
    this.validateRules = new ReactiveFormValidateModel();
    this.initValidateRules();
  }


  /**
  *
  * @param data
  * @returns {AttributeFormModel}
  */
  public static toRequestModel(data: any): AttributeFormModel {
    const model = new AttributeFormModel();
    model.name = data.name;
    model.entityType = data.entityType;
    model.isRequired = data.isRequired.toString();
    model.inputType = data.inputType;
    model.inputTypeKey = data.inputTypeKey;
    model.isActive = data.isActive.toString();
    model.options = JSON.stringify(data.attributeOptions.map(AttributeOptionsModel.toRequestModel));
    delete model.validateRules;
    delete model._fb;
    delete model.attributeFormGroup;
    delete model.imageUpload;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new AttributeFormModel();
    model.rid = data.rid, model.name = data.name;
    model.entityId = data.entityId;
    model.entityType = data.entityType;
    model.isRequired = data.isRequired;
    model.inputType = data.inputType;
    model.options = data.options;
    model.entityTypeKey = data.entityTypeKey;
    model.inputTypeKey = data.inputTypeKey;
    model.createdByName = data.createdByName;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    delete model.validateRules;
    delete model.imageUpload;
    return model;
  }

  static toFormResponseModel(data: any, filters: any = []) {
    const model = new AttributeFormModel();
    model.rid = data.rid, model.name = data.name;
    model.entityId = data.entityId;
    model.entityType = data.entityType;
    model.isRequired = data.isRequired;
    model.inputType = data.inputType;
    model.inputTypeKey = data.inputTypeKey;
    model.createdByName = data.createdByName;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    delete model.validateRules;
    delete model.imageUpload;
    return model;
  }

  public validateAllFields() {
    Object.keys(this.attributeFormGroup.controls).forEach(field => {
      const control = this.attributeFormGroup.get(field);
      if (control instanceof FormArray) {
        this.ValidateAllOptionsFields(control);
      } else {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  public ValidateAllOptionsFields(options: FormArray) {
    Object.keys(options.controls).forEach(index => {
      const childControl: any = this.attributeFormGroup.get('attributeOptions.' + index);
      Object.keys(childControl.controls).forEach(field => {
        const control = childControl.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    });
  }

  public optionsPatchValue(options = [],inputType:number = 0) {
    let isRequired:Array<any> = [];
    if(inputType==3){
      isRequired = [Validators.required];
    }
    if (options.length) {
      let control = <FormArray>this.attributeFormGroup.controls.attributeOptions;
      options.forEach(x => {
        control.push(this._fb.group({
          entityId: x.entityId,
          isDeleted: x.isDeleted,
          swatch: x.swatch,
          label: [x.label,isRequired],
          name: [x.name, [Validators.required, Validators.minLength(MIN_LENGTHS_VALUES.MIN_LENGTH_1)]],
          isDefault: [x.isDefault]
        }));
      })
    }
  }

  public initValidateRules() {
    this.addFormControl('createdByName');
    this.addRule('inputType', 'required', Validators.required, 'ATTRIBUTE_INPUT_TYPE');
    this.addRule('entityType', 'required', Validators.required, 'THEME_STATUS_REQUIRED');
    this.addRule('name', 'required', Validators.required, 'ATTRIBUTE_NAME_REQUIRED');
    this.addRule('name', 'minlength', Validators.minLength(MIN_LENGTHS_VALUES.MIN_LENGTH_3), 'ATTRIBUTE_NAME_LENGTH');
    this.addRule('isRequired', 'required', Validators.required, 'THEME_STATUS_REQUIRED');
    this.addRule('isActive', 'required', Validators.required, 'STATUS_REQUIRED');
    this.attributeFormGroup = this.getFormGroup();
    this.attributeFormGroup.addControl('attributeOptions', this._fb.array([]));
  }

  public attributeOption(inputType:number = 0) {
    let isRequired:Array<any> = [];
    if(inputType==3){
      isRequired = [Validators.required];
    }
    return this._fb.group({
      entityId: "",
      isDeleted: 0,
      swatch: 0,
      label: ["",isRequired],
      name: ["", [Validators.required, Validators.minLength(MIN_LENGTHS_VALUES.MIN_LENGTH_1)]],
      isDefault: [0]
    });
  }
}
