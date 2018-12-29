export const COMMON_TRANSLATE_FILE = './assets/i18n/';

export const BANNER_LANGUAGE = [
  {label:'en_US',value:'en_US'},
  {label:'nl_NL',value:'nl_NL'}
];

export const BANNER_LOCATION = [
  {label:'Top - Below Header',value:"1"},
  {label:'Bottom- Above footer',value:"2"}
];

export const DATA_GRID = {
  FROZEN_LEFT: false
};
export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export const AUTHORIZATION = {
  TYPE: 'Authorization',
  METHOD: 'Bearer',
  ACTION: 'action'
};

export const SESSION = {
  TOKEN_KEYWORD: 'sessionId',
  PROFILE_KEYWORD: 'profile',
  LANGUAGE_KEYWORD: 'language',
  RETURN_URL_KEYWORD: 'returnUrl',
  NEXT_URL_KEYWORD: 'nextUrl'
};

export const ERROR_CODE = {
  AUTHENTICATION: {
    GENERIC: 1100,
    VIOLATE_RFC6750: 1101,
    TOKEN_NOT_FOUND_CODE: 1102,
    NOT_AUTHORIZED_CODE: 1103,
    NOT_PERMISSION_ACCESS_CODE: 1104,
    WRONG_USER_OR_PASSWORD_CODE: 1105,
    INVALID_ACCESS_TOKEN_CODE: 1106,
    TOKEN_EXPIRED_CODE: 1107
  }
};

export const MODULE_ID = {
  USER: '08f5cf63-d534-4050-9c03-b3e4fc314495',
  MERCHANT: '2ef859e1-744d-11e8-a41b-021a018d4e0e',
  ROLE: '3e1ebf5f-6d4b-11e8-a41b-021a018d4e0e',
  SCHEME: '80d97b1f-79f1-11e8-a41b-021a018d4e0e',
  APPROVAL: '69b8da0f-7aa7-11e8-a41b-021a018d4e0e',
  DOCUMENT: 'f5cb95fc-806e-11e8-a41b-021a018d4e0e',
  CERTIFICATES: 'efc6c7bd-80e8-11e8-a41b-021a018d4e0e',
  CATALOG: 'ce583ca4-85d9-11e8-a41b-021a018d4e0e',
  COUNTRY: '8b4610ae-996a-11e8-84d4-28565a9a87e7',
  ATTRIBUTE: '8b4610ae-996a-11e8-84d4-28565a9a87e7',
  COUNTRYGROUP: '8b4610ae-996a-11e8-84d4-28565a9a87e7',
  CURRENCY: '8b4610ae-996a-11e8-84d4-28565a9a87e7',
  STATES: '8b4610ae-996a-11e8-84d4-28565a9a87e7',
  CITIES: '8b4610ae-996a-11e8-84d4-28565a9a87e7',
  CUSTOMER : '21f56afa-c6ea-11e8-b8d0-0268ffaa0bb8',
  THEMES: '8b4610ae-996a-11e8-84d4-28565a9a87e7',
  BRANDS: 'ce583ca4-85d9-11e8-a41b-021a018d4e0e',
  BANNERS:'a4668154-c8a6-11e8-b8d0-0268ffaa0bb8',
  CURRENCY_RATES : '8b4610ae-996a-11e8-84d4-28565a9a87e7',
  TRAINING_VIDEOS : 'a4668154-c8a6-11e8-b8d0-0268ffaa0bb8'
};

export const PAGINATION = {
  MAX_SIZE: 5,
  ITEMS_PER_PAGE: 10,
  PAGE_ITEM_SIZE: [
    10,
    20,
    30,
    40,
    50,
    100
  ]
};

export const HEADERS = {
  TOTAL_ITEMS: 'Total',
  ITEM_PER_PAGE: 'Item-Per-Page',
  CONTENT_DISPOSITION: 'Content-Disposition',
  CONTENT_TYPE: 'Content-Type',
  STATUS_CODE_SUCCESS: 200,
  DEVIDE_OS: 'device-os',
  APP_VERSION: 'app-version'
};

export const STATE_EVENT = {
  UPDATE_PROFILE: 'updateProfile',
  LANGUAGE_CHANGED: 'LANGUAGE_CHANGED',
  RESIZE_DATATABLE: 'RESIZE_DATATABLE',
  PICKUP_ADDRESS_ADDED: 'PICKUP_ADDRESS_ADDED',
  CHECK_INCOMPLETE_MERCHANT_STEP: 'CHECK_INCOMPLETE_MERCHANT_STEP',
  AUTOFILL_DOMESTIC_COUNTRY_DELIVERY: 'AUTOFILL_DOMESTIC_COUNTRY_DELIVERY',
  AUTOFILL_DOMESTIC_COUNTRY_REVENUE: 'AUTOFILL_DOMESTIC_COUNTRY_REVENUE'
};

export const LOCAL_STORAGE = {
  MENU_COLLAPSED: 'MENU_COLLAPSED'
};

export const TIME_ZONE = {
  TIME_ZONE_DEFAULT: 'Asia/Kuala_Lumpur',
  TIME_ZONE_UTC: 'UTC'
};

export const MOMENT_DATE_FORMAT = {
  YYYY_MM_DD: 'YYYY-MM-DD',
  MM_DD_YYYY: 'MM-DD-YYYY',
  DD_MM_YYYY: 'DD/MM/YYYY',
  YYYY_MM_DD_H_m: 'YYYY-MM-DD H:m',
  MM_DD_YYYY_H_m: 'MM-DD-YYYY H:m',
  DD_MM_YYYY_hh_mm_A: 'DD/MM/YYYY HH:mm:ss',
  DD_MMMM_YYYY_hh_mm_A: 'DD MMMM YYYY, hh:mm A',
  HH_MM: 'HH:mm',
  h_mm_a: 'h:mm A',
  MM_YYYY: 'MMM-YYYY',
  DD_MMM_YY: 'DD MMM YY',
  DD_MMM_YY_H_m: 'DD MMM YY H:m'
};

export const HEADER_CONTENT_TYPE = {
  APPLICATION_JSON: 'application/json'
};

export const PASSWORD_INPUT_MAXLENGTH = 6; // characters

export const HTTP_CONNNECTION_TIMEOUT = 300000; // 5 minutes

export const FORM_CONTROLS_CONFIG = {
  DEFAULT_TXT_MAX_LENGTH: 30,
  EXTENSION_TXT_MAX_LENGTH: 20
};

export const LANGUAGE = {
  AVAILABLE_LANGUAGE: [
    'en', 'fr'
  ],
  DEFAULT_LANGUAGE: 'en'
};

export const STATUS_ARRAY = [
  {
    label: 'Active',
    value: 1
  }, {
    label: 'Inactive',
    value: 0
  }
];

export const LOCATION_OPTIONS = [
  {
    label: 'Top',
    value: 1
  }, {
    label: 'Bottom',
    value: 0
  }
];

export const SPECIFIED_PAGES = [
  {
    label: 'Home Page',
    value: 1
  }, {
    label: 'Static Pages',
    value: 2
  }
];


export const CURRENCY_STATUS_OPTION = [
  {
    label: 'Please select',
    value: ''
  },{
    label: 'Active',
    value: 1
  }, {
    label: 'Inactive',
    value: 0
  }
];

export const PLATFORM_TYPE = [
  {
    label: 'Global',
    value: '1'
  }, {
    label: 'Domestic',
    value: '2'
  }
];

export const HALAL_CATEGORY_ARRAY = [
  {
    label: 'Halal',
    value: 0
  }, {
    label: 'Other',
    value: 1
  }, {
    label: 'Unknown',
    value: 2
  }
];

export const APPROVAL_STATUS_ARRAY = [
  {
    label: 'New',
    value: 0
  },
  {
    label: 'Approved',
    value: 1
  },
  {
    label: 'L1 In Progress',
    value: 2
  },
  {
    label: 'L2 In Progress ',
    value: 3
  },
  {
    label: 'Incorrect Info',
    value: 4
  },
  {
    label: 'Rejected',
    value: 5
  }
];


export const MERCHANT_APPROVAL_STATUS_ARRAY = [
  {
    label: 'Draft',
    value: -1
  },
  {
    label: 'New',
    value: 0
  },
  {
    label: 'Approved',
    value: 1
  },
  {
    label: 'L1 In Progress',
    value: 2
  },
  {
    label: 'L2 In Progress ',
    value: 3
  },
  {
    label: 'Incorrect Info',
    value: 4
  },
  {
    label: 'Rejected',
    value: 5
  }
];
export const MERCHANT_DENY_EDIT_STATUS_ARRAY = [
  {
    label: 'Incorrect Info',
    value: 4
  },
  {
    label: 'Draft',
    value: -1
  }
];

export const EDIT_APPROVAL_STATUS_ARRAY_FORM = [
  {
    label: 'New',
    value: '0'
  },
  {
    label: 'Approved',
    value: '1'
  },
  {
    label: 'Rejected',
    value: '5'
  },
  {
    label: 'Incorrect Info',
    value: '4'
  }
];

export const EDIT_APPROVAL_STATUS_ARRAY = ['New', 'Approved', 'Rejected', '', 'Incorrect Info'];


export const LOGISTIC_TYPES_ARRAY = [
  {
    value: 2,
    label: 'Domestic'
  }, {
    value: 3,
    label: 'Global'
  }, {
    value: 1,
    label: 'Both'
  }
];

export const SCHEME_TYPES_OBJECT = {
  B2B: 2,
  B2C: 1,
  BOTH: 3,
};

export const SCHEME_TYPES_ARRAY = [
  {
    value: SCHEME_TYPES_OBJECT.B2C,
    label: 'B2C'
  }, {
    value: SCHEME_TYPES_OBJECT.B2B,
    label: 'B2B'
  }, {
    value: SCHEME_TYPES_OBJECT.BOTH,
    label: 'Both'
  }
];

export const COMMON_STATUS_ARRAY = [
  {
    id: 1,
    value: 'Active'
  }, {
    id: 0,
    value: 'Inactive'
  }
];

export const COMMON_REQUIRED_ARRAY = [
  {
    value: 1,
    label: 'Yes'
  }, {
    value: 0,
    label: 'No'
  }
];

export const OTHER_APPROVAL_STATUS_ARRAY = [
  {
    value: 0,
    label: 'Pending'
  }, {
    value: 1,
    label: 'Approved'
  }, {
    value: 2,
    label: 'Rejected'
  }
];

export const OTHER_APPROVAL_TYPE_ARRAY = [
  {
    value: 1,
    label: 'Category'
  }, {
    value: 2,
    label: 'Product Price'
  }, {
    value: 3,
    label: 'Brand'
  }, {
    value: 4,
    label: 'B2B Transaction Fee'
  }
];

export const DURATION_ARRAY = [
  {
    value: 1,
    label: '1 Month'
  }, {
    value: 3,
    label: '3 Months'
  }, {
    value: 6,
    label: '6 Months'
  }, {
    value: 12,
    label: '12 Months'
  }
];

export const IMAGE_SIZE = [
  {
    value: 0,
    label: '170px * 350px'
  }, {
    value: 1,
    label: '350px * 350px'
  }
]

export const CUSTOMER_PLATFORM_OPTION = [
  {
    value: 1,
    label: 'Backend Platform'
  }, {
    value: 2,
    label: 'Web Platform'
  }, {
    value: 3,
    label: 'Mobile Platform'
  }
];

export const CUSTOMER_SIGNUP_METHOD = [
  {
    value: 1,
    label: 'Normal Sign up'
  }, {
    value: 2,
    label: 'Facebook Sign up'
  }, {
    value: 3,
    label: 'Google Sign up'
  }
];

export const CUSTOMER_SIGNUP_METHOD_VALUE = {
    CUSTOMER_SIGNUP_NORMAL : 'Normal Sign up',
    CUSTOMER_SIGNUP_FACEBOOK : 'Facebook Sign up',
    CUSTOMER_SIGNUP_GOOGLE :'Google Sign up'
};

export const CUSTOMER_PLATFORM_OPTION_VALUE = {
    CUSTOMER_PLATFORM_BACKEND :'Backend Platform',
    CUSTOMER_PLATFORM_WEB :'Web Platform',
    CUSTOMER_PLATFORM_MOBILE : 'Mobile Platform'
};

export const CUSTOMER_SIGNUP_METHOD_CONSTANTS = {
  CUSTOMER_SIGNUP_METHOD_VALUE_NORMAL : 1,
  CUSTOMER_SIGNUP_METHOD_VALUE_FACEBOOK : 2,
  CUSTOMER_SIGNUP_METHOD_VALUE_GOOGLE : 3
}

export const CUSTOMER_SIGNUP_PLATFORM_CONSTANTS = {
  CUSTOMER_PLATFORM_OPTION_VALUE_BACKEND : 1,
  CUSTOMER_PLATFORM_OPTION_VALUE_WEB : 2,
  CUSTOMER_PLATFORM_OPTION_VALUE_MOBILE : 3
}

export const ATTRIBUTE_INPUT_TYPE = [
  {
    value: 1,
    label: 'Textfield'
  }, {
    value: 2,
    label: 'Dropdown'
  }, {
    value: 3,
    label: 'Visual Swatch'
  },{
    value: 4,
    label: 'Text Swatch'
  }
];



export const QUERY_PARAMS_TO_OMIT_ARRAY = ['sortKey', 'sortValue', 'limit', 'offset', 'pageNumber', 'pageSize'];

export const LOGISTICS_TYPE_AARAY = ['Domestic', 'International'];

export const STATUS_SEARCH = {
  type: 'dropdown',
  'fieldName': 'status',
  'labelName': 'APPROVAL.FORM_LABELS.STATUS',
  fieldValue: '',
  options: STATUS_ARRAY
};

export const MANAGE_MERCHANT_STEPS = [
    {
      name: 'Business Information',
      stepNo: 1
    }, {
      name: 'Contact Person for Merchandise and Product Matters',
      stepNo: 2
    }, {
      name: 'Contact Person for Accounts and Finance Matters',
      stepNo: 3
    }, {
      name: 'Finance and Tax Details',
      stepNo: 4
    }, {
      name: 'Documents',
      stepNo: 5
    },{
      name: 'Delivery Platform',
      stepNo: 6
    }, {
      name: 'Merchant Authorized Signatory',
      stepNo: 7
    }
  ];


export const MODULE_ACTIONS = {
  USER: {
    ADD: 'USERS_ADD',
    VIEW: 'USERS_VIEW',
    EDIT: 'USERS_EDIT',
    DELETE: 'USERS_DELETE'
  },
  ROLE: {
    ADD: 'ROLES_ADD',
    VIEW: 'ROLES_VIEW',
    EDIT: 'ROLES_EDIT',
    DELETE: 'ROLES_DELETE',
  },
  MERCHANT: {
    ADD: 'MERCHANTS_ADD',
    VIEW: 'MERCHANTS_VIEW',
    EDIT: 'MERCHANTS_EDIT',
    DELETE: 'MERCHANTS_DELETE',
  },
  SCHEME: {
    ADD: 'SCHEMES_ADD',
    VIEW: 'SCHEMES_VIEW',
    EDIT: 'SCHEMES_EDIT',
    DELETE: 'SCHEMES_DELETE',
  },
  APPROVAL: {
    MERCHANT: 'APPROVALS_MERCHANT',
    OTHER: 'APPROVALS_OTHER',
  },
  DOCUMENT: {
    ADD: 'DOCUMENTS_ADD',
    VIEW: 'DOCUMENTS_VIEW',
    EDIT: 'DOCUMENTS_EDIT',
    DELETE: 'DOCUMENTS_DELETE',
  },
  CERTIFICATE: {
    ADD: 'CERTIFICATES_ADD',
    VIEW: 'CERTIFICATES_VIEW',
    EDIT: 'CERTIFICATES_EDIT',
    DELETE: 'CERTIFICATES_DELETE',
  },
  CATEGORY: {
    ADD: 'CATALOGS_ADD',
    VIEW: 'CATALOGS_VIEW',
    EDIT: 'CATALOGS_EDIT',
    DELETE: 'CATALOGS_DELETE',

  },
  COUNTRY: {
    ADD: 'COUNTRIES_ADD',
    VIEW: 'COUNTRIES_VIEW',
    EDIT: 'COUNTRIES_EDIT',
    DELETE: 'COUNTRIES_DELETE'
  },
  CURRENCY: {
    ADD: 'CURRENCIES_ADD',
    VIEW: 'CURRENCIES_VIEW',
    EDIT: 'CURRENCIES_EDIT',
    DELETE: 'CURRENCIES_DELETE'
  },
  COUNTRYGROUP: {
    ADD: 'COUNTRIES_GROUP_ADD',
    VIEW: 'COUNTRIES_GROUP_VIEW',
    EDIT: 'COUNTRIES_GROUP_EDIT',
    DELETE: 'COUNTRIES_GROUP_DELETE'
  },
  MIGRATION:{
    VIEW:'MIGRATION_EXPORT_VIEW'
  },
  ATTRIBUTE: {
    ADD: 'ATTRIBUTES_ADD',
    VIEW: 'ATTRIBUTES_VIEW',
    EDIT: 'ATTRIBUTES_EDIT',
    DELETE: 'ATTRIBUTES_DELETE'
  },
  STATES: {
    ADD: 'STATES_ADD',
    VIEW: 'STATES_VIEW',
    EDIT: 'STATES_EDIT',
    DELETE: 'STATES_DELETE'
  },
  CITIES: {
    ADD: 'CITIES_ADD',
    VIEW: 'CITIES_VIEW',
    EDIT: 'CITIES_EDIT',
    DELETE: 'CITIES_DELETE'
  },
  CUSTOMER: {
    ADD: 'CUSTOMERS_ADD',
    VIEW: 'CUSTOMERS_VIEW',
    EDIT: 'CUSTOMERS_EDIT',
    DELETE: 'CUSTOMERS_DELETE'
  },
  BANNERS:{
    ADD: 'BANNERS_ADD',
    VIEW: 'BANNERS_VIEW',
    EDIT: 'BANNERS_EDIT',
    DELETE: 'BANNERS_DELETE'
  },
  THEMES: {
    ADD: 'THEMES_ADD',
    VIEW: 'THEMES_VIEW',
    EDIT: 'THEMES_EDIT',
    DELETE: 'THEMES_DELETE'
  },
  BRANDS: {
    ADD: 'BRANDS_ADD',
    VIEW: 'BRANDS_VIEW',
    EDIT: 'BRANDS_EDIT',
    DELETE: 'BRANDS_DELETE'
  },
  CURRENCY_RATES:{
    ADD : 'CURRENCY_RATES_EDIT',
    VIEW : 'CURRENCY_RATE_VIEW'
  },
  TRAINING_VIDEOS: {
    ADD: 'TRAINING_VIDEOS_ADD',
    VIEW: 'TRAINING_VIDEOS_VIEW',
    EDIT: 'TRAINING_VIDEOS_EDIT',
    DELETE: 'TRAINING_VIDEOS_DELETE'
  },
};
export const REG_EXP_VALUES = {
  ALPHANUMERIC_CHARACTER: '[a-zA-ZÀ-ž0-9-.,_:@| ]*$',
  ALPHABET_ONLY: '[a-zA-Z ]*$',
  ALPHANUMERIC_NO_SPECIAL_CHARACTER: '[a-zA-ZÀ-ž0-9 ]',
  NUMERIC: '[0-9]',
  DECIMAL: '[0-9.]',
  DECIMAL_UPTO_TWO_POINTS: '[^\d+\.\d{0,2}$]',
  EMAIL_CHARACTER: '[a-zA-ZÀ-ž0-9.@ ]*$',
  ALPHANUMERIC_SPACE_HYPHEN: '[a-zA-Z0-9- ]+$',
  ALPHANUMERIC_SPACE_SPECIALCHARACTER:'/^[ A-Za-z0-9()[\]+-*/%]*$/'
};

export const VALID_EXTENSIONS = {
 FILE : "text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/pdf,image/*,application/vnd.oasis.opendocument.text"
//FILE : 'image/*'
};

export const MAX_LENGTHS_VALUES = {
  EMAIL: 50,
  PASSWORD: 20,
  FIRST_NAME: 30,
  LAST_NAME: 30,
  ROLE_NAME: 30,
  APPROVAL_COMMENT: 500,
  TXT_FIELD_DEFAULT: 100,
  TXT_FIELD_DEFAULT_50: 50,
  TELEPHONE: 10,
  EXT: 5,
  MOBILE_NUMBER: 10,
  COMPANY_TXT_FIELD_DEFAULT: 50,
  ADDRESS_100: 100,
  ADDRESS_200: 200,
  WEBSITE_URL: 100,
  NATURE_OF_BUISNESS: 10,
  GST: 30,
  BANK_TXT_FIELD_NAME: 100,
  BANK_TXT_FIELD_DEFAULT: 50,
  SWIFT: 30,
  OTHERS: 100,
  ZIP_CODE: 10,
  FEES_TXT_FIELD_DEFAULT: 5,
  FEES_AGREEMENT: 3,
  EXTENSION_TXT_MAX_LENGTH: 5,
  MAX_FILE_SIZE: 10,
  ALLOWED_FILE_EXTENSION: /(\.jpg|\.jpeg|\.png|\.doc|\.docx|\.pdf|\.odt|\.txt)$/i,
  ALLOWED_SIGNATURE_EXTENSION: /(\.jpg|\.jpeg|\.png)$/i,
  ALLOWED_BANNER_EXTENSION: /(\.jpg|\.jpeg|\.png)$/i,
  COMMISSION_B2C: 5,
  COMMISSION_B2B: 5,
  MEMBERSHIP_PRICE: 5,
  CERTIFICATE_NAME: 100,
  NATURE_OF_BUSINESS: 1000,
  COUNTRY_CODE: 2,
  COUNTRY_NAME: 50,
  GROUP_NAME: 100,
  REGISTARTION_FEE_B2C: 10,
  REGISTARTION_FEE_B2B: 10,
  AGREEMENT_PERIOD_B2C: 10,
  AGREEMENT_PERIOD_B2B: 10,
  TRANSACTION_FEE_B2C: 10,
  TRANSACTION_FEE_B2B: 10,
  SCHEME_REMARKS: 1000,
  SKU_NUMBER: 10,
  MERCHENT_IMPORT: /(\.CSV|\.csv)$/i,
  MAX_100:100,
  MAX_10:10,
  MAX_7:7,
  CURRENCY_SYMBOL : 5,
  BRAND_NAME: 100,
  SORT_ORDER: 10,
  CURRENCY_RATE : 10
};

export const MIN_LENGTHS_VALUES = {
  COUNTRY_CODE: 2,
  COUNTRY_NAME: 2,
  CITY_NAME: 2,
  GROUP_NAME: 3,
  BRAND_NAME: 3,
  MIN_LENGTH_1: 1,
  MIN_LENGTH_3: 3,
  MIN_LENGTH_5: 5,
  MIN_LENGTH_7: 7,
  CURRENCY_SYMBOL: 1,
  SORT_ORDER: 1
};

export const HTTP = {
  METHOD: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  },
  CONTENT_TYPE: {
    JSON: 'application/json; charset=utf-8'
  },
  HEADER: {
    DEVIDE_OS: 'AdminPortal',
    APP_VERSION: '1.0.0'
  }
};

export const REST_API = {
  MODULE_PERMISSIONS: 'permission/view',
  ACCOUNT: {
    LOGIN: `auth`,
    LOGOUT: `auth`,
    PERMISSIONS: `permission`,
    FORGET_PASSWORD: `auth/forgotPassword`,
    RESET_PASSWORD: `auth/resetPassword`,
    VERIFY_RESET_PASSWORD_TOKEN: `auth/forgotPassword`
  },
  ME: {
    PROFILE: `me`,
    UPDATE_PASSWORD: `me/password`
  },
  USER: {
    LIST: `users`,
    NEWUSER: `users`,
    EDITUSER: `users/view`,
    UPDATEUSER: `users`,
    DELETEUSER: `users`,
    DELETEMASSUSER: `users/massDelete`,
    EXPORT: `users/export`,
    EXPORT_SELECTED: `users/exportSelected`
  },
  MANAGE_MERCHANT: {
    LIST: `merchant`,
    NEWMERCHANT: `merchant`,
    EDITMERCHANT: `merchant/view`,
    UPDATEMERCHANT: `merchant`,
    DELETEMERCHANT: `merchant`,
    DELETEMASSMERCHANT: `merchant/massDelete`,
    EXPORT: `merchant/export`,
    ADD_COMPANY_INFO: `stores/create`,
    ADD_MERCHANT_CONTACT: `stores/contactInfo`,
    GET_MERCHANT_CONTACT: `stores/contactInfo`,
    ADD_MERCHANT_FINANCE_CONTACT: `stores/financeContactInfo`,
    GET_MERCHANT_FINANCE_CONTACT: `stores/financeContactInfo`,
    GET_COMPANY_INO: `stores/businessInfo`,
    UPDATE_COMPANY_INO: `stores/businessInfo`,
    GET_COUNTRY_LIST: `locations/countries`,
    GET_STATE_LIST: `locations/states`,
    GET_CITY_LIST: `locations/cities`,
    GET_TAX_INFO: `stores/taxInfo`,
    ADD_TAX_INFO: `stores/taxInfo`,
    CATEGORY_LIST: `catalog/masterList`,
    SUB_CATEGORY_LIST: `catalog/list`,
    ADD_MERCHANT_FINANCE_BANK_INFO: `stores/financeBankInfo`,
    GET_MERCHANT_FINANCE_BANK_INFO: `stores/financeContactInfo`,
    ADD_MERCHANT_PRODUCT_REVENUE: `stores/revenueInfo`,
    GET_MERCHANT_PRODUCT_REVENUE: `stores/revenueInfo`,
    GET_DOCUMENT_TYPE_LIST: `document-types/list`,
    UPLOAD_FILE: `stores/files`,
    GET_UPLOADED_FILES: `stores/documentInfo`,
    DELETE_UPLOADED_FILES: `stores/documentInfo`,
    SAVE_DOCUMENT: `stores/documentInfo`,
    GET_STORE_LIST: `stores`,
    STORE_DELETE: `stores`,
    STORE_MASS_DELETE: `stores/massDelete`,
    STORE_EXPORT: `stores/exportSelected`,
    GET_FEE_DETAILS: `stores/platformInfo`,
    ADD_FEE_DETAILS: `stores/platformInfo`,
    DELETE_FEE_DETAILS: `stores/platformInfo`,
    ADD_MERCHANT_DELIVERY_DETAIL: `stores/deliveryInfo`,
    GET_MERCHANT_DELIVERY_DETAIL: `stores/deliveryInfo`,
    GET_PICK_UP_ADDRESS: `stores/warehouseInfo`,
    ADD_PICK_UP_ADDRESS: `stores/pickupInfo`,
    DELETE_PICK_UP_ADDRESS: `stores/pickupInfo`,
    SUBMIT_FOR_REVIEW: `approval/submitForReview`,
    AUTHORIZED_SIGNATURE: `stores/signatoryInfo`,
    ADD_PLATFORM:`stores/platformInfo`,
    POST_COUNTRY_GROUP: `stores/countryInfo`,
    DOMESTIC_COUNTRY:`settings/domesticCountry`,
    ASSIGN_SALEPERSON:`stores/assignSaleperson`,
    MERCHANT_VIEW: 'stores/view',
    GET_SCHEMES:'scheme-types/list',
  },

  ROLE: {
    USERROLE: `roles/list`,
    ADD_ROLE: `roles`,
    LIST_ROLE: `roles`,
    VIEW_ROLE: `roles/view`,
    DELETE_ROLE: `roles`,
    MASS_DELETE_ROLE: `roles/massDelete`,
    EXPORT: `roles/export`,
    EXPORT_SELECTED: `roles/exportSelected`,
    EDIT_ROLE: `roles`
  },
  SCHEMETYPES: {
    SCHEMETYPES: `scheme-types/list`,
    ADD_MERCHANT_SCHEME: `stores/schemeInfo`,
    EDIT_MERCHANT_SCHEME: `stores/schemeInfo`,
    GET_MERCHANT_SCHEME: `stores/schemeInfo`
  },
  APPROVAL: {
    MERCHANT: {
      LIST: `approval`,
      EXPORT: `approval/export`,
      EXPORT_SELECTED: `approval/exportSelected`,
      VIEW: `approval/view`,
      UPDATE: `approval/update`
    },
    COMMENT: {
      LIST: `approval/comments/list`
    },
    OTHER: {
      LIST: `admin-approval`,
      VIEW: `admin-approval/view`,
      EXPORT: `admin-approval/export`,
      EXPORT_SELECTED: `admin-approval/exportSelected`,
      APPROVE: `admin-approval/massApprove`,
      REJECT: `admin-approval/massReject`
    }
  },
  MERCHANT_SCHEME: {
    LIST: 'scheme-types',
    NEWSCHEME: 'scheme-types',
    EDITSCHEME: 'scheme-types',
    UPDATESCHEME: 'scheme-types',
    DELETESCHEME: 'scheme-types',
    DELETEMASSSCHEME: 'scheme-types/massDelete',
    EXPORT: 'scheme-types/export',
    EXPORT_SELECTED: `scheme-types/exportSelected`
  },
  DOCUMENT_TYPE: {
    LIST: 'document-types',
    NEWDOCTYPE: 'document-types',
    EDITDOCTYPE: 'document-types',
    UPDATEDOCTYPE: 'document-types',
    DELETEDOCTYPE: 'document-types',
    DELETEMASSSDOCTYPE: 'document-types/massDelete',
    EXPORT: 'document-types/export',
    EXPORT_SELECTED: `document-types/exportSelected`
  },
  CERTIFICATE: {
    LIST: 'certificate-types',
    NEWCERTIFICATE: 'certificate-types',
    EDITCERTIFICATE: 'certificate-types',
    UPDATECERTIFICATE: 'certificate-types',
    DELETECERTIFICATE: 'certificate-types',
    DELETEMASSSCERTIFICATE: 'certificate-types/massDelete',
    EXPORT: 'certificate-types/export',
    EXPORT_SELECTED: `certificate-types/exportSelected`
  },
  CATEGORY: {
    ADD: 'catalog/add',
    LIST: 'catalog',
    EXPORT: 'catalog/export',
    UPDATE: `catalog`,
    DELETE: `catalog`,
    MASS_DELETE: `catalog/massDelete`,
    VIEW: `catalog`,
    PARENT_CATEGORY:`catalog/primarySecondaryList`,
    EXPORT_SELECTED: `catalog/exportSelected`,
    UPLOAD_FILE: `common/fileupload`,
    DELETE_IMAGE:`catalog/deleteImage `,
  },
  PERMISSION: {
    LIST: `permission/master`
  },
  COUNTRY: {
    LIST: `countries`,
    ADD: `countries`,
    UPDATE: `countries`,
    DELETE: `countries`,
    MASS_DELETE: `countries/massDelete`,
    VIEW: `countries`,
    EXPORT_SELECTED: `countries/exportSelected`
  },
  CURRENCY: {
    LIST: `currencies`,
    ADD: `currencies`,
    UPDATE: `currencies`,
    DELETE: `currencies`,
    MASS_DELETE: `currencies/massDelete`,
    VIEW: `currencies`,
    CODE:`currencies/codes`,
    EXPORT_SELECTED: `currencies/exportSelected`
  },
  COUNTRYGROUP: {
    LIST: `groups`,
    ADD: `groups`,
    UPDATE: `groups`,
    DELETE: `groups`,
    MASS_DELETE: `groups/massDelete`,
    VIEW: `groups`,
    EXPORT_SELECTED: `groups/exportSelected`
  },
  MIGRATION:{
    EXPORT_API:'fixture/export.php',
    IMPORT_API:'fixture/import.php',
    SERVER_LIST:'fixture/server.php'
  },
  STATES: {
    LIST: `states`,
    ADD: `states`,
    UPDATE: `states`,
    DELETE: `states`,
    MASS_DELETE: `states/massDelete`,
    VIEW: `states`,
    EXPORT_SELECTED: `states/exportSelected`
  },
  CITIES: {
    LIST: `cities`,
    ADD: `cities`,
    UPDATE: `cities`,
    DELETE: `cities`,
    MASS_DELETE: `cities/massDelete`,
    VIEW: `cities`,
    EXPORT_SELECTED: `cities/exportSelected`,
    GET_COUNTRY_LIST: `locations/countries`,
    GET_STATE_LIST: `locations/states`,
  },
  CUSTOMER: {
    LIST: `customers`,
    ADD: `customers`,
    UPDATE: `customers`,
    DELETE: `customers`,
    MASS_DELETE: `customers/massDelete`,
    VIEW: `customers`,
    CODE:`customers/codes`,
    UPLOAD_FILE: `common/fileupload`,
    EXPORT_SELECTED: `customers/exportSelected`,
    DELETE_IMAGE : `customers/deleteImage`,
    RESET_PASSWORD : `customers/resetPassword`
  },
  THEMES: {
    LIST: `themes`,
    ADD: `themes`,
    UPDATE: `themes`,
    DELETE: `themes`,
    MASS_DELETE: `themes/massDelete`,
    VIEW: `themes`,
    EXPORT_SELECTED: `themes/exportSelected`,
    UPLOAD_FILE: `common/fileupload`,
    DELETE_IMAGE:`themes/deleteImage`,
  },
  BANNERS : {
    LIST : `banners`,
    DELETE: `banners`,
    EXPORT_SELECTED: `banners/exportSelected`,
    MASS_DELETE: `banners/massDelete`,
    VIEW: `banners`,
    ADD:`banners`,
    UPDATE:`banners`,
    PARENT_BANNER:`banners/selectList`,
    SPECIFIED_PAGE:`staticpages/selectList`,
    SPECIFIED_CATEGORIES:`catalog/alllist`,
    SPECIFIED_PRODUCTS:`products/selectList`,
    UPLOAD_FILE:`common/fileupload`,
  },
  BRANDS: {
    LIST: `brands`,
    ADD: `brands`,
    UPDATE: `brands`,
    DELETE: `brands`,
    MASS_DELETE: `brands/massDelete`,
    VIEW: `brands`,
    EXPORT_SELECTED: `brands/exportSelected`,
    SPECIFIED_PAGE: 'staticpages/selectList',
    PRODUCTS_LIST: 'products/selectList',
    CATEGORIES_LIST: 'catalog/alllist'
  },
  ATTRIBUTE: {
    LIST: `attributes`,
    ENTITY_LIST: `attributes/entities`,
    ADD: `attributes`,
    UPDATE: `attributes`,
    DELETE: `attributes`,
    MASS_DELETE: `attributes/massDelete`,
    VIEW: `attributes`,
    EXPORT_SELECTED: `attributes/exportSelected`,
    UPLOAD_FILE: `common/fileupload`,
    DELETE_IMAGE:`attributes/deleteImage`,
  },
  CURRENCY_RATES: {
    ADD: `currency_rates`,
    GET: `currency_rates`,
    IMPORT : `currency_rates/external/USD`
  },
  TRAINING_VIDEOS: {
    LIST: `training/videos`,
    ADD: `training/videos`,
    UPDATE: `training/videos`,
    DELETE: `training/videos`,
    MASS_DELETE: `training/videos/massDelete`,
    EXPORT_SELECTED: `training/videos/exportSelected`,
    VIEW: `training/videos`
  }
};
