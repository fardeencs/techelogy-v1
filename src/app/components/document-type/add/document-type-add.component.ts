import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DocumentTypeService } from '../../../services/document-type.service';
import { AddDocumentTypeModel } from '../../../models/document-type/addDocumentType.model';
// import { RoleService } from '../../../services/role.service';
import * as Constant from '../../../modules/constants';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { COMMON_STATUS_ARRAY } from '../../../modules';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';

@Component({
  templateUrl: './document-type-add.component.html',
  styleUrls: ['./document-type-add.component.css']
})

export class DocumentTypeAddComponent extends BaseComponent implements OnInit {
  public documentType: AddDocumentTypeModel;
  public document_type_token: string;
  public STATUS_OPTIONS: any;
  public permissions: Array<string> = [];
  public pageInfo;
  @ViewChild('addDocumentTypeForm') addDocumentTypeForm: ElementRef;
  constructor(
    protected _router: Router,
    public documentTypeService: DocumentTypeService,
    public activeRoute: ActivatedRoute,
    private bsModalService: BsModalService,
    private translate: TranslateService,
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

    this.documentType = new AddDocumentTypeModel();
    this.document_type_token = this.activeRoute.snapshot.params['id'];
    this.STATUS_OPTIONS = COMMON_STATUS_ARRAY;
    this.documentType.status = 1;
    if (this.document_type_token) {
      this.getDocumentTypeDetail();
    }
  }

  ngOnInit() {
    this.permissions = this.activeRoute.snapshot.data['permission'];
  }

  getDocumentTypeDetail() {
    this.documentTypeService.getDocumentTypeDetail(this.document_type_token).subscribe((response) => {
      this.documentType.documentTypeName = response['documentTypeName'];
      this.documentType.status = response['status'];
    });
  }

  public documentTypeAction(): void {
    try {
      if (this.document_type_token !== undefined) {
        if (this.documentType.validate('addDocumentTypeForm')) {
          this.documentTypeService.updateDocumentType(this.document_type_token, this.documentType).subscribe((response) => {
            this.setSuccess('DOCUMENT_TYPE_ADDED');
            setTimeout(() => this._router.navigate(['/document-type/view']), 500);
          },(error) => {
            this.setError(error.message);
          });
        }
      } else {
        if (this.documentType.validate('addDocumentTypeForm')) {
          this.documentTypeService
            .addNewDocumentType(this.documentType)
            .subscribe((response) => {
              this.addDocumentTypeForm.nativeElement.reset();
              this.setSuccess('SCHEME_ADDED');
              setTimeout(() => this._router.navigate(['/document-type/view']), 500);
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
          // this._router.navigate(['/document-type/view']);
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

  public onDeleteDocumentType() {
    this.showConfirmationDeleteModal(this.document_type_token);
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
        this.deleteDocumentType(item);

      } else if (result === false) {
        // when pressed No
      } else {
        // When closing the modal without no or yes
      }
    });
  }

  /**
   * delete document type by id
   */
  deleteDocumentType(id): void {
    try {
      this.documentTypeService
        .deleteDocumentType(id)
        .subscribe((response) => {
          this.setSuccess('DOCUMENT_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  onEdit() {
    this.navigateByUrl('/document-type/edit/' + this.document_type_token);
  }
}
