import { SESSION } from '../modules/constants';
import * as _ from 'lodash';
import * as dataEn from '../../assets/i18n/en.json';
import * as dataFr from '../../assets/i18n/fr.json';
import { TreeviewItem } from '../shared/dropdown/treeview-dropdown-lib';

export class UtilHelper {
  constructor() { }

  /**
   * Set Default Data
   * @param data
   * @returns {string}
   */
  static setDataDefault(data, defaultValue: any = '') {
    const ret = data
      ? data
      : ((defaultValue !== '')
        ? defaultValue
        : '');

    return ret;
  }

  /**
   * Parse
   * @param data
   * @returns {string}
   */
  public static parseFilterToString(data) {
    let str = '';
    if (data) {
      _
        .forEach(data, function (item, key) {
          if (typeof item !== 'object') {
            str += key + '=' + item + '&';
          }
        });
    }

    return str.substring(0, str.length - 1);
  }

  /**
   * Parse
   * @param data
   * @returns {string}
   */
  public static parseFilterToStringNoEmpty(data) {
    let str = '';
    if (data) {
      _
        .forEach(data, function (item, key) {
          if (typeof item !== 'object' && item != '') {
            str += key + '=' + item + '&';
          }
        });
    }

    return str.substring(0, str.length - 1);
  }

  /**
   * Parse
   * @param string
   * @returns {object}
   */
  public static parseQueryStringToObject(string) {
    const vars = string.split('&');
    const result = {};
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      result[pair[0]] = pair[1];
    }
    return result;
  }

  /**
   *
   * @param array
   * @param attribute
   * @param value
   * @returns {any}
   */
  public static findByAttribute(array, attribute, value) {
    return _.find(array, function (item) {
      return item[attribute] === value;
    });
  }

  /**
   *
   * @param array
   * @param attribute
   * @param value
   * @returns {Array}
   */
  public static findAllByAttribute(array, attribute, value) {
    const result = [];
    _.forEach(array, function (item) {
      if (item[attribute] === value) {
        result.push(item);
      }
    });

    return result;
  }

  /**
   * Get Validate Message
   * @param message
   * @returns {string}
   */
  public static translate(message: string): string {
    let ret = message;
    let data = dataEn['default'];
    let language = null;
    if (sessionStorage.getItem(SESSION.LANGUAGE_KEYWORD)) {
      language = sessionStorage.getItem(SESSION.LANGUAGE_KEYWORD);
    }
    if (language && language !== 'en') {
      data = dataFr['default'];
    }
    if (data[message]) {
      ret = data[message];
    }
    return ret;
  }

  /**
   * Use to slice long string
   * @param desc
   * @returns {string}
   */
  public static sliceText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  }

  /**
   * Use to create query params from object
   * @param Object
   * @returns {string}
   */
  public static toQueryParams(data: any): string {
    return Object.keys(data).map((key) => {
      return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }
  /**
   * Use to fix decimal places
   * @param string/number
   * @returns {string}
   */
  public static toDecimal(data: any, afterDot?: number) {
    let afterdots = (afterDot ? afterDot : 2);
    let val = '0.00';
    if (!isNaN(parseFloat(data))) {
      val = parseFloat(data).toFixed(afterdots);
    }
    return val;
  }
  /**
   * Use to convert object to string
   * @param object
   * @returns {string}
   */
  public static stringify(data: any) {
    return JSON.stringify(data);
  }

  /**
   * Use to add http to url
   * @param url
   * @returns {string}
   */
  public static addHttp(url: string) {
    var pattern = new RegExp(/^((http|https|ftp):\/\/)/);
    var isValid = pattern.test(url);
    if (!isValid) {
      url = "http://" + url;
    }
    return url;
  }

  /**
   * Use to add months to Date
   * @param Date
   * @returns {Date}
   */
  public static addMonths(date: Date, months: number) {
    date.setMonth(date.getMonth() + months);
    return date;
  }


  public static mapTreeviewData(downlineItems: Array<any>, _parent: string, text: string, value: string, selectedList? : Array<any>) {
    function isDataPresent(val, collection){
      return _.find(collection, c => (c == val)) ? true : false;
    }
    function getChildren(data) {
      return data.map(d => {
        return new TreeviewItem({
          text: d[text],
          value: d[value],
          children: d[_parent] ? getChildren(d[_parent]) : null,
          checked : selectedList ? isDataPresent(d[value], selectedList) : false
        })
      })
    }

    return getChildren(downlineItems);
  }

  public static parseCategoryTreeView(categories: any) {
    let treeViewData = _.map(categories, l1Data => {
      return new TreeviewItem({
        text: l1Data.categoryName,
        value: l1Data.entityId,
        children: _.map(l1Data.subcategory, l2Data => {
          return new TreeviewItem({
            text: l2Data.categoryName,
            value: l2Data.entityId,
            children: _.map(l2Data.subcategory, l3Data => {
              return new TreeviewItem({
                text: l3Data.categoryName,
                value: l3Data.entityId,
              })
            })
          })
        })
      })
    });
    return treeViewData;
  }

}
