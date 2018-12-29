import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

declare var jQuery: any;

export class ReactiveFormValidateModel {
  private rules: Object = {};
  private messages: Object = {};

  private fb = new FormBuilder();

  constructor() {
    
  }

  static countryName(control : FormControl){
      if (control.value.match(/^[a-zA-Z-\s]+$/i)) {
          return null;
      } else {
          return { 'countryName': true };
      }
  }

  static numbersOnly(control : FormControl){
    if(!control.value || control.value.match(/^\+?[0-9().]+$/)){
      return null;
    }else{
      return { 'numbers' : true }
    }
  }





  static maxSizeUpload(param : number = 5){
    return (control : FormControl) => {
      if (control && control.value.files.length) {
        let size = control.value.files[0].size;
        // unit MB
        let maxSize = param * 1024 * 1024;
        if (size > maxSize)
          return { 'maxSizeUpload' : true }
        else
          return null;
      } else 
        return null;

    }
  }

  /**
   *
   * @param fieldName
   * @param rule
   * @param message
   */
  public addRule(fieldName: string, errorName : string, validator: Function, message: string = '') {
    if (this.rules && !_.isObject(this.rules[fieldName])) {
      this.rules[fieldName] = ['',[]]; //initilaizing the rules array with default value for the model
    }

    if (this.messages && !_.isObject(this.messages[fieldName])) {
      this.messages[fieldName] = {};
    }

    this.rules[fieldName][1].push(validator);

    if (message) {
      this.messages[fieldName][errorName] = message;
    }
  }

  /**
     *
     * @param fieldName
     * @param rule
     * @param value
     * @param message
     */
  public removeRule(fieldName: string, rule: Function) {
    if (this.rules && _.isObject(this.rules[fieldName])) {
      let index = _.find(this.rules[fieldName], d => {
        return d == rule;
      })
      this.rules[fieldName].splice(index, 1);
    }
  }

  /**
     * Get validate rule
     * @returns {ValidateModel}
     */
  public getRules(): ReactiveFormValidateModel {
    return this;
  }

  /**
   * Get validate form group
   * @returns {FormGroup}
   */
  public getFormGroup(): FormGroup {
    return this.fb.group(this.rules);
  }

   /**
   *
   * @param fieldName
   * @param value
   */

  public addFormControl(fieldName,value){
    this.rules[fieldName] = [value,[]];
    this.messages[fieldName] = {};
  }


  public _t(message: string): string {
    return message;
  }
}
