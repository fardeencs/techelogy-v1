import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";


import { ConfirmDialogComponent } from "./confirm/confirm.component";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  imports: [FormsModule, CommonModule,TranslateModule],
  declarations: [
    ConfirmDialogComponent
  ],
  exports: [ConfirmDialogComponent],
  entryComponents: [
    ConfirmDialogComponent
  ]

})
export class DialogModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DialogModule
    }
  }
}
