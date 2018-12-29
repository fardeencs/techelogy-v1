import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { ListModel } from '../../../models/user/list.model';
import * as Constant from '../../../modules/constants';
import * as _ from 'lodash';
import { UtilHelper } from '../../../helper/util.helper';
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { filter, map, mergeMap } from 'rxjs/operators';
import { BrandService } from '../../../services/brands.service';
import '../../../helper/custom-extension';
import { Brands } from '../../../models/brand/brands.model';
import { DefaultImageDirective } from '../../../directives/default-image.directive';



@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;
  @ViewChild('iconTmplCell') iconTmplCell: TemplateRef<any>;
  @ViewChild('imageTmplCell') imageTmplCell: TemplateRef<any>;

  modalRef: BsModalRef;
  public loader = true;
  public listConfig: ListModel;
  public isCollapsed = true;
  public searchTableOptions: Array<Object>;
  public allRowsSelected = false;
  public sortColumn = '';
  public sortOrder = '';
  public showMassDeleteBtn = false;
  public searchTxt = '';
  public isCollapsedSearch = true;
  public EXPORT_API = Constant.REST_API.BRANDS.EXPORT_SELECTED;
  public EXPORT_ACTION = Constant.MODULE_ACTIONS.BRANDS.VIEW;
  public permissions: Array<string> = [];
  public selectedRids: Array<String> = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];
  lookups: any = {};
  public pageInfo: any;


  constructor(
    protected _router: Router,
    public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    protected _location: Location,
    private _brandService: BrandService,
    private titleService: Title,
    private translate: TranslateService) {
    super(_router, _location);
    this.listConfig = new ListModel();
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        , map(() => this._activatedRoute)
        , map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        , filter(route => route.outlet === 'primary')
        , mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title) => {
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


    this.searchTableOptions = [
      {
        type: 'text',
        'fieldName': 'entityId',
        'labelName': 'COMMON.LABELS.ID',
        fieldValue: '',
        defaultValue: this.queryParams.entityId ? this.queryParams.entityId : ''
      }, {
        type: 'text',
        'fieldName': 'brandName',
        'labelName': 'BRANDS.FORM_LABELS.NAME',
        fieldValue: '',
        defaultValue: this.queryParams.brandName ? this.queryParams.brandName : ''
      }
      , {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'startDate',
        'labelName': 'BRANDS.FORM_LABELS.START_DATE',
        fieldValue: '',
        defaultValue: this.queryParams.startDate ? this.queryParams.startDate : ''
      },
      {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'endDate',
        'labelName': 'BRANDS.FORM_LABELS.END_DATE',
        fieldValue: '',
        defaultValue: this.queryParams.endDate ? this.queryParams.endDate : ''
      },
      {
        type: 'keyValueDropdown',
        'fieldName': 'location',
        'labelName': 'BRANDS.FORM_LABELS.LOCATION',
        fieldValue: '',
        options: Constant.LOCATION_OPTIONS,
        defaultValue: this.queryParams.location ? this.queryParams.location : ''
      },
      {
        type: 'keyValueDropdown',
        'fieldName': 'isActive',
        'labelName': 'COMMON.LABELS.STATUS',
        fieldValue: '',
        options: Constant.STATUS_ARRAY,
        defaultValue: this.queryParams.isActive ? this.queryParams.isActive : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'updatedDate',
        'labelName': 'APPROVAL.FORM_LABELS.LAST_UPDATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.updatedDate ? new Date(this.queryParams.updatedDate) : ''
      }
      , {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'createdDate',
        'labelName': 'APPROVAL.FORM_LABELS.CREATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.createdDate ? new Date(this.queryParams.createdDate) : ''
      }
    ];

    this.listConfig.columns = [
      {
        headerTemplate: this.commonTmplHeader,
        name: 'Actions',
        headerClass: 'text-center',
        cellTemplate: this.actionTmpl,
        flexGrow: 1,
        sortable: false,
        value: '',
        frozenLeft: true,
        resizeable: false,
        cellClass: 'action-btn'
      },
      {
        headerTemplate: this.checkboxTmplHeader,
        cellTemplate: this.checkboxTmpl,
        name: 'SELECT',
        headerClass: 'text-center',
        draggable: false,
        flexGrow: 1,
        width: 80,
        sortable: false,
        frozenLeft: true,
        cellClass: 'fixed-column',
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'COMMON.LABELS.ID',
        sortable: true,
        flexGrow: 1,
        width: 70,
        value: 'entityId',
        frozenLeft: true,
        cellClass: 'fixed-column',
      }, {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'BRANDS.FORM_LABELS.NAME',
        sortable: true,
        flexGrow: 1,
        value: 'brandName'
      },
      {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.iconTmplCell,
        name: 'BRANDS.FORM_LABELS.ICON',
        sortable: true,
        flexGrow: 1,
        value: 'icon'
      },
      {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.imageTmplCell,
        name: 'BRANDS.FORM_LABELS.IMAGE',
        sortable: true,
        flexGrow: 1,
        value: 'image'
      },
      {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'BRANDS.FORM_LABELS.START_DATE',
        sortable: true,
        flexGrow: 1,
        value: 'startDate'
      },
      {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'BRANDS.FORM_LABELS.END_DATE',
        sortable: true,
        flexGrow: 1,
        value: 'endDate'
      },
      {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.commonTmplCell,
        name: 'BRANDS.FORM_LABELS.LOCATION',
        sortable: true,
        flexGrow: 1,
        value: 'location'
      }
      , {
        headerTemplate: this.commonTmplHeader,
        cellTemplate: this.statusTmplCell,
        name: 'COMMON.LABELS.STATUS',
        sortable: true,
        flexGrow: 1,
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
    ];
  }

  /**
   * load role list details with pagination functionality
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

    this.navigateByUrl('/brand/view?' + paramRoute);

    try {
      this
        ._brandService
        .list(param)
        .subscribe((response) => {
          //src\assets\images\broken-img\broken-image.png
          response.data = _.map(response.data, item => {
            //Brands.convertArrayToJoinText(item);
            item.location = Brands.getLocationText(item.location.toString());
            return item;
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
          this.listConfig.rows = response.data;
          this.listConfig.totalRecords = response.totalItems;
          this.loader = false;
        }, (error) => {
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
      this.listConfig.rows = [];
      this.sortColumn = $event.column.value;
      $event.newValue === 'asc'
        ? this.sortOrder = 'asc'
        : this.sortOrder = 'desc';
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
    const selectedItems = _.filter(this.listConfig.rows, { 'selected': true });
    this.showMassDeleteBtn = selectedItems.length >= 1
      ? true
      : false;
    this.selectedIdsArray();
  }

  /**
   * mass delete functionality
   */
  onMassDelete() {
    const selectedItems = _.filter(this.listConfig.rows, { 'selected': true });
    const selectedUserArr = _.map(selectedItems, 'rid');
    this.showConfirmationMassDeleteModal(selectedUserArr);
  }

  /**
  * confirm modal mass delete
  **/
  showConfirmationMassDeleteModal(ids: Array<string>): void {
    const modal = this
      .modalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.DELETE',
        'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
        'COMMON.BUTTONS.YES',
        'COMMON.BUTTONS.NO'
      ); (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          this.deleteMass(ids);
        } else if (result === false) {
          // when pressed No
        } else {
          // When closing the modal without no or yes
        }
      });
  }

  // confirm modal delete
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
      ); (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes this.deleteUser(item['rid']);
          this.delete(item.rid);
        } else if (result === false) {
          // when pressed No
        } else {
          // When closing the modal without no or yes
        }
      });
  }

  // next set of data loaded if page changes

  pageChange($event) {
    this.pageNumber = $event.page - 1;
    this.pageSize = $event.itemsPerPage;
    this.loadList();
  }

  onAdd() {
    this.navigateByUrl('/brand/add');
  }

  onEdit(item) {
    this.navigateByUrl('/brand/edit/' + item.rid);
  }

  onView(item) {
    this.navigateByUrl('/brand/view/' + item.rid);
  }

  // delete single role functionality
  onDelete(item) {
    this.showConfirmationDeleteModal(item);
  }

  // delete modal ok button event
  confirmDelete(): void {
    this
      .modalRef
      .hide();
  }

  // delete modal close button event
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

  // Select All functionality
  onSelectAllCheckbox($event) {
    this.allRowsSelected = $event.target.checked;
    this.showMassDeleteBtn = $event.target.checked;
    _.map(this.listConfig.rows, (obj) => obj.selected = this.allRowsSelected);
    this.selectedIdsArray();
  }

  /**
 * delete item by id
 */
  delete(id): void {
    try {
      this._brandService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('BRAND_DELETED_SUCCESSFULLY');
          this.loadList();
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
 * delete mass
 */
  deleteMass(ids): void {
    try {
      this._brandService
        .massDelete(ids)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadList();
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  public selectedIdsArray() {
    const selectedItems = _.filter(this.listConfig.rows, { 'selected': true });
    this.selectedRids = _.map(selectedItems, 'rid');
  }

  /**
   * Get status name
   */
  public getStatusName(status: string) {
    const arr = _.filter(Constant.STATUS_ARRAY, { label: status });
    return arr.length > 0 ? arr[0]['label'] : '';
  }
}
