import {
  Component,
  OnInit,
  AfterViewInit,
  NgModule,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BaseComponent } from '../../base.component';
import { RoleFormModel } from '../../../models/form/role.model';
import { BsModalService } from 'ngx-bootstrap';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm.component';
import { Location } from '@angular/common';
import { RoleService } from '../../../services/role.service';
import { StatesService } from '../../../services/states.service';
import { States } from '../../../models/states/states.model';
import {filter,map,mergeMap} from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";


@Component({ templateUrl: './view.component.html', styleUrls: ['./view.component.css'] })
export class ViewComponent extends BaseComponent implements OnInit,
  AfterViewInit {

  public data: any;
  public lookups : any;
  public STATUS_OPTIONS: any;
  public token: string;
  public permissions: Array<string> = [];
  public pageInfo;

  constructor(protected _router: Router
    , public _activatedRoute: ActivatedRoute,
    private modalService: BsModalService
    , protected _location: Location
    , private _statesService: StatesService
    , private translate:TranslateService
    , private titleService:Title) {
    super(_router, _location);
    this.data = new States();
    this.token = this._activatedRoute.snapshot.params.id;
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

    if (this.token) {
      this.getLookup();
      this.getDetail();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.permissions = this._activatedRoute.snapshot.data['permission'];
  }

  getLookup() {
    this._statesService.getLookup().subscribe((response) => {
      this.lookups = response;
    },(error) => {
        this.setError(error.message);
      });
  }

  getDetail() {
    this
      ._statesService
      .view(this.token)
      .subscribe((response) => {
        this.data = response;
      },(error) => {
        this.setError(error.message);
      });
  }

  onEdit(item) {
    this.navigateByUrl('/state/edit/' + this.token);
  }

  /**
   * delete by id
  **/
  public onDelete() {
    this.showConfirmationDeleteModal(this.token);
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
      this._statesService
        .delete(id)
        .subscribe((response) => {
          this.setSuccess('STATE_DELETED_SUCCESSFULLY');
          this.back();
        },(error) => {
          this.setError(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  }
}

/*

//our root app component
import {Component, NgModule, ViewChild} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule, NgForm, FormGroup } from '@angular/forms'


@Component({
  selector: 'my-app',
  template: `
    <form #myForm="ngForm" (ngSubmit)="onSubmit($event)">
      <span *ngFor="let value of values;let i = index">
       <input type="text" [(ngModel)]="value.text" name="text-{{i}}"/>
       <br/>
      </span>
      <input type="submit" value="Save" [disabled]="!myForm.dirty" />
    </form>
    Form dirty - {{ formStatus }}
  `,
})
export class App {
  values: Model[];
  @ViewChild('myForm') myForm: FormGroup;
  private formStatus: boolean;
  
  constructor() {
    this.values = [new Model("1"),new Model("2"),new Model("3")];
  }
  
  ngOnInit() {
    this.myForm.valueChanges.subscribe(v => this.formStatus = this.myForm.dirty);
  }
  
  onSubmit(event){
    event.preventDefault();
    
    // So here we have 2 options
    //1. Either to `reset` the form and pass prev form value as a param
    const { myForm: { value: formValueSnap } } = this; // const formValueSnap = this.myForm.value;
    this.myForm.reset(formValueSnap, true);
   
    //2. Or use helper method to loop through all the controls
    // and mark them as pristine
    // this._markFormPristine(this.myForm);
    
    this.formStatus = this.myForm.dirty;
  }
  
  private _markFormPristine(form: FormGroup | NgForm): void {
    Object.keys(form.controls).forEach(control => {
      form.controls[control].markAsPristine();
    });
  }
}

@NgModule({
  imports: [ BrowserModule, FormsModule ],
  declarations: [ App ],
  bootstrap: [ App ]
})
export class AppModule {}

export class Model
{
  constructor(public text: string){
  
  }
}
*/
