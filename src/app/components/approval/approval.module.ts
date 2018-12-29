import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { ApprovalRoutes } from './approval.routing';
import { MerchantListComponent } from './merchant/list/list.component';
import { TranslateModule } from '@ngx-translate/core';
import { RoleService } from '../../services/role.service';
import { MerchantViewComponent } from './merchant/view/view.component';
import { CommentService } from '../../services/comment';
import { ApprovalEditComponent } from './merchant/edit/edit.component';
import { OtherApprovalListComponent } from './other/list/list.component';
import { PermissionGuard } from '../../services/permission_guard.service';
import { MerchantApprovalService } from '../../services/merchant_approval';
import { OtherApprovalService } from '../../services/other_approval';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ApprovalRoutes),
    TranslateModule
  ],
  declarations: [
    MerchantListComponent,
    MerchantViewComponent,
    ApprovalEditComponent,
    OtherApprovalListComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    PermissionGuard,
    MerchantApprovalService,
    RoleService,
    CommentService,
    OtherApprovalService
  ]
})

export class ApprovalModule {}
