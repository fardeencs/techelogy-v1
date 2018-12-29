import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService, BsDropdownModule, OnChange } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { STATUS_ARRAY, COMMON_REQUIRED_ARRAY, ATTRIBUTE_INPUT_TYPE } from '../../../modules';
import { Title } from "@angular/platform-browser";
import { filter, map, mergeMap } from 'rxjs/operators';
import { TranslateService } from "@ngx-translate/core";
import { AttributeFormModel } from '../../../models/attribute/attribute.model';
import { AttributeService } from '../../../services/attribute.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AttributeOptionsModel } from '../../../models/attribute/attribute.options.model';
@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.scss'] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  public attribute: any;
  public attrOptions: any;
  public STATUS_OPTIONS: any;
  public REQUIRED_OPTION: any;
  public INPUT_OPTION: any;
  public attributeToken: string;
  public permissions: Array<string> = [];
  public pageInfo;
  public activeOptionCount:number = 0;
  public _fb: FormBuilder;
  public attributeEntites: Array<Object> = [];
  public ImageTypes: Object = { productPlaceholder: "2", backgroundImage: "1", otherPlaceholder: "3" }

  @ViewChild('attributeForm') attributeForm: ElementRef;
  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute, private translate: TranslateService,
    private modalService: BsModalService, protected _location: Location, private titleService: Title,
    private _attributeService: AttributeService) {
    super(_router, _location);
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        , map(() => this._activatedRoute)
        , map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        , filter(route => route.outlet === 'primary')
        , mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title) => {
          this.titleService.setTitle(title);
        });
        this.pageInfo = event;
      });
    this.attribute = new AttributeFormModel();
    this.attrOptions = new AttributeOptionsModel();
    this.STATUS_OPTIONS = STATUS_ARRAY;
    this.REQUIRED_OPTION = COMMON_REQUIRED_ARRAY;
    this.INPUT_OPTION = ATTRIBUTE_INPUT_TYPE;
    this.attributeToken = this._activatedRoute.snapshot.params.id;


  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.attribute.attributeFormGroup.patchValue({ isRequired: '0', isActive: '1' });
    this.attribute.attributeFormGroup.get('inputType').valueChanges.subscribe(
      async (type: number) => {
        if (this.attribute.attributeFormGroup.controls.attributeOptions.controls.length == 0 && !this.attributeToken) {
          await this.addOptions();
        }
        if (type == 3) {
          this.attribute.attributeFormGroup.controls.attributeOptions.controls.forEach((c, i) => {
            this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.label.setValue("");
            this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.label.setValidators(Validators.required);
            this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.label.updateValueAndValidity();
          });
        } else if (type == 1) {
          const arr = <FormArray>this.attribute.attributeFormGroup.controls.attributeOptions;
          arr.controls = [];
        } else {
          this.attribute.attributeFormGroup.controls.attributeOptions.controls.forEach((c, i) => {
            this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.label.setValue("");
            this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.label.clearValidators();
            this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.label.updateValueAndValidity();
          });
        }
      });
    this.getAttributeEntity();

  }

  ngAfterViewInit() { }

  getDetail() {
    this._attributeService.view(this.attributeToken).subscribe((response: any) => {
      this.attribute.attributeFormGroup.patchValue(AttributeFormModel.toFormResponseModel(response));
      if (response.options instanceof Array) {
        this.activeOptionCount = response.options.length;
        this.attribute.optionsPatchValue(response.options.map(AttributeOptionsModel.toResponseModel), response.inputType);
      }
    }, (error) => {
      this.setError(error.message);
    });
  }

  getAttributeEntity() {
    this._attributeService.entityList().subscribe((response) => {
      this.attributeEntites = response.data;
      if (this.attributeToken) {
        this.getDetail();
      }
    }, (error) => {
      this.setError(error.message);
    });
  }


  action() {
    if (this.attributeToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.attribute.attributeFormGroup.valid) {
        try {
          this
            ._attributeService
            .add((this.attribute.attributeFormGroup.value))
            .subscribe((response) => {
              this.attributeForm.nativeElement.reset();
              this.setSuccess(response.message);
              this.navigateByUrl('attributes/list');
            }, (error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        this.attribute.validateAllFields();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public update() {
    try {
      if (this.attribute.attributeFormGroup.valid) {

        try {
          this
            ._attributeService
            .update(this.attributeToken, this.attribute.attributeFormGroup.value)
            .subscribe((response) => {
              this.attributeForm.nativeElement.reset();
              this.setSuccess('ATTRIBUTE_UPDATED_SUCCESSFULLY');
              this.back();
            }, (error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        this.attribute.validateAllFields();
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
    this.showConfirmationDeleteModal(this.attributeToken);
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
    let rids:any = [id];
    try {
      this._attributeService
        .massDelete(rids)
        .subscribe((response) => {
          this.setSuccess('ATTRIBUTE_DELETED_SUCCESSFULLY');
          this.back();
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * file remove from server  
   */
  onRemove(imageFiledName) {

    const modal = this.modalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO'
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        let fileName: string = "";
        if (this.attribute.imageUpload[imageFiledName]) {
          fileName = this.attribute.imageUpload[imageFiledName];
        } else {
          fileName = this.attribute.attributeFormGroup.value[imageFiledName]; //this.theme[imageFiledName];
        }

        // when pressed Yes
        let params: Object = { fileName: fileName, rid: this.attributeToken, uploadType: this.ImageTypes[imageFiledName] }
        try {
          this._attributeService.deleteFiles(params).subscribe((res: any) => {
            this.attribute.attributeFormGroup.controls[imageFiledName].setValue("", { onlySelf: true });
            this.attribute.imageUpload[imageFiledName] = "";
            this.attribute.attributeFormGroup.controls[imageFiledName].updateValueAndValidity();
          }, (error) => {
            this.setError(error.message);
          });
        } catch (error) {
          console.log(error);
        }

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
  * Set value of lable field and swatch base on swatch type.
  */

  swatchOption(index: number, InputType: string) {
    if (InputType == "color") {
      this.attribute.attributeFormGroup.controls.attributeOptions.controls[index].controls.swatch.value = "2";
      this.attribute.attributeFormGroup.controls.attributeOptions.controls[index].controls.label.value = "#929292";
    } else if (InputType == "image") {
      this.fileInput.nativeElement.value = '';
      this.fileInput.nativeElement.setAttribute('data-index', index);
      let event = new MouseEvent('click', { bubbles: true });
      this.fileInput.nativeElement.dispatchEvent(event);
    } else if (InputType == "clear") {
      this.attribute.attributeFormGroup.controls.attributeOptions.controls[index].controls.label.value = "";
    }
    this.attribute.attributeFormGroup.controls.attributeOptions.at(index).controls.label.updateValueAndValidity();
  }

  /**
   * onFileSelect with file event;
   */

  onFileSelect(event) {
    let index: number = this.fileInput.nativeElement.getAttribute('data-index');
    if (this.fileInput.nativeElement.files.length > 0) {
      const e = this.fileInput.nativeElement;
      const file = e.files[0];
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > this.MAX_LENGTH_CONFIG.MAX_FILE_SIZE) {
        e.value = null;
        this.fileInput.nativeElement.value = '';
        this.setError('MAX_FILE_SIZE_EXCEED');
      } else if (!this.MAX_LENGTH_CONFIG.ALLOWED_FILE_EXTENSION.exec(file.name)) {
        e.value = null;
        this.fileInput.nativeElement.value = '';
        this.setError('FILE_FORMAT_EXCEPTED');
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploadType', "1");
        formData.append('tmp', "1");
        let obj: any = {};
        try {
          this._attributeService.uploadFiles(formData).subscribe((res: any) => {
            this.attribute.attributeFormGroup.controls.attributeOptions.controls[index].controls.swatch.value = "3";
            this.attribute.attributeFormGroup.controls.attributeOptions.controls[index].controls.label.value = res.location;
            this.attribute.attributeFormGroup.controls.attributeOptions.at(index).controls.label.updateValueAndValidity();
          }, (error) => {
            this.setError(error.message);
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  redioSelect(index: number, event) {
    event.target.checked = true;
    this.attribute.attributeFormGroup.controls.attributeOptions.controls.forEach((c, i) => {
      if (index == i) {
        this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.isDefault.setValue(1);
      } else {
        this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.isDefault.setValue(0);
      }
      this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.isDefault.updateValueAndValidity();
    });
  }

  /**
  * Add new options 
  */
  private addOptions() {
    this.activeOptionCount++;
    const control = <FormArray>this.attribute.attributeFormGroup.controls['attributeOptions'];
    control.push(this.attribute.attributeOption(this.attribute.attributeFormGroup.value.inputType));

  }

  /**
   * Remove exist options array by index
   */
  private removeOptions(i: number) {
    const modal = this.modalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO'
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        const control = <FormArray>this.attribute.attributeFormGroup.controls['attributeOptions'];
        const optionsControl = <FormGroup>control.at(i);
        if (optionsControl.controls.entityId.value > 0) {
          this.activeOptionCount--;
          this.attribute.attributeFormGroup.controls.attributeOptions.controls[i].controls.isDeleted.value = '1';
          this.attribute.attributeFormGroup.controls.attributeOptions.at(i).controls.label.updateValueAndValidity();
        } else {
          this.activeOptionCount--;
          control.removeAt(i);
        }
      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });


  }




}
