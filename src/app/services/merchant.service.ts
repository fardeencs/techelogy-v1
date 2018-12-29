import { AuthsignatureModel } from './../models/add-merchant/authSignature.model';
import { CompanyinfoModel } from './../models/add-merchant/companyInfo.model';
import { TransferHttp } from './../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import * as Constant from '../modules/constants';
import { BaseService } from './base.service';
import { MerchantListModel } from '../models/add-merchant/merchant.list.model';
import { ContactmerchantModel } from '../models/add-merchant/contactMerchant.model';
import { ContactFinanceModel } from '../models/add-merchant/contactFinance.model';
import { FinanceinfoModel } from '../models/add-merchant/financeInfo.model';
import { DocumentuploadModel } from '../models/add-merchant/docUpload.model';
import { PaginationModel } from '../models/pagination.model';
import {Observable} from "rxjs";

@Injectable()
export class MerchantService extends BaseService {

  constructor(protected http: TransferHttp) {
    super(http);
  }

  /**
   * Merchant List
   */
  getMerchantList(params: string = ''): Observable<MerchantListModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_STORE_LIST + '?' + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }

  /**
   * Delete Merchant
   */
  deleteMerchant(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.MANAGE_MERCHANT.STORE_DELETE}/` + id);
  }
  /**
   * Delete Mass Merchant
   */
  deleteMassMerchant(merchantIds: Array<string>): Observable<any> {
    const obj = {
      'rids': JSON.stringify(merchantIds)
    };
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.STORE_MASS_DELETE, obj, Constant.MODULE_ACTIONS.MERCHANT.DELETE);
  }

  /**
   * Add/Update Merchant Contact
   */

  addUpdateMerchantContact(id: string, data: ContactmerchantModel): Observable<any> {
    const obj = ContactmerchantModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ADD_MERCHANT_CONTACT + '/' + id,
      obj, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }

  /**
   * Get Merchant Contact
   */
  getMerchantContact(params: string = ''): Observable<ContactFinanceModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_MERCHANT_CONTACT + '/' + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }

  /**
   * Add / Update Merchant Finance Contact
   */
  addUpdateMerchantFinanceContact(id: string, data: ContactFinanceModel): Observable<any> {
    const obj = ContactFinanceModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ADD_MERCHANT_FINANCE_CONTACT + '/' + id,
      obj, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }

  /**
   * Get Merchant Finance Contact
   */
  getMerchantFinanceContact(params: string = ''): Observable<ContactFinanceModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_MERCHANT_FINANCE_CONTACT + '/'
    + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  /**
   * Get conpany Info
   */
  getCompanyInfo(params: string = ''): Observable<ContactFinanceModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_COMPANY_INO + '/' + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }

  /**
 * Add / Update Merchant Finance Contact
 */
  updateCompanyInfo(id: string, data: CompanyinfoModel): Observable<any> {
    const obj = CompanyinfoModel.toRequestModel(data);
    return this.makeHttpPut(Constant.REST_API.MANAGE_MERCHANT.UPDATE_COMPANY_INO + '/' + id, obj, Constant.MODULE_ACTIONS.MERCHANT.EDIT);
  }
  /**
   * Add Merchant Contact
   */
  addCompanyInfo(data: CompanyinfoModel): Observable<any> {
    const obj = CompanyinfoModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ADD_COMPANY_INFO, obj, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }


  /**
   * Get country list
   */
  getCountryList(): Observable<PaginationModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_COUNTRY_LIST, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  /**
   * Get state list
   */
  getStateList(param: string = ''): Observable<ContactFinanceModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_STATE_LIST + '/' + param,Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  /**
   * Get City list
   */
  getCityList(param: string = ''): Observable<ContactFinanceModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_CITY_LIST + '/' + param,Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }

  /**
   * get Signature Details
   */
  getAutSignatureDetails(param: string = ''): Observable<AuthsignatureModel>{
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.AUTHORIZED_SIGNATURE + '/' + param,Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  /**
   * Add update Authorized Signature
   */
  addUpdateAuthorizedSignature(id: string, data: AuthsignatureModel): Observable<AuthsignatureModel> {
    const obj = AuthsignatureModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.AUTHORIZED_SIGNATURE + '/' + id, obj, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }

  /**
   * Get Financial Info
   */
  getMerchantFinancialInfo(params: string = ''): Observable<FinanceinfoModel> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_MERCHANT_FINANCE_BANK_INFO + '/' +
      params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }

  /**
   * Add / Update Merchant Finance Contact
   */
  addUpdateMerchantFinancialInfo(id: string, data: FinanceinfoModel): Observable<any> {
    const obj = FinanceinfoModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ADD_MERCHANT_FINANCE_BANK_INFO + '/' + id,
      obj, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }

  /**
   * upload file
   */
  addFiles(data: any,id:string): Observable<any> {
    return this.requestHttpFormData(Constant.REST_API.MANAGE_MERCHANT.UPLOAD_FILE+ '/' + id, 'POST', data);
  }

  /**
   * Get uploaded files
   */
  getUploadedDocumentList(params: string = ''): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_UPLOADED_FILES + '/' + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }

  /**
   * delete uploaded file
   */
  deleteUploadedDocument(id: string = ''): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.MANAGE_MERCHANT.DELETE_UPLOADED_FILES}/` + id);
  }

  /**
   * Save file
   */
  saveFile(id: string, data: DocumentuploadModel): Observable<any> {
    const obj = DocumentuploadModel.toRequestModel(data);
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.SAVE_DOCUMENT + '/' + id,
      obj, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }
  /**
   * get Platform detail
   */
  getPlatform(params: string = ''): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.ADD_PLATFORM + '/' + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  /**
  * Add / Update Merchant Platform
  */
  addUpdatePlatfrom(id: string, data: Object): Observable<any> {
    const obj = JSON.stringify(data);
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ADD_PLATFORM + '/' + id,
      obj, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }

  /**
   * Add / Update Delivery Detail
   */
  addUpdateDeliveryDetail(id: string, data: Object): Observable<any> {
    const obj = JSON.stringify(data);
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ADD_MERCHANT_DELIVERY_DETAIL + '/' + id,
      obj, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }

  /**
   * Get Pickup Address
   */
  getPickUpAddress(storedID:string='' , id: string = ''): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.ADD_PICK_UP_ADDRESS + '/' + storedID + '/' + id, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  /**
   * Add / Update Merchant Finance Contact
   */
  addUpdatePickupAddress(id: string, data): Observable<any> {
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ADD_PICK_UP_ADDRESS + '/' + id,
      data, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }
  /**
   * Add / Update Merchant Finance Contact
   */
  deletePickupAddress(id: string): Observable<any> {
    return this.makeHttpDelete(Constant.REST_API.MANAGE_MERCHANT.ADD_PICK_UP_ADDRESS + '/' + id);
  }

  /**
   * Submit for Review
   */
  submitForReview(id: string): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.SUBMIT_FOR_REVIEW + '/' + id, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }

  /**
   * Get Groups
   */
  getGroups(params: string = ''): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.COUNTRYGROUP.LIST + '?' + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }

  /**
   * Get Schemes
   */
  getSchemes(): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_SCHEMES , Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  /* get Delivery information*/
  getDelivery(params:string=''):Observable<any>{
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.GET_MERCHANT_DELIVERY_DETAIL+ '/' + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  deleteDeliverInfo(id: string): Observable<any> {
    return this.makeHttpDelete(`${Constant.REST_API.MANAGE_MERCHANT.GET_MERCHANT_DELIVERY_DETAIL}/` + id);
  }

  addUpdateCountryAndGroup(params, id:string):Observable<any>{
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.POST_COUNTRY_GROUP + '/' + id, params, Constant.MODULE_ACTIONS.MERCHANT.ADD)
  }


  getPrimaryCategory(params):Observable<any>{
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.CATEGORY_LIST+ '?' + params, Constant.MODULE_ACTIONS.MERCHANT.VIEW)
  }

  getSecondryCategory(params):Observable<any> {
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.SUB_CATEGORY_LIST, params, Constant.MODULE_ACTIONS.MERCHANT.VIEW)
  }

  getDomesticCountry(){
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.DOMESTIC_COUNTRY , Constant.MODULE_ACTIONS.MERCHANT.VIEW)
  }
  addUpdateRevenueInfo(parms, id):Observable<any> {
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ADD_MERCHANT_PRODUCT_REVENUE + '/' + id, parms, Constant.MODULE_ACTIONS.MERCHANT.ADD);
  }
   /**
   * get Sales Person List
   */
  getSaleperson(params: string = ''): Observable<any> {
    return this.makeHttpGet(Constant.REST_API.USER.LIST + '?' + params, Constant.MODULE_ACTIONS.USER.VIEW);
  }
  /**
   * Assign Sales Person for store
   */
  assignSaleperson(data): Observable<any> {
    return this.makeHttpPost(Constant.REST_API.MANAGE_MERCHANT.ASSIGN_SALEPERSON , data, Constant.MODULE_ACTIONS.MERCHANT.EDIT);
  }
  getMerchantDetails(id):Observable<any> {
    return this.makeHttpGet(Constant.REST_API.MANAGE_MERCHANT.MERCHANT_VIEW + '/'+ id, Constant.MODULE_ACTIONS.MERCHANT.VIEW);
  }
  /**
   * upload csv file
   */
  importFiles(data: any): Observable<any> {
    return this.httpxFormData(Constant.REST_API.MIGRATION.IMPORT_API, 'POST', data);
  }
   /**
   * get server list
   */
  getServerList(data?: any): Observable<any> {
    return this.httpxFormData(Constant.REST_API.MIGRATION.SERVER_LIST, 'GET',data);
  }
}
