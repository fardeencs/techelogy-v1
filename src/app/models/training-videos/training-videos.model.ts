import { BaseModel } from '../base.model';
import { ValidateModel } from '../validate.model';
import { MIN_LENGTHS_VALUES, MOMENT_DATE_FORMAT } from '../../modules';
import { DateHelper } from '../../helper/date.helper';
import * as _ from 'lodash';

export class TrainingVideosFormModel extends BaseModel {
  public entityId : number;
  public title: string;
  public topic: string;
  public url: string;
  public createdBy : string;
  public isActive: number;
  public isActiveKey: string;
  public rid: string;
  public createdByName : string;
  public createdDate: string;
  public updatedDate: string;

  constructor() {
    super();
    this.validateRules = new ValidateModel();
    this.initValidateRules();
  }


  /**
  *
  * @param data
  * @returns {TrainingVideosFormModel}
  */
  public static toRequestModel(data: TrainingVideosFormModel): TrainingVideosFormModel {
    const model = new TrainingVideosFormModel();
    model.title = data.title;
    model.topic = data.topic;
    model.url = data.url;
    model.isActive = data.isActive;
    model.createdBy = data.createdBy;
    delete model.validateRules;
    return model;
  }

  static toResponseModel(data: any) {
    const model = new TrainingVideosFormModel();
    model.rid = data.rid,
    model.entityId = data.entityId;
    model.title = data.title;
    model.topic = data.topic;
    model.url = data.url;
    model.isActive = data.isActive;
    model.createdBy = data.createdBy;
    model.createdDate = DateHelper.toFormat(data.createdDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.updatedDate = DateHelper.toFormat(data.updatedDate, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    model.isActive = data.isActive;
    model.isActiveKey = data.isActiveKey;
    model.createdByName = data.createdByName;
    return model;
  }

  public initValidateRules(): ValidateModel {
    this.addRule('title', 'required', true, this._t('TITLE_REQUIRED'));
    this.addRule('title', 'minlength',  MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('TITLE_LENGTH'));
    this.addRule('title', 'alphanumeric_space_special_diacritic',  true, this._t('TITLE_ALPHANUMERIC'));
    this.addRule('topic', 'required', true, this._t('TOPIC_REQUIRED'));
    this.addRule('topic', 'alphanumeric_space_special_diacritic', true, this._t('TOPIC_ALPHANUMERIC'));
    this.addRule('topic', 'minlength', MIN_LENGTHS_VALUES.MIN_LENGTH_3, this._t('TOPIC_LENGTH'));
    this.addRule('url', 'website_url', true, this._t('INVALID_WEBSITE_ADDRESS'));
    this.addRule('url', 'required', true, this._t('VALID_WEBSITE_REQUIRED'));
    this.addRule('isActive', 'required', true, this._t('STATUS_REQUIRED'));
    return this.getRules();
  }
}
