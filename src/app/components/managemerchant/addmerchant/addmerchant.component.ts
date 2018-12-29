import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {BsModalService} from 'ngx-bootstrap';
import {ConfirmDialogComponent} from '../../../shared/dialog/confirm/confirm.component';
import {BaseComponent} from '../../base.component';
import { Location } from '@angular/common';
import {MerchantService} from '../../../services/merchant.service';
import * as _ from 'lodash';
import * as Constant from '../../../modules/constants';
import {STATE_EVENT} from "../../../modules/constants";
import {GlobalState} from "../../../global.state";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {filter,map,mergeMap} from 'rxjs/operators';

export class StoreDetailModel {
  public rid: string = '';
  public storeId:number = 0;
  public storePlatformId?: string = '';
}

@Component({
  selector: 'app-addmerchant',
  templateUrl: './addmerchant.component.html',
  styleUrls: ['./addmerchant.component.scss']
})

export class AddmerchantComponent extends BaseComponent implements OnInit {
  public stepsTabs: Array<Object> = [
    { name: 'Business Information', stepNo: 'step_1' , dbField: 'businessInfo' },
    { name: 'Contact Person', stepNo: 'step_2', dbField: 'contactInfo' },
    { name: 'Contact Person', stepNo: 'step_3', dbField: 'financeContactInfo' },
    { name: 'Finance and Tax details', stepNo: 'step_4', dbField:  'financeBankInfo'},
    { name: 'Documents', stepNo: 'step_5' , dbField:  'documentinfo'},
    { name: 'Delivery Platform', stepNo: 'step_6', dbField:  'deliveryInfo' },
    { name: 'Merchant Authorized Signatory', stepNo: 'step_7', dbField:  'signatoryInfo' }
    ];

  public allowedStatusTypes = [];
  public activeTab: string = 'step_1';
  public lastCompletedStep:string = '';
  public storeDetail: StoreDetailModel = new StoreDetailModel();
  public isDetailSection:boolean = false;
  public routeIDAvailable:boolean = false;
  public stepsFilledIncomplete:boolean = false;
  public pageInfo;

  constructor(private activeRoute:ActivatedRoute,
              protected _router: Router,
              protected _location: Location,
              private _globalState:GlobalState,
              private _merchantService: MerchantService,
              private bsModalService: BsModalService,
              private titleService: Title,
              private translate: TranslateService) {
                super(_router,_location);

                this
                  ._router.events
                  .pipe(filter(event => event instanceof NavigationEnd)
                    ,map(() => this.activeRoute)
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

    /**
     * Check Incomplete Status
     */
    this._globalState.subscribe(STATE_EVENT.CHECK_INCOMPLETE_MERCHANT_STEP,
      (status) => {
        this.getStoreInfo();
      });

  }

  ngOnInit() {
    //incorrect info and draft allowed
    this.allowedStatusTypes = _.map(Constant.MERCHANT_DENY_EDIT_STATUS_ARRAY,'value');

    this.storeDetail['rid'] = this.activeRoute.snapshot.params['id'] || '';
    this.isDetailSection    = this.activeRoute.snapshot.params['type'] == 'view' ? true : false;
    this.routeIDAvailable   = this.activeRoute.snapshot.params['id'] ? true : false;

    this.getStoreInfo();
  }

  /**
   * Get Store Info
   */
  getStoreInfo() {
     // allowed in EDIT / DETAIL mode
     if (this.storeDetail['rid']) {
      const param = this.storeDetail['rid'];
      this._merchantService
        .getCompanyInfo(param)
        .subscribe((response) => {

          // if it is in EDIT mode
          if(this.activeRoute.snapshot.params['type'] != 'view'){
            // only Allowed for Incorrect and Draft status otherwise show as detail section
            const isAllowed = (_.indexOf(this.allowedStatusTypes,response['approvalStatus']) != -1);
            this.isDetailSection = (isAllowed) ? false:false;

            // find step which is incomplete
            const self = this;
            let stepsFilledIncomplete = false;
            _.forEach(this.stepsTabs, function(value, key) {
              _.forEach(response['merchantStepStatus'], function(value_res, key_res) {
                if (String(value['dbField']) === String(key_res) && value_res == 0 && !stepsFilledIncomplete) {
                  self.activeTab = value['stepNo'];
                  self.lastCompletedStep = value['stepNo'];
                  self.stepsFilledIncomplete = true;
                  stepsFilledIncomplete = true;
                }
              });
            });
          }
        },(error) => {
        });
    }
  }

  /**
   * Active tab
   */
  isActiveTab(tab) {
    if (!this.routeIDAvailable) {
       const prevTab = parseInt(this.activeTab.split('_')[1], 0);
       const currentTab = parseInt(tab.split('_')[1], 0);
       if (currentTab > prevTab) {
         return false;
       }
    }

    //check for edit mode
    if (this.stepsFilledIncomplete) {
      const lastFilledStep = parseInt(this.lastCompletedStep.split('_')[1], 0);
      const currentTab = parseInt(tab.split('_')[1], 0);
      if (currentTab > lastFilledStep) {
        return false;
      }
    }

    this.activeTab = tab;
  }

  /**
   * Handler for buttons in form
   */
  buttonHandler(item) {
    const mode = item['mode'] || 'VIEW'; // ADD , UPDATE
    const currentStep = parseInt(item['step'].split('_')[1], 0);
    (currentStep  === 1 && mode === 'ADD') ? this.storeDetail = item['data'] : '';


    if (item['type'] === 'SAVE_CONTINUE') {
      this.activeTab = 'step_' + (currentStep + 1);
    } else if (item['type'] === 'PREVIOUS') {
      this.activeTab = 'step_' + (currentStep - 1);
    } else if (item['type'] === 'SUBMIT_FOR_REVIEW') {
      // last step
      try {
        this._merchantService.submitForReview(this.storeDetail['rid']).subscribe((response) => {
          this.setSuccess(response['message']);
          const url = '/merchant/view';
          this._router.navigate([url]);
        });
      } catch (error) {
      }
    }
  }

  /*
   Cancel button functionality
   */
  public cancelButtonAction() {
    try {
      const modal = this.bsModalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.CANCEL',
        'COMMON.MODALS.CHANGES_NOT_SAVED',
        'COMMON.BUTTONS.OK',
        'COMMON.BUTTONS.CANCEL'
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          // this._router.navigate(['/merchant/view']);
          this.back();
        } else if (result === false) {
          // when pressed No
        } else {
          // When closing the modal without no or yes
        }
      });
    } catch (error) {
    }
  }

  /**
   * set Disabled class for menu
   */
  isDisabled(stepNo) {
    const prevTab = parseInt(this.activeTab.split('_')[1], 0);
    const currentTab = parseInt(stepNo.split('_')[1], 0);
    const lastFilledStep = parseInt(this.lastCompletedStep.split('_')[1], 0);

    // edit and detail mode
    if (this.activeTab == stepNo || this.routeIDAvailable && !this.stepsFilledIncomplete) {
      return '';
    }
    // add mode
    if (currentTab < prevTab && !this.routeIDAvailable && !this.stepsFilledIncomplete) {
      return '';
    }

    // edit mode when all steps are not completed
    if ((currentTab <= lastFilledStep) && this.routeIDAvailable && this.stepsFilledIncomplete) {
      return '';
    }

    return 'nav-link-disabled';
  }

}
