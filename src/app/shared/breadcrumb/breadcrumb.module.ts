import {NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbComponent} from "./breadcrumb.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppRoutingModule} from "../../app-routing.module";

@NgModule({
  imports: [ CommonModule,
    BrowserModule,
    FormsModule,
    TranslateModule,
    AppRoutingModule],
  declarations: [
    BreadcrumbComponent
  ],
  exports: [BreadcrumbComponent]
})
export class BreadCrumbModule  {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BreadCrumbModule
    }
  }
}
