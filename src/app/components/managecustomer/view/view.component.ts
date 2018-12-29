import {
  Component,
  OnInit,
  AfterViewInit,
  NgModule,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute,NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { RoleFormModel } from '../../../models/form/role.model';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { CustomerFormModel } from '../../../models/customer/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { CUSTOMER_PLATFORM_OPTION_VALUE,CUSTOMER_SIGNUP_METHOD_VALUE, CUSTOMER_SIGNUP_METHOD_CONSTANTS, CUSTOMER_SIGNUP_PLATFORM_CONSTANTS } from '../../../modules';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';


@Component({ templateUrl: './view.component.html', styleUrls: ['./view.component.css'] })
export class ViewComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public customer: any;
  public STATUS_OPTIONS: any;
  public customerToken: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService, protected _location: Location, private customerService: CustomerService,private translate:TranslateService,private titleService:Title) {
    super(_router, _location);
    this.customer = new CustomerFormModel();
    this.customerToken = this._activatedRoute.snapshot.params.id;
    if (this.customerToken) {
      this.getDetail();
    }
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
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  getDetail() {
    this
      .customerService
      .view(this.customerToken)
      .subscribe((response) => {
        this.customer = response;
        this.customer.signUpPlatform = this.getPlatformName(this.customer.signUpPlatform);
        this.customer.signUpMethod = this.getSignUpMethodName(this.customer.signUpMethod);
      },(error) => {
        this.setError(error.message);
      });
  }

  onEdit(item) {
    this.navigateByUrl('/customer/edit/' + this.customerToken);
  }

  /**
   * delete by id
  **/
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

   /**
   * Reset password
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

  /**
   * Get Sign up Method name
   */

  private getSignUpMethodName(value){
    let methodName = "";
    if(value == CUSTOMER_SIGNUP_METHOD_CONSTANTS.CUSTOMER_SIGNUP_METHOD_VALUE_NORMAL){
      methodName = CUSTOMER_SIGNUP_METHOD_VALUE.CUSTOMER_SIGNUP_NORMAL;
    }else if(value == CUSTOMER_SIGNUP_METHOD_CONSTANTS.CUSTOMER_SIGNUP_METHOD_VALUE_FACEBOOK){
      methodName = CUSTOMER_SIGNUP_METHOD_VALUE.CUSTOMER_SIGNUP_FACEBOOK;
    }else if(value ==  CUSTOMER_SIGNUP_METHOD_CONSTANTS.CUSTOMER_SIGNUP_METHOD_VALUE_GOOGLE){
      methodName = CUSTOMER_SIGNUP_METHOD_VALUE.CUSTOMER_SIGNUP_GOOGLE;
    }
    return methodName;
  }

  /**
   * Get Sign up platform name
   */
  private getPlatformName(value){
    let platform = "";
    if(value == CUSTOMER_SIGNUP_PLATFORM_CONSTANTS.CUSTOMER_PLATFORM_OPTION_VALUE_BACKEND){
      platform = CUSTOMER_PLATFORM_OPTION_VALUE.CUSTOMER_PLATFORM_BACKEND;
    }else if(value == CUSTOMER_SIGNUP_PLATFORM_CONSTANTS.CUSTOMER_PLATFORM_OPTION_VALUE_WEB){
      platform = CUSTOMER_PLATFORM_OPTION_VALUE.CUSTOMER_PLATFORM_WEB;
    }else if(value == CUSTOMER_SIGNUP_PLATFORM_CONSTANTS.CUSTOMER_PLATFORM_OPTION_VALUE_MOBILE){
      platform = CUSTOMER_PLATFORM_OPTION_VALUE.CUSTOMER_PLATFORM_MOBILE;
    }
    return platform;
  }

}
