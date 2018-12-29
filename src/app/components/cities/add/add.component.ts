import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { STATUS_ARRAY } from '../../../modules';
import { CitiesService } from '../../../services/cities.service';
import { CitiesFormModel } from '../../../models/cities/cities.model';
import { FormGroup } from '@angular/forms';

@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.css'] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public cities: any;
  public stateList: any;
  public countryList: any;
  public STATUS_OPTIONS: any;
  public citiesToken: string;
  public permissions: Array<string> = [];
  public isCodeEnable=false;

  private initStateLoad : boolean = true;

  @ViewChild('citiesForm') citiesForm: ElementRef;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService, protected _location: Location, private _citiesService: CitiesService) {
    super(_router, _location);
    this.cities = new CitiesFormModel();
    this.cities.citiesFormGroup.setValue(CitiesFormModel.toFormModel(this.cities));
    this.citiesToken = this._activatedRoute.snapshot.params.id;
    this.STATUS_OPTIONS = STATUS_ARRAY;
    this.cities.isActive = "1";
  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.getCountryList();
    
  }

  ngAfterViewInit() { }

  public getCountryList(){
    this._citiesService.getCountryList().subscribe((res) => {
      this.countryList = res['data'];
      this.stateList = [];
      if (this.citiesToken) {
        this.getDetail();
      }
    });
  }

  public getStateList(event, resetState? : boolean) {
    if(resetState && this.cities && !this.initStateLoad){
      this.cities.citiesFormGroup.controls.stateId.setValue(null);
    }
    this.initStateLoad = false;
    let country = _.find(this.countryList, (c) => (c.countryName == event))
    if(country)
      this._citiesService.getStateList(country.countryCode).subscribe((res) => {
        this.stateList = res['data'];
      });
    else
      this.stateList = [];
  }

  getDetail() {
    this._citiesService.view(this.citiesToken).subscribe((response) => {
      response.isActive = response.isActive.toString();
      this.cities.citiesFormGroup.setValue(CitiesFormModel.toFormModel(response));
      // if(typeof response.countryName != 'undefined'){
      //   this.getStateList(response.countryName);
      // }
    },(error) => {
        this.setError(error.message);
      });
  }

  action() {
    if (this.citiesToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.cities.citiesFormGroup.valid) {
        try {
          this
            ._citiesService
            .add(this.cities.citiesFormGroup.value)
            .subscribe((response) => {
              this.citiesForm.nativeElement.reset();
              this.setSuccess(response.message);
              this.navigateByUrl('cities/view');
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }else{
        this.cities.validateAllFields();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public update() {
    try {
      if (this.cities.citiesFormGroup.valid) {
        try {
          this
            ._citiesService
            .update(this.citiesToken, this.cities.citiesFormGroup.value)
            .subscribe((response) => {
              this.citiesForm.nativeElement.reset();
              this.setSuccess('CITIES_UPDATED_SUCCESSFULLY');
              this.back();
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }else{
        this.cities.validateAllFields();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public cancelButtonAction() {
    try {
      const modal = this.modalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.CANCEL',
        'COMMON.MODALS.CHANGES_NOT_SAVED',
        'COMMON.BUTTONS.OK',
        'COMMON.BUTTONS.CANCEL'
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          this.back();
        } else if (result === false) {
          // when pressed No
        } else {
          // When closing the modal without no or yes
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  /*
   *Delete functionality
 */
  public onDelete() {
    this.showConfirmationDeleteModal(this.citiesToken);
  }

  /**
   * confirm modal delete
  **/
  showConfirmationDeleteModal(item): void {
    const modal = this.modalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO'
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes
        this.delete(item);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete by id
   */
  delete(id): void {
    try {
      this._citiesService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('CITIES_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
