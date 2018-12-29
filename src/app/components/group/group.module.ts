import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { CountryService } from '../../services/country.service';
import { GroupRoutes } from './group.routing';
import { MerchantService } from '../../services/merchant.service';
import { GroupService } from '../../services/group.service';


@NgModule({
  imports: [
    SharedModule,
    TranslateModule,
    RouterModule.forChild(GroupRoutes)
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
    GroupService,
    MerchantService
  ]
})

export class GroupModule {}
