import { Router } from '@angular/router';
import { BaseComponent } from './../../../base.component';
import { MerchantService } from './../../../../services/merchant.service';
import { CompanyinfoModel } from './../../../../models/add-merchant/companyInfo.model';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Component({
  selector: 'app-company-info',
  templateUrl: './companyInfo.component.html',
  styleUrls: ['./companyInfo.component.scss']
})

export class CompanyinfoComponent extends BaseComponent implements OnInit {
  @Output() buttonHandler = new EventEmitter<Object>();
  @Input() clickedTab;
  @Input() storeDetail;
  @Input() isDetailSection = false;
  @ViewChild('companyInfoForm') companyInfoForm: ElementRef;

  public companyInfo: CompanyinfoModel;
  public countryList;
  public stateList;
  public cityList;
  public categoryList;
  public annualTurnOver: Array<Object> = [
    { id: 0, value: 'Select Annual Turnover' },
    { id: 1, value: 'Less than 100K' },
    { id: 2, value: 'Between 100K to 1 Million' },
    { id: 3, value: 'Between 1 Million to 10 Millions' },
    { id: 4, value: 'More than 10 Millions' },
    { id: 5, value: 'Don’t know' }
  ];

  constructor(_router: Router, private _merchantService: MerchantService, protected _location: Location) {
    super(_router, _location);
    this.companyInfo = new CompanyinfoModel();
  }
  ngOnInit() {
    const self = this;
    this._merchantService.getCountryList().subscribe((res) => {
      this.countryList = res['data'];
        // get detail of Company info
        if (this.storeDetail['rid']) {
          this._merchantService
            .getCompanyInfo(this.storeDetail['rid'])
            .subscribe((response) => {
              _.extend(this.companyInfo, response);
              const countryId = response['countryId'] || this.countryList[0]['countryId'];
              this.generateStateList(countryId).subscribe((stateList) => {
                const stateId = response['state'] || stateList[0]['state'];
                this.stateList = stateList;
                this.generateCityList(stateId).subscribe((cityList) => {
                  this.cityList = cityList;
                });
              });

              // assign cat values to model object
              const parentCatArr = [];
              _.each((response['parentCategories']), function (v, k) {
                const obj = _.find(self.categoryList, { 'entityId': Number(v) });
                if (obj) {
                  parentCatArr.push(obj);
                }
              });
              response['parentCategories'] = parentCatArr;
              _.extend(
                this.companyInfo,
                response
              );
            },(error) => {
              // this.setError(error.message);
            });
        }
      });
  }

  //Function to handle change of dropdown
  public onChangeDropDown(event, msg: string) {
    if (msg === 'country') {
      this._merchantService.getStateList(event).subscribe((res) => {
        console.log(res);
        this.stateList = res['data'];
        this.cityList = [];
      });
    } else if (msg === 'state') {
      this._merchantService.getCityList(event).subscribe((res) => {
        this.cityList = res['data'];
      });
    }
  }

  public sellOtherWebsiteOnChange(event) {
    if (event === '0') {
      this.companyInfo.otherWebsiteUrl = '';
    }
  }

  /*
  Save and Next  button functionality
  **/
  public onNextClick() {
    if (this.companyInfo.validate('companyInfoForm')) {
      // extracting first/last name from contactPerson field
      const storeName = this.companyInfo.storeName.match(/\S+/g) || [];
      let firstName, lastName = '';
      if (storeName.length > 0) {
        firstName = storeName.shift();
        lastName = storeName.join(' ') || '';
      }
      const companyInfoData = _.extend({}, this.companyInfo, {
        firstname: firstName,
        lastname: lastName
      });

      if (this.storeDetail['rid']) { // UPDATE DATA
        this._merchantService
          .updateCompanyInfo(this.storeDetail['rid'], companyInfoData)
          .subscribe((response) => {
            this.onAddUpdateHandler(response , 'UPDATE');
          },(error) => {
            this.setError(error.message);
          });
      } else {// ADD DATA
        this._merchantService
          .addCompanyInfo(companyInfoData)
          .subscribe((response) => {
            this.onAddUpdateHandler(response, 'ADD');
          },(error) => {
            this.setError(error.message);
          });
      }
    }
  }
  /**
   * Add / update response handler
   */
  onAddUpdateHandler(response, mode) {
    this.setSuccess(response['message']);
    this.companyInfoForm.nativeElement.reset();
    setTimeout(() => {
      this.buttonHandler.emit({
        type: 'SAVE_CONTINUE',
        step: this.clickedTab,
        data: {rid: response['rid'], storeId: response['storeId']},
        mode: mode
      });
    }, 500);
  }

  /**
   * Generate State List
   * @param counrtyId
   */
  public generateStateList(counrtyId?: string): Observable<any> {
    return this._merchantService.getStateList(counrtyId)
      .pipe(map((res)=>  res['data']),catchError((error) =>  throwError(error)));
  }
  /**
   * Generate City List
   * @param stateId
   */
  public generateCityList(stateId?: string): Observable<any> {
    return this._merchantService.getCityList(stateId)
  .pipe(map((res)=>  res['data']),catchError((error) =>  throwError(error)));
  }
}
