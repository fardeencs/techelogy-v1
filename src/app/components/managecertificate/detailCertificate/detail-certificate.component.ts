import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';

import { CertificateListModel } from '../../../models/manage-certificate/certificate.list.model';
// import { RoleService } from '../../../services/role.service';
import { CertificateService } from '../../../services/certificate.service';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';

@Component({
  templateUrl: './detail-certificate.component.html',
  styleUrls: ['./detail-certificate.component.css']
})
export class ManageCertificateDetailComponent extends BaseComponent implements OnInit {
  public certificate: CertificateListModel;
  public certificate_token: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router,
    public activeRoute: ActivatedRoute,
    public certificateService: CertificateService,
    private translate: TranslateService,
    private bsModalService: BsModalService,
    protected _location: Location,
    private titleService: Title
  ) {
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
    this.certificate = new CertificateListModel();
    this.certificate_token = this.activeRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.permissions = this.activeRoute.snapshot.data['permission'];
    this.getCertificateDetail();
  }

  getCertificateDetail() {
    this.certificateService.getCertificateDetail(this.certificate_token).subscribe((response) => {
      this.certificate.certificateTypeName = response['certificateTypeName'];
      this.certificate.certificateTypeId = response['certificateTypeId'];
      this.certificate.requiredLabel = response['requiredLabel'];
      this.certificate.statusLabel = response['statusLabel'];
      this.certificate.createdDate = response['createdDate'];
      this.certificate.updatedDate = response['updatedDate'];
    });
  }

  onEdit() {
    this.navigateByUrl('/certificate/edit/' + this.certificate_token);
  }

  onDelete() {
    this.showConfirmationDeleteModal();
  }

  showConfirmationDeleteModal(): void {
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
        this.deleteCertificate();

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  deleteCertificate(): void {
    try {
      this.certificateService
        .deleteCertificate(this.certificate_token)
        .subscribe((response) => {
          this.setSuccess('CERTIFICATE_DELETED_SUCCESSFULLY');
          setTimeout(() => this._router.navigate(['/certificate/view']), 500);
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
