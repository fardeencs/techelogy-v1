import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { STATUS_ARRAY } from '../../../modules';
import { StatesService } from '../../../services/states.service';
import { States } from '../../../models/states/states.model';
import * as _ from 'lodash';
import { DropdownService } from './dropdown.service';
import { isNil, remove, reverse } from 'lodash';
import { TreeviewEventParser, OrderDownlineTreeviewEventParser, TreeviewConfig, TreeviewComponent, TreeviewItem, DownlineTreeviewItem, TreeviewHelper } from '../../../shared/dropdown/treeview-dropdown-lib';
import {filter,map,mergeMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import { log } from 'util';



@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.css'],
providers: [
  DropdownService,
  { provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser },
  { provide: TreeviewConfig, useClass: AddComponent }
] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public data: any;
  public STATUS_OPTIONS: any;
  public lookups: any = {};
  public token: string;
  public permissions: Array<string> = [];
  public isCodeEnable = false;
  public pageInfo;

  @ViewChild('dataForm') dataForm: ElementRef;



   /**
     *  treeview dropdown variable  
     */
 //@ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
    dropdownEnabled = true;
    items: TreeviewItem[];
    rows: string[];
    values: number[];
    config = TreeviewConfig.create({
        hasAllCheckBox: true,
        hasFilter: true,
        hasCollapseExpand: true,
        decoupleChildFromParent: false,
        maxHeight: 400
    });

  /**
   * end
   */

  constructor(protected _router: Router
    , public _activatedRoute: ActivatedRoute
    , private modalService: BsModalService
    , protected _location: Location
    , private _statesService: StatesService
    , private service: DropdownService
    , private translate:TranslateService
    , private titleService:Title) {
    super(_router, _location);
    this.data = new States();
    //this.data.isActive = "1";
    this.data.formGroup.setValue(States.toFormModel(this.data));
    this.token = this._activatedRoute.snapshot.params.id;
    this.STATUS_OPTIONS = STATUS_ARRAY;
   

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


    if (this.token) {
      this.getDetail();
    }
  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.getLookup();

    this.items = this.service.getData();
  }

  ngAfterViewInit() { }

  /**
   * get all lookup
   */
  getLookup() {
    this._statesService.getLookup().subscribe((response) => {
      if (response && _.isArray(response.data))
        this.lookups.countries = response.data;
    },(error) => {
      this.setError(error.message);
    });
  }

  getDetail() {
    this._statesService.view(this.token).subscribe((response) => {
      response.isActive = response.isActive.toString();
      this.data.formGroup.setValue(States.toFormModel(response));
    },(error) => {
        this.setError(error.message);
      });
  }


  action() {
    if (this.token !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.data.formGroup.valid) {
        try {
          this
            ._statesService
            .add(this.data.formGroup.value)
            .subscribe((response) => {
             // this.dataForm.nativeElement.reset();
             States.resetAllFields(this.data.formGroup);
             //this.data.resetAllFields();
              this.setSuccess(response.message);
              this.navigateByUrl('state/view');
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
      else{
        States.validateAllFields(this.data.formGroup);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public update() {
    try {
      if (this.data.formGroup.valid) {
        try {
          this
            ._statesService
            .update(this.token, this.data.formGroup.value)
            .subscribe((response) => {
             // this.dataForm.nativeElement.reset();
             //this.data.resetAllFields();
             States.resetAllFields(this.data.formGroup);
              this.setSuccess('STATE_UPDATED_SUCCESSFULLY');
              this.back();
            },(error) => {
              this.setError(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }else{
        States.validateAllFields(this.data.formGroup);
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
          // this._router.navigate(['/state/view']);
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
    this.showConfirmationDeleteModal(this.token);
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
      this._statesService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('STATE_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }


 /**
  * treeview dropdown
  */


    buttonClasses = [
        'btn-outline-primary',
        'btn-outline-secondary',
        'btn-outline-success',
        'btn-outline-danger',
        'btn-outline-warning',
        'btn-outline-info',
        'btn-outline-light',
        'btn-outline-dark'
    ];
    //buttonClass = this.buttonClasses[1];

    onFilterChange(value: string) {
        console.log('filter:', value);
    }

    onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
        this.rows = [];
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
            this.rows.push(row);
        });
    }

    removeItem(item: TreeviewItem) {
        let isRemoved = false;
        for (const tmpItem of this.items) {
            if (tmpItem === item) {
                remove(this.items, item);
            } else {
                isRemoved = TreeviewHelper.removeItem(tmpItem, item);
                if (isRemoved) {
                    break;
                }
            }
        }

        if (isRemoved) {
            //this.treeviewComponent.raiseSelectedChange();
        }
    }


 /**
  * end code
  */
}
