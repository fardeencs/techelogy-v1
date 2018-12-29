import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';
import { BaseModel } from '../base.model';

export class ApprovalStatusFormModel extends BaseModel {
  public status: string;
  public step: string;
  public comment: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }
  /**
    *
    * @param data
    * @returns {ApprovalStatusFormModel}
    */
  public static toRequestModel(data: ApprovalStatusFormModel): ApprovalStatusFormModel {
    const model = new ApprovalStatusFormModel();
    model.status = UtilHelper.setDataDefault(data.status);
    model.step = data.step;
    model.comment = UtilHelper.setDataDefault(data.comment);

    delete model.validateRules;
    return model;
  }

  /**
  * init validate rule
  * @returns {ValidateModel}
  */
  public initValidateRules(): ValidateModel {
    this.addRule('status', 'required', true, this._t('STATUS_REQUIRED'));
    this.addRule('step', 'required', true, this._t('STEP_REQUIRED'));
    return this.getRules();
  }
}
