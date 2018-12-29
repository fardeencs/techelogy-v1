import { ValidateModel } from '../validate.model';
import { BaseModel } from '../base.model';
import { UtilHelper } from '../../helper/util.helper';

export class AddDocumentTypeModel extends BaseModel {
    public documentTypeName: string;
    public status: number;
  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
    *
    * @param data
    * @returns {DocumentTypeModel}
    */
  public static toAddDocumentTypeModel(data: AddDocumentTypeModel): AddDocumentTypeModel {
    const model = new AddDocumentTypeModel();
    model.documentTypeName = UtilHelper.setDataDefault(data.documentTypeName);
    model.status = UtilHelper.setDataDefault(data.status);

    delete model.validateRules;
    return model;
  }

  /**
  *
  * @param data
  * @returns {AddDocumentTypeModel}
  */
  public static toRequestModel(data: AddDocumentTypeModel): AddDocumentTypeModel {
    const model = new AddDocumentTypeModel();
    model.documentTypeName = UtilHelper.setDataDefault(data.documentTypeName);
    model.status = data.status;

    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('documentTypeName', 'required', true, this._t('DOCUMENT_NAME_REQUIRED'));
    this.addRule('documentTypeName', 'alphanumeric', true, this._t('INVALID_INPUT'));
    this.addRule('status', 'required', true, this._t('STATUS_REQUIRED'));

    return this.getRules();
  }
}
