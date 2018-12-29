import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { MerchantschemeModel } from '../models/add-merchant/merchantScheme.model';
import {Observable} from "rxjs";

@Injectable()
export class SchemeTypesService extends BaseService {
  constructor(protected http: TransferHttp) {
    super(http);
  }

  getSchemeList(): Observable<MerchantschemeModel> {
    return this.makeHttpGet(Constant.REST_API.SCHEMETYPES.SCHEMETYPES, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
}
