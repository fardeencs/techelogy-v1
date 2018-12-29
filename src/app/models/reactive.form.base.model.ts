import { UtilHelper } from '../helper/util.helper';
import { ReactiveFormValidateModel } from './reactive.form.validate.model';
import { FormGroup } from '@angular/forms';
declare var jQuery: any;

export class ReactiveFormBaseModel {
  public id: string;
  public createdDate: string;
  public updatedDate: string;
  public isEnable: any;
  public isDeleted: boolean;

  public validateRules: ReactiveFormValidateModel;

  constructor() {
  }

  /**
   *
   * @param fieldName
   * @param rule
   * @param value
   * @param message
   */
  public addRule(fieldName: string, errorName : string, validator: Function, message: string = '') {
    this.validateRules.addRule(fieldName, errorName, validator, message);
  }

  /**
   *
   * @param fieldName
   * @param rule
   */
  public removeRule(fieldName: string, rule: Function) {
    this.validateRules.removeRule(fieldName, rule);
  }

  /**
   *
   * @param fieldName
   * @param rule
   */
  public removeAllRule() {
    this.validateRules = new ReactiveFormValidateModel();
  }

  /**
   * Get validate rule
   * @returns {ValidateModel}
   */
  public getRules(): ReactiveFormValidateModel {
    return this.validateRules.getRules();
  }

  /**
   * Get validate FormGroup
   * @returns {FormGroup}
   */
  public getFormGroup(): FormGroup {
    return this.validateRules.getFormGroup();
  }

  /**
   * validate form data
   * @param formElementId
   * @param rules
   * @returns {any}
   */
  public validate(formElementId: string, ruleModel?: ReactiveFormValidateModel): boolean {
    const form = jQuery('#' + formElementId);

    this.resetForm(formElementId, ruleModel);
     if (ruleModel != null) {
      form.validate(ruleModel);
    } else {
      form.validate(this.getRules());
    }
    return form.valid();
  }

  /**
   * Reset validate form data
   * @param formElementId
   * @param rules
   */
  public resetForm(formElementId: string, ruleModel?: ReactiveFormValidateModel): void {
    const form = jQuery('#' + formElementId);
    const validation = form.validate();
    let obj: any = this.getRules();
    if (ruleModel != null) {
      obj = ruleModel;
    }

    validation.resetForm();
    validation.settings.rules = obj.rules;
    validation.settings.messages = obj.messages;
    validation.settings.errorPlacement = obj.errorPlacement;
  }

  /** */
  public addFormControl(fieldName: string, value:any ='') {
    this.validateRules.addFormControl(fieldName,value);
  }

    /**
   * Get Validate Message
   * @param message
   * @returns {string}
   */
  public _t(message: string): string {
    return UtilHelper.translate(message);
  }

  
  static resetAllFields(formGroup : FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsPristine();
    });
  }

  static validateAllFields(formGroup : FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
}
