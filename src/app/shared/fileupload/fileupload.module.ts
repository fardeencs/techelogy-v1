import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from './fileupload';
@NgModule({
  imports: [CommonModule,],
  exports: [FileUpload],
  declarations: [FileUpload]
})
export class FileUploadModule { }
