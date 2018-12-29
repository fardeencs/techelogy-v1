import { DateHelper } from '../../helper/date.helper';
import { MOMENT_DATE_FORMAT } from '../../modules';

export class CertificateListModel {
    public certificateTypeName: string;
    public certificateTypeId: string;
    public status: number;
    public isRequired: number;
    public requiredLabel: string;
    public statusLabel: string;
    public rid: string;
    public createdDate: string;
    public updatedDate: string;

    static toResponseModel(data: any, filters: any = []) {
      const model = new CertificateListModel();
      model.rid = data.rid;
      model.certificateTypeName = data.certificateName;
      model.certificateTypeId = data.certificateTypeId;
      model.isRequired = data.isRequired;
      model.requiredLabel = model.isRequired ? 'Yes' : 'No';
      model.status = data.status;
      model.statusLabel = model.status ? 'Active' : 'Inactive';
      model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
      model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);

      return model;
    }

  }
