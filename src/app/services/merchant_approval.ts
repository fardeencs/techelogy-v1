import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { MerchantApprovalListModel } from '../models/approval/merchant.approval.model';
import { isArray } from 'util';
import { PaginationModel } from '../models/pagination.model';
import { ApprovalStatusFormModel } from '../models/form/approval_status.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class MerchantApprovalService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * Merchant Approval List
   */
  list(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.APPROVAL.MERCHANT.LIST + '?' + params, Constant.MODULE_ACTIONS.APPROVAL.MERCHANT)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Merchant Approval Detail
   */
  view(approvalRequestToken: string = ''): Observable<MerchantApprovalListModel> {
    return this.makeHttpGet(Constant.REST_API.APPROVAL.MERCHANT.VIEW + '/' +
    approvalRequestToken, Constant.MODULE_ACTIONS.APPROVAL.MERCHANT)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
   * Merchant Approval Status Update
   */
  update(data: ApprovalStatusFormModel, approvalRequestToken: string): Observable<any> {
    const obj = ApprovalStatusFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.APPROVAL.MERCHANT.UPDATE + '/'
    + approvalRequestToken, obj, Constant.MODULE_ACTIONS.APPROVAL.MERCHANT);
  }

  moduleLevelPermissions(moduleId: string = ''): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.MODULE_PERMISSIONS + '/' + moduleId, '');
  }

/**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(MerchantApprovalListModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return MerchantApprovalListModel.toResponseModel(response);
    }
  }
}
