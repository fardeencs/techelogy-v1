
import { NgModule } from '@angular/core';
import { ConstantFilterPipe } from './constant-filter.pipe';

@NgModule({
  imports: [],
  declarations: [ConstantFilterPipe], 
  exports:[ConstantFilterPipe],
})
export class PipeModule { 
  static forRoot() {
  return {
      ngModule: PipeModule,
      providers: [],
  };
}}
