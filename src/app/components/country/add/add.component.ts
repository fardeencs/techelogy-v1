import { Component, OnInit, AfterViewInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { CountryFormModel } from '../../../models/country/country.model';
import { STATUS_ARRAY } from '../../../modules';
import { CountryService } from '../../../services/country.service';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";

@Component({ templateUrl: './add.component.html', styleUrls: ['./add.component.css'] })
export class AddComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public country: any;
  public STATUS_OPTIONS: any;
  public countryToken: string;
  public permissions: Array<string> = [];
  public isCodeEnable=false;
  public pageInfo;

  @ViewChild('countryForm') countryForm: ElementRef;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,private translate:TranslateService,private titleService:Title,
    private modalService: BsModalService, protected _location: Location, private _countryService: CountryService) {
    super(_router, _location)

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

    this.country = new CountryFormModel();
    this.countryToken = this._activatedRoute.snapshot.params.id;
    this.STATUS_OPTIONS = STATUS_ARRAY;
    this.country.isActive = 1;
    if (this.countryToken) {
      this.getDetail();
    }
  }

  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  ngAfterViewInit() { }

  getDetail() {
    this._countryService.view(this.countryToken).subscribe((response) => {
      this.country = response;
      if(typeof this.country.rid == 'undefined'){
        this.isCodeEnable=false;
      }else{
        this.isCodeEnable=true;
      }
    },(error) => {
        this.setError(error.message);
      });
  }

  action() {
    if (this.countryToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.country.validate('countryForm')) {
        try {
          this
            ._countryService
            .add(this.country)
            .subscribe((response) => {
              this.countryForm.nativeElement.reset();
              this.setSuccess(response.message);
              this.navigateByUrl('country/view');
            },(error) => {
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
      if (this.country.validate('countryForm')) {
        try {
          this
            ._countryService
            .update(this.countryToken, this.country)
            .subscribe((response) => {
              this.countryForm.nativeElement.reset();
              this.setSuccess('COUNTRY_UPDATED_SUCCESSFULLY');
              this.back();
            },(error) => {
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
          // this._router.navigate(['/country/view']);
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
    this.showConfirmationDeleteModal(this.countryToken);
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
      this._countryService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('COUNTRY_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
