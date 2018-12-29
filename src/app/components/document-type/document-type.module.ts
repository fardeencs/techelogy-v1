import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../services/auth_guard.service';
import { DocumentTypeRoutes } from './document-type.routing';
import { DocumentTypeComponent } from './document-type.component';
import { DocumentTypeViewComponent } from './view/document-type-view.component';
import { DocumentTypeAddComponent } from './add/document-type-add.component';
import { DocumentTypeDetailComponent } from './detailType/detail-type.component';
import { SharedModule } from '../../shared/shared.module';
import { DocumentTypeService } from '../../services/document-type.service';
import { RoleService } from '../../services/role.service';
import { HttpLoaderFactory } from '../../app.module';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(DocumentTypeRoutes),
    NgbModule,
    TranslateModule
  ],
  declarations: [
    DocumentTypeComponent,
    DocumentTypeViewComponent,
    DocumentTypeAddComponent,
    DocumentTypeDetailComponent
  ],
  providers: [
    DocumentTypeService,
    AuthGuard,
    PermissionGuard,
    RoleService,
    PermissionResolver
  ]
})
export class DocumentTypeModule { }
