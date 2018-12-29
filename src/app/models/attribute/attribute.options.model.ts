
import * as _ from 'lodash';
import { ReactiveFormBaseModel } from '../reactive.form.base.model';
import { ReactiveFormValidateModel } from '../reactive.form.validate.model';
import { UtilHelper } from '../../helper/util.helper';

export class AttributeOptionsModel extends ReactiveFormBaseModel {
  public isDefault: string;
  public swatch: string;
  public name: string;
  public value: string;
  public label: string;
  public isDeleted: boolean;
  public entityId: string;;
  public inputType: number = 0;
  constructor() {
    super();
    this.validateRules = new ReactiveFormValidateModel();
    this.validateRules['messages'] = {
      name: { required: "ATTRIBUTE_VALUE_REQUIRED", minlength: "ATTRIBUTE_VALUE_LENGTH" },
      label: { required: "ATTRIBUTE_SWATCH_REQUIRED" }
    }
  }
  /**
  *
  * @param data
  * @returns {AttributeOptionsModel}
  */
  static toRequestModel(data: AttributeOptionsModel): AttributeOptionsModel {
    const model = new AttributeOptionsModel();
    model.entityId = data.entityId;
    model.isDefault = data.isDefault ? '1' : '0';
    model.value = data.name;
    model.label = data.swatch ? data.label : data.name;
    model.swatch = data.swatch ? data.swatch : '0';
    model.isDeleted = data.isDeleted;
    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: AttributeOptionsModel) {
    const model = new AttributeOptionsModel();
    model.entityId = (data.entityId),
    model.isDefault = data.isDefault ? '1' : '0';
    model.isDeleted = (data.isDeleted);
    model.name = UtilHelper.setDataDefault(data.value);
    model.label = UtilHelper.setDataDefault(data.label);
    model.swatch = UtilHelper.setDataDefault(data.swatch);
    delete model.validateRules;
    return model;
  }



}
