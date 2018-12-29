import {NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import {OnlyNumberDirective} from "./numeric-only.component";
import {OnlyDecimalDirective} from "./decimal.component";
import {RestrictDirective} from "./restrict.component";

@NgModule({
  imports: [CommonModule],
  declarations: [
    OnlyNumberDirective,
    OnlyDecimalDirective,
    RestrictDirective
  ],
  exports: [OnlyNumberDirective,OnlyDecimalDirective,RestrictDirective]
})
export class NumericValidationModule  {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NumericValidationModule
    }
  }
}
