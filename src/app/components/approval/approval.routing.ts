import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { MerchantListComponent } from './merchant/list/list.component';
import { MerchantViewComponent } from './merchant/view/view.component';
import { ApprovalEditComponent } from './merchant/edit/edit.component';
import { OtherApprovalListComponent } from './other/list/list.component';

export const ApprovalRoutes: Routes = [
  {
    path: 'merchant',
    component: MerchantListComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Merchants Approval List'
    }
  },
  {
    path: 'other',
    component: OtherApprovalListComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Other Approvals List'
    }
  },
  {
    path: 'merchant/view/:id',
    component: MerchantViewComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Merchants Approval View'
    }
  },
  {
    path: 'merchant/edit/:id',
    component: ApprovalEditComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Merchants Approval Edit'
    }
  }
];
