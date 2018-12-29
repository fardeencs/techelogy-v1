import { DateHelper } from '../../helper/date.helper';
import { MOMENT_DATE_FORMAT } from '../../modules';

export class RoleListModel {
  public rid: string;
  public roleId: string;
  public roleName: string;
  public createdDate: string;
  public updatedDate: string;
  public permission: any;
  public permissionType: number;
  public defaultRole: number;

  static toResponseModel(data: any, filters: any = []) {
    const model = new RoleListModel();
    model.rid = data.rid,
    model.roleName = data.roleName;
    model.roleId = data.roleId;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.permission = data.permission;
    model.permissionType = data.permissionType;
    model.defaultRole = data.defaultRole;
    return model;
  }
}
