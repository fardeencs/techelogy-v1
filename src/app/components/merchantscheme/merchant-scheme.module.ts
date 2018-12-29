import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../services/auth_guard.service';
import { MerchantSchemeRoutes } from './merchant-scheme.routing';
import { MerchantSchemeComponent } from './merchant-scheme.component';
import { MerchantSchemeViewComponent } from './view/merchant-scheme-view.component';
import { MerchantSchemeAddComponent } from './add/merchant-scheme-add.component';
import { MerchantSchemeDetailComponent } from './detailScheme/detail-scheme.component'
import { SharedModule } from '../../shared/shared.module';
import { SchemeService } from '../../services/scheme.service';
import { RoleService } from '../../services/role.service';
import { HttpLoaderFactory } from '../../app.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(MerchantSchemeRoutes),
    NgbModule,
    TranslateModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    MerchantSchemeComponent,
    MerchantSchemeViewComponent,
    MerchantSchemeAddComponent,
    MerchantSchemeDetailComponent
  ],
  providers: [
    SchemeService,
    AuthGuard,
    PermissionGuard,
    RoleService,
    PermissionResolver
  ]
})
export class MerchantSchemeModule { }
