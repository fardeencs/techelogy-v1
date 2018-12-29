import { DocumentuploadModel } from './../../../../models/add-merchant/docUpload.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MerchantService } from '../../../../services/merchant.service';
import { BaseComponent } from '../../../base.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../../shared/dialog/confirm/confirm.component';
import {STATE_EVENT} from "../../../../modules/constants";
import {GlobalState} from "../../../../global.state";

@Component({
  selector: 'app-document-upload',
  templateUrl: './documentUpload.component.html',
  styleUrls: ['./documentUpload.component.scss']
})

export class DocumentuploadComponent extends BaseComponent implements OnInit {
  @Output() buttonHandler = new EventEmitter<Object>();
  @Input() clickedTab;
  @Input() storeDetail;
  @Input() isDetailSection = false;
  uploadedDocuments: Array<Object> = [];
  constructor(protected _router: Router,
    private _merchantService: MerchantService,
    private bsModalService: BsModalService,
    private _globalState:GlobalState,
    protected _location: Location) {
    super(_router, _location);
  }

  ngOnInit() {
    if (this.storeDetail['rid']) {
      this.loadUploadedDocuments();
    }
  }

  /**
   * File upload event
   * @param e
   */
  fileEvent(event, documentTypeId, documentId) {
    const e = (event.srcElement||event.target);
    if (e.files.length > 0) {
      const file = e.files[0];
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > this.MAX_LENGTH_CONFIG.MAX_FILE_SIZE) {
        e.value = null;
        this.setError('MAX_FILE_SIZE_EXCEED');
      } else if (!this.MAX_LENGTH_CONFIG.ALLOWED_FILE_EXTENSION.exec(file.name)) {
        e.value = null;
        this.setError('FILE_FORMAT_EXCEPTED');
      } else {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentTypeId', documentTypeId);

        // upload to server
        this._merchantService.addFiles(formData,this.storeDetail['rid']).subscribe((res) => {

          const obj: DocumentuploadModel = new DocumentuploadModel();
          obj.documentTypeId = documentTypeId;
          obj.documentValue = res['link'];
          obj.documentId = documentId;

          // save to server
          this._merchantService.saveFile(this.storeDetail['rid'], obj)
            .subscribe((response) => {
              this.setSuccess(response['message']);
              this.loadUploadedDocuments();
              e.value = null;
            },(error) => {
              this.setError(error.message);
              e.value = null;
            });

        });
      }
    }
  }
  /**
   * list uploaded documents
   */

  loadUploadedDocuments() {
    this._merchantService
      .getUploadedDocumentList(this.storeDetail['rid'])
      .subscribe((response) => {
        this.uploadedDocuments = response['data'];
        this._globalState.notifyDataChanged(STATE_EVENT.CHECK_INCOMPLETE_MERCHANT_STEP,true);
      },(error) => {
      });
  }

  /**
   * Delete uploaded documents
   */
  deleteDocument(item) {
    this._merchantService
      .deleteUploadedDocument(item['rid'])
      .subscribe((response) => {
        this.loadUploadedDocuments();
      },(error) => {
        this.setError(error.message);
      });
  }
  /**
   * GET file extension from url
   */
  getFileExtension(url) {
    const fileExtension = url.replace(/^.*\./, '');
    return fileExtension;
  }

  /**
   * GET file type from extension
   */
  getFileType(fileExtension: string) {
    let type = '';
    if (('jpg|jpeg|png').indexOf(fileExtension) != -1) {
      type = 'image';
    } else if (('pdf').indexOf(fileExtension) != -1) {
      type = 'pdf';
    } else if (('doc|docx|odt|txt').indexOf(fileExtension) != -1) {
      type = 'word';
    } else {
      type = 'document';
    }
    return type;
  }


  /**
   * Save and continue button handler
   */
  public onNextClick() {
    // checking atleast one document from each type is uploaded
    let allFilesTypeUploaded = true;
    _.each(this.uploadedDocuments, function (v, k) {
      if (v['documents'].length == 0) { // any node has blank array
        allFilesTypeUploaded = false;
        return false;
      }
    });

    if (!allFilesTypeUploaded) {
      this.setError('ONE_DOCUMET_REQUIRED');
    } else {
      setTimeout(() => {
        this.buttonHandler.emit({
          type: 'SAVE_CONTINUE',
          step: this.clickedTab,
          mode: 'ADD_UPDATE'
        });
      }, 500);
    }
  }
  /**
   * previous button handler
   */
  public moveToPrevious() {
    setTimeout(() => {
      this.buttonHandler.emit({
        type: 'PREVIOUS',
        step: this.clickedTab
      });
    }, 500);
  }

  /*
   * Confirm Delete button functionality
   */
  public confirmDeleteDocument(item) {
    try {
      const modal = this.bsModalService.show(ConfirmDialogComponent);
      (<ConfirmDialogComponent>modal.content).showConfirmationModal(
        'COMMON.BUTTONS.DELETE',
        'COMMON.MODALS.ARE_U_SURE_TO_DELETE',
        'COMMON.BUTTONS.YES',
        'COMMON.BUTTONS.NO',
      );
      (<ConfirmDialogComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          // when pressed Yes
          this.deleteDocument(item);
        } else if (result === false) {
          // when pressed No
        } else {
          // When closing the modal without no or yes
        }
      });
    } catch (error) { }
  }
}

