import { TransferHttp } from '../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { TrainingVideosFormModel } from '../models/training-videos/training-videos.model';

@Injectable()
export class TrainingVideosService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New  training video
    */
  add(data: TrainingVideosFormModel): Observable<any> {
    const obj = TrainingVideosFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.TRAINING_VIDEOS.ADD, obj, Constant.MODULE_ACTIONS.TRAINING_VIDEOS.ADD);
  }

  /**
     *  training video List
     */
  list(params: string = ''): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.TRAINING_VIDEOS.LIST + '?' + params, Constant.MODULE_ACTIONS.TRAINING_VIDEOS.VIEW).pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete  training video
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.TRAINING_VIDEOS.DELETE}/` + id);
  }

  /**
   * Delete Mass  training video
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.TRAINING_VIDEOS.MASS_DELETE, obj, Constant.MODULE_ACTIONS.TRAINING_VIDEOS.DELETE);
  }

  /**
   * training video Detail
   */
  view(token: string = ''): Observable<TrainingVideosFormModel> {
     return this.makeHttpGet(Constant.REST_API.TRAINING_VIDEOS.VIEW + '/' + token, Constant.MODULE_ACTIONS.TRAINING_VIDEOS.VIEW)
     .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update  training video
*/
  update(params: string = '', data: TrainingVideosFormModel): Observable<RoleFormModel> {
    const obj = TrainingVideosFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.TRAINING_VIDEOS.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.TRAINING_VIDEOS.EDIT);
  }
  
/**
 *
 * @param response
 * @returns {any}
 */
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response
        .data
        .map(TrainingVideosFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return TrainingVideosFormModel.toResponseModel(response);
    }
  }
}
