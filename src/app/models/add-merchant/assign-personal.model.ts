import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';

export class AssignPersonalModel extends BaseModel {
  public salesPersonal: string='';
  public storeIds?: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
  *
  * @param data
  * @returns {assignPersonalModel}
  */
  public static toRequestModel(data: AssignPersonalModel): AssignPersonalModel {
    const model = new AssignPersonalModel();
    model.salesPersonal = UtilHelper.setDataDefault(data.salesPersonal);
    model.storeIds = UtilHelper.setDataDefault(data.storeIds);
    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('salesPersonal', 'required', true, this._t('ASSIGN_SALESPERSON_REQUIRED'));
    return this.getRules();
  }
}
