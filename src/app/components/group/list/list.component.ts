import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { ListModel } from '../../../models/user/list.model';
import * as Constant from '../../../modules/constants';
import * as _ from 'lodash';
import { UtilHelper } from '../../../helper/util.helper';
import { CountryService } from '../../../services/country.service';
import { GroupService } from '../../../services/group.service';
import { MerchantService } from '../../../services/merchant.service';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {filter,map,mergeMap} from 'rxjs/operators';
import {DATA_GRID} from "../../../modules/constants";

@Component({ templateUrl: './list.component.html', styleUrls: ['./list.component.css'] })
export class ListComponent extends BaseComponent implements OnInit {

    @ViewChild('checkboxTmpl') checkboxTmpl: TemplateRef<any>;
    @ViewChild('actionTmpl') actionTmpl: TemplateRef<any>;
    @ViewChild('roleNameTmpl') roleNameTmpl: TemplateRef<any>;
    @ViewChild('confirmModal') confirmModal: TemplateRef<any>;
    @ViewChild('checkboxTmplHeader') checkboxTmplHeader: TemplateRef<any>;
    @ViewChild('commonTmplHeader') commonTmplHeader: TemplateRef<any>;
    @ViewChild('commonTmplCell') commonTmplCell: TemplateRef<any>;
    @ViewChild('countriesTmplCell') countriesTmplCell: TemplateRef<any>;
    @ViewChild('statusTmplCell') statusTmplCell: TemplateRef<any>;
    modalRef: BsModalRef;
    public loader = true;
    public groupListConfig: ListModel;
    public isCollapsed = true;
    public groupSearchTableOptions: Array<Object>;
    public allRowsSelected = false;
    public sortColumn = '';
    public sortOrder = '';
    public showMassDeleteBtn = false;
    public searchTxt = '';
    public isCollapsedSearch = true;
    public GROUP_EXPORT_API = Constant.REST_API.COUNTRYGROUP.EXPORT_SELECTED;
    public GROUP_EXPORT_ACTION = Constant.MODULE_ACTIONS.COUNTRYGROUP.VIEW;
    public permissions: Array<string> = [];
    public selectedRids: Array<String> = [];
    public pageNumber: number;
    public pageSize: number;
    public sortArray: Array<Object> = [];
    public pageInfo:any;

    constructor(
      protected _router: Router,
      public _activatedRoute: ActivatedRoute,
      private modalService: BsModalService,
      protected _location: Location,
      private _groupService: GroupService,
      private titleService: Title,
      private translate: TranslateService,
      private _merchantService: MerchantService) {
      super(_router, _location);
      this.groupListConfig = new ListModel();

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

      this.groupSearchTableOptions = [
        {
          type: 'text',
          'fieldName': 'groupId',
          'labelName': 'COMMON.LABELS.ID',
          fieldValue: '',
          defaultValue: this.queryParams.groupId ? this.queryParams.groupId : ''
        }, {
          type: 'text',
          'fieldName': 'groupName',
          'labelName': 'COUNTRYGROUP.FORM_LABELS.NAME',
          fieldValue: '',
          defaultValue: this.queryParams.groupName ? this.queryParams.groupName : ''
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

      this.groupListConfig.columns = [
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
          frozenLeft: DATA_GRID.FROZEN_LEFT,
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
          width: 80,
          maxWidth : 80,
          resizeable: false,
          draggable: false,
          sortable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT,
          cellClass: 'fixed-column'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'COMMON.LABELS.ID',
          flexGrow: 1,
          width: 70,
          value: 'groupId',
          cellClass: 'fixed-column',
          sortable: true,
          draggable: false,
          resizeable: false,
          frozenLeft: DATA_GRID.FROZEN_LEFT
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'COUNTRYGROUP.FORM_LABELS.NAME',
          sortable: true,
          flexGrow: 1,
          value: 'groupName'
        }, {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.countriesTmplCell,
          name: 'COUNTRYGROUP.FORM_LABELS.COUNTRIES',
          sortable: true,
          flexGrow: 1,
          value: 'countryIds'
        }, {
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

      this.getCountries();
    }

    getCountries() {
      this._merchantService.getCountryList().subscribe((response) => {
        const countries = [];
        response.data.forEach(element => {
          countries.push( { value: element.countryCode, label: element.countryName } );
        });
        this
        .groupSearchTableOptions
        .splice(2, 0, {
          type: 'multipleKeyValueDropdown',
          fieldName: 'countryIds',
          labelName: 'COUNTRYGROUP.FORM_LABELS.COUNTRIES',
          fieldValue: '',
          options: countries,
          defaultValue: this.queryParams.countryIds ? new Date(this.queryParams.countryIds) : ''
        });
      },(error) => {
        this.setError(error.message);
      });
    }

    /**
     * load group list details with pagination functionality
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

      this.navigateByUrl('/group/view?' + paramRoute);

      try {
        this
          ._groupService
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
            this.groupListConfig.rows = response.data;
            this.groupListConfig.totalRecords = response.totalItems;
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
        this.groupListConfig.rows = [];
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
      const selectedItems = _.filter(this.groupListConfig.rows, { 'selected': true });
      this.showMassDeleteBtn = selectedItems.length >= 1
        ? true
        : false;
      this.selectedIdsArray();
    }

    /**
     * mass delete functionality
     */
    onMassDelete() {
      const selectedItems = _.filter(this.groupListConfig.rows, { 'selected': true });
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
      this.navigateByUrl('/group/add');
    }

    onEdit(item) {
      this.navigateByUrl('/group/edit/' + item.rid);
    }

    onView(item) {
      this.navigateByUrl('/group/view/' + item.rid);
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
      _.map(this.groupListConfig.rows, (obj) => obj.selected = this.allRowsSelected);
      this.selectedIdsArray();
    }

    /**
   * delete item by id
   */
    delete(id): void {
      try {
        this._groupService
          .delete(id)
          .subscribe((response) => {
            this.setSuccess('GROUP_DELETED_SUCCESSFULLY');
            this.loadList();
          },(error) => {
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
        this._groupService
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
      const selectedItems = _.filter(this.groupListConfig.rows, { 'selected': true });
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
