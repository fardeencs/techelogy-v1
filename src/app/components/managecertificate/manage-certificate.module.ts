import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../services/auth_guard.service';
import { AdminCertificatesRoutes } from './manage-certificate.routing';
import { ManageCertificateComponent } from './manage-certificate.component';
import { ManageCertificateViewComponent } from './view/manage-certificate-view.component';
import { ManageCertificateAddComponent } from './add/manage-certificate-add.component';
import { ManageCertificateDetailComponent } from './detailCertificate/detail-certificate.component';
import { SharedModule } from '../../shared/shared.module';
import { CertificateService } from '../../services/certificate.service';
import { RoleService } from '../../services/role.service';
import { HttpLoaderFactory } from '../../app.module';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(AdminCertificatesRoutes),
    NgbModule,
    TranslateModule
  ],
  declarations: [
    ManageCertificateComponent,
    ManageCertificateViewComponent,
    ManageCertificateAddComponent,
    ManageCertificateDetailComponent
  ],
  providers: [
    CertificateService,
    AuthGuard,
    PermissionGuard,
    RoleService,
    PermissionResolver
  ]
})
export class CertificateModule { }
