import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DTSearchComponent } from './dtsearch.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({

  imports: [
    FormsModule,
    CommonModule,
    NgbCollapseModule,
    NgbModule,
    NgSelectModule,
    TranslateModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    DTSearchComponent
  ],
  exports: [DTSearchComponent]
})
export class DataTableSearchModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DataTableSearchModule
    };
  }
}
