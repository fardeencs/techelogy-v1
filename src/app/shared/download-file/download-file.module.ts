import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadFileDirective } from './download-file.component';
import { ExportService } from '../../services/export.service';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DownloadFileDirective
  ],
  providers: [ExportService],
  exports: [DownloadFileDirective]
})
export class DownloadFileModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DownloadFileModule
    };
  }
}
