import {Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation} from "@angular/core";
import { Location } from '@angular/common';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Subject, Observable, throwError} from "rxjs";
import {BaseComponent} from "../../../../../base.component";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {PickupaddressModel} from "../../../../../../models/add-merchant/pickupAddress.model";
import {MerchantService} from "../../../../../../services/merchant.service";
import * as _ from 'lodash';
import {map, catchError} from "rxjs/operators";

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  encapsulation:ViewEncapsulation.None
})
export class AddEditAdddressComponent extends BaseComponent implements OnInit {

  public pickupAddress: PickupaddressModel;
  public active: boolean = false;
  public body: string;
  public title: string;
  public onClose: Subject<Object>;
  public countryList:Array<Object> = [];
  public stateList:Array<Object> = [];
  public cityList:Array<Object> = [];
  public storeDetail:Object ;
  @ViewChild('pickupAddressForm') pickupAddressForm: ElementRef;

  constructor(_router: Router, _location: Location,
              private bsModalService: BsModalService,
              private _bsModalRef: BsModalRef,
              private _merchantService:MerchantService,
              private translate: TranslateService) {
    super(_router, _location);
    this.pickupAddress = new PickupaddressModel();
  }

  public ngOnInit(): void {
    this.onClose = new Subject();
  }

  public showConfirmationModal(title: string , storeDetail:Object ,editData:Object = null): void {
    //set country drop down data
    this._merchantService.getCountryList().subscribe((res) => {
      this.countryList = res['data'];
      //set state / city drop down data for editing
      if(editData) {
        const countryId = editData['countryId'];
        this.generateStateList(countryId).subscribe((stateList) => {
          const stateId = editData['stateId'];
          this.stateList = stateList;
          this.generateCityList(stateId).subscribe((cityList) => {
            this.cityList = cityList;
            _.extend(this.pickupAddress,editData);
          });
        });
      }
    });

    this.storeDetail = storeDetail;
    this.title = title;
    this.active = true;
  }

  public onConfirm(): void {
    if (this.pickupAddress.validate('pickupAddressForm')) {
      this.active = false;
      this.onClose.next({status:'SAVE',data:this.pickupAddress});
      this._bsModalRef.hide();
    }
  }

  public onCancel(): void {
    this.active = false;
    this.onClose.next({status:'CANCEL'});
    this._bsModalRef.hide();
  }

  public hideConfirmationModal(): void {
    this.active = false;
    this.onClose.next({status:'CLOSE'});
    this._bsModalRef.hide();
  }

  /**
   * Change Drop Down for country , state and city
  */
  public onChangeDropDown(event, msg: string, item) {

    if (msg === 'country') {
      this._merchantService.getStateList(event).subscribe((res) => {
        item['countryName'] = _.find(this.countryList, { countryCode: event})['countryName'] || '';
        item['cityName'] = item['cityId'] =  item['stateName'] = item['stateId'] = '';
        this.stateList = res['data'];
        this.cityList = [];
      });
    } else if (msg === 'state') {
      item['stateName'] = _.find(this.stateList, {stateId: Number(event)})['stateName'] || '';
      item['cityId'] =  item['cityName'] = '';
      this._merchantService.getCityList(event).subscribe((res) => {
        this.cityList = res['data'];
      });
    }else if (msg === 'city') {
      item['cityName'] = _.find(this.cityList, {cityId:Number(event)})['cityName'] || '';
    }
  }

  /**
   * Generate State List
   * @param counrtyId
   */
  public generateStateList(counrtyId?: string): Observable<any> {
    return this._merchantService.getStateList(counrtyId)
      .pipe(map((response)=> response['data']),catchError((error) =>  throwError(error)));
  }
  /**
   * Generate City List
   * @param stateId
   */
  public generateCityList(stateId?: string): Observable<any> {
    return this._merchantService.getCityList(stateId)
      .pipe(map((response)=> response['data']),catchError((error) =>  throwError(error)));
  }

}
