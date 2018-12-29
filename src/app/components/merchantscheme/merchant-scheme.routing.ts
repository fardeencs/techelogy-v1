import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { MerchantSchemeComponent } from './merchant-scheme.component';
import { MerchantSchemeViewComponent } from './view/merchant-scheme-view.component';
import { MerchantSchemeAddComponent } from './add/merchant-scheme-add.component';
import { MerchantSchemeDetailComponent } from './detailScheme/detail-scheme.component';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';

export const MerchantSchemeRoutes: Routes = [
  {
    path: '',
    component: MerchantSchemeComponent,
    children: [
      {
        path: 'view',
        component: MerchantSchemeViewComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'MERCHANT_SCHEME.LIST_MERCHANT_SCHEME.LIST_SCHEME_LBL',
          moduleID: Constant.MODULE_ID.SCHEME,
          action: Constant.MODULE_ACTIONS.SCHEME.VIEW
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'add',
        component: MerchantSchemeAddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'MERCHANT_SCHEME.ADD_MERCHANT_SCHEME.ADD_SCHEME_LBL',
          moduleID: Constant.MODULE_ID.SCHEME,
          action: Constant.MODULE_ACTIONS.SCHEME.ADD
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'edit/:id',
        component: MerchantSchemeAddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'MERCHANT_SCHEME.EDIT_MERCHANT_SCHEME.EDIT_SCHEME_LBL',
          moduleID: Constant.MODULE_ID.SCHEME,
          action: Constant.MODULE_ACTIONS.SCHEME.EDIT
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'schemeDetail/:id',
        component: MerchantSchemeDetailComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'MERCHANT_SCHEME.MERCHANT_SCHEME_DETAIL.DETAIL_SCHEME_LBL',
          moduleID: Constant.MODULE_ID.SCHEME,
          action: Constant.MODULE_ACTIONS.SCHEME.VIEW
        },
        resolve: { permission: PermissionResolver }
      }
    ]
  }
];
