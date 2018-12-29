import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute,NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { ListModel } from '../../../models/user/list.model';
import * as Constant from '../../../modules/constants';
import * as _ from 'lodash';
import { UtilHelper } from '../../../helper/util.helper';
import { TranslateService } from '@ngx-translate/core';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import { TrainingVideosService } from '../../../services/training-videos.service';


@Component({ templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class ListComponent extends BaseComponent implements OnInit {

    @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
    @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
    @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
    @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
    @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
    @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
    @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
    @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;

    modalRef: BsModalRef;
    public loader = true;
    public trainingVideosListConfig: ListModel;
    public isCollapsed = true;
    public trainingVideosSearchTableOptions: Array<Object>;
    public allRowsSelected = false;
    public sortColumn = '';
    public sortOrder = '';
    public showMassDeleteBtn = false;
    public searchTxt = '';
    public isCollapsedSearch = true;
    public TRAINING_VIDEOS_EXPORT_API = Constant.REST_API.TRAINING_VIDEOS.EXPORT_SELECTED;
    public TRAINING_VIDEOS_EXPORT_ACTION = Constant.MODULE_ACTIONS.TRAINING_VIDEOS.VIEW;
    public permissions: Array<string> = [];
    public selectedRids: Array<String> = [];
    public pageNumber: number;
    public pageSize: number;
    public sortArray: Array<Object> = [];
    public pageInfo;

    constructor(
      protected _router: Router,
      public _activatedRoute: ActivatedRoute,
      private modalService: BsModalService,
      protected _location: Location,
      private translate: TranslateService,
      private titleService: Title,
      private _trainingVideosService: TrainingVideosService) {
      super(_router, _location);
      this.trainingVideosListConfig = new ListModel();
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
        this.sortArray = [{value: this.sortColumn, dir: this.sortOrder}];
      }
      const filterValues = Object.values(_.omit(this.queryParams, Constant.QUERY_PARAMS_TO_OMIT_ARRAY));
      filterValues.forEach(val => {
        if (val) {
          this.isCollapsedSearch = false;
        }
      });

      this.trainingVideosSearchTableOptions = [
        {
          type: 'text',
          'fieldName': 'entityId',
          'labelName': 'COMMON.LABELS.ID',
          fieldValue: '',
          defaultValue: this.queryParams.entityId ? this.queryParams.entityId : ''
        }, {
          type: 'text',
          'fieldName': 'title',
          'labelName': 'TRAINING_VIDEO.FORM_LABELS.TITLE',
          fieldValue: '',
          defaultValue: this.queryParams.title ? this.queryParams.title : ''
        }, {
          type: 'text',
          'fieldName': 'topic',
          'labelName': 'TRAINING_VIDEO.FORM_LABELS.TOPIC',
          fieldValue: '',
          defaultValue: this.queryParams.topic ? this.queryParams.topic : ''
        }, {
          type: 'text',
          'fieldName': 'url',
          'labelName': 'TRAINING_VIDEO.FORM_LABELS.URL',
          fieldValue: '',
          defaultValue: this.queryParams.url ? this.queryParams.url : ''
        },{
          type: 'text',
          'fieldName': 'createdByName',
          'labelName': 'CUSTOMER.FORM_LABELS.CREATED_BY',
          fieldValue: '',
          defaultValue: this.queryParams.createdByName ? this.queryParams.createdByName : ''
        }, {type: 'keyValueDropdown',
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
        }, {
          type: 'datepicker',
          format: 'YYYY-MM-DD',
          'fieldName': 'createdDate',
          'labelName': 'APPROVAL.FORM_LABELS.CREATED_ON',
          fieldValue: '',
          defaultValue: this.queryParams.createdDate ? new Date(this.queryParams.createdDate) : ''
        }
      ];

      this.trainingVideosListConfig.columns = [
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
          maxWidth : 120,
          resizeable: false,
          cellClass: 'action-btn'
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
          //frozenLeft: true,
          cellClass: 'fixed-column'
        }, {
           headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'COMMON.LABELS.ID',
          flexGrow: 3,
          width: 70,
          maxWidth : 100,
          value: 'entityId',
          cellClass: 'fixed-column',
          sortable: true,
          draggable: false,
          resizeable: false,
          //frozenLeft: true,
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'TRAINING_VIDEO.FORM_LABELS.TITLE',
          sortable: true,
          flexGrow: 1,
          value: 'title'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'TRAINING_VIDEO.FORM_LABELS.TOPIC',
          sortable: true,
          flexGrow: 1,
          value: 'topic'
        },{
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'TRAINING_VIDEO.FORM_LABELS.URL',
          sortable: true,
          flexGrow: 1,
          value: 'url'
        },{
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'CUSTOMER.FORM_LABELS.CREATED_BY',
          sortable: true,
          flexGrow: 1,
          value: 'createdByName'
        },{
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

      this.navigateByUrl('/trainingvideo/view?' + paramRoute);

      try {
        this
          ._trainingVideosService
          .list(param)
          .subscribe((response) => {
            _
            .each(response['data'], function (v) {
              v['selected'] = false;
            });
            const blankData = [
               {
                  'rid': '',
                  'title': '',
                  'topic': '',
                  'url': '',
                  'createdBy': '',
                  'createdDate': '',
                  'updatedDate': '',
               }
            ];
            if (response['data'].length === 0) {
              if(this.pageNumber == 0){
                response['data'] = blankData;
              }else if(this.pageNumber > 0){
                this.pageNumber = this.pageNumber - 1;
                this.loadList();
              }
            }
            this.trainingVideosListConfig.rows = response.data;
            this.trainingVideosListConfig.totalRecords = response.totalItems;
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
        this.trainingVideosListConfig.rows = [];
        this.sortColumn = $event.column.value;
        $event.newValue === 'asc'
          ? this.sortOrder = 'asc'
          : this.sortOrder = 'desc';
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
      const selectedItems = _.filter(this.trainingVideosListConfig.rows, { 'selected': true });
      this.showMassDeleteBtn = selectedItems.length >= 1
        ? true
        : false;
      this.selectedIdsArray();
    }

    /**
     * mass delete functionality
     */
    onMassDelete() {
      const selectedItems = _.filter(this.trainingVideosListConfig.rows, { 'selected': true });
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
              let ids: any = [];
              ids.push(item.rid);
              this.delete(ids);
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
      this.navigateByUrl('/trainingvideo/add');
    }

    onEdit(item) {
      this.navigateByUrl('/trainingvideo/edit/' + item.rid);
    }

    onView(item) {
      this.navigateByUrl('/trainingvideo/view/' + item.rid);
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
      _.map(this.trainingVideosListConfig.rows, (obj) => obj.selected = this.allRowsSelected);
      this.selectedIdsArray();
    }

    /**
   * delete item by id
   */
    delete(id): void {
      try {
        this._trainingVideosService
          .massDelete(id)
          .subscribe((response) => {
              this.setSuccess(response.message);
              this.loadList();
            },(error) => {
            this.setError(error.message);
            //this.loader = false;
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
        this._trainingVideosService
          .massDelete(ids)
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
      const selectedItems = _.filter(this.trainingVideosListConfig.rows, { 'selected': true });
      this.selectedRids = _.map(selectedItems, 'rid');
      console.log( this.selectedRids)
    }

  /**
   * Get status name
   */
  public getStatusName(status: string) {
    const arr = _.filter(Constant.STATUS_ARRAY, { label: status });
    return arr.length > 0 ? arr[0]['label'] : '';
  }

}
