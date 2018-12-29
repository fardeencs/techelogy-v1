import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DocumentTypeListModel } from '../../../models/document-type/documentType.list.model';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
// import { RoleService } from '../../../services/role.service';
import { DocumentTypeService } from '../../../services/document-type.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';

@Component({
  templateUrl: './detail-type.component.html',
  styleUrls: ['./detail-type.component.css']
})
export class DocumentTypeDetailComponent extends BaseComponent implements OnInit {
  public documentType: DocumentTypeListModel;
  public document_type_token;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router,
    public activeRoute: ActivatedRoute,
    public documentTypeService: DocumentTypeService,
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

    this.documentType = new DocumentTypeListModel();
    this.document_type_token = this.activeRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.permissions = this.activeRoute.snapshot.data['permission'];
    this.getDocumentTypeDetail();
  }

  getDocumentTypeDetail() {
    this.documentTypeService.getDocumentTypeDetail(this.document_type_token).subscribe((response) => {
      this.documentType.documentTypeName = response['documentTypeName'];
      this.documentType.documentTypeId = response['documentTypeId'];
      this.documentType.statusLabel = response['statusLabel'];
      this.documentType.createdDate = response['createdDate'];
      this.documentType.updatedDate = response['updatedDate'];
    });
  }

  onEdit() {
    this.navigateByUrl('/document-type/edit/' + this.document_type_token);
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
        this.deleteDocumentType();

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  deleteDocumentType(): void {
    try {
      this.documentTypeService
        .deleteDocumentType(this.document_type_token)
        .subscribe((response) => {
          this.setSuccess('DOCUMENT_DELETED_SUCCESSFULLY');
          setTimeout(() => this._router.navigate(['/document-type/view']), 500);
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

}
