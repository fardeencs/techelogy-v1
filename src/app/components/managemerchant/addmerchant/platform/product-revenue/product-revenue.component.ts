import {Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray} from '@angular/forms';
import {BaseComponent} from "../../../../base.component";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {MerchantService} from "../../../../../services/merchant.service";
import * as _  from 'lodash';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {STATE_EVENT} from "../../../../../modules/constants";
import {GlobalState} from "../../../../../global.state";

@Component({
  selector: 'app-products-revenue',
  templateUrl: './product-revenue.component.html',
  encapsulation:ViewEncapsulation.None
})
export class ProductsRevenueComponent extends BaseComponent implements OnInit{
  @Input() group:FormGroup;
  @Input() storeDetail;
  @Input() isFormSubmitted:boolean = false;

  public primaryCategory:Array<Object> = [];
  public secondryCategoryList:Array<Object> = [];
  public categoryList:Array<Object> = [];
  public productCountToSell;
  public countryGroups;
  public parentSelectedCategory:Object = {
    primaryCat: [],
    secondaryCat:[],
    category: [],
  };

  public productCountSell: Array<Object> = [
    { id:1, value: '1 – 10' },
    { id:2, value: '11 – 100' },
    { id:3, value: '101 – 500' },
    { id:4, value: 'More than 500' },
    { id:5, value: 'Don’t know' }
  ];
  constructor(protected _router: Router,
              protected _location: Location,
              private _merchantService:MerchantService,
              private translate:TranslateService,
              private cdr: ChangeDetectorRef,
              private _globalState:GlobalState
  ){
    super(_router, _location);
  }

    ngOnInit() {

      //find child countries of a specific group
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

      //set product count to sell field
      if(this.group.value['productCountToSell'] !=""){
        this.group.patchValue({
         productCountToSell :this.group.value['productCountToSell']
        })
      }

      //get drop down list and set each field value
      this.getDropDownLists('ON_INIT');


      this.cdr.detectChanges();


      /**
       * Auto fill Domestic Country on Group save
       */
      this._globalState.subscribe(STATE_EVENT.AUTOFILL_DOMESTIC_COUNTRY_REVENUE,
        (res) => {

          const selectionType =  this.group.controls['selectionType'].value;
          const countryId     =  this.group.controls['countryId'].value;
          const childCountry  =  res['countryID'];
          if(selectionType == 'COUNTRY' && countryId == childCountry){
            const data  = JSON.parse(res['data']);
            this.group.patchValue({
              primaryCat:[],
              secondaryCat:[],
              category:[],
              productCountToSell: ''
            });

            this.group.patchValue({
              primaryCat: JSON.stringify(_.map(data['primaryCat'], "entityId")),
              secondaryCat:JSON.stringify(_.map(data['secondaryCat'], "entityId")),
              category:JSON.stringify(_.map(data['category'], "entityId")),
              productCountToSell: data['productCountToSell']
            });

            this.parentSelectedCategory = {
              primaryCat: _.map(data['primaryCat'],(item)=> item['disable'] = true),
              secondaryCat:_.map(data['secondaryCat'],(item)=> item['disable'] = true),
              category: _.map(data['category'],(item)=> item['disable'] = true)
            };
            setTimeout(()=>{
              this.getDropDownLists('AUTO_FILL');
              this.formValueChanged();
            },500);
          }
        });
    }

  /***
   * Primary Drop down Data Change
   */
    onPrimaryCategoryChange(list){
       if(list.length > 0){
         let groupOrCountry = (this.group.value['countryId'] == "") ? this.group.value['countryGroups'] : this.group.value['countryId'];
         this._merchantService.getSecondryCategory({catalogIds: _.map(list, "entityId").join(","),countryId: groupOrCountry}).subscribe((response)=>{
          this.secondryCategoryList = response['data'];

          //secondary category auto fill
          const selectedCatArr = this.group.controls['secondaryCat'].value;
          const newSecondCat   = [];
           _.each(this.secondryCategoryList,function(v,k){
             _.each(selectedCatArr,function(v1,k1){
               if(v['entityId'] == v1['entityId']){
                 (v1['disabled']) ? v['disabled'] = true : v['disabled'] = false;
                 newSecondCat.push(v);
               }
             });
           });

           this.group.patchValue({
             secondaryCat : newSecondCat
           });
           this.onSecondaryCategoryChange(newSecondCat);

        },(error)=>{
          this.setError(error.message);
        });
       }else{

         //reset dependent dropdowns
         this.secondryCategoryList = [];
         this.categoryList = [];
         this.group.patchValue({
           secondaryCat : [],
           category:[]
         });
       }

       this.formValueChanged();
    }

  /***
   * Secondary Dropdown Data Change
   */
    onSecondaryCategoryChange(list){
      if(list.length > 0) {
        let groupOrCountry = (this.group.value['countryId'] == "") ? this.group.value['countryGroups'] : this.group.value['countryId'];
        this._merchantService.getSecondryCategory({
          catalogIds: _.map(list, "entityId").join(","),
          countryId: groupOrCountry
        }).subscribe((response)=> {
          this.categoryList = response['data'];

          //category auto fill
          const selectedCatArr = this.group.controls['category'].value;
          const newCat   = [];
          _.each(this.categoryList,function(v,k){
            _.each(selectedCatArr,function(v1,k1){
              if(v['entityId'] == v1['entityId']){
                (v1['disabled']) ? v['disabled'] = true : v['disabled'] = false;
                newCat.push(v);
              }
            });
          });

          this.group.patchValue({
            category : newCat
          });



        },(error)=> {
          this.setError(error.message);
        });
      }else{
        //reset dependent dropdowns
        this.categoryList = [];
        this.group.patchValue({
          category:[]
        });
      }

      this.formValueChanged();
    }

  /***
   * Save Data
   */
  saveData(){
    this.isFormSubmitted = true;
    if(this.group.valid){
      this.isFormSubmitted = false;

      const obj = {
        countryId: this.group.controls['countryId'].value,
        countryGroupId: this.group.controls['countryGroupId'].value,
        primaryCategory: JSON.stringify(_.map(this.group.controls['primaryCat'].value, 'entityId')),
        secondaryCategory: JSON.stringify(_.map(this.group.controls['secondaryCat'].value, 'entityId')),
        category: JSON.stringify(_.map(this.group.controls['category'].value, 'entityId')),
        productCountToSell: this.group.controls['productCountToSell'].value,
      };
      this._merchantService.addUpdateRevenueInfo(obj, this.storeDetail['rid']).subscribe((response)=>{
        this.group.patchValue({
          isChanged: false
        });
        this.setSuccess(response.message);
        this.setChildCountries();
      },(error)=>{
        this.setError(error.message);
      })

    }else{
      const sectionName = this.group.controls['name'].value;
      this.translate.get('PLS_COMPLETE_REQD_FIELD',{name:sectionName}).subscribe((msg)=>{
        this.setError(msg);
      });
    }
  }


  /****
   * Set Child Countries Data
   */
  setChildCountries(){
    if(this.group.controls['selectionType'].value == "GROUP"){
      const self = this;
      const countryGroups = this.group.value['countryGroups'].split(",");
      const revenueList= this.group.parent.value;

      _.each( countryGroups, function(country,index){
        _.each(revenueList, function(v,i){
          if( v['countryId'] === country){
            const groupData = JSON.stringify(self.group.value);

            self._globalState.notifyDataChanged(
              STATE_EVENT.AUTOFILL_DOMESTIC_COUNTRY_REVENUE,
              {
                countryID:country,
                data:JSON.stringify(self.group.value)
              });
          }
        })
      });
    }
  }

  /****
   * Get Dropdown(s) data
   */
  getDropDownLists(calledOn:string){

    let groupOrCountry = (this.group.value['countryId'] == "") ? this.group.value['countryGroups'] : this.group.value['countryId'];
    this._merchantService.getPrimaryCategory(groupOrCountry).subscribe((response)=>{
      this.primaryCategory = response['data'];
      const savedPrimaryCat = this.group.value['primaryCat'] ? JSON.parse(this.group.value['primaryCat']) : [];
      let selectedPrimaryCat = [];
      _.each(this.primaryCategory,function(v,k) {
        _.each(savedPrimaryCat, function (item) {
          if (Number(v['entityId']) == Number(item)) {
            (calledOn == 'AUTO_FILL') ? v['disabled'] = true : v['disabled'] = false;
            selectedPrimaryCat.push(v);
          }
        });
      });

      this.group.patchValue({
        primaryCat : selectedPrimaryCat
      });

      if(this.group.value['secondaryCat'].length > 0){
        this._merchantService.getSecondryCategory({catalogIds: _.map(this.group.value['primaryCat'], 'entityId').join(",") ,countryId: groupOrCountry}).subscribe((response)=>{
          this.secondryCategoryList = response['data'];
          const savedSecondaryCat = this.group.value['secondaryCat'] ? JSON.parse(this.group.value['secondaryCat']) : [];
          let selectedSecondaryCat = [];

          _.each(this.secondryCategoryList,function(v,k) {
            _.each(savedSecondaryCat, function (item) {
              if (Number(v['entityId']) == Number(item)) {
                (calledOn == 'AUTO_FILL') ? v['disabled'] = true : v['disabled'] = false;
                selectedSecondaryCat.push(v);
              }
            });
          });

          if(this.group.value['category'].length > 0){
            if(selectedSecondaryCat.length > 0) {
              this._merchantService.getSecondryCategory({
                catalogIds: _.map(selectedSecondaryCat, 'entityId').join(","),
                countryId: groupOrCountry
              }).subscribe((response)=> {
                this.categoryList = response['data'];
                const catagory = this.group.value['category'] ? JSON.parse(this.group.value['category']) : [];
                let selectedCategory = [];
                _.each(this.categoryList, function (v, k) {
                  _.each(catagory, function (item) {
                    if (Number(v['entityId']) == Number(item)) {
                      (calledOn == 'AUTO_FILL') ? v['disabled'] = true : v['disabled'] = false;
                      selectedCategory.push(v);
                    }
                  });
                });
                this.group.patchValue({
                  category: selectedCategory
                });
              },(error)=> {
                this.setError(error.message);
              });
            }
          }
          this.group.patchValue({
            secondaryCat : selectedSecondaryCat
          });
        },(error)=>{
          this.setError(error.message);
        });
      }
    });

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
