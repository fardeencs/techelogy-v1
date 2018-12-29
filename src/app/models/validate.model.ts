import * as _ from 'lodash';

declare var jQuery: any;

export class ValidateModel {
  private rules: Object = {};
  private messages: Object = {};
  private errorPlacement: Function;

  constructor() {
    this.initCustomRules();

    this.errorPlacement = function (error, element) {
      if (element.attr('type') === 'checkbox' || element.attr('type') === 'radio') {
        error.insertAfter(jQuery(element).parents().find('label'));
      } else {
        error.insertAfter(element);
      }
    };
  }

  /**
   * Custom Rules
   */
  private initCustomRules(): void {
    // validate max size upload
    jQuery.validator.addMethod(
      'maxSizeUpload',
      function (val, element, params) {
        params = params ? params : 5;

        if (element && element.files.length) {
          let size = element.files[0].size;
          // unit MB
          let maxSize = params * 1024 * 1024;
          return size < maxSize;
        }

        return true;
      },
      this._t(`File upload too large. Only allow {0}MB.`)
    );

    // min files
    jQuery.validator.addMethod(
      'minNumOfFile',
      function (val, element, params) {
        if (element && element.files.length) {
          let numOfFile = element.files.length;
          return numOfFile >= params;
        }

        return false;
      },
      this._t(`You must choose at least {0} file(s).`)
    );

    // max files
    jQuery.validator.addMethod(
      'maxNumOfFile',
      function (val, element, params) {
        if (element && element.files.length) {
          let numOfFile = element.files.length;
          return numOfFile <= params;
        }

        return true;
      },
      this._t(`You can only choose maximum {0} file(s).`)
    );

    // password alphabets and numbers least 6
    jQuery.validator.addMethod(
      'passwordPolicy',
      function (val, element) {
        return val.match(/^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@*!^])\S{6,20}$/);
      },
      this._t('PASSWORD_POLICY')
    );

    // max length string
    jQuery.validator.addMethod(
      'maxLength',
      function (val, element, param) {
        return val.length <= param;
      },
      this._t(`Maximum {0} characters.`)
    );

    // number with dot
    jQuery.validator.addMethod(
      'numeric',
      function (val, element, param) {
        return val.match(/^\+?[0-9().]+$/);
      },
      this._t('INVALID_NUMBER')
    );

    // number
    jQuery.validator.addMethod(
      'onlyNumber',
      function (val, element, param) {
        return val.match(/^\+?[0-9]+$/);
      },
      this._t('INVALID_NUMBER')
    );

    jQuery.validator.addMethod(
      'decimalWithTwoDots',
      function (val, element, param) {
        return val.match(/^\d+(\.\d{1,2})?$/);
      },
      this._t('INVALID_NUMBER')
    );

    // contrain valid website
    jQuery.validator.addMethod(
      'website',
      function (val, element) {
        return val.match(
          /^((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/
        );
      },
      this._t('INVALID_WEBSITE_ADDRESS')
    );


  // contrain valid website
  jQuery.validator.addMethod(
    'website_url',
    function (val, element) {
      val = val.toLowerCase();
      let regex = new RegExp(/http(s?):\/\/www\.[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/);
      return regex.test(val);
    },
    this._t('INVALID_WEBSITE_ADDRESS')
  );



    // contrain valid url
    jQuery.validator.addMethod(
      'validate-url',
      function (val, element) {
        if (!val) {
          return true;
        }
        val = val.toLowerCase();
        const validUrl = (/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm).test(val);
        const validtld = (/(?:https?\:\/\/|www\.)/gm).test(val);
        if (validUrl && validtld) {
          return true;
        } else {
          return false;
        }
      },
      this._t('INVALID_WEBSITE_ADDRESS')
    );


    // format email
    jQuery.validator.addMethod(
      'formatEmail',
      function (val, element) {
        return val.match(
          /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      },
      this._t('INVALID_EMAIL')
    );

    jQuery.validator.addMethod(
      'notEmpty',
      function (val, element, params) {
        return val.trim();
      },
      this._t('')
    );

    jQuery.validator.addMethod(
      'minStrict',
      function (value, el, param) {
        return value > param;
      },
      this._t('Number must be greater than {0}.')
    );

    jQuery.validator.addMethod(
      'alphanumeric',
      function (val, element) {
        return val.match(/^[\w\s\düäöÄÖÜß-]+$/i);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    jQuery.validator.addMethod(
      'alphanumericwithspacehyphen',
      function (val, element) {
        return val.match(/^[a-zA-Z0-9-_ ]*$/);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    jQuery.validator.addMethod(
      'alphanumericOnly',
      function (val, element) {
        return val.match(/^[a-zA-Z0-9]*$/);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    jQuery.validator.addMethod(
      'alphabets',
      function (val, element) {
        return val.match(/^[a-zA-Z]*$/);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    jQuery.validator.addMethod(
      'symbol',
      function (val, element) {
        return val.match(/^[a-zA-ZÀ-ž0-9-.,_:@|؋ƒBrBZ$$bKMP៛¥₡knKč₱£€¢﷼ ]*$/);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    jQuery.validator.addMethod(
      'alphanumeric_space_special_diacritic',
      function (val, element) {
        return val.match(/^[A-ZÀ-ž,a-z,0-9,-.,_:@&| ]*$/);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    jQuery.validator.addMethod(
      'groupName',
      function (val, element) {
        return val.match(/^[a-zA-Z0-9-_@+. ]*$/);
      },
      this._t('ALPHANUMERIC_ENTER')
    );
    /** Alphanumeric with spaces and some Special Characters (-@+_.)
     *  add some characters from above alphanumeric rule
     */
    jQuery.validator.addMethod(
      'alphanumericwithatdothyphen',
      function (val, element) {
        return val.match(/^[\w\s\düäöÄÖÜß.+@_-]+$/i);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    jQuery.validator.addMethod(
      'countryName',
      function (val, element) {
        return val.match(/^[a-zA-Z-\s]+$/i);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    // ALPHANUMERIC with some specia character
    jQuery.validator.addMethod(
      'alphanumericwithspecialchar',
      function (val, element) {
        return val.match(/^[a-zA-Z0-9-_@+.&() ]*$/);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    // ALPHANUMERIC with some specia character
    jQuery.validator.addMethod(
      'categoryName',
      function (val, element) {
        return val.match(/^[A-Z,a-z,0-9,-.,_:@&| ]*$/);
      },
      this._t('ALPHANUMERIC_ENTER')
    );

    // Color code validation inculding #
    jQuery.validator.addMethod(
      'color',
      function (val, element) {
        return val.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
      },
      this._t('COLOR_CODE')
    );
  }

  /**
     *
     * @param fieldName
     * @param rule
     * @param value
     * @param message
     */
  public addRule(fieldName: string, rule: string, value: any = true, message: string = '') {
    if (this.rules && !_.isObject(this.rules[fieldName])) {
      this.rules[fieldName] = {};
    }

    if (this.messages && !_.isObject(this.messages[fieldName])) {
      this.messages[fieldName] = {};
    }

    this.rules[fieldName][rule] = value;

    if (message) {
      this.messages[fieldName][rule] = message;
    }
  }

  /**
     *
     * @param fieldName
     * @param rule
     * @param value
     * @param message
     */
  public removeRule(fieldName: string, rule: string) {
    if (this.rules && _.isObject(this.rules[fieldName])) {
      this.rules[fieldName][rule] = false;
    }
  }

  /**
     * Get validate rule
     * @returns {ValidateModel}
     */
  public getRules(): ValidateModel {
    return this;
  }


  public _t(message: string): string {
    return message;
  }
}
