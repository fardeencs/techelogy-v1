
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { CertificateListModel } from '../models/manage-certificate/certificate.list.model';
import { isArray } from 'util';
import { AddCertificateModel } from '../models/manage-certificate/addCertificate.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class CertificateService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * Certificate List
   */
  list(params: string = ''): Observable<CertificateListModel> {
    return this.makeHttpGet(Constant.REST_API.CERTIFICATE.LIST + '?' + params, Constant.MODULE_ACTIONS.CERTIFICATE.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Add New Certificate
   */
  addNewCertificate(data: AddCertificateModel): Observable<AddCertificateModel> {
    const obj = AddCertificateModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.CERTIFICATE.NEWCERTIFICATE, obj, Constant.MODULE_ACTIONS.CERTIFICATE.ADD);
  }
  /**
   * Delete Certificate
   */
  deleteCertificate(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.CERTIFICATE.DELETECERTIFICATE}/` + id);
  }
  /**
   * Delete Mass Certificate
   */
  deleteMassCertificate(certificateIds: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(certificateIds)
    };
    return this.makeHttpPost(Constant.REST_API.CERTIFICATE.DELETEMASSSCERTIFICATE, obj, Constant.MODULE_ACTIONS.CERTIFICATE.DELETE);
  }

  /**
   * Get Certificate Detail
   */
  getCertificateDetail(params: string = ''): Observable<AddCertificateModel> {
    return this.makeHttpGet(Constant.REST_API.CERTIFICATE.EDITCERTIFICATE + '/' + params, Constant.MODULE_ACTIONS.CERTIFICATE.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
 * Update Certificate
 */
  updateCertificate(params: string = '', data: AddCertificateModel): Observable<AddCertificateModel> {
    const obj = AddCertificateModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.CERTIFICATE.UPDATECERTIFICATE + '/' + params, obj, Constant.MODULE_ACTIONS.CERTIFICATE.EDIT);
  }

  /**
*
* @param response
* @returns {any}
*/
  mapResponse(response: any) {
    if (response && isArray(response.data)) {
      const ret = response.data.map(CertificateListModel.toResponseModel);
      response.data = ret;
      return response;
    } else {
      return CertificateListModel.toResponseModel(response);
    }
  }
}
