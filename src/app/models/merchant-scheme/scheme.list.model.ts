import { DateHelper } from '../../helper/date.helper';
import { MOMENT_DATE_FORMAT, LOGISTIC_TYPES_ARRAY } from '../../modules';
import { UtilHelper } from '../../helper/util.helper';
import * as Constant from '../../modules/constants';
import * as _ from 'lodash';

export class SchemeListModel {
  public schemeName: string;
  public duration: string;
  public validity: Date;
  public durationLabel: string;
  public registrationFeeB2c: number;
  public registrationFeeB2b: number;
  public agreementPeriodB2c: number;
  public agreementPeriodB2b: number;
  public transactionFeeB2c: number;
  public transactionFeeB2b: number;
  public schemeType: string;
  public remark: string;
  public isActive: number;
  public isActiveKey: string;
  public rid: string;
  public schemeId: String;
  public createdDate: string;
  public updatedDate: string;

  static toResponseModel(data: any, filters: any = []) {
    const model = new SchemeListModel();
    model.schemeName = data.schemeName;
    model.duration =  data.duration ? _.filter(Constant.DURATION_ARRAY, { value: data.duration })[0]['label'] : '';
    model.validity = DateHelper.toFormat(data.validity, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.schemeType =  data.schemeName ? _.filter(Constant.SCHEME_TYPES_ARRAY, { value: data.schemeType })[0]['label'] : '';
    model.registrationFeeB2b = data.registrationFeeB2b;
    model.registrationFeeB2c = data.registrationFeeB2c;
    model.agreementPeriodB2b = data.agreementPeriodB2b;
    model.agreementPeriodB2c = data.agreementPeriodB2c;
    model.transactionFeeB2b = data.transactionFeeB2b;
    model.transactionFeeB2c = data.transactionFeeB2c;
    model.schemeId = data.schemeId;
    model.rid = data.rid;
    model.remark = data.remark;
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);

    return model;
  }
}
