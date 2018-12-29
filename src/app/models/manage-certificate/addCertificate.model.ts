import { ValidateModel } from '../validate.model';
import { BaseModel } from '../base.model';
import { UtilHelper } from '../../helper/util.helper';

export class AddCertificateModel extends BaseModel {
  public certificateTypeName: string;
  public status: any;
  public required: any;
  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
    *
    * @param data
    * @returns {CertificateModel}
    */
  public static toAddCertificateModel(data: AddCertificateModel): AddCertificateModel {
    const model = new AddCertificateModel();
    model.certificateTypeName = UtilHelper.setDataDefault(data.certificateTypeName);
    model.status = UtilHelper.setDataDefault(data.status);
    model.required = UtilHelper.setDataDefault(data.required);

    delete model.validateRules;
    return model;
  }

  /**
  *
  * @param data
  * @returns {AddCertificateModel}
  */
  public static toRequestModel(data: AddCertificateModel): AddCertificateModel {
    const model = new AddCertificateModel();
    model.certificateTypeName = UtilHelper.setDataDefault(data.certificateTypeName);
    model.status = data.status;
    model.required = data.required;

    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('certificateTypeName', 'required', true, this._t('MANAGE_CERTIFICATE_CERTIFICATE_NAME_REQUIRED'));
    this.addRule('certificateTypeName', 'alphanumeric', true, this._t('MANAGE_CERTIFICATE_CERTIFICATE_NAME_ALPHANUMERIC'));
    this.addRule('status', 'required', true, this._t('MANAGE_CERTIFICATE_STATUS_REQUIRED'));
    this.addRule('required', 'required', true, this._t('MANAGE_CERTIFICATE_REQUIRED_REQUIRED'));

    return this.getRules();
  }
}
