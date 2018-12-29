import {
  Component,
  OnInit,
  AfterViewInit,
  NgModule,
  ElementRef,
  ViewChild
} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { CountryFormModel } from '../../../models/country/country.model';
import { GroupService } from '../../../services/group.service';
import { GroupFormModel } from '../../../models/group/group.model';
import {filter,map,mergeMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";

@Component({ templateUrl: './view.component.html', styleUrls: ['./view.component.css'] })
export class ViewComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public group: GroupFormModel;
  public STATUS_OPTIONS: any;
  public groupToken: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,private translate:TranslateService,private titleService:Title,
    private modalService: BsModalService, protected _location: Location, private _groupService: GroupService) {
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
    if (this.groupToken) {
      this.getDetail();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  getDetail() {
    this
      ._groupService
      .view(this.groupToken)
      .subscribe((response) => {
        this.group = response;
      },(error) => {
        this.setError(error.message);
      });
  }

  onEdit(item) {
    this.navigateByUrl('/group/edit/' + this.groupToken);
  }

  /**
   * delete by id
  **/
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
}
