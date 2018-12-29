import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { UserService } from '../../../services/user.service';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { UtilHelper } from '../../../helper/util.helper';
import { RoleService } from '../../../services/role.service';
import * as Constant from '../../../modules/constants';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { DateHelper } from '../../../helper/date.helper';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import {DATA_GRID} from "../../../modules/constants";

@Component({
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('dateTmplCell') dateTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;

  public loader = true;
  public userListConfig = {};
  public totalRecords = 0;
  public sortColumn = '';
  public sortOrder = '';
  public showMassDeleteBtn = false;
  public searchTxt = '';
  public allRowsSelected = false;
  public isCollapsedSearch = true;
  public USER_EXPORT_API = Constant.REST_API.USER.EXPORT_SELECTED;
  public USER_EXPORT_ACTION = 'USERS_VIEW';

  public STATUS_ARRAY = Constant.STATUS_ARRAY;
  public permissions: Array<string> = [];
  public selectedRids: Array<String> = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];
  public pageInfo;

  public userSearchTableOption: Array<Object>;

  constructor(
    protected _router: Router,
    private _roleService: RoleService,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private titleService: Title,
    protected _location: Location) {
    super(_router, _location);

    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
      ,map(() => this.activatedRoute)
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
    this.permissions = this.activatedRoute.snapshot.data['permission'];
    this.processInitials();
    this.getRoleList();
    this.onSearch(_.omit(this.queryParams, Constant.QUERY_PARAMS_TO_OMIT_ARRAY));
  }

  /**
 * process grid default values, search attributes and table header for list
 */
  processInitials() {
    this.queryParams = this.activatedRoute.snapshot.queryParams;
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

    this.userSearchTableOption = [
      {
        type: 'text',
        'fieldName': 'userId',
        'labelName': 'COMMON.LABELS.ID',
        fieldValue: '',
        defaultValue: this.queryParams.userId ? this.queryParams.userId : ''
      }, {
        type: 'text',
        'fieldName': 'firstname',
        'labelName': 'USER.FORM_LABELS.FIRST_NAME',
        fieldValue: '',
        defaultValue: this.queryParams.firstname ? this.queryParams.firstname : ''
      }, {
        type: 'text',
        'fieldName': 'lastname',
        'labelName': 'USER.FORM_LABELS.LAST_NAME',
        fieldValue: '',
        defaultValue: this.queryParams.firstname ? this.queryParams.firstname : ''
      }, {
        type: 'text',
        'fieldName': 'email',
        'labelName': 'USER.FORM_LABELS.EMAIL',
        fieldValue: '',
        defaultValue: this.queryParams.email ? this.queryParams.email : ''
      }, {
        type: 'text',
        'fieldName': 'createdByName',
        'labelName': 'USER.FORM_LABELS.CREATED_BY_NAME',
        fieldValue: '',
        defaultValue: this.queryParams.createdByName ? this.queryParams.createdByName : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'isActive',
        'labelName': 'USER.FORM_LABELS.STATUS',
        fieldValue: '',
        options: this.STATUS_ARRAY,
        defaultValue: this.queryParams.isActive ? this.queryParams.isActive : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'createdDate',
        'labelName': 'COMMON.LABELS.CREATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.createdDate ? this.queryParams.createdDate : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'updatedDate',
        'labelName': 'COMMON.LABELS.LAST_UPDATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.updatedDate ? this.queryParams.updatedDate : ''
      }
    ];

    this.userListConfig = {
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
          value: ''
        },
        {
          headerTemplate: this.checkboxTmplHeader,
          cellTemplate: this.checkboxTmpl,
          name: 'SELECT',
          headerClass: 'text-center',
          flexGrow: 1,
          width: 70,
          maxWidth : 70,
          resizeable: false,
          draggable: false,
          sortable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT,
          cellClass: 'fixed-column',
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'COMMON.LABELS.ID',
          flexGrow: 3,
          width: 70,
          maxWidth : 100,
          value: 'userId',
          cellClass: 'fixed-column',
          sortable: true,
          draggable: false,
          resizeable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'USER.FORM_LABELS.FIRST_NAME',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'firstname'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'USER.FORM_LABELS.LAST_NAME',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'lastname'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'USER.FORM_LABELS.EMAIL',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'email'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'USER.FORM_LABELS.ROLE_NAME',
          sortable: true,
          draggable: false,
          flexGrow: 4,
          value: 'roleName'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'USER.FORM_LABELS.CREATED_BY_NAME',
          sortable: true,
          draggable: false,
          flexGrow: 4,
          value: 'createdByName'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.statusTmplCell,
          name: 'USER.FORM_LABELS.STATUS',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'status'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.dateTmplCell,
          name: 'COMMON.LABELS.LAST_UPDATED_ON',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'updatedDate'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.dateTmplCell,
          name: 'COMMON.LABELS.CREATED_ON',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'createdDate'
        }
      ]
    };
  }

  /**
   * sort functionality for user list
   */
  onSort($event) {
    if ($event !== '$event') {
      this.loader = true;
      this.userListConfig['rows'] = [];
      this.sortColumn = $event.column['value'];
      $event.newValue === 'asc' ? this.sortOrder = 'asc' : this.sortOrder = 'desc';
      this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
      this.loadUserList();
    }
  }

  /**
   * next set of data loaded if page changes
   */
  pageChange($event) {
    this.pageNumber = $event.page - 1;
    this.pageSize = $event.itemsPerPage;
    this.loadUserList();
  }

  /**
   * load user list details with pagination functionality
   */
  loadUserList() {
    this.allRowsSelected = this.showMassDeleteBtn = false;
    this.loader = true;
    let param = '';
    let paramRoute = '';
    if (this.searchTxt) {
      paramRoute = param = this.searchTxt + '&';
    }

    param += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}`;

    paramRoute += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;

    this.navigateByUrl('/user/view?' + paramRoute);

    try {
      this._userService
        .list(param)
        .subscribe((response) => {
          _.each(response['data'], function (v, k) {
            v['selected'] = false;
          });
          const blankData = [
            {
              'createdDate': '',
              'updatedDate': '',
              'email': '',
              'firstname': '',
              'lastname': '',
              'userId': '',
              'phoneNumber1': '',
              'phoneNumber2': '',
              'rid': '',
              'roleId': '',
              'roleName': '',
              'extensionNumber': '',
              'telephone': '',
              'designation': '',
              'merchantRepresentativeName': '',
              'storeName': '',
              'companyNumber': '',
              'approvalStatus': '',
              'businessLegalName': '',
              'status': '',
              'createdByName': '',
              'roleIsDeleted': ''
            }
          ];
          if (response['data'].length === 0) {
            response['data'] = blankData;
          }
          this.userListConfig['totalRecords'] = response['totalItems'];
          this.userListConfig['rows'] = response['data'];
          this.loader = false;
        }
        ,(error) => {
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
    this.loadUserList();
  }

  /**
   * check box select functionality
   */
  onCheckBoxSelect(row) {
    row['selected'] = !row['selected'];
    const selectedItems = _.filter(this.userListConfig['rows'], { 'selected': true });
    this.showMassDeleteBtn = selectedItems.length >= 1 ? true : false;
    this.allRowsSelected = false;
    this.selectedIdsArray();
  }

  /**
   * mass user delete button functionality
   */
  onMassDeleteUsers() {
    const selectedItems = _.filter(this.userListConfig['rows'], { 'selected': true });
    const selectedUserArr = _.map(selectedItems, 'rid');
    this.showConfirmationMassDeleteModal(selectedUserArr);
  }

  /**
   * edit user functionality
   */
  onEditUser(item) {
    const url = '/user/edit/' + item['rid'];
    this._router.navigate([url]);
  }
  /**
   * view user functionality
   */
  public onviewUser(item) {
    const url = '/user/userDetail/' + item['rid'];
    this._router.navigate([url]);
  }

  /**
   * add user functionality
   */
  onAddUser() {
    const url = '/user/add';
    this._router.navigate([url]);
  }

  /**
   * delete single user functionality
   */
  onDeleteUser(item) {
    this.showConfirmationDeleteModal(item);
  }

  /**
   * confirm modal delete
  **/
  showConfirmationDeleteModal(item): void {
    const modal = this.bsModalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO',
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes
        this.deleteUser(item['rid']);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete user by id
   */
  deleteUser(id): void {
    try {
      this._userService
        .deleteUser(id)
        .subscribe((response) => {
          this.setSuccess('USER_DELETED_SUCCESSFULLY');
          this.loadUserList();
        }
        ,(error) => {
          this.setError(error.message);
        });
    } catch (error) {
    }
  }

  /**
   * confirm modal mass delete
   **/
  showConfirmationMassDeleteModal(userIds: Array<string>): void {
    const modal = this.bsModalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO',
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes
        // delete user
        this.deleteMassUsers(userIds);
      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete mass user
   */
  deleteMassUsers(userIds): void {
    try {
      this._userService
        .deleteMassUsers(userIds)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadUserList();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {

    }
  }

  /**
   * Get Role List
   */
  getRoleList() {
    try {
      this._roleService.getRole().subscribe((response) => {
        const roles = _.map(response.data, 'roleName');
        this.userSearchTableOption.push(
          { type: 'dropdown', fieldName: 'roleName', labelName: 'Role Name', fieldValue: '', options: roles }
        );
      });
    } catch (error) {
    }
  }

  /**
   * Select All functionality
   */
  onSelectAllChkBox($event) {
    this.allRowsSelected = $event.target.checked;
    this.showMassDeleteBtn = $event.target.checked;
    _.map(this.userListConfig['rows'], (obj) => obj['selected'] = this.allRowsSelected);
    this.selectedIdsArray();
  }
  /**
   * Get status name
   */
  public getStatusName(id) {
    const arr = _.filter(this.STATUS_ARRAY, { value: id });
    return arr.length > 0 ? arr[0]['label'] : '';
  }

  public selectedIdsArray() {
    const selectedItems = _.filter(this.userListConfig['rows'], { 'selected': true });
    this.selectedRids = _.map(selectedItems, 'rid');
  }
}
