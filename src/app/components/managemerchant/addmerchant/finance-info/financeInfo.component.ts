import { TranslateService } from '@ngx-translate/core';
import { FinanceinfoModel } from './../../../../models/add-merchant/financeInfo.model';
import {Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {BaseComponent} from '../../../base.component';
import {Router} from '@angular/router';
import {MerchantService} from '../../../../services/merchant.service';
import * as _ from 'lodash';
import { Location } from '@angular/common';

@Component({
  selector: 'app-finance-info',
  templateUrl: './financeInfo.component.html',
  styleUrls: ['./financeInfo.component.scss']
})

export class FinanceinfoComponent extends BaseComponent implements OnInit {
  financeInfo: FinanceinfoModel;
  @Output() buttonHandler = new EventEmitter<Object>();
  @Input()  clickedTab;
  @Input()  storeDetail;
  @Input() isDetailSection = false;
  @ViewChild('financeInfoForm') financeInfoForm: ElementRef;

  constructor(_router: Router, private _merchantService: MerchantService, protected _location: Location,
    private translate: TranslateService) {
    super(_router, _location);
    this.financeInfo = new FinanceinfoModel();
  }

  ngOnInit() {

    // get detail of merchant finance
    if (this.storeDetail['rid']) {

      this._merchantService
        .getMerchantFinancialInfo(this.storeDetail['rid'])
        .subscribe((response) => {
          // assign response values to model object
          _.extend(
            this.financeInfo,
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
    if (this.financeInfo.validate('financeInfoForm')) {
      // assign store Id to model object
      _.extend(this.financeInfo , {
        storeId: this.storeDetail['storeId']
      });

      this._merchantService
        .addUpdateMerchantFinancialInfo(this.storeDetail['rid'], this.financeInfo)
        .subscribe((response) => {
          this.setSuccess(response['message']);
          this.financeInfoForm.nativeElement.reset();
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
