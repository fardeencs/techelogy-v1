import { AuthsignatureModel } from './../../../../models/add-merchant/authSignature.model';
import { TranslateService } from '@ngx-translate/core';
import { MerchantService } from './../../../../services/merchant.service';
import { Router } from '@angular/router';
import { BaseComponent } from './../../../base.component';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { Location } from '@angular/common';

@Component({
  selector: 'app-authsignature',
  templateUrl: './authsignature.component.html',
  styleUrls: ['./authsignature.component.scss']
})

export class AuthorizedSignatureComponent extends BaseComponent  implements OnInit {
  authSignatureData: AuthsignatureModel;
  @Output() buttonHandler = new EventEmitter<Object>();
  @Input()  clickedTab;
  @Input()  storeDetail;
  @Input() isDetailSection = false;
  @ViewChild('authSignature') authSignature: ElementRef;
  public applicationSign = "";
  constructor(_router: Router,
    private _merchantService: MerchantService,
    protected _location: Location,
    private translate: TranslateService) {
    super(_router, _location);
    this.authSignatureData = new AuthsignatureModel();
  }
  ngOnInit() {
    let currentDate = new Date();
    this.authSignatureData.createdAt = String(currentDate.getDate()+ '-' + Number(currentDate.getMonth()+1) + '-' +currentDate.getFullYear());
    if (this.storeDetail['rid']) {
      // get Tax and Vat details
      this._merchantService.getAutSignatureDetails(this.storeDetail['rid']).subscribe((response) => {
        _.extend(this.authSignatureData, response);
        let currentDate = new Date(this.authSignatureData.createdAt);
        this.authSignatureData.createdAt = String(currentDate.getDate()+ '-' + Number(currentDate.getMonth()+1) + '-' +currentDate.getFullYear());
      });
    }
  }
  /*
  Save and Next  button functionality
  **/
  public onNextClick() {
    if((this.applicationSign == "" && this.authSignatureData.applicantSignature == "") || (this.applicationSign == "" && this.authSignatureData.applicantSignature == undefined)){
      this.setError('AUTHORIZED_SIGNATURE_IMAGE');
    }else if (this.authSignatureData.validate('authSignature')) {
      _.extend(this.authSignatureData, {
        storeId: this.storeDetail['storeId']
      });
      let  initDate = this.authSignatureData.createdAt.split("-");
      let postDate = initDate[2]+'-'+initDate[1]+'-'+initDate[0];
      this.authSignatureData.createdAt = postDate;
      //String(String(new Date(postDate).getFullYear())+'-'+String(new Date(postDate).getMonth())+'-'+String(new Date(postDate).getDate()));

      this._merchantService.addUpdateAuthorizedSignature(this.storeDetail['rid'], this.authSignatureData).subscribe((response) => {
        this.setSuccess(response['message']);
        this.authSignature.nativeElement.reset();
        setTimeout(() => {
          this.buttonHandler.emit({
          type: 'SUBMIT_FOR_REVIEW',
          step: this.clickedTab,
          mode: 'ADD_UPDATE'
          });
        }, 500);
      },(error) => {
        this.setError(error.message);
      });
    }
  }
  encodeImageFileAsURL(element) {
    const file = element.files[0];
    const reader = new FileReader();
    reader.onloadend = function() {
     // console.log('RESULT', reader.result);
    };
    reader.readAsDataURL(file);

  }
  /**
   * File upload event
   * @param e
   */
  fileEvent(event) {
    const e = (event.srcElement||event.target);
    this.applicationSign = e.files[0].name;
    if (e.files.length > 0) {
      const file = e.files[0];
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > this.MAX_LENGTH_CONFIG.MAX_FILE_SIZE) {
        e.value = null;
        this.authSignatureData.applicantSignature = "";
        this.applicationSign = "";
        this.setError('MAX_FILE_SIZE_EXCEED');
      } else if (!this.MAX_LENGTH_CONFIG.ALLOWED_SIGNATURE_EXTENSION.exec(file.name)) {
        e.value = null;
        this.authSignatureData.applicantSignature = "";
        this.applicationSign = "";
        this.setError('FILE_FORMAT_SIGNATURE_EXCEPTED');
      } else {
        this.readThis(event.target);
        const formData = new FormData();
        formData.append('file', file);

      }
    }
  }

  readThis(inputValue: any): void {
    const file:File = inputValue.files[0];
    const myReader:FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.authSignatureData.applicantSignature = myReader.result;
    };
    myReader.readAsDataURL(file);
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
