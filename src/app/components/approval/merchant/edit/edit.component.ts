import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../../base.component';
import { Location } from '@angular/common';
import { ApprovalStatusFormModel } from '../../../../models/form/approval_status.model';
import { MANAGE_MERCHANT_STEPS, EDIT_APPROVAL_STATUS_ARRAY, EDIT_APPROVAL_STATUS_ARRAY_FORM } from '../../../../modules';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../../shared/dialog/confirm/confirm.component';
import { MerchantApprovalService } from '../../../../services/merchant_approval';
import { MerchantApprovalListModel } from '../../../../models/approval/merchant.approval.model';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({ templateUrl: './edit.component.html', styleUrls: ['./edit.component.css'] })
export class ApprovalEditComponent extends BaseComponent implements OnInit {
  public approval: ApprovalStatusFormModel;
  public approvalRequestDetail: MerchantApprovalListModel;
  private approvalRequestToken: string;
  public steps: any;
  public statuses: Array<Object>;
  public pageInfo;

  constructor(
    protected _router: Router,
    public activeRoute: ActivatedRoute,
    private _approvalServices: MerchantApprovalService,
    protected _location: Location,
    private _modalService: BsModalService,
    private titleService: Title,
    private translate: TranslateService) {
    super(_router, _location);
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        ,map(() => this.activeRoute)
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

    this.approvalRequestToken = this.activeRoute.snapshot.params.id;
    this.steps = MANAGE_MERCHANT_STEPS;
    this.statuses = EDIT_APPROVAL_STATUS_ARRAY_FORM;
    this.approval = new ApprovalStatusFormModel();
    this.approval.status = '0';
    this.approval.step = '1';
  }

  ngOnInit() {
    this.getDetail();
  }

  getDetail() {
    try {
      this._approvalServices.view(this.approvalRequestToken).subscribe((response) => {
        this.approvalRequestDetail = response;
        if (this.approvalRequestDetail.approvalStatus != 'New') {
          this.navigateByUrl('approval/merchant');
        }
      } , (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  updateApprovalStatus() {
    try {
      if (this.approval.validate('approvalStatusForm')) {
        this._approvalServices
          .update(this.approval, this.approvalRequestToken)
          .subscribe((response) => {
            this.setSuccess(response.message);
            this.navigateByUrl('approval/merchant');
          } ,(error) => {
            console.log(error);
            this.setError(error.message);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public cancelButtonAction() {
    try {
      const modal = this._modalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.CANCEL',
        'COMMON.MODALS.CHANGES_NOT_SAVED',
        'COMMON.BUTTONS.OK',
        'COMMON.BUTTONS.CANCEL'
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          // this._router.navigate(['/approval/merchant']);
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
}
