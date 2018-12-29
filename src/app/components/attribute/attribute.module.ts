import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../services/auth_guard.service';
import { AttributeRoutes } from './attribute.routing';
import { AttributeComponent } from './attribute.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { AttributeService } from '../../services/attribute.service';
import { RoleService } from '../../services/role.service';
import { HttpLoaderFactory } from '../../app.module';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileUploadModule } from '../../shared/fileupload/fileupload.module';
import { BsDropdownModule } from 'ngx-bootstrap';
import { PipeModule } from '../../pipes/pipe.module';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(AttributeRoutes),
    BsDropdownModule.forRoot(),
    TranslateModule, PipeModule.forRoot(),
    ColorPickerModule,
    FileUploadModule,
    NgbModule,
  ],
  declarations: [
    AttributeComponent,
    ListComponent,
    AddComponent,
    ViewComponent,

  ],
  providers: [
    AttributeService,
    AuthGuard,
    PermissionGuard,
    RoleService,
    PermissionResolver
  ]
})
export class AttributeModule { }
