
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import { DropdownComponent } from './dropdown.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from './treeview-dropdown-lib';
import { DisabledOnSelectorDirective } from './disabled-on-selector.directive';
// import { DropdownTreeviewSelectModule } from './treeview-dropdown';
// import { DisabledOnSelectorDirective } from './treeview-dropdown/disabled-on-selector.directive';



@NgModule({
  imports: [CommonModule, FormsModule, NgSelectModule, PaginationModule.forRoot(), TranslateModule
  , TreeviewModule.forRoot(),
  // DropdownTreeviewSelectModule
  ],
  declarations: [
    DropdownComponent,
    DisabledOnSelectorDirective
  ],
  exports: [
    DropdownComponent,
    TreeviewModule,
   // DropdownTreeviewSelectModule,
    DisabledOnSelectorDirective
  ]
})
export class DropdownModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DropdownModule
    };
  }
}
