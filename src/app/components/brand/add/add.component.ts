import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService, BsDatepickerConfig } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { STATUS_ARRAY, COMMON_REQUIRED_ARRAY, IMAGE_SIZE, OTHER_APPROVAL_STATUS_ARRAY, LOCATION_OPTIONS, SPECIFIED_PAGES } from '../../../modules';
import { FormGroup } from '@angular/forms';
import { Brands } from '../../../models/brand/brands.model';
import { BrandService } from '../../../services/brands.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { UtilHelper } from '../../../helper/util.helper';
import { TreeviewEventParser, OrderDownlineTreeviewEventParser, TreeviewConfig, DownlineTreeviewItem, TreeviewItem } from '../../../shared/dropdown/treeview-dropdown-lib';
import { isNil, reverse } from 'lodash';
import { log } from 'util';


@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.css'] ,
            providers: [
              { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
              { provide: TreeviewConfig, useClass: AddComponent }
            ]})
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {
    
  public bsConfig: Partial<BsDatepickerConfig>;
  public minDate : Date = UtilHelper.addMonths(new Date(), -6);
  public data: any;
  public SPECIFIED_PAGES: any;
  public STATUS_OPTIONS: any;
  public LOCATION_OPTIONS: any;
  public PAGE_OPTION: any;
  public IMG_SIZE_OPTION: any;
  public CATEGORY_LIST:  any;
  public PRODUCT_LIST: Array<any> = [];
  public brandToken: string;
  public permissions: Array<string> = [];
  public countries: Array<Object> = [];
  public selectedCountries: any;

  public iconName : string = "COMMON.LABELS.ICON_NAME";
  public imageName : string  = "COMMON.LABELS.IMAGE_NAME";
  public categoryName = '';
  public pageInfo;
  public parentCategories: Array<Object> = [];
  public ImageTypes: Object = { icon: "3", backgroundImage: "1", image: "2", mobileImage: "4" }

  public config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
});

  @ViewChild('dataForm') dataForm: ElementRef;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute, private translate: TranslateService,
    private modalService: BsModalService, protected _location: Location, private titleService: Title,
    private _brandService: BrandService) {
    super(_router, _location);
    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        ,map(() => this._activatedRoute)
        ,map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
        ,filter(route => route.outlet === 'primary')
        ,mergeMap(route => route.data))
      .subscribe((event) => {
        this.translate.get(event['title']).subscribe((title)=>{
          this.titleService.setTitle(title);
        });
        this.pageInfo = event;
      });

    this.data = new Brands();
    this.data.formGroup.setValue(Brands.toFormModel(this.data));
    this.STATUS_OPTIONS = STATUS_ARRAY;
    this.SPECIFIED_PAGES = SPECIFIED_PAGES;
    this.LOCATION_OPTIONS = LOCATION_OPTIONS
    this.PAGE_OPTION = COMMON_REQUIRED_ARRAY;
    this.IMG_SIZE_OPTION = IMAGE_SIZE;
    this.data.isActive = "1";
    this.brandToken = this._activatedRoute.snapshot.params.id;
    if(this.brandToken)
      this.getDetail();
    else
      this.getCategoriesList();

  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    //this.getSpecifiedPages();
    this.getProductList();
    //this.getCategoriesList();
  }

  ngAfterViewInit() { }

  getSpecifiedPages() {
    this._brandService.getLookup().subscribe((response:any) => {
      if(response && response.data){
        this.SPECIFIED_PAGES[1].label = this.SPECIFIED_PAGES[1].label + '(' + _.map(response.data, 'pageTitle').join(', ') + ')';
      }
    },(error) => {
        this.setError(error.message);
      });
  }

  getProductList(){
    this._brandService.getProductList().subscribe((response:any) => {
      if(response && response.data){
        this.PRODUCT_LIST = response.data;
      }
    },(error) => {
      this.setError(error.message);
    });
  }

  getCategoriesList(){
    this._brandService.getCategoriesList().subscribe((response:any) => {
      if(response && response.data){
        this.CATEGORY_LIST = UtilHelper.mapTreeviewData(response.data, "subcategory", "categoryName", "entityId", this.data.formGroup.value.categories);
      }
    },(error) => {
      this.setError(error.message);
    });
  }

  getDetail() {
    this._brandService.view(this.brandToken).subscribe((response:any) => {
      this.iconName = response.iconName;
      this.imageName = response.imageName;
      response.isActive = response.isActive.toString();
      this.data.formGroup.setValue(Brands.toFormModel(response));
      this.getCategoriesList();
      
    },(error) => {
        this.setError(error.message);
      });
  }

  action() {
    if (this.brandToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.data.formGroup.valid) {
        if(this.data.formGroup.value.endDate <= this.data.formGroup.value.startDate){
          this.setError("BRAND_DATES_ERROR");
          return
        }
        try {
          this
            ._brandService
            .add(this.data.formGroup.value)
            .subscribe((response) => {
              this.dataForm.nativeElement.reset();
              this.setSuccess(response.message);
              this.navigateByUrl('brand/view');
            }
            ,(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }else{
        Brands.validateAllFields(this.data.formGroup);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public update() {
    try {
      if (this.data.formGroup.valid) {
        if(this.data.formGroup.value.endDate <= this.data.formGroup.value.startDate){
          this.setError("BRAND_DATES_ERROR");
          return
        }
        try {
          this
            ._brandService
            .update(this.brandToken, this.data.formGroup.value)
            .subscribe((response) => {
              this.dataForm.nativeElement.reset();
              this.setSuccess('BRAND_UPDATED_SUCCESSFULLY');
              this.back();
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }else{
        Brands.validateAllFields(this.data.formGroup);
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
    this.showConfirmationDeleteModal(this.brandToken);
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
      this._brandService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('BRAND_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *  after file upload response
   */
  onSelect(event, imageFiledName) {
    
    if (imageFiledName == "icon") {
      this.iconName = event.files[0].name;
    } else {
      this.imageName = event.files[0].name;
    }
    this.data.formGroup.controls[imageFiledName].setValue(event.files[0].objectURL);
  }

  /**
   *  custom file upload
   */
  onFileUpload(fileData, imageFiledName) {
    const formData = new FormData();
    formData.append('file', fileData.files[0]);
    formData.append('uploadType', this.ImageTypes[imageFiledName]);
    formData.append('tmp', "1");
    let obj: any = {};
    try {
      this._brandService.uploadFiles(formData).subscribe((res: any) => {
        this.data.formGroup.controls[imageFiledName].setValue(res.location);
      },(error) => {
        this.setError(error.message);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * file upload error
   */

  onError(event) {
    console.log('ev', event);
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
        let fileName:string = "";
        if(this.data.formGroup.controls[imageFiledName]){
          fileName = this.data.formGroup.controls[imageFiledName].value;
        }
        // when pressed Yes
        let params: Object = { fileName : fileName,rid: this.brandToken, uploadType: this.ImageTypes[imageFiledName] }
        try {
          this._brandService.deleteFiles(params).subscribe((res: any) => {
            this.data.formGroup.controls[imageFiledName].setValue("");
          },(error) => {
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

  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    let rows = [];
    downlineItems.forEach(downlineItem => {
        const item = downlineItem.item;
        const value = item.value;
        const texts = [item.text];
        let parent = downlineItem.parent;
        while (!isNil(parent)) {
            texts.push(parent.item.text);
            parent = parent.parent;
        }
        const reverseTexts = reverse(texts);
        const row = `${reverseTexts.join(' -> ')} : ${value}`;
        rows.push(row);
    });
}

}
