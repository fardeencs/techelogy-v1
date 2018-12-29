import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { STATUS_ARRAY } from '../../../modules';
import { CountryService } from '../../../services/country.service';
import { GroupFormModel } from '../../../models/group/group.model';
import { MerchantService } from '../../../services/merchant.service';
import { GroupService } from '../../../services/group.service';
import {filter,map,mergeMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";

@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.css'] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public group: GroupFormModel;
  public STATUS_OPTIONS: any;
  public groupToken: string;
  public permissions: Array<string> = [];
  public countries: Array<Object> = [];
  public selectedCountries: any;
  public pageInfo;

  @ViewChild('groupForm') groupForm: ElementRef;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,private translate:TranslateService,private titleService:Title,
    private modalService: BsModalService, protected _location: Location, private _groupService: GroupService,
    private _merchantService: MerchantService) {
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

    this.group = new GroupFormModel();
    this.groupToken = this._activatedRoute.snapshot.params.id;
    this.STATUS_OPTIONS = STATUS_ARRAY;
    this.group.isActive = 1;
    if (this.groupToken) {
      this.getDetail();
    }
  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.getCountries();
  }

  ngAfterViewInit() { }

  getCountries() {
    this._merchantService.getCountryList().subscribe((response) => {
      this.countries = response.data;
    },(error) => {
      this.setError(error.message);
    });
  }

  getDetail() {
    this._groupService.view(this.groupToken).subscribe((response) => {
      this.group = response;
      this.selectedCountries = response.countries;
      this.onCountryChange(this.selectedCountries);
    },(error) => {
        this.setError(error.message);
      });
  }

  action() {
    if (this.groupToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.group.validate('groupForm')) {
        if (!this.group.countryIds) {
          this.setError('COUNTRIES_IS_REQUIRED');
        } else {
            try {
              this
                ._groupService
                .add(this.group)
                .subscribe((response) => {
                  this.groupForm.nativeElement.reset();
                  this.setSuccess(response.message);
                  this.navigateByUrl('group/view');
                },(error) => {
                  this.setError(error.message);
                });
            } catch (error) {
              console.log(error);
            }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public update() {
    try {
      if (this.group.validate('groupForm')) {
        if (!this.group.countryIds) {
          this.setError('COUNTRIES_IS_REQUIRED');
        } else {
          try {
            this
              ._groupService
              .update(this.groupToken, this.group)
              .subscribe((response) => {
                this.groupForm.nativeElement.reset();
                this.setSuccess('GROUP_UPDATED_SUCCESSFULLY');
                this.back();
              },(error) => {
                this.setError(error.message);
              });
          } catch (error) {
            console.log(error);
          }
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
          // this._router.navigate(['/group/view']);
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
    this.showConfirmationDeleteModal(this.groupToken);
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
      this._groupService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('GROUP_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
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
    debugger;
    this.group.countryIds = (_.map(selectedArr, 'countryCode')).toString();
  }
}
