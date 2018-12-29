import { BaseModel } from './../base.model';
import { ValidateModel } from './../validate.model';
import { UtilHelper } from '../../helper/util.helper';

export class RoleFormModel extends BaseModel {
  public roleName: string;
  public permissionType: any;
  public permission: any;
  public defaultRole: number;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }


  /**
  *
  * @param data
  * @returns {UserModel}
  */
 public static toRequestModel(data: RoleFormModel): RoleFormModel {
  const model = new RoleFormModel();
  model.roleName = UtilHelper.setDataDefault(data.roleName);
  model.permission = JSON.stringify(UtilHelper.setDataDefault(data.permission));
  model.permissionType = data.permissionType;

  delete model.validateRules;
  return model;
}

  public initValidateRules(): ValidateModel {
    this.addRule('name', 'required', true, this._t('ROLE_NAME_REQUIRED'));
    this.addRule('name', 'alphanumeric', true, this._t('INVALID_INPUT'));
    this.addRule('permissionType', 'required', true, this._t('ROLE_PERMISSIONS_REQUIRED'));
    return this.getRules();
  }
}
