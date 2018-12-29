import {Component, OnInit, Input, Output, EventEmitter ,ChangeDetectorRef} from '@angular/core';
import {BaseComponent} from '../../../base.component';
import {Router} from '@angular/router';
import {MerchantService} from '../../../../services/merchant.service';
import { Location } from '@angular/common';
import * as _  from 'lodash';
import {FormGroup, FormBuilder, FormArray, Validators ,FormControl} from "@angular/forms";
import {ConfirmDialogComponent} from "../../../../shared/dialog/confirm/confirm.component";
import {BsModalService} from "ngx-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {Observable, throwError} from "rxjs";
import {map, catchError} from "rxjs/operators";


@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})

export class PlatformComponent extends BaseComponent implements OnInit {
  public globalPlatform:boolean = false;
  public domesticPlatform:boolean = false;
  public isFormSubmitted:boolean = false;
  public groupsList:Array<Object> = [];
  public countriesList:Array<Object> = [];
  public selectedGroups:Array<Object> = [];
  public selectedCountries:Array<Object> = [];
  public deliverAndFeeSchemeFormGlobal: FormGroup;
  public deliverAndFeeSchemeFormDomestic:FormGroup;
  public productRevenueFormGlobal: FormGroup;
  public productRevenueFormDomestic:FormGroup;
  public currentSubStep:number = 1;
  public domesticCountry:string ='';
  public schemeList:Array<Object> = [];

  @Output() buttonHandler = new EventEmitter<Object>();
  @Input() clickedTab;
  @Input() storeDetail;
  @Input() isDetailSection = false;

  constructor(
    protected _router: Router,
    private _merchantService: MerchantService,
    protected _location: Location,
    private _fb: FormBuilder,
    private bsModalService: BsModalService,
    private translate:TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    super(_router, _location);
  }

  ngOnInit() {
    // get selected platform type from delivery detail
    if (this.storeDetail['rid']) {
      const param = this.storeDetail['rid'];
      /**
       * Get Platform
       */
      this._merchantService.getPlatform(param).subscribe((response) => {
        this.domesticPlatform = response['domestic'] == 1 ? true : false;
        this.globalPlatform   = response['international'] == 1 ? true : false;
      });
    }

    //get country list
    this._merchantService.getCountryList().subscribe((res) => {
      this.countriesList = res['data'];
    });

    //get group list
    const params = "groupId=&groupName=&countryIds=&isActive=1&createdDate=&updatedDate=&sortKey=isActiveKey&sortValue=ASC&limit=100&offset=0";
    this._merchantService.getGroups(params).subscribe((res) => {
      this.groupsList = res['data'];
    });

    //get domestic country
    this._merchantService.getDomesticCountry().subscribe((res) => {
      this.domesticCountry = res['country'] || '';
    });

    //get schemeList
    this._merchantService.getSchemes().subscribe((res) => {
      this.schemeList = res['data'];
    });

    //Forms
    this.deliverAndFeeSchemeFormGlobal = this._fb.group({
      groupsAndCountries: this._fb.array([])
    });

    this.deliverAndFeeSchemeFormDomestic = this._fb.group({
      groupsAndCountries: this._fb.array([])
    });

    this.productRevenueFormGlobal = this._fb.group({
      products:this._fb.array([])
    });

    this.productRevenueFormDomestic = this._fb.group({
      products:this._fb.array([])
    });

  }

  /**
   ** Add GroupOrCountries For Delivery , Fee , Scheme
   **/

  addGroupAndCountriesForFeeScheme(formGroup , type){
    const arr = _.concat(this.selectedGroups , this.selectedCountries);
    let control = <FormArray>formGroup.controls['groupsAndCountries'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }

    arr.forEach((value) => {
      const addrCtrl = this._fb.group({
        name: [ (value['countryGroupName'] || value['countryName'] || value['type'])],
        domestic:[this.domesticPlatform],
        global:[this.globalPlatform],
        isDisabled:[(value['isDisabled'] || false)],
        isBaseCountry:[(value['isBaseCountry'] || false)],
        countryId:[(value['countryId'])|| ''],
        countryGroupId:[(value['countryGroupId']) || ''],
        countryGroups:[(value['groupCountryId']) || ''],
        containsInAnyGroup:[{contains:false,groupName:'',groupIndex:''}],
        rid:[(value['rid']) || ''],
        selectionType:[(value['selectionType']) || ''],
        schemeIds:[(value['schemeIds']) || ''],
        schemeList:[this.schemeList || []],
        pickupInfo:[_.isArray(value['pickupInfo']) ? value['pickupInfo'] : []],
        normal: new FormControl((value['normal'] == 1 ? true : false)),
        frozen: new FormControl((value['frozen'] == 1 ? true : false)),
        merchantDelivery:new FormControl((value['merchantDelivery'] == 1 ? true : false)),
        other:new FormControl((value['other'] == 1 ? true : false)),
        otherDetail: new FormControl({value:(value['otherDetail'] || ''),disabled:(value['other'] == 1 ? false : true)}, [Validators.required ,Validators.minLength(3)]),
        estimateSku: new FormControl((value['estimateSku'] || ''), [Validators.required, Validators.minLength(1)]),
        shippingFee:new FormControl((value['shippingFee'] || '0'), [Validators.required]),
        scheme: new FormControl((''), [Validators.required]),
        registrationFeeB2c: new FormControl({value:(value['registrationFeeB2c'] || ''),disabled:((!value['registrationFeeB2c'] || value['registrationFeeB2c'] == "0.00")  ? true : false)}, [Validators.required, Validators.minLength(1),Validators.pattern(/^\d*(?:[.,]\d{2})?$/)]),
        agreementPeriodB2c: new FormControl({value:(value['agreementPeriodB2c'] || ''),disabled:(!value['agreementPeriodB2c'] ? true : false)}, [Validators.required, Validators.minLength(1)]),
        registrationFeeB2b: new FormControl({value:(value['registrationFeeB2b'] || ''),disabled:((!value['registrationFeeB2b']  || value['registrationFeeB2b'] == "0.00") ? true : false)}, [Validators.required, Validators.minLength(1),Validators.pattern(/^\d*(?:[.,]\d{2})?$/)]),
        agreementPeriodB2b: new FormControl({value:(value['agreementPeriodB2b'] || ''),disabled:(!value['agreementPeriodB2b'] ? true : false)}, [Validators.required, Validators.minLength(1)]),
        transactionFeeB2b: new FormControl({value:(value['transactionFeeB2b'] || ''),disabled:((!value['transactionFeeB2b'] || value['transactionFeeB2b'] == "0.00")  ? true : false)}, [Validators.required, Validators.minLength(1),Validators.pattern(/^\d*(?:[.,]\d{2})?$/)]),
        transactionFeeB2c: new FormControl({value:(value['transactionFeeB2c'] || ''),disabled:((!value['transactionFeeB2c']  || value['transactionFeeB2c'] == "0.00") ? true : false)}, [Validators.required, Validators.minLength(1),Validators.pattern(/^\d*(?:[.,]\d{2})?$/)]),
        remarks: new FormControl((value['remarks'] || ''), [Validators.minLength(3)]),
        addresses:this._fb.array([]),
        isChanged: [false]
      });
      control.push(addrCtrl);
    });

  }

  /**
   ** Remove Group Or Countries
   **/
  removeGroupAndCountries(i: number,formGroup) {

      const modal = this
      .bsModalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.OK',
      'COMMON.BUTTONS.CANCEL'
    ); (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes delete certificate
        const control = <FormArray>formGroup.controls['groupsAndCountries'];

        //removing deleted object from groups and countries array
         const deletedItem = control.at(i).value;

        this._merchantService.deleteDeliverInfo(deletedItem['rid']).subscribe((res)=>{
            this.getDeliveryInfo(this.storeDetail['rid']).subscribe((response)=>{
              this.setGroupsAndCountries(response);
            });
        },(error) => {
           this.setError(error.message);
        });

        //delete value from Form Object
        control.removeAt(i);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   ** Add Product and Revenues
   **/
  addProductAndRevenue(formGroup , type){
    const arr = _.concat(this.selectedGroups , this.selectedCountries);
    let control = <FormArray>formGroup.controls['products'];
    for(let i = control.length-1; i >= 0; i--) {
      control.removeAt(i);
    }

    arr.forEach((value)=>{
      const addrCtrl = this._fb.group({
        name: [ (value['countryGroupName'] || value['countryName'] || value['type'])],
        domestic:[this.domesticPlatform],
        global:[this.globalPlatform],
        containsInAnyGroup:[{contains:false,groupName:'',groupIndex:''}],
        countryId:[(value['countryId'])|| ''],
        countryGroupId:[(value['countryGroupId']) || ''],
        countryGroups:[(value['groupCountryId']) || ''],
        rid:[(value['rid']) || ''],
        selectionType:[(value['selectionType']) || ''],
        primaryCat:new FormControl((value['primaryCategory'] || []), [Validators.required]),
        secondaryCat:new FormControl((value['secondaryCategory'] || [])),
        category:new FormControl((value['category'] || [])),
        productCountToSell:new FormControl((value['productCountToSell'] || '1'), [Validators.required]),
        isChanged: [false]
      });
      control.push(addrCtrl);
    });
  }

  /**
   * Move previous button
  **/
  public moveToPrevious() {
    this.buttonHandler.emit({
      type: 'PREVIOUS',
      step: this.clickedTab
    });
  }

  /**
   * Move to next tab
   */
  onNextClick(){
    this.buttonHandler.emit({
      type: 'SAVE_CONTINUE',
      step: this.clickedTab,
      mode: 'ADD_UPDATE'
    });
  }


  /**
   * on Sub Step Next Click
   */
  onSubStepNextClick(stepNo) {
    //if any platform are not selected
    if(!this.globalPlatform && !this.domesticPlatform){
      this.setError('SELECT_ONE_PLATFORM');
      return false;
     //if both platform is selected
    }else if(stepNo == 1 && this.globalPlatform && this.domesticPlatform){

        this.addUpdatePlatform().subscribe((msg) => {
          this.setSuccess(msg);
          this.getDeliveryInfo(this.storeDetail['rid']).subscribe((response)=>{
            this.setGroupsAndCountries(response);
            this.currentSubStep = 2;
          },(error) => {
            this.setGroupsAndCountries({country:[],group:[]});
            this.currentSubStep = 2;
          });
        },(error) => {
          this.setError(error.message);
        });

        //if global platform is selected
    }else if(stepNo == 1 && this.globalPlatform && !this.domesticPlatform){
        this.addUpdatePlatform().subscribe((msg) => {
          this.setSuccess(msg);
          this.getDeliveryInfo(this.storeDetail['rid']).subscribe((response)=>{
            this.setGroupsAndCountries(response);
            this.currentSubStep = 2;
          },(error) => {
            this.setGroupsAndCountries({country:[],group:[]});
            this.currentSubStep = 2;
          });
        },(error) => {
          this.setError(error.message);
        });
    //if domestic platform is selected
    }else if(stepNo == 1 && !this.globalPlatform && this.domesticPlatform){


        this.addUpdatePlatform().subscribe((msg) => {
          this.setSuccess(msg);

          this._merchantService.addUpdateCountryAndGroup({
            countryInfo: this.domesticCountry,
            groupInfo:''
          }, this.storeDetail['rid']).subscribe((res)=>{
            this.setSuccess(res['message']);

            this.getDeliveryInfo(this.storeDetail['rid']).subscribe((response)=>{
              this.setGroupsAndCountries(response);
              this.addGroupAndCountriesForFeeScheme(this.deliverAndFeeSchemeFormDomestic,'DOMESTIC');
              this.currentSubStep = 5;
            },(error) => {
              this.setGroupsAndCountries({country:[],group:[]});
              this.addGroupAndCountriesForFeeScheme(this.deliverAndFeeSchemeFormDomestic,'DOMESTIC');
              this.currentSubStep = 5;
            });

          },(error) => {
            this.setError(error.message);
          });

        },(error) => {
          this.setError(error.message);
        });





    //if group and countries are not selected
    }else if(stepNo == 2 && this.selectedGroups.length == 0 && this.selectedCountries.length == 0) {
        this.setError('SELECT_GROUP_COUNTRY');
        return false;
    } else if (stepNo == 2) {

        this.isDomesticCountryAdded();
        this._merchantService.addUpdateCountryAndGroup({
          countryInfo: _.map(this.selectedCountries, "countryCode").join(","),
          groupInfo:_.map(this.selectedGroups, "groupId").join(",")
        }, this.storeDetail['rid']).subscribe((res)=>{
          this.setSuccess(res['message']);

          this.getDeliveryInfo(this.storeDetail['rid']).subscribe((response)=>{
            this.setGroupsAndCountries(response);
            this.addGroupAndCountriesForFeeScheme(this.deliverAndFeeSchemeFormGlobal, 'GLOBAL');
            this.currentSubStep = 3;
          },(error) => {
            this.setGroupsAndCountries({country:[],group:[]});
            this.addGroupAndCountriesForFeeScheme(this.deliverAndFeeSchemeFormGlobal, 'GLOBAL');
            this.currentSubStep = 3;
          });
        },(error) => {
          this.setError(error.message);
        });

    } else if(stepNo == 3 && this.globalPlatform && !this.domesticPlatform){

      this.getDeliveryInfo(this.storeDetail['rid']).subscribe((response)=>{
        this.setGroupsAndCountries(response);
        this.addProductAndRevenue(this.productRevenueFormGlobal,'GLOBAL');
        this.currentSubStep = 4;
      },(error) => {
        this.setGroupsAndCountries({country:[],group:[]});
        this.addProductAndRevenue(this.productRevenueFormGlobal,'GLOBAL');
        this.currentSubStep = 4;
      });
        //if global and domestic both are selected
    }else if(stepNo == 3 && this.globalPlatform && this.domesticPlatform){
      this.getDeliveryInfo(this.storeDetail['rid']).subscribe((response)=>{
        this.setGroupsAndCountries(response);
        this.addProductAndRevenue(this.productRevenueFormGlobal,'GLOBAL');
        this.currentSubStep = 4;
      },(error) => {
        this.setGroupsAndCountries({country:[],group:[]});
        this.addProductAndRevenue(this.productRevenueFormGlobal,'GLOBAL');
        this.currentSubStep = 4;
      });
    }else if(stepNo == 5){
      this.getDeliveryInfo(this.storeDetail['rid']).subscribe((response)=>{
        this.setGroupsAndCountries(response);
        this.addProductAndRevenue(this.productRevenueFormDomestic,'DOMESTIC');
        this.currentSubStep = 6;
      },(error) => {
        this.setGroupsAndCountries({country:[],group:[]});
        this.addProductAndRevenue(this.productRevenueFormDomestic,'DOMESTIC');
        this.currentSubStep = 6;
      });

    }else if(stepNo == 4 && this.globalPlatform && !this.domesticPlatform){
        //this.setError('GLOBAL_PLATFORM_SUBMIT');
        this.onNextClick();
    }else if(stepNo == 4 && this.globalPlatform && this.domesticPlatform){
        //this.setError('GLOBAL_PLATFORM_SUBMIT');
        //this.addGroupAndCountriesForFeeScheme(this.deliverAndFeeSchemeFormDomestic,'DOMESTIC');
        //this.currentSubStep = 5;
        this.onNextClick();
    }else if(stepNo == 6  && !this.globalPlatform && this.domesticPlatform) {
        this.onNextClick();
        //this.setError('DOMESTIC_PLATFORM_SUBMIT');
    }else if(stepNo == 6  && this.globalPlatform && this.domesticPlatform) {
       // this.setError('DOMESTIC_GLOBAL_SUBMIT');
    }

  }

  /**
   * on Step Previous Click
   */
  onSubStepPrevClick(stepNo) {
    //if both platform is selected
    if (this.globalPlatform && this.domesticPlatform) {
      this.currentSubStep = stepNo - 1;
    } else if (this.globalPlatform && !this.domesticPlatform) {
      //if global platform
      this.currentSubStep = stepNo - 1;
    } else if (!this.globalPlatform && this.domesticPlatform) {
      //if domestic platform
      if(stepNo == 5){
        this.currentSubStep = 1;
      }else{
        this.currentSubStep = stepNo - 1;
      }
    }
  }

  /**
   * getCountry Labels in groups and countries section
   */
  getCountriesLabels(arr: Array<Object>) {
    return (_.chain(arr).map('countryName').join(',') || '');
  }

  /**
   * Save & Next Delivery Form
   */
  saveDeliveryFeeScheme(form: any,stepNo:number) {

    let controls = <FormArray>form.controls['groupsAndCountries'];
    if(form.valid){
      this.isFormSubmitted  = false;
      let isAddressAdded    = true;
      let isValueNotChanged = true;
      for(let i = 0; i < controls.length; i++) {
        const control = controls.at(i)['controls'];
        const sectionName = control['name'].value;

        if(control['addresses'].length == 0){
          this.translate.get('PLS_COMPLETE_ADDRESS_REQD',{name:sectionName}).subscribe((msg)=>{
            this.setError(msg);
          });
          isAddressAdded = false;
        }else if(control['isChanged'].value){
          this.translate.get('PLS_SAVE_FIELDS_TO_CONTINUE',{name:sectionName}).subscribe((msg)=>{
            this.setError(msg);
          });
          isValueNotChanged = false;
        }

        if(!isAddressAdded || !isValueNotChanged){
          return false;
        }
      }

      if(isAddressAdded && isValueNotChanged){
        this.onSubStepNextClick(stepNo);
      }

    }else{
      this.isFormSubmitted = true;
      let isError  = false;
      for(let i = 0; i < controls.length; i++) {
        const control = controls.at(i)['controls'];
        if(!controls.at(i).valid){
          const sectionName = control['name'].value;
          if(!control['normal'].value && !control['frozen'].value && !control['merchantDelivery'].value && !control['other'].value){
            this.translate.get('DELIVERY_MODE_REQUIRED',{name:sectionName}).subscribe((msg)=>{
              this.setError(msg);
            });
            isError = true;
          }else{
            this.translate.get('PLS_COMPLETE_REQD_FIELD',{name:sectionName}).subscribe((msg)=>{
              this.setError(msg);
            });
            isError = true;
          }

          if(isError){
            return false;
          }
        }
      }
    }
  }

  /**
   * Save & Next Product Revenue Form
   */
  saveProductRevenueScheme(form: any,stepNo:number) {
    if(form.valid){
      this.isFormSubmitted = false;
      let controls = <FormArray>form.controls['products'];
      let isValueNotChanged = true;
      for(let i = 0; i < controls.length; i++) {
        const control = controls.at(i)['controls'];
        if(controls.at(i).valid) {
          const sectionName = control['name'].value;
          if (control['isChanged'].value) {
            this.translate.get('PLS_SAVE_FIELDS_TO_CONTINUE', {name: sectionName}).subscribe((msg)=> {
              this.setError(msg);
            });
            isValueNotChanged = false;
            return false;
          }
        }
      }

      if(isValueNotChanged){
        this.onSubStepNextClick(stepNo);
      }

    }else{
      this.isFormSubmitted = true;
      let isError  = false;
      let controls = <FormArray>form.controls['products'];
      for(let i = 0; i < controls.length; i++) {
          const control = controls.at(i)['controls'];
          if(!controls.at(i).valid) {
            const sectionName = control['name'].value;
            this.translate.get('PLS_COMPLETE_REQD_FIELD', {name: sectionName}).subscribe((msg)=> {
              this.setError(msg);
            });
            return false;
          }
      }
    }
  }

  /**
   * Add /Update Platform
   **/

  addUpdatePlatform(): Observable<any>{
    const data = {
      domestic:this.domesticPlatform ? 1 : 0,
      international:this.globalPlatform ? 1 :0
    };
    return this._merchantService.addUpdatePlatfrom(this.storeDetail['rid'] ,data)
      .pipe(map((response)=> response['message']),catchError((error) =>  throwError(error)));
  }


  /**
   Get Country, Group and scheme fee details
  **/
  getDeliveryInfo(params): Observable<any>{
    return this._merchantService.getDelivery(params)
      .pipe(map((response)=> response),catchError((error) =>  throwError(error)));
  }

  /**
   * Set Country, Group from response
   **/
  setGroupsAndCountries(response){

    //selected countries
    const self = this;
    let selectedCountry = [];
    _.each(this.countriesList,function(v,k) {
      _.each(response['country'], function (v1, k1) {
        if (v['countryCode'] == v1['countryId']) {
          const obj = _.extend(
            v,
            v1,
            {
              selectionType:'COUNTRY',
              isDisabled : (self.globalPlatform && self.domesticPlatform && v['countryCode'] === self.domesticCountry) ? true : false,
              isBaseCountry : (v['countryCode'] === self.domesticCountry) ? true : false
            }
            );
          selectedCountry.push(obj);
        }
      });
    });

    this.selectedCountries = selectedCountry;

    //selected groups
    let selectedGroups = [];
    _.each(this.groupsList,function(v,k) {
      _.each(response['group'], function (v1, k1) {
        if (v['groupId'] == v1['countryGroupId']) {
          const obj = _.extend(v,v1,{selectionType:'GROUP'});
          selectedGroups.push(obj);
        }
      });
    });
    this.selectedGroups = selectedGroups;

    //when global platform is selected select its base country
      this.onGroupSelect(selectedGroups);
  }

  /**
   * on Group Change
   * @param groupArr - group Array
   */
  onGroupSelect(groupArr){
    // if(this.domesticPlatform && this.globalPlatform){
    //   return false;
    // }
    const self = this;
    let selectedCountries  = this.selectedCountries;
    this.selectedCountries = [];
    _.each(groupArr,function(v,k) {
      _.each(self.countriesList, function (v1, k1) {
        const groupCountry = _.map(v['countries'],'countryCode');
        if (_.indexOf(groupCountry,v1['countryCode']) != -1 && (v1['countryCode'] === self.domesticCountry)) {
          selectedCountries.push(_.extend(v1,{
            selectionType:'COUNTRY',
            isDisabled :  true,
            isBaseCountry : (v1['countryCode'] === self.domesticCountry) ? true : false
          }));
        }
      });
    });

    this.selectedCountries = _.uniqBy(selectedCountries, 'countryCode');
  }

  /**
   * on group remove
   * @param data - removed data
   */
  onGroupRemove(data){
    if(this.domesticPlatform && this.globalPlatform){
      return false;
    }
    const self  = this;
    const groupCountry = _.map(data['value']['countries'],'countryCode');
    let disabledCountryCode = '';
    _.each(self.selectedCountries, function (v, k) {
      if (_.indexOf(groupCountry,v['countryCode']) != -1 && v['isBaseCountry']) {
        v['isDisabled'] = false;
        disabledCountryCode = v['countryCode'];
      }
    });

    _.remove(self.selectedCountries,function(item){
      return item['countryCode'] == disabledCountryCode;
    })
  }


  decimalWithPrecision(control: FormControl) {
    let value = control.value;
    if (value && value.match(/^\d+(\.\d{1,2})?$/)) {
        return {
          decimalWithPrecision: {
            precision: false
          }
        }
    }
    return null;
  }


  /***
   * Check Group is Valid
   * @param formGroup
   * @param group
   * @returns {boolean}
   */
  checkGroupIsValid(formGroup ,group){
      const index    = group.controls.containsInAnyGroup['value']['groupIndex'];
      const contains = group.controls.containsInAnyGroup['value']['contains'];
      if(contains){
        const form     = formGroup.controls[index];
        const controls = formGroup.controls[index].controls;
        return form.valid && !controls['isChanged'].value  ? false : true;
      }
      return false;
  }

  /**
   * Check is Domestic country Added
   */
  isDomesticCountryAdded(){
    const self = this;
    _.each(self.selectedCountries, function (v, k) {
      if (v['isDisabled']) {
        self.domesticPlatform = true;
        self.addUpdatePlatform().subscribe((msg) => {
          self.setSuccess(msg);
        },(error) => {
          self.setError(error.message);
        });
        return;
      }
    });
  }


}
