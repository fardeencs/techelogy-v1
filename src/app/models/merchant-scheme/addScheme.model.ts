import { ValidateModel } from '../validate.model';
import { BaseModel } from '../base.model';
import { UtilHelper } from '../../helper/util.helper';
import { MIN_LENGTHS_VALUES,MAX_LENGTHS_VALUES, SCHEME_TYPES_OBJECT, MOMENT_DATE_FORMAT } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';
import * as Constant from '../../modules/constants';

export class AddSchemeModel extends BaseModel {
  public schemeName: string;
  public duration: number;
  public validity: Date;
  public durationLabel: string;
  public registrationFeeB2c: any='0.00';
  public registrationFeeB2b: any='0.00';
  public agreementPeriodB2c: number=0;
  public agreementPeriodB2b: number=0;
  public transactionFeeB2c: any='0.00';
  public transactionFeeB2b: any='0.00';
  public schemeType: number;
  public remark: string;
  public isActive: any;
  public isActiveKey: string;
  public rid: string;
  public schemeId: String;
  public createdDate: string;
  public updatedDate: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
  *
  * @param data
  * @returns {AddSchemeModel}
  */
  public static toRequestModel(data: AddSchemeModel): AddSchemeModel {
    const model = new AddSchemeModel();
    model.schemeName = UtilHelper.setDataDefault(data.schemeName);
    model.duration = UtilHelper.setDataDefault(data.duration);
    model.validity = DateHelper.toFormat(data.validity, MOMENT_DATE_FORMAT.YYYY_MM_DD_H_m);
    model.schemeType = UtilHelper.setDataDefault(data.schemeType);
    model.registrationFeeB2b = (model.schemeType == SCHEME_TYPES_OBJECT.B2B || model.schemeType == SCHEME_TYPES_OBJECT.BOTH)
      ? UtilHelper.setDataDefault(data.registrationFeeB2b)
      : '';
    model.registrationFeeB2c = (model.schemeType == SCHEME_TYPES_OBJECT.B2C || model.schemeType == SCHEME_TYPES_OBJECT.BOTH)
      ? UtilHelper.setDataDefault(data.registrationFeeB2c)
      : '';
    model.agreementPeriodB2b = (model.schemeType == SCHEME_TYPES_OBJECT.B2B || model.schemeType == SCHEME_TYPES_OBJECT.BOTH)
      ? UtilHelper.setDataDefault(data.agreementPeriodB2b)
      : '';
    model.agreementPeriodB2c = (model.schemeType == SCHEME_TYPES_OBJECT.B2C || model.schemeType == SCHEME_TYPES_OBJECT.BOTH)
      ? UtilHelper.setDataDefault(data.agreementPeriodB2c)
      : '';
    model.transactionFeeB2b = (model.schemeType == SCHEME_TYPES_OBJECT.B2B || model.schemeType == SCHEME_TYPES_OBJECT.BOTH)
      ? UtilHelper.setDataDefault(data.transactionFeeB2b)
      : '';
    model.transactionFeeB2c = (model.schemeType == SCHEME_TYPES_OBJECT.B2C || model.schemeType == SCHEME_TYPES_OBJECT.BOTH)
      ? UtilHelper.setDataDefault(data.transactionFeeB2c)
      : '';
    model.remark = UtilHelper.setDataDefault(data.remark);
    model.isActive = data.isActive;

    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new AddSchemeModel();
    model.schemeName = data.schemeName;
    model.duration =  data.duration;
    model.validity = DateHelper.toFormat(data.validity, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.schemeType =  data.schemeType;
    model.registrationFeeB2b = UtilHelper.toDecimal(data.registrationFeeB2b);
    model.registrationFeeB2c = UtilHelper.toDecimal(data.registrationFeeB2c);
    model.agreementPeriodB2b = data.agreementPeriodB2b;
    model.agreementPeriodB2c = data.agreementPeriodB2c;
    model.transactionFeeB2b = UtilHelper.toDecimal(data.transactionFeeB2b);
    model.transactionFeeB2c = UtilHelper.toDecimal(data.transactionFeeB2c);
    model.schemeId = data.schemeId;
    model.rid = data.rid;
    model.remark = data.remark;
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);

    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('schemeName', 'required', true, this._t('SCHEME_NAME_REQUIRED'));
    this.addRule('schemeName', 'alphanumericwithatdothyphen', true, this._t('SCHEME_NAME_ALPHANUMERIC'));
    this.addRule('schemeName', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('SCHEME_NAME_MIN_LENGTH'));
    this.addRule('duration', 'required', true, this._t('DURATION_REQUIRED'));
    this.addRule('validity', 'required', true, this._t('VALIDITY_REQUIRED'));
    this.addRule('schemeType', 'required', true, this._t('SCHEME_TYPE_REQUIRED'));
    this.addRule('isActive', 'required', true, this._t('STATUS_REQUIRED'));
    this.addRule('registrationFeeB2c', 'required', true, this._t('REGISTARTION_FEE_B2C_REQUIRED'));
    this.addRule('registrationFeeB2c', 'decimalWithTwoDots', true, this._t('REGISTARTION_FEE_B2C_NUMERIC'));
    this.addRule('registrationFeeB2c', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('REGISTARTION_FEE_B2C_MIN_LENGTH'));
    this.addRule('registrationFeeB2b', 'required', true, this._t('REGISTARTION_FEE_B2B_REQUIRED'));
    this.addRule('registrationFeeB2b', 'decimalWithTwoDots', true, this._t('REGISTARTION_FEE_B2B_NUMERIC'));
    this.addRule('registrationFeeB2b', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('REGISTARTION_FEE_B2B_MIN_LENGTH'));
    this.addRule('agreementPeriodB2c', 'required', true, this._t('AGREEMENT_PERIOD_B2C_REQUIRED'));
    this.addRule('agreementPeriodB2c', 'onlyNumber', true, this._t('AGREEMENT_PERIOD_B2C_NUMERIC'));
    this.addRule('agreementPeriodB2c', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('AGREEMENT_PERIOD_B2C_MIN_LENGTH'));
    this.addRule('agreementPeriodB2b', 'required', true, this._t('AGREEMENT_PERIOD_B2B_REQUIRED'));
    this.addRule('agreementPeriodB2b', 'onlyNumber', true, this._t('AGREEMENT_PERIOD_B2B_NUMERIC'));
    this.addRule('agreementPeriodB2b', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('AGREEMENT_PERIOD_B2B_MIN_LENGTH'));
    this.addRule('transactionFeeB2c', 'required', true, this._t('TRANSECTION_FEE_B2C_REQUIRED'));
    this.addRule('transactionFeeB2c', 'decimalWithTwoDots', true, this._t('TRANSECTION_FEE_B2C_NUMERIC'));
    this.addRule('transactionFeeB2c', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('TRANSECTION_FEE_B2C_MIN_LENGTH'));
    this.addRule('transactionFeeB2b', 'required', true, this._t('TRANSECTION_FEE_B2B_REQUIRED'));
    this.addRule('transactionFeeB2b', 'decimalWithTwoDots', true, this._t('TRANSECTION_FEE_B2B_NUMERIC'));
    this.addRule('transactionFeeB2b', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_1, this._t('TRANSECTION_FEE_B2B_MIN_LENGTH'));
    this.addRule('remark', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('REMARKS_MIN_LENGTH'));
    return this.getRules();
  }
}
