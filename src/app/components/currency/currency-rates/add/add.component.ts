import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { CurrencyFormModel } from '../../../../models/currency/currency.model';
import { CURRENCY_STATUS_OPTION, REG_EXP_VALUES } from '../../../../modules';
import { CurrencyRatesService } from '../../../../services/currency-rates.service';
import { TranslateService } from "@ngx-translate/core";
import { Title } from "@angular/platform-browser";
import { filter, map, mergeMap } from 'rxjs/operators';
import { NgForm, FormGroup , FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CurrencyRatesFormModel } from '../../../../models/currency-rates/currency-rates.model';



function validateDecimal(c: FormControl) {
  let DECIMAL_REGEXP = new RegExp(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/);
  if(c.value){
    if (DECIMAL_REGEXP.test(c.value)) {
      return DECIMAL_REGEXP.test(c.value) ? null : {
        validateDecimal: {
          valid: false
        }
      };
    } else {
      if(c.value.length > 0 && c.value.match(/[a-zA-Z _@/#&$%!.{}()?:;|-]+$/)){
        return {
          alphabet: true
        }
      }else{
        return DECIMAL_REGEXP.test(c.value) ? null : {
          validateDecimal: {
            valid: false
          }
        };
      }
    }
  }
}

@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.css'] })
export class CurrencyRatesComponent extends BaseComponent implements OnInit,
  AfterViewInit {
  public currencyRates: any;
  public originalData: any;
  public STATUS_OPTIONS: any;
  public REG_EXP_VALUES = REG_EXP_VALUES;
  public permissions: Array<string> = [];
  public pageInfo;
  public baseCurrency;
  public currency = new CurrencyRatesFormModel();
  public currencyRatesForm : FormGroup;
  items: FormArray;
  public regex = new RegExp(/^[0-9]\d{0,9}(\.\d{1,2})?%?$/)
  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService, protected _location: Location, private _currencyRatesService: CurrencyRatesService, private translate: TranslateService, private titleService: Title, protected changeDetectorRef: ChangeDetectorRef, private formBuilder: FormBuilder) {
    super(_router, _location);
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        , map(() => this._activatedRoute)
        , map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        , filter(route => route.outlet === 'primary')
        , mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title) => {
          this.titleService.setTitle(title);
        });
        this.pageInfo = event;
      });
      this.currencyRates = new CurrencyFormModel();
  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.get();
    this.currencyRatesForm = new FormGroup({
      rates: this.formBuilder.array([])
    })
  }

  ngAfterViewInit() { }


  /**
   * Import currency from external API
   */

  public import() {
    this
      ._currencyRatesService
      .import()
      .subscribe((response) => {
        const arr = <FormArray>this.currencyRatesForm.controls.rates;
        arr.controls = [];
        this.currencyRates = response;
        for(let c of this.currencyRates.rates){
          this.items = this.currencyRatesForm.get('rates') as FormArray;
          this.items.push(this.formBuilder.group({
            rate: [c.rate,[Validators.required,Validators.minLength(1),Validators.maxLength(10),Validators.pattern(this.regex),validateDecimal]],
            currency : [c.currency]
          }));
        }
      }, (error) => {
        this.setError(error.message);
      });
  }

  /**
   * get currencies list from API
   */

  public get() {
    this
      ._currencyRatesService
      .getCurrencyRates()
      .subscribe((response) => {
        this.currencyRates = response;
        const arr = <FormArray>this.currencyRatesForm.controls.rates;
        arr.controls = [];
        for(let c of this.currencyRates.rates){
          this.items = this.currencyRatesForm.get('rates') as FormArray;
          this.items.push(this.formBuilder.group({
            rate: [c.rate,[Validators.required,Validators.minLength(1),Validators.maxLength(10),Validators.pattern(this.regex),validateDecimal]],
            currency : [c.currency]
          }));
        }
        this.originalData = JSON.parse(JSON.stringify(response)); //for deep copy of array for reset values
      }, (error) => {
        this.setError(error.message);
      });
  }

  /**
   * reset currencies list to default
  */

  public reset() {
    const arr = <FormArray>this.currencyRatesForm.controls.rates;
    arr.controls = [];
    for(let c of this.originalData.rates){
      this.items = this.currencyRatesForm.get('rates') as FormArray;
      this.items.push(this.formBuilder.group({
        rate: [c.rate,[Validators.required,Validators.minLength(1),Validators.maxLength(10),Validators.pattern(this.regex),validateDecimal]],
        currency : [c.currency]
      }));
    }
  }


  /**
   * add currencies 
  */
  public add() {
    if (this.currencyRatesForm.invalid) {
      return;
    }
    try {
      let rates = this.rates();
      this
        ._currencyRatesService
        .add(rates)
        .subscribe((response) => {
          this.setSuccess(response.message);
         this.setAsDefault(rates);
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }


  public rates() {
    this.currencyRates.rates = [];
    let rates = this.currencyRatesForm.get('rates') as FormArray;
    this.currencyRates.rates = rates.value;
    return this.currencyRates;
  }

  public setAsDefault(data:any){
    this.originalData = JSON.parse(JSON.stringify(data)); //for deep copy of array for reset values
  }

  // For preventing error in formArray
  get formData() { return <FormArray>this.currencyRatesForm.get('rates'); }

}
