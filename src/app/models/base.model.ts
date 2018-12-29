import {ValidateModel} from './validate.model';
import { UtilHelper } from '../helper/util.helper';
declare var jQuery: any;

export class BaseModel {
  public id: string;
  public createdDate: string;
  public updatedDate: string;
  public isEnable: any;
  public isDeleted: boolean;

  public validateRules: ValidateModel;

  constructor() {
  }

  /**
   * Validate rule
   * @returns {}
   */

  public initValidateRules(): ValidateModel {
    return this.validateRules.getRules();
  }

  /**
   *
   * @param fieldName
   * @param rule
   * @param value
   * @param message
   */
  public addRule(fieldName: string, rule: string, value: any = true, message: string = '') {
    this.validateRules.addRule(fieldName, rule, value, message);
  }

  /**
   *
   * @param fieldName
   * @param rule
   * @param value
   * @param message
   */
  public removeRule(fieldName: string, rule: string) {
    this.validateRules.removeRule(fieldName, rule);
  }

  /**
   *
   * @param fieldName
   * @param rule
   */
  public removeAllRule() {
    this.validateRules = new ValidateModel();
  }

  /**
   * Get validate rule
   * @returns {ValidateModel}
   */
  public getRules(): ValidateModel {
    return this.validateRules.getRules();
  }

  /**
   * validate form data
   * @param formElementId
   * @param rules
   * @returns {any}
   */
  public validate(formElementId: string, ruleModel?: ValidateModel): boolean {
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
  public resetForm(formElementId: string, ruleModel?: ValidateModel): void {
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

    /**
   * Get Validate Message
   * @param message
   * @returns {string}
   */
  public _t(message: string): string {
    return UtilHelper.translate(message);
  }
}
