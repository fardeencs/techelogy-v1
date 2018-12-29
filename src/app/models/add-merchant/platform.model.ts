import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';

export class PlatformModel extends BaseModel {
  public storePlatformId: string = "1";
  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
  *
  * @param data
  * @returns {ContactmerchantModel}
  */
  public static toRequestModel(data: PlatformModel): PlatformModel {
    const model = new PlatformModel();
    model.storePlatformId = UtilHelper.setDataDefault(data.storePlatformId);
    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('platformType', 'required', true, this._t('PLATFORM_TYPE_REQUIRED'));
    return this.getRules();
  }
}
