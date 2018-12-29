import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RolesRoutes } from './role.routing';
import { AuthGuard } from '../../services/auth_guard.service';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../shared/shared.module';
import { ViewComponent } from './view/view.component';
import { RoleService } from '../../services/role.service';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';


@NgModule({
  imports: [
    SharedModule,
    TranslateModule,
    RouterModule.forChild(RolesRoutes)
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
    RoleService,
    PermissionResolver
  ]
})

export class RoleModule {}
