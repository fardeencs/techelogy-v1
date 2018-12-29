import { UtilHelper } from './../../helper/util.helper';
import { ValidateModel } from './../validate.model';
import { BaseModel } from './../base.model';

export class DocumentuploadModel extends BaseModel {
  public documentTypeId: string;
  public documentValue: string;
  public documentId: string;
  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }

  /**
  *
  * @param data
  * @returns {ContactmerchantModel}
  */
  public static toRequestModel(data: DocumentuploadModel): DocumentuploadModel {
    const model = new DocumentuploadModel();
    model.documentTypeId = UtilHelper.setDataDefault(data.documentTypeId);
    model.documentValue = UtilHelper.setDataDefault(data.documentValue);
    model.documentId = UtilHelper.setDataDefault(data.documentId);

    delete model.validateRules;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('docType', 'required', true, this._t('DOCUMENT_TYPE_REQUIRED'));
    this.addRule('document', 'required', true, this._t('ONE_DOCUMENT_REQUIRED'));
    return this.getRules();
  }
}
