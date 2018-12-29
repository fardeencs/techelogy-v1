import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as _ from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { UtilHelper } from '../../../helper/util.helper';
import * as Constant from '../../../modules/constants';
import { COMMON_REQUIRED_ARRAY, } from '../../../modules';
import { Location } from '@angular/common';
import { MerchantService } from '../../../services/merchant.service';
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { filter, map, mergeMap } from 'rxjs/operators';
import { AttributeService } from '../../../services/attribute.service';

@Component({ templateUrl: './list.component.html', styleUrls: ['./list.component.scss'] })

export class ListComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('requiredTmplCell') requiredTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;

  modalRef: BsModalRef;
  public loader = true;
  public themeListConfig = {};
  public totalRecords = 0;
  public sortColumn = '';
  public sortOrder = '';
  public showMassDeleteBtn = false;
  public searchTxt = '';
  public allRowsSelected = false;
  public isCollapsedSearch = true;
  public EXPORT_API = Constant.REST_API.ATTRIBUTE.EXPORT_SELECTED;
  public EXPORT_ACTION = 'USERS_VIEW';
  public permissions: Array<string> = [];
  public selectedRids: Array<String> = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];
  public themeSearchTableOption: Array<Object>;
  public pageInfo: any;
  public REQUIRED_OPTION: any;
  constructor(
    protected _router: Router,
    public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private _attributeService: AttributeService,
    private translate: TranslateService,
    private titleService: Title,
    protected _location: Location) {
    super(_router, _location);
    this.REQUIRED_OPTION = COMMON_REQUIRED_ARRAY;
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

    this.themeSearchTableOption = [
      {
        type: 'text',
        'fieldName': 'entityId',
        'labelName': 'COMMON.LABELS.ID',
        fieldValue: '',
        defaultValue: this.queryParams.entityId ? this.queryParams.entityId : ''
      }, {
        type: 'text',
        'fieldName': 'name',
        'labelName': 'ATTRIBUTE.FORM_LABELS.NAME',
        fieldValue: '',
        defaultValue: this.queryParams.categoryName ? this.queryParams.categoryName : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'isDefault',
        'labelName': 'ATTRIBUTE.FORM_LABELS.DEFAULT',
        fieldValue: '',
        options: Constant.COMMON_REQUIRED_ARRAY,
        defaultValue: this.queryParams.isDefault ? this.queryParams.isDefault : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'isActive',
        'labelName': 'COMMON.LABELS.STATUS',
        fieldValue: '',
        options: Constant.STATUS_ARRAY,
        defaultValue: this.queryParams.isActive ? this.queryParams.isActive : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'createdDate',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.CREATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.createdDate ? new Date(this.queryParams.createdDate) : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'updatedDate',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.LAST_UPDATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.updatedDate ? new Date(this.queryParams.updatedDate) : ''
      },
    ];

    this.themeListConfig = {
      rows: [],
      columns: [
        {
          headerTemplate: this.commonTmplHeader,
          name: 'Actions',
          headerClass: 'text-center',
          cellTemplate: this.actionTmpl,
          flexGrow: 1,
          value: '',
          width: 120,
          sortable: false,
          draggable: false,
          frozenLeft: false,
          maxWidth: 120,
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
          maxWidth: 80,
          resizeable: false,
          draggable: false,
          sortable: false,
          frozenLeft: false,
          cellClass: 'fixed-column'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'COMMON.LABELS.ID',
          flexGrow: 3,
          width: 70,
          value: 'entityId',
          cellClass: 'fixed-column',
          sortable: true,
          draggable: false,
          resizeable: false,
          frozenLeft: false
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'ATTRIBUTE.FORM_LABELS.NAME',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'name'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.requiredTmplCell,
          name: 'ATTRIBUTE.FORM_LABELS.IS_REQUIRED',
          sortable: true,
          flexGrow: 1,
          value: 'isRequired'
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
          name: 'COMMON.LABELS.CREATED_BY',
          sortable: true,
          draggable: false,
          flexGrow: 4,
          value: 'createdByName'
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
      this.themeListConfig['rows'] = [];
      switch ($event.column.value) {
        case 'isActiveKey':
          this.sortColumn = 'isActive';
          break;
        case 'isRequired':
          this.sortColumn = 'isRequired';
          break;
        default:
          this.sortColumn = $event.column.value;
      }
      $event.newValue === 'asc' ? this.sortOrder = 'asc' : this.sortOrder = 'desc';
      this.sortArray = [{ value: this.sortColumn, dir: this.sortOrder }];
      this.loadAttributesList();
    }
  }

  /**
   * load category list details with pagination functionality
   */
  loadAttributesList() {
    this.allRowsSelected = this.showMassDeleteBtn = false;
    this.loader = true;
    let param = '';
    let paramRoute = '';
    if (this.searchTxt) {
      paramRoute = param = this.searchTxt + '&';
    }
    param += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}`;

    paramRoute += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;

    this.navigateByUrl('/attributes/list?' + paramRoute);

    try {
      this
        ._attributeService
        .list(param)
        .subscribe((response) => {
          console.log('res',response);
          _
            .each(response['data'], function (v, k) {
              v['selected'] = false;
            });
          const blankData = [
            {
              'rid': '',
              'name': '',
              'entityId': '',
              'isRequired': '',
              'status': '',
              'updatedDate': '',
              'createdDate': '',
              'createdBy': ''
            }
          ];
          if (response['data'].length === 0) {
            response['data'] = blankData;
          }
          this.themeListConfig['totalRecords'] = response['totalItems'];
          this.themeListConfig['rows'] = response['data'];
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
 * search box functionality
 */
  onSearch(searchObj: Object) {
    this.searchTxt = UtilHelper.toQueryParams(searchObj);
    this.loadAttributesList();
  }

  /**
      * check box select functionality
      */
  onCheckBoxSelect(row) {
    row['selected'] = !row['selected'];
    const selectedItems = _.filter(this.themeListConfig['rows'], { 'selected': true });
    this.showMassDeleteBtn = selectedItems.length >= 1
      ? true
      : false;
    this.selectedIdsArray();
  }

  /**
   * mass delete functionality
   */
  onMassDelete() {
    const selectedItems = _.filter(this.themeListConfig['rows'], { 'selected': true });
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
    this.loadAttributesList();
  }

  onAdd() {
    this.navigateByUrl('/attributes/add');
  }

  onEdit(item) {
    this.navigateByUrl('/attributes/edit/' + item.rid);
  }

  onView(item) {
    this.navigateByUrl('/attributes/view/' + item.rid);
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
    _.map(this.themeListConfig['rows'], (obj) => obj.selected = this.allRowsSelected);
    this.selectedIdsArray();
  }

  /**
 * delete item by id
 */
  delete(id): void {
    try {
      let rids: Array<string> = [id];
      this._attributeService
        .massDelete(rids)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadAttributesList();
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
      this._attributeService
        .massDelete(ids)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadAttributesList();
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  public selectedIdsArray() {
    const selectedItems = _.filter(this.themeListConfig['rows'], { 'selected': true });
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
