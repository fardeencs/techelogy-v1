import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { UtilHelper } from '../../../helper/util.helper';
import * as Constant from '../../../modules/constants';
import { SchemeService } from '../../../services/scheme.service';
import { Location } from '@angular/common';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import {DATA_GRID} from "../../../modules/constants";

@Component({ templateUrl: './merchant-scheme-view.component.html', styleUrls: ['./merchant-scheme-view.component.css'] })
export class MerchantSchemeViewComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('remarksTmplCell') remarksTmplCell: TemplateRef<any>;
  @ViewChild('durationTmplCell') durationTmplCell: TemplateRef<any>;
  @ViewChild('schemeTypeTmplCell') schemeTypeTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;

  public loader = true;
  public schemeListConfig = {};
  public totalRecords = 0;
  public sortColumn = '';
  public sortOrder = '';
  public showMassDeleteBtn = false;
  public searchTxt = '';
  public allRowsSelected = false;
  public isCollapsedSearch = true;
  public SCHEME_EXPORT_API = Constant.REST_API.MERCHANT_SCHEME.EXPORT_SELECTED;
  public SCHEME_EXPORT_ACTION = 'SCHEMES_VIEW';
  public permissions: Array<string> = [];
  public selectedRids: Array<String> = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];
  public schemeSearchTableOption: Array<Object>;
  public pageInfo;

  constructor(
    protected _router: Router,
    public _activatedRoute: ActivatedRoute,
    private bsModalService: BsModalService,
    private _schemeService: SchemeService,
    private translate:TranslateService,
    private titleService: Title,
    protected _location: Location) {
    super(_router, _location);

    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
      ,map(() => this._activatedRoute)
      ,map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      ,filter(route => route.outlet === 'primary')
      ,mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title)=>{
          this.titleService.setTitle(title);
        });
        this.pageInfo = event;
      });
  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.processInitials();
    this.onSearch(_.omit(this.queryParams, Constant.QUERY_PARAMS_TO_OMIT_ARRAY));
  }

    /**
   * process grid default values, search attributes and table header for list
   */
  processInitials() {
    this.queryParams = this._activatedRoute.snapshot.queryParams;
    this.pageNumber = this.queryParams.pageNumber ? this.queryParams.pageNumber : 0;
    this.pageSize = this.queryParams.pageSize ? this.queryParams.pageSize : Constant.PAGINATION.ITEMS_PER_PAGE;
    this.sortColumn = this.queryParams.sortKey ? this.queryParams.sortKey : '';
    this.sortOrder = this.queryParams.sortValue ? this.queryParams.sortValue : '';
    if (this.sortColumn && this.sortOrder) {
      this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
    }
    const filterValues = Object.values(_.omit(this.queryParams, Constant.QUERY_PARAMS_TO_OMIT_ARRAY));
    filterValues.forEach(val => {
      if (val) {
        this.isCollapsedSearch = false;
      }
    });

    this.schemeSearchTableOption = [
      {
        type: 'text',
        'fieldName': 'schemeId',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.SCHEME_ID',
        fieldValue: '',
        defaultValue: this.queryParams.schemeId ? this.queryParams.schemeId : ''
      }, {
        type: 'text',
        'fieldName': 'schemeName',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.SCHEME_NAME',
        fieldValue: '',
        defaultValue: this.queryParams.schemeName ? this.queryParams.schemeName : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'duration',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.DURATION',
        fieldValue: '',
        options: Constant.DURATION_ARRAY,
        defaultValue: this.queryParams.duration ? this.queryParams.duration : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'validity',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.VALIDITY',
        fieldValue: '',
        defaultValue: this.queryParams.validity ? new Date(this.queryParams.validity) : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'schemeType',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.SCHEME_TYPE',
        fieldValue: '',
        options: Constant.SCHEME_TYPES_ARRAY,
        defaultValue: this.queryParams.schemeType ? this.queryParams.schemeType : ''
      }, {
        type: 'text',
        'fieldName': 'remarks',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.REMARKS',
        fieldValue: '',
        defaultValue: this.queryParams.remarks ? this.queryParams.remarks : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'isActive',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.STATUS',
        fieldValue: '',
        options: Constant.STATUS_ARRAY,
        defaultValue: this.queryParams.isActive ? this.queryParams.isActive : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'updatedDate',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.LAST_UPDATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.updatedDate ? new Date(this.queryParams.updatedDate) : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'createdDate',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.CREATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.updatedDate ? new Date(this.queryParams.createdDate) : ''
      }
    ];

    this.schemeListConfig = {
      rows: [],
      columns: [
        {
          headerTemplate: this.commonTmplHeader,
          name: 'Actions',
          headerClass: 'text-center',
          cellTemplate: this.actionTmpl,
          flexGrow: 2,
          width: 120,
          sortable: false,
          draggable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT,
          maxWidth : 120,
          resizeable: false,
          cellClass: 'action-btn',
        },
        {
          headerTemplate: this.checkboxTmplHeader,
          cellTemplate: this.checkboxTmpl,
          name: 'SELECT',
          headerClass: 'text-center',
          flexGrow: 1,
          width: 70,
          maxWidth : 80,
          resizeable: false,
          draggable: false,
          sortable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT,
          cellClass: 'fixed-column',
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'MERCHANT_SCHEME.FORM_LABELS.SCHEME_ID',
          flexGrow: 3,
          width: 70,
          maxWidth : 100,
          value: 'schemeId',
          cellClass: 'fixed-column',
          sortable: true,
          draggable: false,
          resizeable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'MERCHANT_SCHEME.FORM_LABELS.SCHEME_NAME',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'schemeName'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.durationTmplCell,
          name: 'MERCHANT_SCHEME.FORM_LABELS.DURATION',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'duration'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'MERCHANT_SCHEME.FORM_LABELS.VALIDITY',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'validity'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.schemeTypeTmplCell,
          name: 'MERCHANT_SCHEME.FORM_LABELS.SCHEME_TYPE',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'schemeType'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.remarksTmplCell,
          name: 'MERCHANT_SCHEME.FORM_LABELS.REMARKS',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'remark'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.statusTmplCell,
          name: 'COMMON.LABELS.STATUS',
          sortable: true,
          draggable: false,
          flexGrow: 4,
          value: 'isActiveKey'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'COMMON.LABELS.LAST_UPDATED_ON',
          sortable: true,
          draggable: false,
          flexGrow: 4,
          value: 'updatedDate'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'COMMON.LABELS.CREATED_ON',
          sortable: true,
          draggable: false,
          flexGrow: 4,
          value: 'createdDate'
        }
      ]
    };
  }

  /**
   * sort functionality for scheme list
   */
  onSort($event) {
    if ($event !== '$event') {
      this.loader = true;
      this.schemeListConfig['rows'] = [];
      switch ($event.column.value) {
        case 'statusLabel':
          this.sortColumn = 'status';
          break;
        default:
          this.sortColumn = $event.column.value;
      }
      $event.newValue === 'asc' ? this.sortOrder = 'asc' : this.sortOrder = 'desc';
      this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
      this.loadSchemeList();
    }
  }

  /**
 * next set of data loaded if page changes
 */
  pageChange($event) {
    this.pageNumber = $event.page - 1;
    this.pageSize = $event.itemsPerPage;
    this.loadSchemeList();
  }

  /**
 * load scheme list details with pagination functionality
 */
  loadSchemeList() {
    this.allRowsSelected = this.showMassDeleteBtn = false;
    this.loader = true;
    let param = '';
    let paramRoute = '';
    if (this.searchTxt) {
      paramRoute = param = this.searchTxt + '&';
    }

    param += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}`;

    paramRoute += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;

    this.navigateByUrl('/scheme/view?' + paramRoute);

    try {
      this
        ._schemeService
        .list(param)
        .subscribe((response) => {
          _
          .each(response['data'], function (v, k) {
            v['selected'] = false;
          });
          const blankData = [
            {
              'rid': '',
              'schemeId': '',
              'schemeName': '',
              'duration': '',
              'validity': '',
              'schemeType': '',
              'remark': '',
              'status': '',
              'createdDate': '',
              'updatedDate': ''
           }
          ];
          if (response['data'].length === 0) {
            response['data'] = blankData;
          }
          this.schemeListConfig['totalRecords'] = response['totalItems'];
          this.schemeListConfig['rows'] = response['data'];
          this.loader = false;
        },(error) => {
          this.setError(error.message);
          this.loader = false;
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
 * search box functionality
 */
  onSearch(searchObj: Object) {
    this.searchTxt = UtilHelper.toQueryParams(searchObj);
    this.loadSchemeList();
  }

  /**
 * check box select functionality
 */
  onCheckBoxSelect(row) {
    row['selected'] = !row['selected'];
    const selectedItems = _.filter(this.schemeListConfig['rows'], { 'selected': true });
    this.showMassDeleteBtn = selectedItems.length >= 1
      ? true
      : false;
    this.allRowsSelected = false;
    this.selectedIdsArray();
  }

  /**
 * mass scheme delete button functionality
 */
  onMassDeleteSchemes() {
    const selectedItems = _.filter(this.schemeListConfig['rows'], { 'selected': true });
    const selectedSchemeArr = _.map(selectedItems, 'rid');
    this.showConfirmationMassDeleteModal(selectedSchemeArr);
  }

  /**
 * edit scheme functionality
 */
  onEditScheme(item) {
    const url = '/scheme/edit/' + item['rid'];
    this
      ._router
      .navigate([url]);
  }

  /**
 * view scheme functionality
 */
  public onViewScheme(item) {
    const url = '/scheme/schemeDetail/' + item['rid'];
    this
      ._router
      .navigate([url]);
  }

  /**
 * add scheme functionality
 */
  onAddScheme() {
    const url = '/scheme/add';
    this
      ._router
      .navigate([url]);
  }

  /**
 * delete single scheme functionality
 */
  onDeleteScheme(item) {
    this.showConfirmationDeleteModal(item);
  }

  /**
 * confirm modal delete
**/
  showConfirmationDeleteModal(item): void {
    const modal = this
      .bsModalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.DELETE', 'COMMON.MODALS.ARE_U_SURE_TO_DELETE', 'COMMON.BUTTONS.YES',
        'COMMON.BUTTONS.NO'); (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            // when pressed Yes
            this.deleteScheme(item['rid']);

          } else if (result === false) {
            // when pressed No
          } else {
            // When closing the modal without no or yes
          }
        });
  }

  /** * delete scheme by id */
  deleteScheme(id): void {
    try {
      this
        ._schemeService
        .deleteScheme(id)
        .subscribe((response) => {
          this.setSuccess('SCHEME_DELETED_SUCCESSFULLY');
          this.loadSchemeList();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /** * confirm modal mass delete **/
  showConfirmationMassDeleteModal(schemeIds:
    Array<string>): void {
    const modal = this
      .bsModalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.DELETE', 'COMMON.MODALS.ARE_U_SURE_TO_DELETE', 'COMMON.BUTTONS.YES',
        'COMMON.BUTTONS.NO'); (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            // when pressed Yes delete scheme
            this.deleteMassSchemes(schemeIds);
          } else if (result === false) {
            // when pressed No
          } else {
            // When closing the modal without no or yes
          }
        });
  }

  /** * delete mass scheme */
  deleteMassSchemes(schemeIds): void {
    try {
      this
        ._schemeService
        .deleteMassSchemes(schemeIds)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadSchemeList();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

            /** * Select All functionality */
  onSelectAllChkBox($event) {
    this.allRowsSelected = $event.target.checked;
    this.showMassDeleteBtn = $event.target.checked;
    _.map(this.schemeListConfig['rows'], (obj) => obj['selected'] = this.allRowsSelected);
    this.selectedIdsArray();
  }

  public selectedIdsArray() {
   const selectedItems = _.filter(this.schemeListConfig['rows'], { 'selected': true });
   this.selectedRids = _.map(selectedItems, 'rid');
  }

  public getDurationLabel(duration: number) {
    return duration ? _.filter(Constant.DURATION_ARRAY, { value: duration })[0]['label'] : '';
  }

  public getSchemeTypeLabel(schemeType: number) {
    return schemeType ? _.filter(Constant.SCHEME_TYPES_ARRAY, { value: schemeType })[0]['label'] : '';
  }

  /**
   * Get status name
   */
  public getStatusName(status: string) {
    const arr = _.filter(Constant.STATUS_ARRAY, { label: status });
    return arr.length > 0 ? arr[0]['label'] : '';
  }
}
