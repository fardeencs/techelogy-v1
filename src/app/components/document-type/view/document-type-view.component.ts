import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { UtilHelper } from '../../../helper/util.helper';
import * as Constant from '../../../modules/constants';
import { TranslateService } from '@ngx-translate/core';
import { DocumentTypeService } from '../../../services/document-type.service';
import { Location } from '@angular/common';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import {DATA_GRID} from "../../../modules/constants";

@Component({
  templateUrl: './document-type-view.component.html',
  styleUrls: ['./document-type-view.component.css']
})
export class DocumentTypeViewComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;

  public documentTypeListConfig: {};
  public loader = true;
  public totalRecords = 0;
  public sortColumn = '';
  public sortOrder = '';
  public showMassDeleteBtn = false;
  public searchTxt = '';
  public allRowsSelected = false;
  public isCollapsedSearch = true;
  public DOCUMENT_TYPE_EXPORT_API = Constant.REST_API.DOCUMENT_TYPE.EXPORT_SELECTED;
  public DOCUMENT_TYPE_EXPORT_ACTION = 'USERS_VIEW';
  public permissions: Array<string> = [];
  public selectedRids: Array<String> = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];
  public documentTypeSearchTableOption: Array<Object>;
  public pageInfo:any;

  constructor(protected _router: Router,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _documentTypeService: DocumentTypeService,
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

    this.documentTypeSearchTableOption = [
      {
        type: 'text',
        'fieldName': 'documentTypeId',
        'labelName': 'DOCUMENT_TYPE.FORM_LABLES.DOCTYPE_ID',
        fieldValue: '',
        defaultValue: this.queryParams.documentTypeId ? this.queryParams.documentTypeId : ''
      }, {
        type: 'text',
        'fieldName': 'documentTypeName',
        'labelName': 'DOCUMENT_TYPE.FORM_LABLES.NAME',
        fieldValue: '',
        defaultValue: this.queryParams.documentTypeName ? this.queryParams.documentTypeName : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'status',
        'labelName': 'MERCHANT_SCHEME.FORM_LABELS.STATUS',
        fieldValue: '',
        options: Constant.STATUS_ARRAY,
        defaultValue: this.queryParams.status ? this.queryParams.status : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'createdDate',
        'labelName': 'COMMON.LABELS.CREATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.createdDate ? new Date(this.queryParams.createdDate) : ''
      }, {
        type: 'datepicker',
        format: 'YYYY-MM-DD',
        'fieldName': 'updatedDate',
        'labelName': 'COMMON.LABELS.LAST_UPDATED_ON',
        fieldValue: '',
        defaultValue: this.queryParams.updatedDate ? new Date(this.queryParams.updatedDate) : ''
      },
    ];

    this.documentTypeListConfig = {
      rows: [],
      columns: [
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
          width: 60,
          maxWidth : 80,
          resizeable: false,
          draggable: false,
          sortable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT,
          cellClass: 'fixed-column'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'DOCUMENT_TYPE.FORM_LABLES.DOCTYPE_ID',
          flexGrow: 3,
          width: 70,
          maxWidth : 100,
          value: 'documentTypeId',
          cellClass: 'fixed-column',
          sortable: true,
          draggable: false,
          resizeable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'DOCUMENT_TYPE.FORM_LABLES.NAME',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'documentTypeName'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.statusTmplCell,
          name: 'COMMON.LABELS.STATUS',
          sortable: true,
          draggable: false,
          flexGrow: 4,
          value: 'statusLabel'
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
   * sort functionality for document type list
   */
  onSort($event) {
    if ($event !== '$event') {
      this.loader = true;
      this.documentTypeListConfig['rows'] = [];
      switch ($event.column.value) {
        case 'statusLabel':
          this.sortColumn = 'status';
          break;
        default:
          this.sortColumn = $event.column.value;
      }
      $event.newValue === 'asc' ? this.sortOrder = 'asc' : this.sortOrder = 'desc';
      this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
      this.loadDocumentTypeList();
    }
  }

  /**
 * next set of data loaded if page changes
 */
  pageChange($event) {
    this.pageNumber = $event.page - 1;
    this.pageSize = $event.itemsPerPage;
    this.loadDocumentTypeList();
  }

/**
 * load document type list details with pagination functionality
 */
  loadDocumentTypeList() {
    this.allRowsSelected = this.showMassDeleteBtn = false;
    this.loader = true;
    let param = '';
    let paramRoute = '';
    if (this.searchTxt) {
      paramRoute = param = this.searchTxt + '&';
    }
    param += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}`;

    paramRoute += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;

    this.navigateByUrl('/document-type/view?' + paramRoute);

    try {
      this
        ._documentTypeService
        .list(param)
        .subscribe((response) => {
          _.each(response['data'], function (v, k) {
              v['selected'] = false;
            });
          const blankData = [
            {
              'rid': '',
              'documentTypeId': '',
              'documentName': '',
              'status': '',
              'createdDate': '',
              'updatedDate': ''
           }
          ];
          if (response['data'].length === 0) {
            response['data'] = blankData;
          }
          this.documentTypeListConfig['totalRecords'] = response['totalItems'];
          this.documentTypeListConfig['rows'] = response['data'];
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
    this.loadDocumentTypeList();
  }

  /**
  * check box select functionality
  */
  onCheckBoxSelect(row) {
    row['selected'] = !row['selected'];
    const selectedItems = _.filter(this.documentTypeListConfig['rows'], { 'selected': true });
    this.showMassDeleteBtn = selectedItems.length >= 1
      ? true
      : false;
    this.allRowsSelected = false;
    this.selectedIdsArray();
  }

  /**
  * mass document type delete button functionality
  */
  onMassdeleteDocumentTypes() {
    const selectedItems = _.filter(this.documentTypeListConfig['rows'], { 'selected': true });
    const selectedDocumentTypeArr = _.map(selectedItems, 'rid');
    this.showConfirmationMassDeleteModal(selectedDocumentTypeArr);
  }

  /**
  * edit document type functionality
  */
  onEditDocumentType(item) {
    const url = '/document-type/edit/' + item['rid'];
    this
      ._router
      .navigate([url]);
  }

  /**
  * view document type functionality
  */
  public onViewDocumentType(item) {
    const url = '/document-type/docTypeDetail/' + item['rid'];
    this
      ._router
      .navigate([url]);
  }

  /**
  * add document type functionality
  */
  onAddDocumentType() {
    const url = '/document-type/add';
    this
      ._router
      .navigate([url]);
  }

  /**
  * delete single document type functionality
  */
  onDeleteDocumentType(item) {
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
            this.deleteDocumentType(item['rid']);

          } else if (result === false) {
            // when pressed No
          } else {
            // When closing the modal without no or yes
          }
        });
  }

  /** * delete document type by id */
  deleteDocumentType(id): void {
    try {
      this
        ._documentTypeService
        .deleteDocumentType(id)
        .subscribe((response) => {
          this.setSuccess('DOCUMENT_DELETED_SUCCESSFULLY');
          this.loadDocumentTypeList();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /** * confirm modal mass delete **/
  showConfirmationMassDeleteModal(documentTypeIds: Array<string>): void {
    const modal = this
      .bsModalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.DELETE', 'COMMON.MODALS.ARE_U_SURE_TO_DELETE',       'COMMON.BUTTONS.YES',
        'COMMON.BUTTONS.NO'); (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            // when pressed Yes delete document type
            this.deleteMassDocumentType(documentTypeIds);
          } else if (result === false) {
            // when pressed No
          } else {
            // When closing the modal without no or yes
          }
        });
  }

  /** * delete mass document type */
  deleteMassDocumentType(documentTypeIds): void {
    try {
      this
        ._documentTypeService
        .deleteMassDocumentType(documentTypeIds)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadDocumentTypeList();
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
    _.map(this.documentTypeListConfig['rows'], (obj) => obj['selected'] = this.allRowsSelected);
    this.selectedIdsArray();
  }

  public selectedIdsArray() {
   const selectedItems = _.filter(this.documentTypeListConfig['rows'], { 'selected': true });
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
