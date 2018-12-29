import { MOMENT_DATE_FORMAT } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as Constant from '../../modules/constants';
import * as _ from 'lodash';
import { BaseModel } from '../base.model';
import { ValidateModel } from '../validate.model';

export class ApprovalCommentModel extends BaseModel {
  public approvalRequestId: string;
  public approvalStatus: string;
  public complainantFirstName: string;
  public complainantLastName: string;
  public complainantName: string;
  public rid: string;
  public roleName: string;
  public comments: string;
  public isNotified: number;
  public step: string;
  public createdDate: string;
  public updatedDate: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  static toResponseModel(data: any, filters: any = []) {
    const model = new ApprovalCommentModel();
    model.approvalRequestId = data.approvalRequestId;
    model.complainantFirstName = data.complainantFirstName;
    model.complainantLastName = data.complainantLastName;
    model.complainantName = model.complainantFirstName + ' ' + model.complainantLastName;
    model.rid = data.rid,
    model.roleName = data.roleName;
    model.comments = data.comments;
    model.isNotified = data.isNotified;
    model.step = model.step;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('step', 'required', true, this._t('DOCUMENT_NAME_REQUIRED.'));
    this.addRule('status', 'required', true, this._t('STATUS_REQUIRED'));

    return this.getRules();
  }
}
