import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from './datatable/datatable.module';
import { DataTableSearchModule } from './dtsearch/dtsearch.module';
import { ModalModule,BsDatepickerModule } from 'ngx-bootstrap';
import { DialogModule } from './dialog/dialog.module';
import { DownloadFileModule } from './download-file/download-file.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {NumericValidationModule} from './numeric-validation/numeric-validation.module';
import { AccordionModule } from 'ngx-bootstrap';
import {FormValidationErrorModule} from "./form-validation-error/forma-validation-error.module";
import { DropdownModule } from './dropdown/dropdown.module';
import { ControlMessages } from './validation/control-messages.component';
import { DefaultImageDirective } from '../directives/default-image.directive';
import { TranslateHelperService } from './translate-helper/translate-helper.service';


@NgModule({
  imports: [
    FormsModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    DataTableSearchModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    NgSelectModule,
    DialogModule,
    DownloadFileModule,
    NumericValidationModule,
    FormValidationErrorModule,
    DropdownModule
  ],
  declarations: [
    ControlMessages,
    DefaultImageDirective
  ],
  providers: [
    TranslateHelperService
  ],
  exports: [
    FormsModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    DataTableModule,
    DataTableSearchModule,
    DialogModule,
    DownloadFileModule,
    NgSelectModule,
    NumericValidationModule,
    AccordionModule,
    FormValidationErrorModule,
    DropdownModule,
    ControlMessages,
    DefaultImageDirective
  ]
})
export class SharedModule { 
  //this inclusion is required to register the change translation listener
  constructor(private translate : TranslateHelperService){}
}
