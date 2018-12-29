import {Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import {BaseComponent} from "../../../../base.component";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as Constant from './../../../../../modules/constants';
import {MerchantService} from "../../../../../services/merchant.service";
import { SCHEME_TYPES_OBJECT } from '../../../../../modules';
import * as _ from 'lodash';
import {GlobalState} from "../../../../../global.state";
import {STATE_EVENT} from "../../../../../modules/constants";

@Component({
  selector: 'app-scheme-fee',
  templateUrl: './scheme-fee.component.html',
  encapsulation:ViewEncapsulation.None
})
export class SchemeFeeComponent extends BaseComponent implements OnInit{
  public SCHEME_TYPES: any;
  @Input() group:FormGroup;
  @Input() isFormSubmitted:boolean = false;
  schemesList:Array<Object> = [];

  constructor(protected _router: Router,
              protected _location: Location,
              private _merchantService:MerchantService,
              private _globalState:GlobalState,
              private cdr: ChangeDetectorRef
  ){
    super(_router, _location);
    this.SCHEME_TYPES = SCHEME_TYPES_OBJECT;

  }

  ngOnInit() {
    /***
     *  Get Scheme list and set values
     */
    this._merchantService.getSchemes().subscribe((res) => {
      this.schemesList = res['data'];

      //get scheme list
      const schemeIds = this.group.controls['schemeIds'].value;
      const savedSchemesArr = schemeIds ? schemeIds.toString().split(',') : [];
      let selectedSchemes   = [];
      _.each(this.schemesList,function(v,k) {
        _.each(savedSchemesArr, function (item) {
          if (Number(v['schemeId']) == Number(item)) {
            selectedSchemes.push(v);
          }
        });
      });
      this.group.patchValue({
        scheme: selectedSchemes
      });
    });



    /**
     * Check Domestic Country for Auto fill
     */
    this._globalState.subscribe(STATE_EVENT.AUTOFILL_DOMESTIC_COUNTRY_DELIVERY,
      (res) => {
        const selectionType = this.group.controls['selectionType'].value;
        const countryId     = this.group.controls['countryId'].value;

        const childCountry    =  res['countryID'];
        const data  = JSON.parse(res['data']);
        const selectedSchemes = data['scheme'];

        if(selectionType == 'COUNTRY' && countryId == childCountry){

          _.each(this.schemesList,function(v,k){
              v['disabled'] = false;
          });

          let diabledSchemesArr = [];
          _.each(this.schemesList,function(v,k) {
            _.each(selectedSchemes, function (v1,k1) {
              if (Number(v['schemeId']) == Number(v1['schemeId'])) {
                v['disabled'] = true ;
                diabledSchemesArr.push(v);
              }else{
                v['disabled'] = false ;
              }
            });
          });

          this.group.patchValue({
            scheme: []
          });
          this.group.patchValue({
            scheme: diabledSchemesArr
          });


          //enable disable schemes from option
          this.group.controls['registrationFeeB2b'].disable();
          this.group.controls['agreementPeriodB2b'].disable();
          this.group.controls['transactionFeeB2b'].disable();
          this.group.controls['registrationFeeB2c'].disable();
          this.group.controls['agreementPeriodB2c'].disable();
          this.group.controls['transactionFeeB2c'].disable();

          const selSchemeTypeArr = _.map(diabledSchemesArr , 'schemeType');
          if(selSchemeTypeArr.length > 0){
            const self = this;
             if(_.indexOf(selSchemeTypeArr,self.SCHEME_TYPES.BOTH)!= -1){
                 _.each(self.schemesList , function(v,k){
                    v['disabled'] = true;
                 });
             }else if(selSchemeTypeArr.length == 1 && _.indexOf(selSchemeTypeArr,self.SCHEME_TYPES.B2C)!= -1){
               _.each(self.schemesList , function(v,k){
                 if(v['schemeType'] == self.SCHEME_TYPES.B2C || v['schemeType'] == self.SCHEME_TYPES.BOTH){
                    v['disabled'] = true;
                 }
             });

             }else if(selSchemeTypeArr.length == 1 && _.indexOf(selSchemeTypeArr,self.SCHEME_TYPES.B2B)!= -1){
                 _.each(self.schemesList , function(v,k){
                  if(v['schemeType'] == self.SCHEME_TYPES.B2B || v['schemeType'] == self.SCHEME_TYPES.BOTH){
                    v['disabled'] = true;
                  }
             });

             }else if(selSchemeTypeArr.length == 2){
               _.each(self.schemesList , function(v,k){
                      v['disabled'] = true;
               });
             }

             this.schemesList = [...this.schemesList];
           }

        }
      });
    }

  /**
   * On scheme Remove
   */
  onSchemeRemove(item){
    const type = item['value']['schemeType'];
    const data = {
      registrationFeeB2c:'',
      agreementPeriodB2c:'',
      registrationFeeB2b:'',
      agreementPeriodB2b:'',
      transactionFeeB2b:'',
      transactionFeeB2c:''
    };
    this.disableFeesValues(type ,data);
  }

  /**
   * On scheme Change
   */
  onSchemeChange(arr){
    if(arr.length > 0){
      const data = arr[arr.length-1];
      const type = data['schemeType'];

      if(type == this.SCHEME_TYPES.B2B){
        this.removeDuplicateScheme(arr,data);
        this.setSchemeValues(type,data);
      }else if(type == this.SCHEME_TYPES.B2C){
        this.removeDuplicateScheme(arr,data);
        this.setSchemeValues(type,data);
      }else if(type == this.SCHEME_TYPES.BOTH){
        this.group.patchValue({
          scheme : [data]
        });
        this.setSchemeValues(type,data);
      }
    }else{
      const data = {
        registrationFeeB2c:'',
        agreementPeriodB2c:'',
        registrationFeeB2b:'',
        agreementPeriodB2b:'',
        transactionFeeB2b:'',
        transactionFeeB2c:''
      };
      this.disableFeesValues(this.SCHEME_TYPES.BOTH ,data);

    }

    this.formValueChanged();
  }

  /**
   * Remove same type of schemes
   */
  removeDuplicateScheme(arr,newData){
    //remove both
    _.remove(arr,(obj)=>{
      return obj['schemeType'] == this.SCHEME_TYPES.BOTH;
    });

    let schemeType = newData['schemeType'];
    const existingScheme  = _.filter(arr , {schemeType:schemeType});
    if(existingScheme.length > 1){
      _.remove(arr,(obj)=>{
        return obj['schemeType'] == schemeType;
      });
      arr.push(newData);
    };

    this.group.patchValue({
      scheme : arr
    });

    //resetting form values
    const selectedSchemeTypes = (_.map(arr,'schemeType'));
    if(_.indexOf(selectedSchemeTypes,this.SCHEME_TYPES.BOTH) != -1){
      // do nothing
    }else if(_.indexOf(selectedSchemeTypes,this.SCHEME_TYPES.B2B) != -1 && _.indexOf(selectedSchemeTypes,this.SCHEME_TYPES.B2C) != -1){
      // do nothing
    }else if(_.indexOf(selectedSchemeTypes,this.SCHEME_TYPES.B2B) != -1){
      this.group.patchValue({
        registrationFeeB2c:'' ,
        agreementPeriodB2c: '',
        transactionFeeB2c: ''
      });
      this.group.controls['registrationFeeB2c'].disable();
      this.group.controls['agreementPeriodB2c'].disable();
      this.group.controls['transactionFeeB2c'].disable();
    }else if(_.indexOf(selectedSchemeTypes,this.SCHEME_TYPES.B2C) != -1){
      this.group.patchValue({
        registrationFeeB2b:'',
        agreementPeriodB2b:'',
        transactionFeeB2b:''
      });
      this.group.controls['registrationFeeB2b'].disable();
      this.group.controls['agreementPeriodB2b'].disable();
      this.group.controls['transactionFeeB2b'].disable();
    }
  }

  /**
   * set fees value
   */
  setSchemeValues(type , data){

    if(type == this.SCHEME_TYPES.B2B){
      this.group.patchValue({
        registrationFeeB2b: data['registrationFeeB2b'],
        agreementPeriodB2b: data['agreementPeriodB2b'],
        transactionFeeB2b:data['transactionFeeB2b']
      });
      this.group.controls['registrationFeeB2b'].enable();
      this.group.controls['agreementPeriodB2b'].enable();
      this.group.controls['transactionFeeB2b'].enable();
    }else if(type == this.SCHEME_TYPES.B2C){
      this.group.patchValue({
        registrationFeeB2c: data['registrationFeeB2c'] ,
        agreementPeriodB2c: data['agreementPeriodB2c'],
        transactionFeeB2c: data['transactionFeeB2c']
      });
      this.group.controls['registrationFeeB2c'].enable();
      this.group.controls['agreementPeriodB2c'].enable();
      this.group.controls['transactionFeeB2c'].enable();
    }else if(type == this.SCHEME_TYPES.BOTH){
      this.group.patchValue({
        registrationFeeB2c: data['registrationFeeB2c'] ,
        agreementPeriodB2c: data['agreementPeriodB2c'] ,
        registrationFeeB2b: data['registrationFeeB2b'] ,
        agreementPeriodB2b: data['agreementPeriodB2b'] ,
        transactionFeeB2b: data['transactionFeeB2b'] ,
        transactionFeeB2c: data['transactionFeeB2c']
      });
      this.group.controls['registrationFeeB2b'].enable();
      this.group.controls['agreementPeriodB2b'].enable();
      this.group.controls['transactionFeeB2b'].enable();
      this.group.controls['registrationFeeB2c'].enable();
      this.group.controls['agreementPeriodB2c'].enable();
      this.group.controls['transactionFeeB2c'].enable();
    }

     const self = this;
     const disabledScheme = this.group.controls['scheme'].value;
    _.each(disabledScheme,function(v,k){
      if(v['disabled']){
        const type = v['schemeType'];
        if(type == self.SCHEME_TYPES.B2B){
          self.group.controls['registrationFeeB2b'].disable();
          self.group.controls['agreementPeriodB2b'].disable();
          self.group.controls['transactionFeeB2b'].disable();
        }else if(type == self.SCHEME_TYPES.B2C){
          self.group.controls['registrationFeeB2c'].disable();
          self.group.controls['agreementPeriodB2c'].disable();
          self.group.controls['transactionFeeB2c'].disable();
        }else if(type == self.SCHEME_TYPES.BOTH){
          self.group.controls['registrationFeeB2b'].disable();
          self.group.controls['agreementPeriodB2b'].disable();
          self.group.controls['transactionFeeB2b'].disable();
          self.group.controls['registrationFeeB2c'].disable();
          self.group.controls['agreementPeriodB2c'].disable();
          self.group.controls['transactionFeeB2c'].disable();
        }
      }
    });
  }


  /**
   * disable fees value on remove
   */
  disableFeesValues(type , data){

    if(type == this.SCHEME_TYPES.B2B){
      this.group.patchValue({
        registrationFeeB2b: data['registrationFeeB2b'],
        agreementPeriodB2b: data['agreementPeriodB2b'],
        transactionFeeB2b:data['transactionFeeB2b']
      });
      this.group.controls['registrationFeeB2b'].disable();
      this.group.controls['agreementPeriodB2b'].disable();
      this.group.controls['transactionFeeB2b'].disable();
    }else if(type == this.SCHEME_TYPES.B2C){
      this.group.patchValue({
        registrationFeeB2c: data['registrationFeeB2c'] ,
        agreementPeriodB2c: data['agreementPeriodB2c'],
        transactionFeeB2c: data['transactionFeeB2c']
      });
      this.group.controls['registrationFeeB2c'].disable();
      this.group.controls['agreementPeriodB2c'].disable();
      this.group.controls['transactionFeeB2c'].disable();
    }else if(type == this.SCHEME_TYPES.BOTH){
      this.group.patchValue({
        registrationFeeB2c: data['registrationFeeB2c'] ,
        agreementPeriodB2c: data['agreementPeriodB2c'] ,
        registrationFeeB2b: data['registrationFeeB2b'] ,
        agreementPeriodB2b: data['agreementPeriodB2b'] ,
        transactionFeeB2b: data['transactionFeeB2b'] ,
        transactionFeeB2c: data['transactionFeeB2c']
      });
      this.group.controls['registrationFeeB2b'].disable();
      this.group.controls['agreementPeriodB2b'].disable();
      this.group.controls['transactionFeeB2b'].disable();
      this.group.controls['registrationFeeB2c'].disable();
      this.group.controls['agreementPeriodB2c'].disable();
      this.group.controls['transactionFeeB2c'].disable();
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



