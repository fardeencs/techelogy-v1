import { DateHelper } from '../../helper/date.helper';
import { MOMENT_DATE_FORMAT } from '../../modules';

export class DocumentTypeListModel {
    public documentTypeName: string;
    public documentTypeId: string;
    public status: string;
    public statusLabel: string;
    public rid: string;
    public createdDate: string;
    public updatedDate: string;

    static toResponseModel(data: any, filters: any = []) {
      const model = new DocumentTypeListModel();
      model.documentTypeName = data.documentName;
      model.rid = data.rid;
      model.documentTypeId = data.documentTypeId;
      model.status = data.status;
      model.statusLabel = model.status ? 'Active' : 'Inactive';
      model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
      model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);

      return model;
    }

  }
