import {
  Component,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { CitiesFormModel } from '../../../models/cities/cities.model';
import { CitiesService } from '../../../services/cities.service';

@Component({ templateUrl: './view.component.html', styleUrls: ['./view.component.css'] })
export class ViewComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public city: any;
  public STATUS_OPTIONS: any;
  public citiesToken: string;
  public permissions: Array<string> = [];

  constructor(protected _router: Router, public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService, protected _location: Location, private _citiesService: CitiesService) {
    super(_router, _location);
    this.city = new CitiesFormModel();
    this.citiesToken = this._activatedRoute.snapshot.params.id;
    if (this.citiesToken) {
      this.getDetail();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  getDetail() {
    this
      ._citiesService
      .view(this.citiesToken)
      .subscribe((response) => {
        this.city = response;
      },(error) => {
        this.setError(error.message);
      });
  }

  onEdit(item) {
    this.navigateByUrl('/cities/edit/' + this.citiesToken);
  }

  /**
   * delete by id
  **/
  public onDelete() {
    this.showConfirmationDeleteModal(this.citiesToken);
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
      this._citiesService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('CITIES_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
