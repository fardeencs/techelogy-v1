import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {FormValidationErrorComponent} from "./form-validation-error.component";


@NgModule({
  imports: [FormsModule,ReactiveFormsModule, CommonModule,TranslateModule],
  declarations: [
    FormValidationErrorComponent
  ],
  exports: [FormValidationErrorComponent]

})
export class FormValidationErrorModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FormValidationErrorModule
    }
  }
}
