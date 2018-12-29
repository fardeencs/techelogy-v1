
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ExportFileModel } from '../models/export.file.model';
import {Observable} from "rxjs";


@Injectable()
export class ExportService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * get download link
   */
  getDownloadLink(url: string, action: string = ''): Observable<ExportFileModel> {
    return this.makeHttpGet(url, action);
  }

  /**
   * get selected rows download link
   */
  getSelectedDownloadLink(url: string, action: string = '', ids: Array<String>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(ids)
    };
    return this.makeHttpPost(url, obj, action);
  }

  /**
   * get selected rows download link
   */
  downloadLink(url: string, ids: Array<String>,action: string = ''): Observable<any> {
    let obj=new FormData();
    obj.append('rids',JSON.stringify(ids));
    return this.httpxFormData(url, 'POST',obj);
  }

}
