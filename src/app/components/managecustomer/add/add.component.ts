import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { CustomerService } from '../../../services/customer.service';

import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { Location } from '@angular/common';

import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { CustomerFormModel } from '../../../models/customer/customer.model';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";

import {filter,map,mergeMap} from 'rxjs/operators';
import { UserIdentityService } from '../../../services/user_identity.service';

import { CUSTOMER_PLATFORM_OPTION,CURRENCY_STATUS_OPTION, CUSTOMER_SIGNUP_METHOD,VALID_EXTENSIONS } from '../../../modules';

@Component({
  selector: 'app-customer-info',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddComponent extends BaseComponent implements OnInit {
  @Output() buttonHandler = new EventEmitter<Object>();
  @Input() clickedTab;
  @Input() storeDetail;
  @Input() isDetailSection = false;
  @ViewChild('customerForm') customerForm: ElementRef;

  public customer: CustomerFormModel;
  public permissions: Array<string> = [];
  public customerToken: string;
  public platforms : any = CUSTOMER_PLATFORM_OPTION;
  public signupMethods : any = CUSTOMER_SIGNUP_METHOD;
  public defaultValue : any;
  public STATUS_OPTIONS: any;
  public pageInfo;
  public defaultFont: any;
  public validExtensions = VALID_EXTENSIONS.FILE;
  public isEditSection : boolean = false;
  
 
  constructor(_router: Router, private customerService: CustomerService, protected _location: Location,private modalService: BsModalService, public _activatedRoute: ActivatedRoute,private translate:TranslateService,private titleService:Title) {
    super(_router, _location);
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        ,map(() => this._activatedRoute)
        ,map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        ,filter(route => route.outlet === 'primary')
        ,mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title)=>{
          this.titleService.setTitle(title);
        });
        this.pageInfo = event;
      });
    this.customer = new CustomerFormModel();
    this.customerToken = this._activatedRoute.snapshot.params.id;
    this.STATUS_OPTIONS = CURRENCY_STATUS_OPTION;
    this.customer.isActive = 1;
    if (this.customerToken) {
      this.isEditSection = true;
      this.getDetail();
    }
  }
  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.defaultFont = {'label':'Please select'};
    this.customer.signUpPlatform = 1;
    this.customer.signUpMethod = 1;
    this.customer.isActive = 1;
    this.customerForm.nativeElement.reset();
    if (UserIdentityService.getProfile()) {
      let profile =  UserIdentityService.getProfile();
      if(profile.firstname){
        this.customer.createdByName = profile.firstname;
      }
      if(profile.lastname){
        this.customer.createdByName = profile.firstname +" "+profile.lastname;
      }
      
    }
  }

  ngAfterViewInit() { }

  getDetail() {
    this.customerService.view(this.customerToken).subscribe((response) => {
      this.customer = response;
    },(error) => {
      this.setError(error.message);
    });
  }


  action() {
    if (this.customerToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.customer.validate('customerForm')) {
        try {
          this
            .customerService
            .add(this.customer)
            .subscribe((response) => {
              this.setSuccess(response.message);
              this.navigateByUrl('customer/view');
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public update() {
    try {
      if (this.customer.validate('customerForm')) {
        try {
          this
            .customerService
            .update(this.customerToken, this.customer)
            .subscribe((response) => {
             // this.customerForm.nativeElement.reset();
              this.setSuccess('CUSTOMER_UPDATED_SUCCESSFULLY');
              this.back();
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public cancelButtonAction() {
    try {
      const modal = this.modalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.CANCEL',
        'COMMON.MODALS.CHANGES_NOT_SAVED',
        'COMMON.BUTTONS.OK',
        'COMMON.BUTTONS.CANCEL'
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          // this._router.navigate(['/customer/view']);
          this.back();
        } else if (result === false) {
          // when pressed No
        } else {
          // When closing the modal without no or yes
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /*
   *Delete functionality
 */
  public onDelete() {
    this.showConfirmationDeleteModal(this.customerToken);
  }

  /**
   * confirm modal delete
  **/
  showConfirmationDeleteModal(item): void {
    const modal = this.modalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO'
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes
        this.delete(item);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete by id
   */
  delete(id): void {
    try {
      this.customerService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('CUSTOMER_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }


  /* file upload */
   /**
   *  after file upload response
   */
  onSelect(event, imageFiledName) {
    this.customer.upload = event.files[0].objectURL;
    this.customer.kycDocumentName = event.files[0].name;
  }

  /**
   *  custom file upload 
   */
  onFileUpload(fileData, imageFiledName) {
    const file = fileData.files[0];
    const fileSize = file.size / 1024 / 1024;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', "1");
    formData.append('tmp', "1");
    let obj: any = {};
    try {
      this.customerService.uploadFiles(formData).subscribe((res: any) => {
        this.customer.upload = res.location;
      },(error) => {
        this.setError(error.message);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * file upload error 
   */

  onError(event) {
    console.log('ev', event);
  }

  /**
   * file remove from server  
   */
  onRemove() {
    const modal = this.modalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO'
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        let fileName:string = "";
        if(this.customer.kycDocument){
          fileName = this.customer.kycDocument;         
        }else{
          fileName = this.customer.upload;  
        }      
        //when pressed Yes
        let params: Object = { fileName : fileName,rid: this.customerToken , uploadType :1}
        try {
          this.customerService.deleteFiles(params).subscribe((res: any) => {
            this.setSuccess(res.message);
            this.customer.kycDocument = "";
            this.customer.upload = "";
          },(error) => {
            this.setError(error.message);
          });
        } catch (error) {
          console.log(error);
        }

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });


  }

  /**
   * resetPassword
   */
  public resetPassword() {
    try {
      this.customerService
        .resetPassword(this.customerToken)
        .subscribe((response) => {
          this.setSuccess(response.message);
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

}
