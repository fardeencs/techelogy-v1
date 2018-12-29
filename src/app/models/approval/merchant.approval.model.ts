import { DateHelper } from '../../helper/date.helper';
import { MOMENT_DATE_FORMAT } from '../../modules';
import * as Constant from '../../modules/constants';
import * as _ from 'lodash';
import { UtilHelper } from '../../helper/util.helper';

export class MerchantApprovalListModel {
  public approvalRequestId: string;
  public approvalStatus: string;
  public storeApprovalStatus: string;
  public assigneeFirstName: string;
  public assigneeLastName: string;
  public assigneeName: string;
  public rid: string;
  public selected?: boolean;
  public roleName: string;
  public storeFirstName: string;
  public storeLastName: string;
  public storeName: string;
  public createdDate: string;
  public updatedDate: string;
  public status: string;
  public approvalDate: string;
  public storeId: string;
  public approvalStatusValue:string;
  public storeApprovalStatusValue:string;

  static toResponseModel(data: any, filters: any = []) {
    const model = new MerchantApprovalListModel();
    model.approvalRequestId = data.approvalRequestId;
    model.approvalStatus = _.filter(Constant.APPROVAL_STATUS_ARRAY, { value: data.approvalStatus })[0]['label'];
    model.storeApprovalStatus = _.filter(Constant.APPROVAL_STATUS_ARRAY, { value: data.storeApprovalStatus })[0]['label'];
    model.assigneeFirstName = data.assigneeFirstName;
    model.assigneeLastName = data.assigneeLastName;
    model.assigneeName = model.assigneeFirstName + ' ' + model.assigneeLastName;
    model.rid = data.rid,
    model.roleName = data.roleName;
    model.storeFirstName = data.storeFirstName ? data.storeFirstName : '';
    model.storeLastName = data.storeLastName ? data.storeLastName : '';
    model.storeName = model.storeFirstName + ' ' + model.storeLastName;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.status = data.status ? 'Active' : 'Inactive';
    model.approvalDate = data.approvalDate ? DateHelper.toFormat(data.approvalDate, MOMENT_DATE_FORMAT.DD_MM_YYYY) : '';
    model.storeId = data.storeId;
    model.approvalStatusValue = data.approvalStatus;
    model.storeApprovalStatusValue = data.storeApprovalStatus;
    return model;
  }
}
