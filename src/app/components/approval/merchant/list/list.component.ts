import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BaseComponent } from '../../../base.component';
import { ListModel } from '../../../../models/user/list.model';
import { ConfirmDialogComponent } from '../../../../shared/dialog/confirm/confirm.component';
import * as _ from 'lodash';
import { UtilHelper } from '../../../../helper/util.helper';
import { TranslateService } from '@ngx-translate/core';
import * as Constant from '../../../../modules/constants';
import { RoleService } from '../../../../services/role.service';
import { Location } from '@angular/common';
import { MerchantApprovalService } from '../../../../services/merchant_approval';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import {DATA_GRID} from "../../../../modules/constants";

@Component({ templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class MerchantListComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('anchorTmplCell') anchorTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;
  @ViewChild('merchantStatusTmplCell') merchantStatusTmplCell: TemplateRef<any>;

  modalRef: BsModalRef;
  public approvalListConfig: ListModel;
  public loader = true;
  public totalRecords = 0;
  public sortColumn = '';
  public sortOrder = '';
  public showMassDeleteBtn = false;
  public searchTxt = '';
  public allRowsSelected = false;
  public isCollapsedSearch = true;
  public APPROVAL_EXPORT_API = Constant.REST_API.APPROVAL.MERCHANT.EXPORT_SELECTED;
  public APPROVAL_EXPORT_ACTION = Constant.MODULE_ACTIONS.APPROVAL.MERCHANT;
  public permissions: Array<string> = [];
  public merchantPermissions: Array<string> = [];
  public selectedRids: Array<String> = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];
  public approvalSearchTableOption: Array<Object>;
  public pageInfo:any;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute, private _approvalServices: MerchantApprovalService,
    private translate: TranslateService, private _roleService: RoleService, private modalService: BsModalService,private titleService: Title,
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
      this.sortArray = [{ value: this.sortColumn, dir: this.sortOrder }];
    }
    const filterValues = Object.values(_.omit(this.queryParams, Constant.QUERY_PARAMS_TO_OMIT_ARRAY));
    filterValues.forEach(val => {
      if (val) {
        this.isCollapsedSearch = false;
      }
    });

    this.getMerchantViewPermission();

    this.approvalSearchTableOption = [
      {
        type: 'text',
        'fieldName': 'approvalRequestId',
        'labelName': 'APPROVAL.FORM_LABELS.APPROVAL_REQUEST_ID',
        fieldValue: '',
        defaultValue: this.queryParams.approvalRequestId ? this.queryParams.approvalRequestId : ''
      }, {
        type: 'text',
        'fieldName': 'storeName',
        'labelName': 'APPROVAL.FORM_LABELS.STORE_NAME',
        fieldValue: '',
        defaultValue: this.queryParams.storeName ? this.queryParams.storeName : ''
      }, {
        type: 'text',
        'fieldName': 'assigneeName',
        'labelName': 'APPROVAL.FORM_LABELS.ASSIGNEE_NAME',
        fieldValue: '',
        defaultValue: this.queryParams.assigneeName ? this.queryParams.assigneeName : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'approvalStatus',
        'labelName': 'APPROVAL.FORM_LABELS.STATUS',
        fieldValue: '',
        options: _.compact(Constant.EDIT_APPROVAL_STATUS_ARRAY_FORM),
        defaultValue: this.queryParams.approvalStatus ? this.queryParams.approvalStatus : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'storeApprovalStatus',
        'labelName': 'APPROVAL.FORM_LABELS.MERCHANT_STATUS',
        fieldValue: '',
        options: _.compact(Constant.APPROVAL_STATUS_ARRAY),
        defaultValue: this.queryParams.storeApprovalStatus ? this.queryParams.storeApprovalStatus : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'approvalDate',
        'labelName': 'APPROVAL.FORM_LABELS.APPROVAL_DATE',
        fieldValue: '',
        defaultValue: this.queryParams.approvalDate ? new Date(this.queryParams.approvalDate) : ''
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
        headerTemplate: this.commonTmplHeader,
        name: 'Actions',
        headerClass: 'text-center',
        cellTemplate: this.actionTmpl,
        flexGrow: 2,
        value: '',
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
        cellClass: 'fixed-column'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.APPROVAL_REQUEST_ID',
        flexGrow: 1,
        width: 50,
        value: 'approvalRequestId',
        cellClass: 'fixed-column',
        sortable: true,
        draggable: false,
        resizeable: false,
        frozenLeft: DATA_GRID.FROZEN_LEFT
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.anchorTmplCell,
        name: 'APPROVAL.FORM_LABELS.STORE_NAME',
        sortable: true,
        draggable: false,
        flexGrow: 3,
        value: 'storeName'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.ASSIGNEE_NAME',
        flexGrow: 4,
        sortable: true,
        draggable: false,
        value: 'assigneeName'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.ROLE_NAME',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'roleName'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.statusTmplCell,
        name: 'APPROVAL.FORM_LABELS.STATUS',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'approvalStatus'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.merchantStatusTmplCell,
        name: 'APPROVAL.FORM_LABELS.MERCHANT_STATUS',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'storeApprovalStatus'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.APPROVAL_DATE',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'approvalDate'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.LAST_UPDATED_ON',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'updatedDate'
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'APPROVAL.FORM_LABELS.CREATED_ON',
        sortable: true,
        draggable: false,
        flexGrow: 4,
        value: 'createdDate'
      }
    ];
  }

  /**
   * load merchant approval list details with pagination functionality
   */
  loadList() {
    this.allRowsSelected = this.showMassDeleteBtn = false;
    this.loader = true;
    let param = '';
    let paramRoute = '';
    if (this.searchTxt) {
      paramRoute = param = this.searchTxt + '&';
    }
    param += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}`;

    paramRoute += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;

    this.navigateByUrl('/approval/merchant?' + paramRoute);

    try {
      this
        ._approvalServices
        .list(param)
        .subscribe((response) => {
          _
            .each(response['data'], function (v, k) {
              v['selected'] = false;
            });
          const blankData = [
            {
              'rid': '',
              'roleId': '',
              'roleName': '',
              'roleType': '',
              'parentId': '',
              'userId': '',
              'createdBy': '',
              'createdDate': '',
              'updatedDate': '',
              'permissionType': '',
              'defaultRole': ''
            }
          ];
          if (response['data'].length === 0) {
            response['data'] = blankData;
          }
          this.approvalListConfig.rows = response.data;
          this.approvalListConfig.totalRecords = response.totalItems;
          this.loader = false;
        } ,(error) => {
          this.setError(error.message);
          this.loader = false;
        });
    } catch (error) {
      console.log(error);
    }
  }

  getMerchantViewPermission() {
    try {
      this
        ._approvalServices
        .moduleLevelPermissions(Constant.MODULE_ID.MERCHANT)
        .subscribe((response) => {
          this.merchantPermissions = response.action;
        });
    } catch (error) {
      console.log(error);
    }
  }


  /**
   * Get Role List
   */
  getRoleList() {
    try {
      this
        ._roleService
        .getRole()
        .subscribe((response) => {
          const roles = _.map(response.data, 'roleName');
          this
            .approvalSearchTableOption
            .splice(3, 0, {
              type: 'dropdown',
              fieldName: 'roleName',
              labelName: 'APPROVAL.FORM_LABELS.ROLE_NAME',
              fieldValue: '',
              options: roles
            });
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
      this.sortArray = [{ value: this.sortColumn, dir: this.sortOrder }];
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
    this.showMassDeleteBtn = selectedItems.length >= 1
      ? true
      : false;
    this.selectedIdsArray();
  }

  /**
   * mass delete functionality
   */
  onMassDelete() {
    const selectedItems = _.filter(this.approvalListConfig.rows, { 'selected': true });
    const selectedUserArr = _.map(selectedItems, 'rid');
    this.showConfirmationMassDeleteModal(selectedUserArr);
  }

  /**
  * confirm modal mass delete
  **/
  showConfirmationMassDeleteModal(userIds: Array<string>): void {
    const modal = this
      .modalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.DELETE',
        'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
        'COMMON.BUTTONS.YES',
        'COMMON.BUTTONS.NO'
      );
    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes this.deleteMassUsers(userIds);
      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }
  /** * confirm modal delete **/
  showConfirmationDeleteModal(item): void {
    const modal = this
      .modalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.DELETE',
        'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
        'COMMON.BUTTONS.YES',
        'COMMON.BUTTONS.NO'
      );
    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes this.deleteUser(item['rid']);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /** * next set of data loaded if page changes */
  pageChange($event) {
    this.pageNumber = $event.page - 1;
    this.pageSize = $event.itemsPerPage;
    this.loadList();
  }

  onEdit(item) {
    this.navigateByUrl('/approval/merchant/edit/' + item.rid);
  }

  onView(item) {
    this.navigateByUrl('/approval/merchant/view/' + item.rid);
  }

  /** * delete single role functionality */
  onDelete(item) {
    this.showConfirmationDeleteModal(item);
  }

  /** * delete modal ok button event */
  confirmDelete(): void {
    this
      .modalRef
      .hide();
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
    this.showMassDeleteBtn = $event.target.checked;
    _.map(this.approvalListConfig.rows, (obj) => obj.selected = this.allRowsSelected);
    this.selectedIdsArray();
  }

  public selectedIdsArray() {
    const selectedItems = _.filter(this.approvalListConfig.rows, { 'selected': true });
    this.selectedRids = _.map(selectedItems, 'rid');
  }

  /**
   * Get status name
   */
  public getStatusName(status: string) {
    const arr = _.filter(Constant.APPROVAL_STATUS_ARRAY, { label: status });
    return arr.length > 0 ? arr[0]['label'] : '';
  }
}
