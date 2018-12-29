import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import {BannersRoutes} from "./banners.routing";
import {AddComponent} from "../banners/add/add.component";
import {ListComponent} from "../banners/list/list.component";
import {ViewComponent} from "../banners/view/view.component";
import { MerchantService } from '../../services/merchant.service';
import { BannerService } from '../../services/banners.service';
import {BsDatepickerModule} from "ngx-bootstrap";

@NgModule({
  imports: [
    SharedModule,
    TranslateModule,
    RouterModule.forChild(BannersRoutes),
    BsDatepickerModule.forRoot()
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
    BannerService,
    MerchantService
  ]
})

export class BannersModule {}
