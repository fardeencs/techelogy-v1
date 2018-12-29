import { DateHelper } from '../../helper/date.helper';
import { MOMENT_DATE_FORMAT } from '../../modules';
import * as Constant from '../../modules/constants';
import * as _ from 'lodash';

export class CategoryListModel {
    public entityId: string;
    public categoryName: string;
    public parentName: string;
    public sortOrder: number;
    public countries: any;
    public countryIds: any;
    public status: number;
    public statusLabel: string;
    public isApproved: number;
    public approvalStatusLabel: string;
    public isHalal: number;
    public level:number;
    public halalCategory: string;
    public rid: string;
    public createdDate: string;
    public updatedDate: string;
    //public selctedCountryIds: any;
    public displayName: string;
    public createdByName: string;
    static toResponseModel(data: any, filters: any = []) {
      const model = new CategoryListModel();
      let countrystr = '';
      model.rid = data.rid;
      model.countries = data.countries ? data.countries : [];
      model.categoryName = data.categoryName;
      model.entityId = data.entityId;
      model.parentName = data.parentName || 'N/A';
      model.sortOrder = data.sortOrder;
      model.status = data.isActive;
      model.statusLabel = model.status ? 'Active' : 'Inactive';
      model.isApproved = data.isApproved;
      model.displayName = data.displayName;
      model.level = data.level;
      model.approvalStatusLabel =_.filter(Constant.OTHER_APPROVAL_STATUS_ARRAY, { value: data.isApproved })[0]['label'];
      model.isHalal = data.isHalal;
      model.halalCategory = _.filter(Constant.HALAL_CATEGORY_ARRAY, { value: data.isHalal })[0]['label'];
      model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
      model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
      // Process Countries Array For List / View
      model.countries.forEach(element => {
        countrystr += element.countryName + ' (' + element.countryCode + ')<br>';
      });
      //model.selctedCountryIds=data.countryIds;
      //model.countryIds = countrystr;
      model.countryIds=data.countryIds;
      model.createdByName = data.createdByName || '';
     
      return model;
    }

  }
