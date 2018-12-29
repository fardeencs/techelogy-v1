import {NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClickOutsideDirective} from "./clickoutside.component";

@NgModule({
  imports: [CommonModule],
  declarations: [
    ClickOutsideDirective
  ],
  exports: [ClickOutsideDirective]
})
export class ClickOutSideModule  {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ClickOutSideModule
    }
  }
}
