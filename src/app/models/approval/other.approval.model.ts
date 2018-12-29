import { DateHelper } from '../../helper/date.helper';
import { MOMENT_DATE_FORMAT } from '../../modules';
import * as Constant from '../../modules/constants';
import * as _ from 'lodash';

export class OtherApprovalListModel {
  public approvalHistoryId: number;
  public entityId: number;
  public approvalType: string;
  public previousValue: string;
  public proposeValue: string;
  public rid: string;
  public createdDate: string;
  public updatedDate: string;
  public proposedByFname: string;
  public proposedByLname: string;
  public proposedBy: string;
  public status: string;

  static toResponseModel(data: any, filters: any = []) {
    const model = new OtherApprovalListModel();
    model.approvalType = data.approvalType ? _.filter(Constant.OTHER_APPROVAL_TYPE_ARRAY, { value: data.approvalType })[0]['label'] : '';
    model.approvalHistoryId = data.approvalHistoryId;
    model.entityId = data.entityId;
    model.previousValue = data.previousValue;
    model.proposeValue = data.proposeValue;
    model.proposedByFname = data.proposedByFname;
    model.proposedByLname = data.proposedByLname;
    model.proposedBy = model.proposedByFname + ' ' + model.proposedByLname;
    model.rid = data.rid,
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.status = data.status ? _.filter(Constant.OTHER_APPROVAL_STATUS_ARRAY, { value: data.status })[0]['label'] : '';

    return model;
  }
}
