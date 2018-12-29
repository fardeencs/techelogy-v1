import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { isArray } from 'util';
import { PaginationModel } from '../models/pagination.model';
import { OtherApprovalListModel } from '../models/approval/other.approval.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class OtherApprovalService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * Other Approval List
   */
  list(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.APPROVAL.OTHER.LIST + '?' + params, Constant.MODULE_ACTIONS.APPROVAL.MERCHANT)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Other Approval Detail
   */
  view(approvalRequestToken: string = ''): Observable<OtherApprovalListModel> {
    return this.makeHttpGet(Constant.REST_API.APPROVAL.OTHER.VIEW + '/' +
      approvalRequestToken, Constant.MODULE_ACTIONS.APPROVAL.MERCHANT)
      .pipe(map(this.mapResponse.bind(this)));
  }

  approve(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.APPROVAL.OTHER.APPROVE, obj, Constant.MODULE_ACTIONS.APPROVAL.OTHER);
  }

  reject(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.APPROVAL.OTHER.REJECT, obj, Constant.MODULE_ACTIONS.APPROVAL.OTHER);
  }

  /**
   *
   * @param response
   * @returns {any}
   */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(OtherApprovalListModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return OtherApprovalListModel.toResponseModel(response);
    }
  }
}
