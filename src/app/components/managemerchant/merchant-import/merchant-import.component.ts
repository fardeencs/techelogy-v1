import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Location } from '@angular/common';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { MerchantService } from '../../../services/merchant.service';
import * as Constants from '../../../modules/constants';
import {TranslateService} from "@ngx-translate/core";
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import {filter,map,mergeMap} from 'rxjs/operators';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-merchant-import',
  templateUrl: './merchant-import.component.html'
})
export class MerchantImportComponent extends BaseComponent implements OnInit {

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
  @ViewChild('reasonTmplCell') reasonTmplCell: TemplateRef<any>;

  public servers =[];
  public currentServer = '';
  protected file: any;
  public fileName: any;
  public msg = '';
  public merchantData = [];
  public merchantImportConfig = {
    columns:[],
    rows:[]
  };
  public merchantSearchTableOption: Array<Object>;
  public totalRecords = 0;
  public showPageLimit: boolean;
  public merchantStatusValue = Constants.MERCHANT_APPROVAL_STATUS_ARRAY;
  public pageInfo;
  constructor(
    private _merchantService: MerchantService,
    protected _router: Router,
    private translate:TranslateService,
    private _modalService: BsModalService,
    private _activatedRoute: ActivatedRoute,
    private titleService:Title,
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
    this._merchantService.getServerList().subscribe((res) => {
      this.servers=res.data;
    })
  }
  /**
     * File upload event
     * @param e
     */
  fileEvent(event) {
    this.file = null;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file.name;
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > this.MAX_LENGTH_CONFIG.MAX_FILE_SIZE) {
        event.srcElement.value = null;
        this.setError('MERCHENT_IMPORT_FILE_SIZE_LIMIT');
      } else if (!this.MAX_LENGTH_CONFIG.MERCHENT_IMPORT.exec(file.name)) {
        event.srcElement.value = null;
        this.setError('MERCHENT_IMPORT_FILE_TYPE');
      } else {
        this.file = file;
      }
    }
  }

  action() {
    const formData = new FormData();
    if (!this.currentServer) {
      this.setError('MERCHENT_IMPORT_SERVER');
      return false;
    }

    if (this.currentServer && this.file) {
      formData.append('csv', this.file);
      formData.append('server', this.currentServer);
      this.merchantData = [];
      this.msg='';
      this._merchantService.importFiles(formData).subscribe((res) => {
        //show message
        if(res['success'] == 1){
          this.setSuccess(res['message']);
        }else if(res['success'] == 0){
          this.setError(res['message']);
        }

        // if (res.data) {
        //   this.merchantData = res.data;
        //   this.LoadMerchantImport(res['data']);
        // }
        this.merchantData = res.data;
        const dataArr = res['data'] || [];
        this.LoadMerchantImport(dataArr);

        this.translate.get('MERCHENT_MESSAGE',{count:res.count,ServerName:this.currentServer}).subscribe((msg)=>{
          this.msg = msg;
        });

      });
    } else {
      this.setError('MERCHENT_IMPORT_FILE');
    }
  }

  /**
   * Load Merchant Import Data
   */
  LoadMerchantImport(data) {
    this.merchantImportConfig = {
      rows: [],
      columns: [
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'COMMON.LABELS.ID',
          sortable: false,
          draggable: false,
          flexGrow: 3,
          width: 70,
          value: 'id'
        },
        {
            headerTemplate: this.commonTmplHeader,
            draggable: false,
            cellTemplate: this.commonTmplCell,
            name: 'MANAGE_MERCHANT.ADD_MERCHANT.COMPANY_INFO.MERCHANT_REPRESENTATIVE_NAME',
            sortable: false,
            flexGrow: 3,
            value: 'merchantRepresentativeName'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.STORE_NAME',
          sortable: false,
          draggable: false,
          flexGrow: 3,
          value: 'storeName'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.emailTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.STORE_EMAIL',
          flexGrow: 4,
          sortable: false,
          draggable: false,
          value: 'email'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.urlTmplCell,
          name: 'MANAGE_MERCHANT.ADD_MERCHANT.COMPANY_INFO.URL',
          flexGrow: 4,
          sortable: false,
          draggable: false,
          value: 'websiteUrl'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.commonTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.CURRENT_SALESPERSON',
          flexGrow: 4,
          sortable: false,
          draggable: false,
          value: 'salePerson'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.statusTmplCell,
          name: 'MANAGE_MERCHANT.FORM_LABELS.STATUS',
          flexGrow: 3,
          sortable: false,
          draggable: false,
          value: 'status'
        },
        {
          headerTemplate: this.commonTmplHeader,
          cellTemplate: this.reasonTmplCell,
          name: 'COMMON.LABELS.REASON',
          flexGrow: 5,
          sortable: false,
          draggable: false,
          value: 'faliureReason'
        },
        {
          headerTemplate: this.commonTmplHeader,
          name: 'Actions',
          headerClass: 'text-center',
          cellTemplate: this.actionTmpl,
          flexGrow: 2,
          sortable: false,
          draggable: false,
          value: ''
        },
      ]
    };
    // const blankData = [
    //   {
    //      'email': '',
    //      'id': '',
    //      'merchantRepresentativeName': '',
    //      'storeName': '',
    //      'businessLegalName': '',
    //      'status': '',
    //      'salesPersonName': '',
    //      'websiteUrl': '',
    //      'faliureReason': ''
    //   }
    // ];
    // if (data.length === 0) {
    //   data = blankData;
    // }
    this.showPageLimit = false;
    this.totalRecords = data.length;
    this.merchantImportConfig['rows'] = data;
  }
  /**
   * Get status name
   */
  public getStatusName(id) {
    let label = '';
    this.merchantStatusValue.forEach(function (v, k) {
      if (v.value == id) {
        label = v['label'];
        return label;
      }
    });
    return label;
  }
  viewMerchant(data){
    const url = '/merchant/merchantDetail/' + data.rid+'/'+data.status;
    this._router.navigate([url]);
  }
  cancel() {
      try {
        const modal = this._modalService.show(ConfirmDialogComponent);
        (<ConfirmDialogComponent>modal.content).showConfirmationModal(
          'COMMON.BUTTONS.CANCEL',
          'COMMON.MODALS.CHANGES_NOT_SAVED',
          'COMMON.BUTTONS.OK',
          'COMMON.BUTTONS.CANCEL'
        );
        (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            this.back();
          } else if (result === false) {
            // when pressed No
          } else {
            // When closing the modal without no or yes
          }
        });
      } catch (error) {
        console.log(error);
      }
  }
  back(){
    const url = '/approval/merchant';
    this._router.navigate([url]);
  }
}
