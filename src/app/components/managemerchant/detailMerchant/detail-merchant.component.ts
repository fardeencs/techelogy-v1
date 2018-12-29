import { MerchantService } from './../../../services/merchant.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import * as Constant from '../../../modules/constants';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import {UtilHelper} from "../../../helper/util.helper";
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';

@Component({
  templateUrl: './detail-merchant.component.html',
  styleUrls: ['./detail-merchant.component.css']
})
export class DetailMerchantComponent extends BaseComponent implements OnInit {
  public user_token;
  private userRole;
  public allowedStatusTypes;
  public STATUS_ARRAY = Constant.STATUS_ARRAY;
  public permissions: Array<string> = [];
  public merchantCompleteDetails = '';
  public authorizedSignDate="";
  public productCountGroup;
  public productCountDomestic;
  public pageInfo;

  public domesticCountry;
  productCountSell: Array<Object> = [
    { id: 1, value: '1 – 10' },
    { id: 2, value: '11 – 100' },
    { id: 3, value: '101 – 500' },
    { id: 4, value: 'More than 500' },
    { id: 5, value: 'Don’t know' }
  ];
  public annualTurnOver: Array<Object> = [
    { id: 0, value: '-' },
    { id: 1, value: 'Less than 100K' },
    { id: 2, value: 'Between 100K to 1 Million' },
    { id: 3, value: 'Between 1 Million to 10 Millions' },
    { id: 4, value: 'More than 10 Millions' },
    { id: 5, value: 'Don’t know' }
  ];
  public annualTurnOverResult;

  constructor(protected _router: Router,
    public activeRoute: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    protected _location: Location,
    private translate: TranslateService,
    private _modalService: BsModalService,
    private _merchantService: MerchantService,
    private titleService: Title
  ) {
    super(_router, _location);

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

    this.permissions = this.activatedRoute.snapshot.data['permission'];
    this.user_token = this.activeRoute.snapshot.params['id'];
    this.allowedStatusTypes = this.activeRoute.snapshot.params['status'];
  }
  ngOnInit() {

    this._merchantService.getDomesticCountry().subscribe((res) => {
      this.domesticCountry = res['country'] || '';
      });

    this._merchantService.getMerchantDetails(this.user_token).subscribe((response)=>{
      this.merchantCompleteDetails = response;
      let currentDate = new Date(this.merchantCompleteDetails['signatoryInfo']['createdAt']);
      this.authorizedSignDate = currentDate.getDate()+'/'+ Number(currentDate.getMonth()+1) + '/' + currentDate.getFullYear() ;
    },(error)=>{
      this.setError(error.message);
    })
  }

/*
Get Merchant Detail
*/
  getMerchantDetail() {
  }

  public onDelete() {
    this.showConfirmationDeleteModal(this.user_token);
  }
  annualTurnOverDetails(data){
    this.annualTurnOver.forEach((item, index)=>{
      if(item['id'] == data){
        this.annualTurnOverResult = item['value'];
      }
    })

  }
  productSellCount(data, platform){
    this.productCountSell.forEach((item, index)=>{
      if(item['id'] == data){
        if(platform == "group"){
          this.productCountGroup = item['value'];
        }else{
          this.productCountDomestic = item['value'];
        }
      }
    })
  }
    /**
   * confirm modal delete
  **/
 showConfirmationDeleteModal(item): void {
  const modal = this._modalService.show(ConfirmDialogComponent);
  (<ConfirmDialogComponent>modal.content).showConfirmationModal(
    'COMMON.BUTTONS.DELETE',
    'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
    'COMMON.BUTTONS.YES',
    'COMMON.BUTTONS.NO',
  );

  (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
    if (result === true) {
      // when pressed Yes
      this.deleteMerchant(item);

    } else if (result === false) {
      // when pressed No
    } else {
      // When closing the modal without no or yes
    }
  });
}
/**
   * Get status name
   */
  public isEditAllowed(status) {
    let isAllowed;
    if (status == -1) {
      isAllowed = true;
    } else {
      isAllowed = false;
    }
    return (isAllowed);
  }
  onEdit() {
    this.navigateByUrl('/merchant/edit/' + this.user_token);
  }

  deleteMerchant(id): void {
    try {
      this._merchantService
        .deleteMerchant(id)
        .subscribe((response) => {
          this.setSuccess('MERCHANT_DELETED_SUCCESSFULLY');
          this.navigateByUrl('/merchant/view');
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {

    }
  }

  /**
   * Get status name
   */
  public getStatusName(id) {
    const arr = _.filter(this.STATUS_ARRAY, { value: id });
    return arr.length > 0 ? arr[0]['label'] : 'NA';
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
