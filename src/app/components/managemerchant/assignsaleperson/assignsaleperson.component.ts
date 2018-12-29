import { Component,ViewChild, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subject } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { BaseComponent } from '../../base.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MerchantService } from '../../../services/merchant.service';
import { UtilHelper } from '../../../helper/util.helper';
import { AssignPersonalModel } from '../../../models/add-merchant/assign-personal.model';
@Component({
  selector: 'app-assignsaleperson',
  templateUrl: './assignsaleperson.component.html'
})
export class AssignsalepersonComponent extends BaseComponent implements OnInit {
  public body: string;
  public title: string;
  public onClose: Subject<Object>;
  public active: boolean = false;
  public salesMan = [];
  public selectedsalesMan ;
  public storeIds = [];
  public assignPersonal: AssignPersonalModel;
  @ViewChild('assigneForm') assigneForm: ElementRef;
  constructor(_router: Router, _location: Location,
    private bsModalService: BsModalService,
    private _bsModalRef: BsModalRef,
    private translate: TranslateService,
    private _merchantService: MerchantService) {
    super(_router, _location);
    this.assignPersonal =new AssignPersonalModel();
  }

  ngOnInit() {
    this.onClose = new Subject();
  }
  public showConfirmationModal(title: string, storeIds: any, data: Object = null): void {
    //set sales drop down data
    let param = 'roleId=267&isActive=1';
    this._merchantService.getSaleperson(param).subscribe((response) => {
      this.salesMan = response.data;
    },(error) => {
      this.setError(error.message);
    });
    this.storeIds=storeIds;
    this.title = title;
    this.active = true;
  }
  hideConfirmationModal() {
    this.active = false;
    this.onClose.next({ status: 'CLOSE' });
    this._bsModalRef.hide();
  }
  submitAddPersonal() {
    let stores = UtilHelper.stringify(this.storeIds);
    let data = { userId: this.assignPersonal.salesPersonal, storeIds: stores };
    if (this.assignPersonal.validate('assigneForm')) {
      this._merchantService.assignSaleperson(data).subscribe((response) => {
        this.setSuccess('ASSIGN_SALESPERSON_SUCCESSFULLY');
        this.active = false;
        this.onClose.next({ status: 'SAVE', data: this.selectedsalesMan });
        this._bsModalRef.hide();
        this.back();
      },(error) => {
        this.setError(error.message);
      });
    }
  }
}
