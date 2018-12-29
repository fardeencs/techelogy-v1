import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { UtilHelper } from '../../../helper/util.helper';
import * as Constant from '../../../modules/constants';
import { TranslateService } from '@ngx-translate/core';
import { CertificateService } from '../../../services/certificate.service';
import { Location } from '@angular/common';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import {DATA_GRID} from "../../../modules/constants";

@Component({
  templateUrl: './manage-certificate-view.component.html',
  styleUrls: ['./manage-certificate-view.component.css']
})
export class ManageCertificateViewComponent extends BaseComponent implements OnInit {

  @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
  @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
  @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
  @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
  @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
  @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;

  public certificateListConfig: {};
  public loader = true;
  public totalRecords = 0;
  public sortColumn = '';
  public sortOrder = '';
  public showMassDeleteBtn = false;
  public searchTxt = '';
  public allRowsSelected = false;
  public isCollapsedSearch = true;
  public CERTIFICATE_EXPORT_API = Constant.REST_API.CERTIFICATE.EXPORT_SELECTED;
  public CERTIFICATE_EXPORT_ACTION = 'USERS_VIEW';
  public permissions: Array<string> = [];
  public selectedRids: Array<String> = [];
  public pageNumber: number;
  public pageSize: number;
  public sortArray: Array<Object> = [];
  public pageInfo:any;

  public certificateSearchTableOption: Array<Object>;

  constructor(protected _router: Router,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    public _activatedRoute: ActivatedRoute,
    private _certificateService: CertificateService,
    private titleService: Title,
    protected _location: Location) {
    super(_router, _location);

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

    this.loadCertificateList();
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

    this.certificateSearchTableOption = [
      {
        type: 'text',
        'fieldName': 'certificateTypeId',
        'labelName': 'MANAGE_CERTIFICATE.FORM_LABLES.CERTIFICATE_ID',
        fieldValue: '',
        defaultValue: this.queryParams.certificateTypeId ? this.queryParams.certificateTypeId : ''
      }, {
        type: 'text',
        'fieldName': 'certificateTypeName',
        'labelName': 'MANAGE_CERTIFICATE.FORM_LABLES.CERTIFICATE_NAME',
        fieldValue: '',
        defaultValue: this.queryParams.certificateTypeName ? this.queryParams.certificateTypeName : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'required',
        'labelName': 'MANAGE_CERTIFICATE.FORM_LABLES.REQUIRED',
        fieldValue: '',
        options: Constant.COMMON_REQUIRED_ARRAY,
        defaultValue: this.queryParams.required ? this.queryParams.required : ''
      }, {
        type: 'keyValueDropdown',
        'fieldName': 'status',
        'labelName': 'COMMON.LABELS.STATUS',
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

    this.certificateListConfig = {
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
          name: 'MANAGE_CERTIFICATE.FORM_LABLES.CERTIFICATE_ID',
          flexGrow: 3,
          width: 70,
          maxWidth : 100,
          value: 'certificateTypeId',
          cellClass: 'fixed-column',
          sortable: true,
          draggable: false,
          resizeable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'MANAGE_CERTIFICATE.FORM_LABLES.CERTIFICATE_NAME',
          sortable: true,
          draggable: false,
          flexGrow: 3,
          value: 'certificateTypeName'
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
          name: 'MANAGE_CERTIFICATE.FORM_LABLES.REQUIRED',
          sortable: true,
          draggable: false,
          flexGrow: 4,
          value: 'requiredLabel'
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
   * sort functionality for certificate list
   */
  onSort($event) {
    if ($event !== '$event') {
      this.loader = true;
      this.certificateListConfig['rows'] = [];
      switch ($event.column.value) {
        case 'statusLabel':
          this.sortColumn = 'status';
          break;
        case 'requiredLabel':
          this.sortColumn = 'required';
          break;
        default:
          this.sortColumn = $event.column.value;
      }
      $event.newValue === 'asc' ? this.sortOrder = 'asc' : this.sortOrder = 'desc';
      this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
      this.loadCertificateList();
    }
  }

  /**
 * next set of data loaded if page changes
 */
  pageChange($event) {
    this.pageNumber = $event.page - 1;
    this.pageSize = $event.itemsPerPage;
    this.loadCertificateList();
  }

  /**
 * load certificate list details with pagination functionality
 */
  loadCertificateList() {
    this.allRowsSelected = this.showMassDeleteBtn = false;
    this.loader = true;
    let param = '';
    let paramRoute = '';
    if (this.searchTxt) {
      paramRoute = param = this.searchTxt + '&';
    }
    param += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}`;

    paramRoute += `sortKey=${this.sortColumn}&sortValue=${this.sortOrder}&offset=${(this.pageSize * this.pageNumber)}&limit=${this.pageSize}&pageNumber=${this.pageNumber}&pageSize=${this.pageSize}`;

    this.navigateByUrl('/certificate/view?' + paramRoute);

    try {
      this
        ._certificateService
        .list(param)
        .subscribe((response) => {
          _.each(response['data'], function (v, k) {
            v['selected'] = false;
          });
          const blankData = [
            {
              'rid': '',
              'certificateTypeId': '',
              'certificateName': '',
              'status': '',
              'isRequired': '',
              'createdDate': '',
              'updatedDate': ''
            }
          ];
          if (response['data'].length === 0) {
            response['data'] = blankData;
          }
          this.certificateListConfig['totalRecords'] = response['totalItems'];
          this.certificateListConfig['rows'] = response['data'];
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
    this.loadCertificateList();
  }

  /**
  * check box select functionality
  */
  onCheckBoxSelect(row) {
    row['selected'] = !row['selected'];
    const selectedItems = _.filter(this.certificateListConfig['rows'], { 'selected': true });
    this.showMassDeleteBtn = selectedItems.length >= 1
      ? true
      : false;
    this.allRowsSelected = false;
    this.selectedIdsArray();
  }

  /**
  * mass certificate delete button functionality
  */
  onMassdeleteCertificates() {
    const selectedItems = _.filter(this.certificateListConfig['rows'], { 'selected': true });
    const selectedCertificateArr = _.map(selectedItems, 'rid');
    this.showConfirmationMassDeleteModal(selectedCertificateArr);
  }

  /**
  * edit certificate functionality
  */
  onEditCertificate(item) {
    const url = '/certificate/edit/' + item['rid'];
    this
      ._router
      .navigate([url]);
  }

  /**
  * view certificate functionality
  */
  public onViewCertificate(item) {
    const url = '/certificate/certificateDetail/' + item['rid'];
    this
      ._router
      .navigate([url]);
  }

  /**
  * add certificate functionality
  */
  onAddCertificate() {
    const url = '/certificate/add';
    this
      ._router
      .navigate([url]);
  }

  /**
  * delete single certificate functionality
  */
  onDeleteCertificate(item) {
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
            this.deleteCertificate(item['rid']);

          } else if (result === false) {
            // when pressed No
          } else {
            // When closing the modal without no or yes
          }
        });
  }

  /** * delete certificate by id */
  deleteCertificate(id): void {
    try {
      this
        ._certificateService
        .deleteCertificate(id)
        .subscribe((response) => {
          this.setSuccess('CERTIFICATE_DELETED_SUCCESSFULLY');
          this.loadCertificateList();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /** * confirm modal mass delete **/
  showConfirmationMassDeleteModal(certificateIds: Array<string>): void {
    const modal = this
      .bsModalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.DELETE', 'COMMON.MODALS.ARE_U_SURE_TO_DELETE', 'COMMON.BUTTONS.YES',
        'COMMON.BUTTONS.NO'); (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            // when pressed Yes delete certificate
            this.deleteMassCertificate(certificateIds);
          } else if (result === false) {
            // when pressed No
          } else {
            // When closing the modal without no or yes
          }
        });
  }

  /** * delete mass certificate */
  deleteMassCertificate(certificateIds): void {
    try {
      this
        ._certificateService
        .deleteMassCertificate(certificateIds)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.loadCertificateList();
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
    _.map(this.certificateListConfig['rows'], (obj) => obj['selected'] = this.allRowsSelected);
    this.selectedIdsArray();
  }

  public selectedIdsArray() {
   const selectedItems = _.filter(this.certificateListConfig['rows'], { 'selected': true });
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
