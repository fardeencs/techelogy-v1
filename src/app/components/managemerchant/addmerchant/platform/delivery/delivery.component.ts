import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import {BaseComponent} from "../../../../base.component";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {MerchantService} from "../../../../../services/merchant.service";
import * as _  from  'lodash';
import {TranslateService} from "@ngx-translate/core";
import {STATE_EVENT, SCHEME_TYPES_ARRAY} from "../../../../../modules/constants";
import {GlobalState} from "../../../../../global.state";
import { SCHEME_TYPES_OBJECT } from '../../../../../modules';
import {Observable} from "rxjs";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  encapsulation:ViewEncapsulation.None
})
export class DeliveryComponent extends BaseComponent implements OnInit{
  public SCHEME_TYPES: any;
  @Input() group:FormGroup;
  @Input() storeDetail;
  @Input() isFormSubmitted:boolean = false;
  skipOnLoad = false;

  constructor(protected _router: Router,
              protected _location: Location,
              private _merchantService:MerchantService,
              private translate:TranslateService,
              private _globalState:GlobalState
  ){
    super(_router, _location);
    this.SCHEME_TYPES = SCHEME_TYPES_OBJECT;
  }

  ngOnInit() {

    this.group.parent.value.forEach((element,index) => {
      if(element.selectionType == "GROUP"){
        const countryGroups = element.countryGroups.split(",");
        if(countryGroups.indexOf(this.group.value.countryId) > -1 ){
          this.group.patchValue({
            containsInAnyGroup:{contains:true,groupName:element['countryGroupId'],groupIndex:index}
          });
        }
      }
    });

    this.group.controls['other'].valueChanges.subscribe(result => {
      if (this.group.controls['other'].value) {
        this.group.controls['otherDetail'].enable();
      } else {
        this.group.controls['otherDetail'].disable();
      }
    });


    /**
     * Check Domestic Country for Auto fill
     */
    this._globalState.subscribe(STATE_EVENT.AUTOFILL_DOMESTIC_COUNTRY_DELIVERY,
      (res) => {
        const selectionType =  this.group.controls['selectionType'].value;
        const countryId     =  this.group.controls['countryId'].value;
        const childCountry  =  res['countryID'];
        if(selectionType == 'COUNTRY' && countryId == childCountry){
          const data  = JSON.parse(res['data']);
            this.group.patchValue({
              normal: data['normal'] ,
              frozen: data['frozen'],
              merchantDelivery: data['merchantDelivery'],
              other: data['other'] ,
              otherDetail: data['otherDetail'],
              estimateSku: data['estimateSku'],
              shippingFee: data['shippingFee'],
              registrationFeeB2c: data['registrationFeeB2c'],
              agreementPeriodB2c: data['agreementPeriodB2c'],
              registrationFeeB2b: data['registrationFeeB2b'],
              agreementPeriodB2b: data['agreementPeriodB2b'],
              transactionFeeB2b: data['transactionFeeB2b'],
              transactionFeeB2c: data['transactionFeeB2c'],
              remarks:data['remarks']
            });
            this.formValueChanged()

        }

      });
  }

  /***
   * Save Data
   */
  saveData(){
    this.isFormSubmitted = true;
    if (this.group.valid) {
        const sectionName = this.group.controls['name'].value;
        if(!this.group.controls['normal'].value &&
          !this.group.controls['frozen'].value &&
          !this.group.controls['merchantDelivery'].value &&
          !this.group.controls['other'].value){
          this.translate.get('DELIVERY_MODE_REQUIRED',{name:sectionName}).subscribe((msg)=>{
            this.setError(msg);
          });
        }else if(this.group.controls['addresses'].value.length == 0){
          this.translate.get('PLS_COMPLETE_ADDRESS_REQD',{name:sectionName}).subscribe((msg)=>{
            this.setError(msg);
          });
        }else{

          const obj = {
            countryId: this.group.controls['countryId'].value,
            countryGroupId: this.group.controls['countryGroupId'].value,
            normal: this.group.controls['normal'].value  ? 1 : 0 ,
            frozen: this.group.controls['frozen'].value ? 1 : 0,
            merchantDelivery: this.group.controls['merchantDelivery'].value ? 1 : 0,
            other: this.group.controls['other'].value ? 1 : 0,
            otherDetail: this.group.controls['otherDetail'].value,
            estimateSku: this.group.controls['estimateSku'].value,
            shippingFee: this.group.controls['shippingFee'].value,
            schemeIds: _.map(this.group.controls['scheme'].value, 'schemeId').join(','),
            registrationFeeB2c: this.group.controls['registrationFeeB2c'].value,
            agreementPeriodB2c: this.group.controls['agreementPeriodB2c'].value,
            registrationFeeB2b: this.group.controls['registrationFeeB2b'].value,
            agreementPeriodB2b: this.group.controls['agreementPeriodB2b'].value,
            transactionFeeB2b: this.group.controls['transactionFeeB2b'].value,
            transactionFeeB2c: this.group.controls['transactionFeeB2c'].value,
            remarks:this.group.controls['remarks'].value
          };

          if(this.group.controls['selectionType'].value === 'COUNTRY'){
            delete obj['countryGroupId'];
          }

          this._merchantService.addUpdateDeliveryDetail(this.storeDetail['rid'], obj)
            .subscribe((response) => {
              this.group.patchValue({
                schemeIds: _.map(this.group.controls['scheme'].value, 'schemeId').join(','),
                isChanged:false
              });

              this.setSuccess(response['message']);
              this.setChildCountries();
            },(error) => {
            this.setError(error.message);
          })

        }
    }
  }

  /****
   * Fill Child Country
   */
  setChildCountries(){
    if(this.group.controls['selectionType'].value == "GROUP"){
      const self = this;
      const countryGroups = this.group.value['countryGroups'].split(",");
      const deliveryList  = this.group.parent.value;

      _.each( countryGroups, function(country,index){
        _.each(deliveryList, function(v,i){
          if( v['countryId'] === country){
            self._globalState.notifyDataChanged(
              STATE_EVENT.AUTOFILL_DOMESTIC_COUNTRY_DELIVERY,
              {
                countryID:country,
                data:JSON.stringify(self.group.value)
              });
          }
        })
      });
    }
  }

  /**
  * Track Form Value Changes
  **/

  formValueChanged(){
      this.group.patchValue({
        isChanged: true
      });
  }


}
