import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TransferHttpModule } from './modules/transfer-http/transfer-http.module';
import { TransferState } from './modules/transfer-state/transfer-state';
import { NotFoundComponent } from './components/404/not-found.component';
import { ThemeSpinner } from './shared/theme_spinner.service';
import { AuthService } from './services/auth.service';
import { GlobalState } from './global.state';
import { PermissionResolver } from './services/permission-resolver.service';
import { LocalStorageService } from './services/local-storage.service';
import {HttpService} from "./services/http.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};


@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NotFoundComponent,
    NavigationComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    TransferHttpModule,
    NgbModule.forRoot(),
    PerfectScrollbarModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide : TranslateLoader,
        useFactory : (HttpLoaderFactory),
        deps : [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }, {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpInterceptorClass,
    //   multi: true
    // },
    AuthService,
    PermissionResolver,
    ThemeSpinner,
    GlobalState,
    LocalStorageService,
    HttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule{

}
