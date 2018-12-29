import { Router,ActivatedRoute,NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { TrainingVideosService } from '../../../services/training-videos.service';

import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { Location } from '@angular/common';

import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";

import {filter,map,mergeMap} from 'rxjs/operators';
import { UserIdentityService } from '../../../services/user_identity.service';

import { CURRENCY_STATUS_OPTION } from '../../../modules';
import { TrainingVideosFormModel } from '../../../models/training-videos/training-videos.model';

@Component({
  selector: 'app-customer-info',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddComponent extends BaseComponent implements OnInit {
  @Output() buttonHandler = new EventEmitter<Object>();
  @Input() clickedTab;
  @Input() storeDetail;
  @Input() isDetailSection = false;
  @ViewChild('trainingVideosForm') trainingVideosForm: ElementRef;

  public trainingVideos: TrainingVideosFormModel;
  public permissions: Array<string> = [];
  public trainingVideosToken: string;
  public defaultValue : any;
  public STATUS_OPTIONS: any;
  public pageInfo;
  public defaultFont: any;
  public isEditSection : boolean = false;
  
 
  constructor(_router: Router, private trainingVideosService: TrainingVideosService, protected _location: Location,private modalService: BsModalService, public _activatedRoute: ActivatedRoute,private translate:TranslateService,private titleService:Title) {
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
    this.trainingVideos = new TrainingVideosFormModel();
    this.trainingVideosToken = this._activatedRoute.snapshot.params.id;
    this.STATUS_OPTIONS = CURRENCY_STATUS_OPTION;
    this.trainingVideos.isActive = 0;
    if (this.trainingVideosToken) {
      this.isEditSection = true;
      this.getDetail();
    }
  }
  ngOnInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
    this.defaultFont = {'label':'Please select'};
    this.trainingVideosForm.nativeElement.reset();
  }

  ngAfterViewInit() { }

  getDetail() {
    this.trainingVideosService.view(this.trainingVideosToken).subscribe((response) => {
      this.trainingVideos = response;
    },(error) => {
      this.setError(error.message);
    });
  }


  action() {
    if (this.trainingVideosToken !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  public add() {
    try {
      if (this.trainingVideos.validate('trainingVideosForm')) {
        try {
          this
            .trainingVideosService
            .add(this.trainingVideos)
            .subscribe((response) => {
              this.setSuccess(response.message);
              this.navigateByUrl('trainingvideo/view');
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
      if (this.trainingVideos.validate('trainingVideosForm')) {
        try {
          this
            .trainingVideosService
            .update(this.trainingVideosToken, this.trainingVideos)
            .subscribe((response) => {
             // this.customerForm.nativeElement.reset();
              this.setSuccess('TRAINING_VIDEOS_UPDATED_SUCCESSFULLY');
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
          // this._router.navigate(['/customer/view']);
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
    this.showConfirmationDeleteModal(this.trainingVideosToken);
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
        let ids: any = [];
        ids.push(item);
        this.delete(ids);

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
      this.trainingVideosService
        .massDelete(id)
        .subscribe((response) => {
          this.setSuccess(response.message);
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
