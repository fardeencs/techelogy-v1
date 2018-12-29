import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';

export class MerchantschemeModel extends BaseModel {
  public schemeTypeId: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
    *
    * @param data
    * @returns {MerchantschemeModel}
    */
   public static toMerchantschemeModel(data: MerchantschemeModel): MerchantschemeModel {
    const model = new MerchantschemeModel();
    model.schemeTypeId = UtilHelper.setDataDefault(data.schemeTypeId);

    delete model.validateRules;
    return model;
  }

  /**
  *
  * @param data
  * @returns {MerchantschemeModel}
  */
  public static toRequestModel(data: MerchantschemeModel): MerchantschemeModel {
    const model = new MerchantschemeModel();
    model.schemeTypeId = UtilHelper.setDataDefault(data.schemeTypeId);
    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('schemeTypeId', 'required', true, this._t('MERCHANT_SCHEME_REQUIRED'));
    return this.getRules();
  }
}
