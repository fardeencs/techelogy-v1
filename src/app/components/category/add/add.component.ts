import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { CategoryFormModel } from '../../../models/category/category.form.model';
import { CategoryService } from '../../../services/category.service';
import { MerchantService } from '../../../services/merchant.service';
import { STATUS_ARRAY, COMMON_REQUIRED_ARRAY, IMAGE_SIZE, OTHER_APPROVAL_STATUS_ARRAY, HALAL_CATEGORY_ARRAY } from '../../../modules';
import { Title } from "@angular/platform-browser";
import { filter, map, mergeMap } from 'rxjs/operators';
import { TranslateService } from "@ngx-translate/core";

@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.scss'] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public category: any;
  public STATUS_OPTIONS: any;
  public PAGE_OPTION: any;
  public APPROVAL_STATUS: any;
  public IMG_SIZE_OPTION: any;
  public HALAL_OPTION: any;
  public categoryToken: string;
  public permissions: Array<string> = [];
  public countries: Array<Object> = [];
  public selectedCountries: any;

  public categoryName = '';
  public pageInfo;
  public parentCategories: Array<Object> = [];
  public ImageTypes: Object = { iconImage: "3", backgroundImage: "1", primaryImage: "2", mobileImage: "4" }

  @ViewChild('categoryForm') categoryForm: ElementRef;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute, private translate: TranslateService,
    private modalService: BsModalService, protected _location: Location, private titleService: Title,
    private _categoryService: CategoryService, private _merchantService: MerchantService) {
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

    this.category = new CategoryFormModel();
    this.STATUS_OPTIONS = STATUS_ARRAY;
    this.PAGE_OPTION = COMMON_REQUIRED_ARRAY;
    this.IMG_SIZE_OPTION = IMAGE_SIZE;
    this.HALAL_OPTION = HALAL_CATEGORY_ARRAY;
    this.APPROVAL_STATUS = OTHER_APPROVAL_STATUS_ARRAY;
    this.categoryToken = this._activatedRoute.snapshot.params.id;

  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.getCountries();
    this.getParentCategories();
  }

  ngAfterViewInit() { }

  getCountries() {
    this._merchantService.getCountryList().subscribe((response) => {
      this.countries = response.data;
      if (this.categoryToken) {
        this.getDetail();
      }
    }, (error) => {
      this.setError(error.message);
    });
  }

  getParentCategories() {
    this._categoryService.parentList().subscribe((response) => {
      this.parentCategories = response.data;
    }, (error) => {
      this.setError(error.message);
    });
  }



  getDetail() {
    this._categoryService.view(this.categoryToken).subscribe((response: any) => {
      this.category = response;
      if (typeof this.category.countryIds != 'undefined') {
        this.selectedCountries = this.category.countryIds.split(',');
        this.category.countryIds = this.category.countryIds;
      }

      if (response.categoryName) {
        this.categoryName = response.categoryName;
      }
    }, (error) => {
      this.setError(error.message);
    });
  }

  /* Parent category event onChange */
  onChangePCategory(event) {
    let selectElement = event.target;
    let level = selectElement.options[selectElement.selectedIndex].getAttribute('data-level');
    if (event.target.value > 0)
      this.category.level = Number(level) + 1;
    else
      this.category.level = Number(level);
  }

  action() {
    if (!this.category.countryIds) {
      this.setError('COUNTRY_REQUIRED');
    } else if (this.categoryToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.category.validate('categoryForm')) {
        try {
          this
            ._categoryService
            .add(this.category)
            .subscribe((response) => {
              this.categoryForm.nativeElement.reset();
              this.setSuccess(response.message);
              this.navigateByUrl('catalog/list');
            }
              , (error) => {
                this.setError(error.message);
              });
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public update() {
    try {
      if (this.category.validate('categoryForm')) {
        try {
          this
            ._categoryService
            .update(this.categoryToken, this.category)
            .subscribe((response) => {
              this.categoryForm.nativeElement.reset();
              this.setSuccess('CATEGORY_UPDATED_SUCCESSFULLY');
              this.back();
            }, (error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
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
    this.showConfirmationDeleteModal(this.categoryToken);
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
      this._categoryService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('CATEGORY_DELETED_SUCCESSFULLY');
          this.back();
        }, (error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /*
   * On Country Change
   */
  onCountryChange(selectedArr) {
    if (selectedArr.length) {
      this.category.countryIds = selectedArr.toString();
    } else {
      this.category.countryIds = '';
    }
  }

  /**
   *  after file upload response
   */
  onSelect(event, imageFiledName: string) {
    switch (imageFiledName) {
      case "iconImage": {
        this.category.iconImageName = event.files[0].name;
        break;
      }
      case "mobileImage": {
        this.category.mobileImageName = event.files[0].name;
        break;
      }
      case "backgroundImage": {
        this.category.backgroundImageName = event.files[0].name;
        break;
      }
      case "primaryImage": {
        this.category.primaryImageName = event.files[0].name;
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
    this.category.imageUpload[imageFiledName] = event.files[0].objectURL;
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
      this._categoryService.uploadFiles(formData).subscribe((res: any) => {
        this.category.imageUpload[imageFiledName] = res.location;
      }, (error) => {
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
        let fileName: string = "";
        if (this.category.imageUpload[imageFiledName]) {
          fileName = this.category.imageUpload[imageFiledName];
        } else {
          if (imageFiledName == 'primaryImage') {
            fileName = this.category['primaryImageArr'][0];
          } else {
            fileName = this.category[imageFiledName];
          }
        }
        // when pressed Yes
        let params: Object = { fileName: fileName, rid: this.categoryToken, uploadType: this.ImageTypes[imageFiledName] }
        try {
          this._categoryService.deleteFiles(params).subscribe((res: any) => {
            this.category.imageUpload[imageFiledName] = "";
            if (imageFiledName == 'primaryImage') {
              this.category['primaryImageArr'] = [];
            } else {
              this.category[imageFiledName] = "";
            }
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


}
