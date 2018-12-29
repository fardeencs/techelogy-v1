import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute , NavigationEnd} from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { CurrencyFormModel } from '../../../models/currency/currency.model';
import { CURRENCY_STATUS_OPTION } from '../../../modules';
import { CurrencyService } from '../../../services/currency.service';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";

import {filter,map,mergeMap} from 'rxjs/operators';

@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.css'] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public currency: any;
  public STATUS_OPTIONS: any;
  public currencyToken: string;
  public permissions: Array<string> = [];
  public isCodeEnable=false;
  public currencyCode:any = [];
  public defaultFont: any;
  public pageInfo;

  @ViewChild('currencyForm') currencyForm: ElementRef;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService, protected _location: Location, private _currencyService: CurrencyService,private translate:TranslateService,private titleService:Title) {
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
    this.currency = new CurrencyFormModel();
    this.currencyToken = this._activatedRoute.snapshot.params.id;
    this.STATUS_OPTIONS = CURRENCY_STATUS_OPTION;
    this.currency.isActive = 1;
    if (this.currencyToken) {
      this.getDetail();
    }
  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.defaultFont = {'label':'Please select'};
    this.currencyCode = Object.assign(this.defaultFont.label);//added temp object in an array for please select
    this.getCurrencyCode();
    this.currencyForm.nativeElement.reset();
  }

  ngAfterViewInit() { }

  getDetail() {
    this._currencyService.view(this.currencyToken).subscribe((response) => {
      this.currency = response;
      if(typeof this.currency.rid == 'undefined'){
        this.isCodeEnable=false;
      }else{
        this.isCodeEnable=true;
      }
    },(error) => {
        this.setError(error.message);
      });
  }


  getCurrencyCode() {
    this._currencyService.getCode().subscribe((response:any) => {
      this.currencyCode = response.data;
    },(error) => {
        this.setError(error.message);
      });
  }

  action() {
    if (this.currencyToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.currency.validate('currencyForm')) {
        try {
          this
            ._currencyService
            .add(this.currency)
            .subscribe((response) => {
             // this.currencyForm.nativeElement.reset();
              this.setSuccess(response.message);
              this.navigateByUrl('currency/view');
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
      if (this.currency.validate('currencyForm')) {
        try {
          this
            ._currencyService
            .update(this.currencyToken, this.currency)
            .subscribe((response) => {
             // this.currencyForm.nativeElement.reset();
              this.setSuccess('CURRENCY_UPDATED_SUCCESSFULLY');
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
          // this._router.navigate(['/currency/view']);
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
    this.showConfirmationDeleteModal(this.currencyToken);
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
      this._currencyService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('CURRENCY_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
