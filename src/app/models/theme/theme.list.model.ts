import { DateHelper } from '../../helper/date.helper';
import { MOMENT_DATE_FORMAT,COMMON_REQUIRED_ARRAY } from '../../modules';
import * as Constant from '../../modules/constants';
import * as _ from 'lodash';

export class ThemeListModel {
  public name: string;
  public entityId:number;
  public themeId:number;
  public startDate: string;
  public endDate: string;
  public isDefault: string;
  public headerBackgroundColor: string;
  public headerFontColor: string;
  public productPlaceholder: string;
  public otherPlaceholder: string;
  public isActive: number;
  public backgroundColor: string;
  public backgroundImage: string;
  public isActiveKey: string;
  public status: string;
  public rid: string;
  public createdDate: string;
  public updatedDate: string;
  public createdByName: string;
  static toResponseModel(data: any, filters: any = []) {
    const model = new ThemeListModel();
    model.rid = data.rid,
    model.name = data.name;
    model.startDate = DateHelper.toFormat(data.startDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.endDate = DateHelper.toFormat(data.endDate, MOMENT_DATE_FORMAT.DD_MM_YYYY);
    model.headerBackgroundColor = data.headerBackgroundColor;
    model.entityId = data.entityId;
    model.backgroundColor = data.backgroundColor;
    model.backgroundImage = data.backgroundImage;
    model.headerFontColor = data.headerFontColor;
    model.productPlaceholder = data.productPlaceholder;
    model.createdByName = (data.createdByName);
    model.isDefault = data.isDefault;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = (data.isActive);
    model.isActiveKey = data.isActiveKey;
    return model;
  }

}
