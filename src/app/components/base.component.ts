import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FlashMessage } from './../shared/flash_message';
import { UtilHelper } from '../helper/util.helper';
import { DateHelper } from '../helper/date.helper';
import { MOMENT_DATE_FORMAT, MODULE_ACTIONS, MAX_LENGTHS_VALUES, REG_EXP_VALUES } from '../modules';
import * as moment from 'moment';
import * as _ from 'lodash';

export class BaseComponent {
  public MAX_LENGTH_CONFIG;
  public PERMISSION_ACTION;
  public REG_EXP_CONFIG;
  public queryParams: any;
  constructor(protected _router: Router,
    protected _location: Location) {
    this.setMaxlengths();
    this.setPermissionActions();
    this.REG_EXP();
  }

  /**
   * Set error message
   * @param message
   */
  public setError(error: any = {}): void {
    if (error.message) {
      FlashMessage.setError(UtilHelper.translate(error.message));
    } else {
      FlashMessage.setError(UtilHelper.translate(error));
    }
  }


  /**
   * Set success message
   * @param message
   */
  public setSuccess(message: string): void {
    FlashMessage.setSuccess(UtilHelper.translate(message));
  }

  /**
   * Set info message
   * @param message
   */

  public setInfo(message: string): void {
    FlashMessage.setInfo(UtilHelper.translate(message));
  }

  /**
   * Set warning message
   * @param message
   */
  public setWarning(message: string): void {
    FlashMessage.setWarning(UtilHelper.translate(message));
  }


  /**
   *
   * @param route
   */
  public navigate(route: any[], queryParams: any = {}): void {
    this
      ._router
      .navigate(route, { queryParams: queryParams });
  }

  /**
   *
   * @param route
   */
  public navigateByUrl(url: string): void {
    this
      ._router
      .navigateByUrl(url);
  }

  public setPermissionActions() {
    this.PERMISSION_ACTION = MODULE_ACTIONS;
  }
  public REG_EXP() {
    this.REG_EXP_CONFIG = REG_EXP_VALUES;
  }
  public setMaxlengths() {
    this.MAX_LENGTH_CONFIG = MAX_LENGTHS_VALUES;
  }

  back(url?: string) {
    if (url) {
      this.navigateByUrl(url);
    } else {
      this._location.back();
    }
  }

  public formatDate(dateValue) {
    if (dateValue) {
      return DateHelper.toFormat(dateValue, MOMENT_DATE_FORMAT.DD_MM_YYYY_hh_mm_A);
    } else {
      return '';
    }
  }

 /**
  * Moment Date Format
  * @param type // date format type
  * @param date
  */
  public momentDateFormat(type, date) {
    return moment(date).format(type);
  }

  /**
   * permission status
   */
  public getPermissionStatus(permissions: any, action: string) {   
    const isAllowed = _.indexOf(permissions , action);
    return isAllowed >= 0 ? true : false;
  }

  public addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
  }
}
