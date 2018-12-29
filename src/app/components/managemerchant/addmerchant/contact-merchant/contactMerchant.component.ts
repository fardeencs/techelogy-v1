import { ContactmerchantModel } from './../../../../models/add-merchant/contactMerchant.model';
import { BaseComponent } from './../../../base.component';
import {Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import {MerchantService} from '../../../../services/merchant.service';
import { Location } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-contact-merchants',
  templateUrl: './contactMerchant.component.html',
  styleUrls: ['./contactMerchant.component.scss']
})

export class ContactmerchantComponent extends BaseComponent implements OnInit {
  public contactMerchant: ContactmerchantModel;
  @Output() buttonHandler = new EventEmitter<Object>();
  @Input()  clickedTab;
  @Input()  storeDetail;
  @Input() isDetailSection = false;
  @ViewChild('contactMerchantForm') contactMerchantForm: ElementRef;

  constructor(_route: Router, private _merchantService: MerchantService, protected _location: Location,
    private translate: TranslateService) {
    super(_route, _location);
    this.contactMerchant = new ContactmerchantModel();
   }

  ngOnInit() {

    // get detail of merchant contact
    if (this.storeDetail['rid']) {
      const param = this.storeDetail['rid'];
      this._merchantService
        .getMerchantContact(param)
        .subscribe((response) => {
          // assign response values to model object
          _.extend(
            this.contactMerchant,
            response
           );
        },(error) => {
        });
    }
  }

  /**
   * Save and continue button handler
   */
  public onNextClick() {
    if (this.contactMerchant.validate('contactMerchantForm')) {

      if (this.storeDetail['rid']) { // ADD/UPDATE DATA

        this._merchantService
          .addUpdateMerchantContact(this.storeDetail['rid'], this.contactMerchant)
          .subscribe((response) => {
            this.setSuccess(response['message']);
            this.contactMerchantForm.nativeElement.reset();
            setTimeout(() => {
              this.buttonHandler.emit({
                type: 'SAVE_CONTINUE',
                step: this.clickedTab,
                mode: 'ADD_UPDATE'
              });
            }, 500);
          },(error) => {
            this.setError(error.message);
          });
      }
    }
  }

  /*
   Move previous button
   */
  public moveToPrevious() {
    this.buttonHandler.emit({
      type: 'PREVIOUS',
      step: this.clickedTab
    });
  }
}
