import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { MerchantService } from '../../../services/merchant.service';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { UtilHelper } from '../../../helper/util.helper';
import * as Constant from '../../../modules/constants';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { AssignsalepersonComponent } from '../assignsaleperson/assignsaleperson.component';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import {DATA_GRID} from "../../../modules/constants";

@Component({
  templateUrl: './merchant-view.component.html',
  styleUrls: ['./merchant-view.component.css']
})
export class MerchantViewComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('dateTmplCell') dateTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;
  @ViewChild('emailTmplCell') emailTmplCell: TemplateRef<any>;
  @ViewChild('urlTmplCell') urlTmplCell: TemplateRef<any>;



  public loader = true;
  public merchantListConfig = {};
  public totalRecords = 0;
  public sortColumn = '';
  public sortOrder = '';
  public showMassDeleteBtn = false;
  public searchTxt = '';
  public allRowsSelected = false;
  public isCollapsedSearch = true;
  public MERCHANT_EXPORT_API = Constant.REST_API.MANAGE_MERCHANT.STORE_EXPORT;
  public MERCHANT_EXPORT_ACTION = Constant.MODULE_ACTIONS.MERCHANT.VIEW;
  public permissions: Array<string> = [];
  public selectedRids: Array<String> = [];

  public merchantListStatusValue = Constant.MERCHANT_APPROVAL_STATUS_ARRAY;
  public allowedStatusTypes = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];
  public pageInfo;

  public merchantSearchTableOption: Array<Object>;

  constructor(
    protected _router: Router,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private _merchantService: MerchantService,
    private activatedRoute: ActivatedRoute,
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
    this.allowedStatusTypes = _.map(Constant.MERCHANT_DENY_EDIT_STATUS_ARRAY, 'value');
    this.permissions = this.activatedRoute.snapshot.data['permission'];
    this.processInitials();
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
      this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
    }
    const filterValues = Object.values(_.omit(this.queryParams, Constant.QUERY_PARAMS_TO_OMIT_ARRAY));
    filterValues.forEach(val => {
      if (val) {
        this.isCollapsedSearch = false;
      }
    });
    this.merchantSearchTableOption = [
      {
         type: 'text',
        'fieldName': 'userId',
        'labelName': 'COMMON.LABELS.ID',
        fieldValue: '',
        defaultValue: this.queryParams.userId ? this.queryParams.userId : ''
      },
      {
        type: 'text',
        'fieldName': 'merchantRepresentativeName',
        'labelName': 'MANAGE_MERCHANT.ADD_MERCHANT.COMPANY_INFO.MERCHANT_REPRESENTATIVE_NAME',
        fieldValue: '',
        defaultValue: this.queryParams.merchantRepresentativeName ? this.queryParams.merchantRepresentativeName : ''
       },
       {
        type: 'text',
        'fieldName': 'storeName',
        'labelName': 'MANAGE_MERCHANT.FORM_LABELS.STORE_NAME',
         fieldValue: '',
         defaultValue: this.queryParams.storeName ? this.queryParams.storeName : ''
        },
      {
        type: 'text',
        'fieldName': 'email',
        'labelName': 'MANAGE_MERCHANT.FORM_LABELS.STORE_EMAIL',
        fieldValue: '',
        defaultValue: this.queryParams.email ? this.queryParams.email : ''
      },
      {
        type: 'text',
        'fieldName': 'websiteUrl',
        'labelName': 'MANAGE_MERCHANT.ADD_MERCHANT.COMPANY_INFO.URL',
         fieldValue: '',
         defaultValue: this.queryParams.websiteUrl ? this.queryParams.websiteUrl : ''
      },
      {
        type: 'text',
        'fieldName': 'salesPersonName',
        'labelName': 'MANAGE_MERCHANT.FORM_LABELS.CURRENT_SALESPERSON',
         fieldValue: '',
         defaultValue: this.queryParams.salesPersonName ? this.queryParams.salesPersonName : ''
      },
      {
        type: 'keyValueDropdown',
        'fieldName': 'approvalStatus',
        'labelName': 'MANAGE_MERCHANT.FORM_LABELS.STATUS',
        fieldValue: '',
        options: this.merchantListStatusValue,
        defaultValue: this.queryParams.approvalStatus ? this.queryParams.approvalStatus : ''
      },
      {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'createdDate',
        'labelName': 'MANAGE_MERCHANT.FORM_LABELS.CREATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.createdDate ?  new Date (this.queryParams.createdDate) : ''
      },
      {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'updatedDate',
        'labelName': 'MANAGE_MERCHANT.FORM_LABELS.LAST_UPDATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.updatedDate ? new Date (this.queryParams.updatedDate) : ''
      }
    ];
    this.merchantListConfig = {
      rows: [],
      columns: [
        {
          headerTemplate: this.commonTmplHeader,
          name: 'Actions',
          headerClass: 'text-left',
          cellTemplate: this.actionTmpl,
          flexGrow: 1,
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
            name: 'MANAGE_MERCHANT.ADD_MERCHANT.COMPANY_INFO.MERCHANT_REPRESENTATIVE_NAME',
            sortable: true,
            draggable: false,
            flexGrow: 3,
            value: 'merchantRepresentativeName'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.STORE_NAME',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'storeName'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.emailTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.STORE_EMAIL',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'email'
        },{
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.urlTmplCell,
          name: 'MANAGE_MERCHANT.ADD_MERCHANT.COMPANY_INFO.URL',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'websiteUrl'
        },{
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.CURRENT_SALESPERSON',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'salesPersonName'
        },{
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.statusTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.STATUS',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'approvalStatus'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.dateTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.LAST_UPDATED_ON',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'updatedDate'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.dateTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.CREATED_ON',
          flexGrow: 4,
          sortable: true,
          draggable: false,
          value: 'createdDate'
        }
      ]
    };
   // this.loadMerchantList();
  }
  /**
   * sort functionality for user list
   */
  onSort($event) {
    if ($event !== '$event') {
      this.loader = true;
      this.merchantListConfig['rows'] = [];
      switch ($event.column.value) {
        case 'approvalStatus':
          this.sortColumn = 'approvalStatusKey';
          break;
        default:
          this.sortColumn = $event.column.value;
      }
      $event.newValue === 'asc' ? this.sortOrder = 'asc' : this.sortOrder = 'desc';
      this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
      this.loadMerchantList();
    }
  }

  /**
   * next set of data loaded if page changes
   */
  pageChange($event) {
    this.pageNumber = $event.page - 1;
    this.pageSize = $event.itemsPerPage;
    this.loadMerchantList();
  }

  /**
   * load merchant list details with pagination functionality
   */
  loadMerchantList() {
    this.allRowsSelected = this.showMassDeleteBtn = false;
    this.loader = true;
    let param = '';
    let paramRoute = '';
    if (this.searchTxt) {
      paramRoute = param = this.searchTxt + '&';
    }
    param += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}`;

    paramRoute += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;
    this.navigateByUrl('/merchant/view?' + paramRoute);

    try {
      this._merchantService
        .getMerchantList(param)
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
               'roleIsDeleted': '',
               'salesPersonName': '',
               'websiteUrl':''
            }
          ];
          if (response['data'].length === 0) {
            response['data'] = blankData;
          }
          this.merchantListConfig['totalRecords'] = response['totalItems'];
          this.merchantListConfig['rows'] = response['data'];
          this.loader = false;
        },(error) => {
          this.setError(error.message);
          this.loader = false;
        });
    } catch (error) {
    }
  }

  /**
   * search box functionality
   */
  onSearch(searchObj: Object) {
    this.searchTxt = UtilHelper.toQueryParams(searchObj);
    this.loadMerchantList();
  }

  /**
   * check box select functionality
   */
  onCheckBoxSelect(row) {
    row['selected'] = !row['selected'];
    const selectedItems = _.filter(this.merchantListConfig['rows'], { 'selected': true });
    this.showMassDeleteBtn = selectedItems.length >= 1 ? true : false;
    this.allRowsSelected = false;
    this.selectedIdsArray();
  }

  /**
   * mass merchant delete button functionality
   */
  onMassDeleteMerchant() {
    const selectedItems = _.filter(this.merchantListConfig['rows'], { 'selected': true });
    const selectedMerchantArr = _.map(selectedItems, 'rid');
    this.showConfirmationMassDeleteModal(selectedMerchantArr);
  }

  /**
 * delete single merchant functionality
 */
  onDeleteMerchant(item) {
    this.showConfirmationDeleteModal(item);
  }

  /**
   * confirm modal delete
  **/
  showConfirmationDeleteModal(item): void {
    // console.log(item);
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
        this.deleteMerchant(item['rid']);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete merchant by id
   */
  deleteMerchant(id): void {
    // console.log(id);
    try {
      this._merchantService
        .deleteMerchant(id)
        .subscribe((response) => {
          this.setSuccess('MERCHANT_DELETED_SUCCESSFULLY');
          this.loadMerchantList();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {

    }
  }

  /**
   * confirm modal mass delete
   **/
  showConfirmationMassDeleteModal(merchantIds: Array<string>): void {
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
        // delete merchant
        this.deleteMassMerchant(merchantIds);
      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete mass merchant
   */
  deleteMassMerchant(merchantIds): void {
    try {
      this._merchantService
        .deleteMassMerchant(merchantIds)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadMerchantList();
        },(error) => {
          this.setError(error.message);
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
    _.map(this.merchantListConfig['rows'], (obj) => obj['selected'] = this.allRowsSelected);
    this.selectedIdsArray();
  }

  /**
   * Add Merchant functionality
   */
  onAddMerchant() {
    const url = '/merchant/add';
    this._router.navigate([url]);
  }

  /**
   * edit Merchant functionality
   */
  onEditMerchant(item) {
    const url = '/merchant/edit/' + item['rid'];
    this._router.navigate([url]);
  }
  /**
   * view Merchant functionality
   */
  public onviewMerchant(item) {
    // console.log(item);
    const url = '/merchant/merchantDetail/' + item['rid'] + '/' + item['approvalStatus'];
    this._router.navigate([url]);
  }

  /**
   * Get status name
   */
  public getStatusName(id) {
    let label = '';
    _.each(this.merchantListStatusValue, function (v, k) {
      if (v['value'] === id) {
        label = v['label'];
        return label;
      }
    });
    return label;
  }

  /**
   * Get status name
   */
  public isEditAllowed(status) {
    const isAllowed = (_.indexOf(this.allowedStatusTypes, status) != -1);
    return (isAllowed) ? true : false;
  }

  /**
   * Get selected record Id's
   */
  public selectedIdsArray() {
    const selectedItems = _.filter(this.merchantListConfig['rows'], { 'selected': true });
    this.selectedRids = _.map(selectedItems, 'rid');
  }

  onMassAssign(){
    const selectedItems = _.filter(this.merchantListConfig['rows'], { 'selected': true });
    let data=_.map(selectedItems, 'userId');
    this.assignSaleperson(data)
  }
  assignSaleperson(data){

    const modal = this
    .bsModalService
    .show(AssignsalepersonComponent, { class: '' });
    (<AssignsalepersonComponent>modal.content).showConfirmationModal('CHANGE SALES PERSON',data);
     (<AssignsalepersonComponent>modal.content).onClose.subscribe(result => {
      if (result['status'] === 'SAVE') {
        this.loadMerchantList();
      }
    });

  }

  /**
   * Add Http
   * @param url
   * @returns {string}
   */
  addHttpURL(url){
    return UtilHelper.addHttp(url);
  }
}
