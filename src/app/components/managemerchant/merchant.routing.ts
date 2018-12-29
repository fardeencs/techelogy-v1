import { DetailMerchantComponent } from './detailMerchant/detail-merchant.component';
import { PermissionResolver } from './../../services/permission-resolver.service';
import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { AddmerchantComponent } from './addmerchant/addmerchant.component';
import { MerchantViewComponent } from './view/merchant-view.component';
import * as Constant from '../../modules/constants';
import { PermissionGuard } from '../../services/permission_guard.service';
import { MerchantExportComponent } from './merchant-export/merchant-export.component';
import { MerchantImportComponent } from './merchant-import/merchant-import.component';

export const MerchantsRoutes: Routes = [
  {
    path: 'add',
    component: AddmerchantComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'MANAGE_MERCHANT.ADD_MERCHANT.ADD_MERCHANT_LBL',
      moduleID : Constant.MODULE_ID.MERCHANT,
      action: Constant.MODULE_ACTIONS.MERCHANT.ADD
    }
  },
  {
    path: 'view',
    component: MerchantViewComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'MANAGE_MERCHANT.LIST_MERCHANT.LIST_MERCHANT_LBL',
      moduleID : Constant.MODULE_ID.MERCHANT,
      action: Constant.MODULE_ACTIONS.MERCHANT.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'edit/:id',
    component: AddmerchantComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'MANAGE_MERCHANT.EDIT_MERCHANT.EDIT_MERCHANT_LBL',
      moduleID : Constant.MODULE_ID.MERCHANT,
      action: Constant.MODULE_ACTIONS.MERCHANT.EDIT
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'detail/:type/:id',
    component: AddmerchantComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'MANAGE_MERCHANT.MERCHANT_DETAIL.MERCHANT_DETAIL_LBL',
      moduleID : Constant.MODULE_ID.MERCHANT,
      action: Constant.MODULE_ACTIONS.MERCHANT.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'merchantDetail/:id/:status',
    component: DetailMerchantComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'MANAGE_MERCHANT.MERCHANT_DETAIL.MERCHANT_DETAIL_LBL',
      moduleID : Constant.MODULE_ID.MERCHANT,
      action: Constant.MODULE_ACTIONS.MERCHANT.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'export',
    component: MerchantExportComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'MANAGE_MERCHANT.LIST_MERCHANT.LIST_MERCHANT_EXPORT',
      moduleID : Constant.MODULE_ID.MERCHANT,
      action: Constant.MODULE_ACTIONS.MERCHANT.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'import',
    component: MerchantImportComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'MANAGE_MERCHANT.LIST_MERCHANT.LIST_MERCHANT_IMPORT',
      moduleID : Constant.MODULE_ID.MERCHANT,
      action: Constant.MODULE_ACTIONS.MERCHANT.VIEW
    },
    resolve: { permission: PermissionResolver }
  }
];
