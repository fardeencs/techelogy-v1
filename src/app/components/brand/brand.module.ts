import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { BrandRoutes } from './brand.routing';
import { ViewComponent } from './view/view.component';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { RoleService } from '../../services/role.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileUploadModule } from '../../shared/fileupload/fileupload.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from '../../services/brands.service';
import { BsDatepickerModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    SharedModule,
    TranslateModule,
    RouterModule.forChild(BrandRoutes),
    BsDatepickerModule.forRoot(),
    ColorPickerModule,
    FileUploadModule,
    NgbModule
  ],
  declarations: [
    AddComponent,
    ListComponent,
    ViewComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    PermissionGuard,
    PermissionResolver,
    RoleService,
    BrandService
  ]
})

export class BrandModule {}
