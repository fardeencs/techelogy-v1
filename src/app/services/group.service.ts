import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { RoleFormModel } from '../models/form/role.model';
import { PaginationModel } from '../models/pagination.model';
import { isArray } from 'util';
import { CountryFormModel } from '../models/country/country.model';
import { GroupFormModel } from '../models/group/group.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class GroupService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
    * Add New Group
    */
  add(data: GroupFormModel): Observable<any> {
    const obj = GroupFormModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.COUNTRYGROUP.ADD, obj, Constant.MODULE_ACTIONS.COUNTRYGROUP.ADD);
  }

  /**
     * Group List
     */
  list(params: string = ''): Observable<PaginationModel> {
    return this
      .makeHttpGet(Constant.REST_API.COUNTRYGROUP.LIST + '?' + params, Constant.MODULE_ACTIONS.COUNTRYGROUP.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Delete Group
   */
  delete(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.COUNTRYGROUP.DELETE}/` + id);
  }

  /**
   * Delete Mass Group
   */
  massDelete(ids: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(Constant.REST_API.COUNTRYGROUP.MASS_DELETE, obj, Constant.MODULE_ACTIONS.COUNTRYGROUP.DELETE);
  }

  /**
   * Group Detail
   */
  view(token: string = ''): Observable<GroupFormModel> {
    return this
      .makeHttpGet(Constant.REST_API.COUNTRYGROUP.VIEW + '/' + token, Constant.MODULE_ACTIONS.COUNTRYGROUP.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

/**
* Update Group
*/
  update(params: string = '', data: GroupFormModel): Observable<RoleFormModel> {
    const obj = GroupFormModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.COUNTRYGROUP.UPDATE + '/' + params, obj, Constant.MODULE_ACTIONS.COUNTRYGROUP.EDIT);
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
        .map(GroupFormModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return GroupFormModel.toResponseModel(response);
    }
  }
}
