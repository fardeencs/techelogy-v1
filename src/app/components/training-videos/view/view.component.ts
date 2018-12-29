import {
  Component,
  OnInit,
  AfterViewInit,
  NgModule,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute,NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { RoleFormModel } from '../../../models/form/role.model';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { CUSTOMER_PLATFORM_OPTION_VALUE,CUSTOMER_SIGNUP_METHOD_VALUE, CUSTOMER_SIGNUP_METHOD_CONSTANTS, CUSTOMER_SIGNUP_PLATFORM_CONSTANTS } from '../../../modules';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {filter,map,mergeMap} from 'rxjs/operators';
import { TrainingVideosFormModel } from '../../../models/training-videos/training-videos.model';
import { TrainingVideosService } from '../../../services/training-videos.service';


@Component({ templateUrl: './view.component.html', styleUrls: ['./view.component.css'] })
export class ViewComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public trainingVideos: any;
  public STATUS_OPTIONS: any;
  public trainingVideosToken: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService, protected _location: Location, private trainingVideosService: TrainingVideosService,private translate:TranslateService,private titleService:Title) {
    super(_router, _location);
    this.trainingVideos = new TrainingVideosFormModel();
    this.trainingVideosToken = this._activatedRoute.snapshot.params.id;
    if (this.trainingVideosToken) {
      this.getDetail();
    }
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
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  getDetail() {
    this
      .trainingVideosService
      .view(this.trainingVideosToken)
      .subscribe((response) => {
        this.trainingVideos = response;
      },(error) => {
        this.setError(error.message);
      });
  }

  onEdit(item) {
    this.navigateByUrl('/trainingvideo/edit/' + this.trainingVideosToken);
  }

  /**
   * delete by id
  **/
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
  delete(ids: Array<string>): void {
    try {
      this.trainingVideosService
        .massDelete(ids)
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
