
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { DocumentTypeListModel } from '../models/document-type/documentType.list.model';
import { isArray } from 'util';
import { AddDocumentTypeModel } from '../models/document-type/addDocumentType.model';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class DocumentTypeService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * Document Type List
   */
  list(params: string = ''): Observable<DocumentTypeListModel> {
    return this.makeHttpGet(Constant.REST_API.DOCUMENT_TYPE.LIST + '?' + params, Constant.MODULE_ACTIONS.DOCUMENT.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
   * Add New Document Type
   */
  addNewDocumentType(data: AddDocumentTypeModel): Observable<AddDocumentTypeModel> {
    const obj = AddDocumentTypeModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.DOCUMENT_TYPE.NEWDOCTYPE, obj, Constant.MODULE_ACTIONS.DOCUMENT.ADD);
  }
  /**
   * Delete Document Type
   */
  deleteDocumentType(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.DOCUMENT_TYPE.DELETEDOCTYPE}/` + id);
  }
  /**
   * Delete Mass Document Type
   */
  deleteMassDocumentType(docTypeIds: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(docTypeIds)
    };
    return this.makeHttpPost(Constant.REST_API.DOCUMENT_TYPE.DELETEMASSSDOCTYPE, obj, Constant.MODULE_ACTIONS.DOCUMENT.DELETE);
  }

  /**
   * Get Document Type Detail
   */
  getDocumentTypeDetail(params: string = ''): Observable<AddDocumentTypeModel> {
    return this.makeHttpGet(Constant.REST_API.DOCUMENT_TYPE.EDITDOCTYPE + '/' + params, Constant.MODULE_ACTIONS.DOCUMENT.VIEW)
      .pipe(map(this.mapResponse.bind(this)));
  }

  /**
 * Update Document Type
 */
  updateDocumentType(params: string = '', data: AddDocumentTypeModel): Observable<AddDocumentTypeModel> {
    const obj = AddDocumentTypeModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.DOCUMENT_TYPE.UPDATEDOCTYPE + '/' + params, obj, Constant.MODULE_ACTIONS.DOCUMENT.EDIT);
  }

    /**
 *
 * @param response
 * @returns {any}
 */
mapResponse(response: any) {
  if (response && isArray(response.data)) {
    const ret = response.data.map(DocumentTypeListModel.toResponseModel);
    response.data = ret;
    return response;
  } else {
    return DocumentTypeListModel.toResponseModel(response);
  }
}
}
