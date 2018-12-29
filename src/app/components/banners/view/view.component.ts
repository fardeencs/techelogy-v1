import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import {filter,map,mergeMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {BannerFormModel} from "../../../models/banner/banner.model";
import {BannerService} from "../../../services/banners.service";
import * as Constant from '../../../modules/constants';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent extends BaseComponent implements OnInit,AfterViewInit {

  public banner: BannerFormModel;
  public STATUS_OPTIONS: any;
  public bannerID: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,private translate:TranslateService,private titleService:Title,
    private modalService: BsModalService, protected _location: Location, private _bannerService: BannerService) {
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

    this.banner = new BannerFormModel();
    this.bannerID = this._activatedRoute.snapshot.params['id'];
    if (this.bannerID) {
      this.getDetail();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  /**
   * Get Banner Detail
   */
  getDetail() {
    this
      ._bannerService
      .view(this.bannerID)
      .subscribe((response) => {
        this.banner = response;
      },(error) => {
        this.setError(error.message);
      });
  }

  /**
   * On Edit
   * @param item
   */
  onEdit(item) {
    this.navigateByUrl('/banner/edit/' + this.bannerID);
  }

  /**
   * delete by id
  **/
  public onDelete() {
    this.showConfirmationDeleteModal(this.bannerID);
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
      this._bannerService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('BANNER_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get Location Detail
   */
  getLocationDetail(locationID){
    const IDs = locationID ? locationID.toString().split(',') : [];
    const locationArr = Constant.BANNER_LOCATION;
    let arr = [];
    IDs.forEach((item)=>{
      locationArr.forEach((v,k)=>{
        if(v['value'] == item){
          arr.push(v['label']);
        }
      });
    });

    return arr.length > 0 ? arr.join(' ,') : '';
  }

}
