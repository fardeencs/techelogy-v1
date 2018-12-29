import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { CertificateService } from '../../../services/certificate.service';
import { AddCertificateModel } from '../../../models/manage-certificate/addCertificate.model';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { COMMON_STATUS_ARRAY, COMMON_REQUIRED_ARRAY } from '../../../modules';
import {filter,map,mergeMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";

@Component({
  templateUrl: './manage-certificate-add.component.html',
  styleUrls: ['./manage-certificate-add.component.css']
})

export class ManageCertificateAddComponent extends BaseComponent implements OnInit {
  public certificate: AddCertificateModel;
  public certificate_token: string;
  public actionName: string;
  public STATUS_OPTIONS: any;
  public REQUIRED_OPTIONS: any;
  public permissions: Array<string> = [];
  public pageInfo;
  @ViewChild('addCertificateForm') addCertificateForm: ElementRef;

  constructor(
    protected _router: Router,
    public certificateService: CertificateService,
    public activeRoute: ActivatedRoute,
    private bsModalService: BsModalService,
    private translate:TranslateService,
    private titleService: Title,
    protected _location: Location) {
    super(_router, _location);

    this
      ._router.events
      .pipe(filter(event => event instanceof NavigationEnd)
        ,map(() => this.activeRoute)
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

    this.certificate = new AddCertificateModel();
    this.certificate_token = this.activeRoute.snapshot.params['id'];
    this.STATUS_OPTIONS = COMMON_STATUS_ARRAY;
    this.REQUIRED_OPTIONS = COMMON_REQUIRED_ARRAY;
    this.certificate.status = 1;
    this.certificate.required = 1;
    if (this.certificate_token) {
      this.getCertificateDetail();
    }
  }

  ngOnInit() {
    this.permissions = this.activeRoute.snapshot.data['permission'];
  }

  getCertificateDetail() {
    this.certificateService.getCertificateDetail(this.certificate_token).subscribe((response) => {
      this.certificate.certificateTypeName = response['certificateTypeName'];
      this.certificate.required = response['isRequired'];
      this.certificate.status = response['status'];
    });
  }

  public certificateAction(): void {
    try {
      if (this.certificate_token !== undefined) {
        if (this.certificate.validate('addCertificateForm')) {
          this.certificateService.updateCertificate(this.certificate_token, this.certificate).subscribe((response) => {
            this.setSuccess('USER_UPDATED_SUCCESSFULLY');
            setTimeout(() => this._router.navigate(['/certificate/view']), 500);
          },(error) => {
            this.setError(error.message);
          });
        }
      } else {
        if (this.certificate.validate('addCertificateForm')) {
          this.certificateService
            .addNewCertificate(this.certificate)
            .subscribe((response) => {
              this.addCertificateForm.nativeElement.reset();
              this.setSuccess('CERTIFICATE_ADDED_SUCCESSFULLY');
              setTimeout(() => this._router.navigate(['/certificate/view']), 500);
            },(error) => {
              this.setError(error.message);
            });
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  public cancelButtonAction(): void {
    try {
      const modal = this.bsModalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.CANCEL',
        'COMMON.MODALS.CHANGES_NOT_SAVED',
        'COMMON.BUTTONS.OK',
        'COMMON.BUTTONS.CANCEL'
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          // this._router.navigate(['/certificate/view']);
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

  public onDeleteCertificate() {
    this.showConfirmationDeleteModal(this.certificate_token);
  }

  /**
   * confirm modal delete
  **/
  showConfirmationDeleteModal(item): void {
    const modal = this.bsModalService.show(ConfirmDialogComponent);
    (<ConfirmDialogComponent>modal.content).showConfirmationModal(
      'COMMON.BUTTONS.DELETE',
      'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
      'COMMON.BUTTONS.YES',
      'COMMON.BUTTONS.NO'
    );

    (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        // when pressed Yes
        this.deleteCertificate(item);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete certificate by id
   */
  deleteCertificate(id): void {
    try {
      this.certificateService
        .deleteCertificate(id)
        .subscribe((response) => {
          this.setSuccess('CERTIFICATE_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
