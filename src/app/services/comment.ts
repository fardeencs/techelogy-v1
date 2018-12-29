import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { isArray } from 'util';
import { PaginationModel } from '../models/pagination.model';
import { ApprovalCommentModel } from '../models/approval/approval.comment';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CommentService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * Comment List
   */
  list(storeId: string): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.APPROVAL.COMMENT.LIST + '/' + storeId, Constant.MODULE_ACTIONS.APPROVAL.MERCHANT)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(ApprovalCommentModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return ApprovalCommentModel.toResponseModel(response);
    }
  }
}
