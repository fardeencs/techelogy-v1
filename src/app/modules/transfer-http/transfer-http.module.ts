import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { TransferHttp } from './transfer-http';
import { TransferState } from '../transfer-state/transfer-state';

@NgModule({
  providers: [
    TransferHttp,
    TransferState
  ]
})
export class TransferHttpModule {}
