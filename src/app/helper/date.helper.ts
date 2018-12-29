import * as moment from 'moment-timezone';
import { TIME_ZONE, MOMENT_DATE_FORMAT } from '../modules/constants';
export class DateHelper {
  constructor() {

  }

  public static getTimezone() {
    const result: string =  TIME_ZONE.TIME_ZONE_DEFAULT;
    return result;
  }

  /**
   *
   * @param date
   * @param format
   * @returns {string}
   */
  public static toDbDate(date: any) {
    return moment.tz(date, this.getTimezone()).format(MOMENT_DATE_FORMAT.YYYY_MM_DD);
  }

  /**
   *
   * @param date
   * @param format
   * @returns {string}
   */
  public static toFormat(date: any, format: string) {
    const date2 = DateHelper.toISOString(date);
    return moment.tz(date2, this.getTimezone()).format(format);
  }

  /**
   * @param date
   * @returns {Moment Object}
   */
  public static toRawMoment(date: any) {
    const date2 = DateHelper.toISOString(date);
    return moment.tz(date2, this.getTimezone());
  }

  /**
   * format date use at slot time
   * @param date
   * @param format
   * @returns {any|string}
   */
  public static toFormatDate(date: any, format: string) {
    const date2 = DateHelper.toISOString(date);
    return moment(date2).format(format);
  }

  public static getDayOfWeek(date: any) {
    return new Date(date).getDay();
  }

  public static getTime(date: any) {
    const hour = new Date(date).getHours();
    const minute = new Date(date).getMinutes();
    let r = '';

    if (hour == 0) {
      r = '12 AM';
    } else if (hour > 12) {
      r = (hour - 12) + ' : ' + minute + ' PM';
    } else {
      r = (hour) + ' : ' + minute + ' AM';
    }

    return r;
  }

  /**
   *
   * @param date1
   * @param date2
   * @returns {boolean}
   */
  public static compareDate(date1, date2) {
    const newDate1 = moment(this.parseDate(date1));
    const newDate2 = moment(this.parseDate(date2));

    if (newDate1.isSameOrAfter(newDate2)) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param date
   * @returns {boolean}
   */
  static isValidDate(date: string) {
    if (this.parseDate(date)) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param date
   * @returns {string}
   */
  static toISOString(date: string) {

    return moment(date).toISOString();
  }

  /**
   *
   */
  static addDays(date: string, additionalDays: number) {
    const dateResult = moment(date).add(additionalDays, 'd').toISOString();
    return dateResult;
  }

  /**
   *
   */
  static addDaysInDate(date: Date, additionalDays: number) {
    const dateResult = moment(date).add(additionalDays, 'd');
    return dateResult;
  }
  
   /**
   *
   */
  static stringtoDate(date: string) {
    const dateResult = moment(date);
    return dateResult;
  } 


  /**
   *
   * @param date
   * @returns {number}
   */
  public static parseDate(date: string) {
    const parsed = Date.parse(date);

    if (!isNaN(parsed)) {
      return parsed;
    }
    return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
  }

  /**
   *
   * @param date1
   * @param date2
   * @returns {boolean}
   */
  static compare2Date(date1, date2) {
    const newDate1 = moment(date1);
    const newDate2 = moment(date2);

    if (newDate1.isSameOrAfter(newDate2)) {
      return true;
    }
    return false;
  }

  public static convertToTimestamp(date) {
    return (new Date().getTime());
  }

  public static getStartYear() {
    return (new Date(moment().startOf('year')).getTime());
  }

  public static getEndYear() {
    return (new Date(moment().endOf('year')).getTime());
  }

   /**
     *
     * @returns {string}
     */
    static getCurrentYear() {
      return moment().year().toString();
  }

  /**
   *
   * @returns {string}
   */
  static getCurrentMonth() {
      const month = moment().month() + 1;
      const newMonth = month < 10 ? '0' + month : month;
      return  newMonth.toString();
  }
}
