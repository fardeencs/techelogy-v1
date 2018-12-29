import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { ContactFinanceModel } from './../../../../models/add-merchant/contactFinance.model';
import { Router } from '@angular/router';
import { BaseComponent } from './../../../base.component';
import {Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef} from '@angular/core';
import {MerchantService} from '../../../../services/merchant.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-contact-finance',
  templateUrl: './contactFinance.component.html',
  styleUrls: ['./contactFinance.component.scss']
})

export class ContactfinanceComponent extends BaseComponent implements OnInit {
  public contactFinance: ContactFinanceModel;
  @Output() buttonHandler = new EventEmitter<Object>();
  @Input()  clickedTab;
  @Input()  storeDetail;
  @Input() isDetailSection = false;
  @ViewChild('contactFinanceForm') contactFinanceForm: ElementRef;

  constructor(_router: Router, _location: Location,
    private _merchantService: MerchantService,
    private translate: TranslateService) {
    super(_router, _location);
    this.contactFinance = new ContactFinanceModel();
  }
  ngOnInit() {

    // get detail of merchant finance
    if (this.storeDetail['rid']) {

      this._merchantService
        .getMerchantFinanceContact(this.storeDetail['rid'])
        .subscribe((response) => {
          // assign response values to model object
          _.extend(
            this.contactFinance,
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
    if (this.contactFinance.validate('contactFinanceForm')) {

      // assign store Id to model object
      _.extend(this.contactFinance , {
        storeId: this.storeDetail['storeId']
      });
      this._merchantService
        .addUpdateMerchantFinanceContact(this.storeDetail['rid'], this.contactFinance)
        .subscribe((response) => {
          this.setSuccess(response['message']);
          this.contactFinanceForm.nativeElement.reset();
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
  /**
   * previous button handler
   */
   public moveToPrevious() {
     setTimeout(() => {
       this.buttonHandler.emit({
         type: 'PREVIOUS',
         step: this.clickedTab
       });
     }, 500);
  }

}
