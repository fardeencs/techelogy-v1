import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../../base.component';
import { MerchantApprovalListModel } from '../../../../models/approval/merchant.approval.model';
import { Location } from '@angular/common';
import { CommentService } from '../../../../services/comment';
import { ApprovalCommentModel } from '../../../../models/approval/approval.comment';
import { MerchantApprovalService } from '../../../../services/merchant_approval';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class MerchantViewComponent extends BaseComponent implements OnInit {
  public approvalRequestToken: string;
  public approvalRequestDetail: MerchantApprovalListModel;
  public comments: ApprovalCommentModel[];
  public pageInfo;
  constructor(
    protected _router: Router,
    public activeRoute: ActivatedRoute,
    private _approvalServices: MerchantApprovalService,
    private _commentServices: CommentService,
    protected _location: Location,
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

    this.approvalRequestDetail = new MerchantApprovalListModel();
    this.approvalRequestToken = this.activeRoute.snapshot.params.id;
    this.comments = [];
  }

  ngOnInit() {
    this.getDetail();
  }

  getDetail() {
    try {
      this._approvalServices.view(this.approvalRequestToken).subscribe((response) => {
        this.approvalRequestDetail = response;
        this.getCommentsList();
      },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  getCommentsList() {
    try {
      this._commentServices.list(this.approvalRequestDetail.storeId).subscribe((response) => {
        this.comments = response.data;
      },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  onEdit() {
    this.navigateByUrl('/approval/merchant/edit/' + this.approvalRequestToken);
  }
}
