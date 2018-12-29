import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {FormGroup, FormBuilder, FormArray} from '@angular/forms';
import {BaseComponent} from "../../../../base.component";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {BsModalService} from "ngx-bootstrap";
import {ConfirmDialogComponent} from "../../../../../shared/dialog/confirm/confirm.component";
import {AddEditAdddressComponent} from "./add/add-edit-address.component";
import * as _ from 'lodash';
import {MerchantService} from "../../../../../services/merchant.service";
import {GlobalState} from "../../../../../global.state";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  encapsulation:ViewEncapsulation.None
})
export class MerchantAddressComponent extends BaseComponent implements OnInit{
  @Input() group:FormGroup;
  @Input() storeDetail;
  constructor(protected _router: Router,
              protected _location: Location,
              private _fb: FormBuilder ,
              private _globalState:GlobalState,
              private _merchantService:MerchantService,
              private bsModalService: BsModalService){
    super(_router, _location);
  }

  ngOnInit() {
    const savedAddresses = this.group.controls['pickupInfo'].value;
    this.addAddresses(savedAddresses);
  }

  /**
   * Add Address Modal popup
   */
  addAddress(item){

    const modal = this
    .bsModalService
    .show(AddEditAdddressComponent, {
      class: 'modal-lg'
    });
    (
      <AddEditAdddressComponent>modal.content).showConfirmationModal(
      'ADD ADDRESS',this.storeDetail); (<AddEditAdddressComponent>modal.content).onClose.subscribe(result => {
      if (result['status'] === 'SAVE') {
        // when pressed Save
        const data = result['data'];
        delete data.validateRules;
        let controls = {};
        _.each(data,function(v,k){
          controls[k] = [v];
        });
        const addressArr  = <FormArray>item.controls['addresses'];
        const addrCtrl    = this._fb.group(controls);
        addressArr.push(addrCtrl);


        const obj = _.extend(
          {},
          addrCtrl.value,
          {
            countryGroupId :item.controls['countryGroupId'].value,
            countryId:data['countryId'],
            country: item.controls['countryId'].value
          }
        );

        this._merchantService.addUpdatePickupAddress(this.storeDetail['rid'], obj)
          .subscribe((response) => {
            this.setSuccess(response['message']);
            this.reloadAddress();
          },(error) => {
          this.setError(error.message);
        })

      } else if (result['status'] === 'CANCEL') {
        // when pressed CANCEL
      } else {
        // When closing the modal without CANCEL or SAVE
      }
    });

  }

  /**
   * Remove Address
   *
   */
  removeAddress(i: number,item:Object) {
    const modal = this
      .bsModalService
      .show(ConfirmDialogComponent);
    (
      <ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE', 'COMMON.MODALS.ARE_U_SURE_TO_DELETE', 'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO');
    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {

        // when pressed Yes delete certificate
        const control = <FormArray>this.group.controls['addresses'];
        this._merchantService.deletePickupAddress(item['rid'])
          .subscribe((response) => {
            this.setSuccess(response['message']);
            control.removeAt(i);
        },(error) => {
            this.setError(error.message);
        });


      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /***
   * Edit Address
   */
  editAddress(i,item){
    const control = <FormArray>this.group.controls['addresses'];
    const editData = control.at(i).value;

    const modal = this
      .bsModalService
      .show(AddEditAdddressComponent, {
        class: 'modal-lg'
      });
      (
      <AddEditAdddressComponent>modal.content).showConfirmationModal(
      'EDIT ADDRESS',this.storeDetail,editData); (<AddEditAdddressComponent>modal.content).onClose.subscribe(result => {
      if (result['status'] === 'SAVE') {
        // when pressed Save
        const updatedData = result['data'];
        delete updatedData.validateRules;

        const obj = _.extend(
          {},
          updatedData,
          {
            countryGroupId :item.controls['countryGroupId'].value,
            countryId:updatedData['countryId'],
            country: item.controls['countryId'].value
          }
        );

        this._merchantService.addUpdatePickupAddress(this.storeDetail['rid'], obj)
          .subscribe((response) => {
            this.setSuccess(response['message']);
            control.at(i).patchValue(updatedData);

            this.group.patchValue({
              pickupInfo: this.group.controls['addresses'].value
            });

          },(error) => {
          this.setError(error.message);
        });


      } else if (result['status'] === 'CANCEL') {
        // when pressed CANCEL
      } else {
        // When closing the modal without SAVE or CANCEL
      }
    });

  }

  /**
   * Refresh Address
   */
  reloadAddress(){
    const countryId = this.group.controls['countryId'].value;
    const countryGroupId = this.group.controls['countryGroupId'].value;
    const selectionTypeID = this.group.controls['selectionType'].value == 'COUNTRY' ? countryId : countryGroupId;
    this._merchantService.getPickUpAddress(this.storeDetail['rid'],selectionTypeID).subscribe((response)=>{
      this.addAddresses(response['data']);
    },(error) => {
      return (error);
    });
  }

  /**
   * Add saved Address
   * @param savedAddresses - Array of Address
   */
  addAddresses(savedAddresses){

    const addressArr  = <FormArray>this.group.controls['addresses'];
    for (let i = addressArr.length - 1; i >= 0; i--) {
      addressArr.removeAt(i)
    }

    const self =  this;
    const addresses = [];
    _.each(savedAddresses,function(v,k){
      _.extend(v ,{
        countryGroupId : v['countryGroupId'] ? v['countryGroupId'] : '',
        countryId:v['countryId'] ? v['countryId'] : '',
      })
      const addrCtrl    = self._fb.group(v);
      addressArr.push(addrCtrl);
      addresses.push(v);
    });

    this.group.patchValue({
      pickupInfo: addresses
    })
  }
}
