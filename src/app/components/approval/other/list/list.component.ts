import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BaseComponent } from '../../../base.component';
import * as _ from 'lodash';
import { UtilHelper } from '../../../../helper/util.helper';
import { TranslateService } from '@ngx-translate/core';
import * as Constant from '../../../../modules/constants';
import { Location } from '@angular/common';
import { ListModel } from '../../../../models/user/list.model';
import { OtherApprovalService } from '../../../../services/other_approval';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import {DATA_GRID} from "../../../../modules/constants";

@Component(
  { templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'] }
)
export class OtherApprovalListComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;
  modalRef: BsModalRef;

  public approvalListConfig: ListModel;
  public loader = true;
  public totalRecords = 0;
  public sortColumn = '';
  public sortOrder = '';
  public showMassActionBtn = false;
  public searchTxt = '';
  public allRowsSelected = false;
  public isCollapsedSearch = true;
  public APPROVAL_EXPORT_API = Constant.REST_API.APPROVAL.OTHER.EXPORT_SELECTED;
  public APPROVAL_EXPORT_ACTION = Constant.MODULE_ACTIONS.APPROVAL.MERCHANT;
  public permissions: Array<string> = [];
  public selectedRids: Array<String> = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];

  public approvalSearchTableOption: Array<Object>;
  public pageInfo:any;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute, private _approvalServices: OtherApprovalService,
    private translate: TranslateService, private modalService: BsModalService,private titleService: Title,
    protected _location: Location) {
    super(_router, _location);
    this.approvalListConfig = new ListModel();

    this._router.events
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
    this.loader = false;
    this.loadList();
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

    this.approvalSearchTableOption = [
      {
        type: 'text',
        'fieldName': 'approvalHistoryId',
        'labelName': 'APPROVAL.FORM_LABELS.APPROVAL_REQUEST_ID',
        fieldValue: '',
        defaultValue: this.queryParams.approvalHistoryId ? this.queryParams.approvalHistoryId : ''
      }, {
        type: 'text',
        'fieldName': 'entityId',
        'labelName': 'APPROVAL.FORM_LABELS.REFERENCE_ID',
        fieldValue: '',
        defaultValue: this.queryParams.entityId ? this.queryParams.entityId : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'approvalType',
        'labelName': 'APPROVAL.FORM_LABELS.APPROVAL_TYPE',
        fieldValue: '',
        options: Constant.OTHER_APPROVAL_TYPE_ARRAY,
        defaultValue: this.queryParams.approvalType ? this.queryParams.approvalType : ''
      }, {
        type: 'text',
        'fieldName': 'previousValue',
        'labelName': 'APPROVAL.FORM_LABELS.PREVIOUS_VALUE',
        fieldValue: '',
        defaultValue: this.queryParams.previousValue ? this.queryParams.previousValue : ''
      }, {
        type: 'text',
        'fieldName': 'proposeValue',
        'labelName': 'APPROVAL.FORM_LABELS.PROPOSED_VALUE',
        fieldValue: '',
        defaultValue: this.queryParams.proposeValue ? this.queryParams.proposeValue : ''
      }, {
        type: 'text',
        'fieldName': 'proposedBy',
        'labelName': 'APPROVAL.FORM_LABELS.PROPOSED_BY',
        fieldValue: '',
        defaultValue: this.queryParams.proposedBy ? this.queryParams.proposedBy : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'status',
        'labelName': 'APPROVAL.FORM_LABELS.STATUS',
        fieldValue: '',
        options: Constant.OTHER_APPROVAL_STATUS_ARRAY,
        defaultValue: this.queryParams.status ? this.queryParams.status : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'updatedDate',
        'labelName': 'APPROVAL.FORM_LABELS.LAST_UPDATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.updatedDate ? new Date(this.queryParams.updatedDate) : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'createdDate',
        'labelName': 'APPROVAL.FORM_LABELS.CREATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.createdDate ? new Date(this.queryParams.createdDate) : ''
      }
    ];

    this.approvalListConfig.columns = [
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
        cellClass: 'fixed-column'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.APPROVAL_REQUEST_ID',
        flexGrow: 1,
        width: 50,
        maxWidth : 100,
        value: 'approvalHistoryId',
        sortable: true,
        draggable: false,
        resizeable: false,
        frozenLeft: DATA_GRID.FROZEN_LEFT,
        cellClass: 'fixed-column'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.REFERENCE_ID',
        sortable: true,
        draggable: false,
        flexGrow: 1,
        width: 50,
        value: 'entityId'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.APPROVAL_TYPE',
        sortable: true,
        draggable: false,
        flexGrow: 3,
        value: 'approvalType'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.PREVIOUS_VALUE',
        flexGrow: 4,
        sortable: true,
        draggable: false,
        value: 'previousValue'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.PROPOSED_VALUE',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'proposeValue'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.PROPOSED_BY',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'proposedBy'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.statusTmplCell,
        name: 'APPROVAL.FORM_LABELS.STATUS',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'status'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.LAST_UPDATED_ON',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'updatedDate'
      }
    ];
  }

  /**
   * load merchant approval list details with pagination functionality
   */
  loadList() {
    this.allRowsSelected = this.showMassActionBtn = false;
    this.loader = true;
    let param = '';
    let paramRoute = '';
    if (this.searchTxt) {
      paramRoute = param = this.searchTxt + '&';
    }
    param += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}`;

    paramRoute += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;

    this.navigateByUrl('/approval/other?' + paramRoute);


    try {
      this
        ._approvalServices
        .list(param)
        .subscribe((response) => {
            _.each(response['data'], function (v, k) {
              v['selected'] = false;
            });
          const blankData = [
            {
              'rid': '',
              'approvalHistoryId': '',
              'entityId': '',
              'approvalType': '',
              'status': '',
              'previousValue': '',
              'proposeValue': '',
              'comments': '',
              'proposedBy': '',
              'createdDate': '',
              'updatedDate': '',
              'proposedByFname': '',
              'proposedByLname': ''
            }
          ];
          if (response['data'].length === 0) {
            response['data'] = blankData;
          }
          this.approvalListConfig.rows = response.data;
          this.approvalListConfig.totalRecords = response.totalItems;
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
  * sort functionality for list
  */
  onSort($event) {
    if ($event !== '$event') {
      this.loader = true;
      this.approvalListConfig.rows = [];
      this.sortColumn = $event.column.value;
      $event.newValue === 'asc' ? this.sortOrder = 'asc' : this.sortOrder = 'desc';
      this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
      this.loadList();
    }
  }

  /**
  * search box functionality
  */
  onSearch(searchObj: Object) {
    this.searchTxt = UtilHelper.toQueryParams(searchObj);
    this.loadList();
  }

  /**
   * check box select functionality
   */
  onCheckBoxSelect(row) {
    row['selected'] = !row['selected'];
    const selectedItems = _.filter(this.approvalListConfig.rows, { 'selected': true });
    this.showMassActionBtn = selectedItems.length >= 1
      ? true
      : false;
    this.selectedIdsArray();
  }

  /** * next set of data loaded if page changes */
  pageChange($event) {
    this.pageNumber = $event.page - 1;
    this.pageSize = $event.itemsPerPage;
    this.loadList();
  }

  onView(item) {
    this.navigateByUrl('/approval/other/view/' + item.rid);
  }

  /** * delete modal close button event */
  confirmClose() {
    this
      .modalRef
      .hide();
  }

  openModal(template: TemplateRef<any>, initialState: Object) {
    this.modalRef = this
      .modalService
      .show(template, Object.assign({}, {
        class: 'modal-sm',
        initialState
      }));
  }

  /** * Select All functionality */
  onSelectAllCheckbox($event) {
    this.allRowsSelected = $event.target.checked;
    this.showMassActionBtn = $event.target.checked;
    _.map(this.approvalListConfig.rows, (obj) => obj.selected = this.allRowsSelected);
    this.selectedIdsArray();
  }

  onAccept() {
    const selectedItems = _.filter(this.approvalListConfig.rows, { 'selected': true });
    const selectedApprovalArr = _.map(selectedItems, 'rid');
    try {
      this
        ._approvalServices
        .approve(selectedApprovalArr)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadList();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  onReject() {
    const selectedItems = _.filter(this.approvalListConfig.rows, { 'selected': true });
    const selectedApprovalArr = _.map(selectedItems, 'rid');
    try {
      this
        ._approvalServices
        .reject(selectedApprovalArr)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadList();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  public selectedIdsArray() {
    const selectedItems = _.filter(this.approvalListConfig.rows, { 'selected': true });
    this.selectedRids = _.map(selectedItems, 'rid');
  }

  /**
   * Get status name
   */
  public getStatusName(status: string) {
    const arr = _.filter(Constant.OTHER_APPROVAL_STATUS_ARRAY, { label: status });
    return arr.length > 0 ? arr[0]['label'] : '';
  }
}

