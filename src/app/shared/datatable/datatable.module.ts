import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DTServersideComponent } from './datatable-serverside.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  imports: [CommonModule, FormsModule, NgxDatatableModule, PaginationModule.forRoot(), TranslateModule],
  declarations: [
    DTServersideComponent
  ],
  exports: [DTServersideComponent]
})
export class DataTableModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DataTableModule
    };
  }
}
