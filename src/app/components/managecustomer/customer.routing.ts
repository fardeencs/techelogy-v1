import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';

export const CustomerRoutes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [AuthGuard,PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CUSTOMER_LIST',
      moduleID: Constant.MODULE_ID.CUSTOMER,
      action: Constant.MODULE_ACTIONS.CUSTOMER.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'add',
    component: AddComponent,
    canActivate: [AuthGuard,PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CUSTOMER_ADD',
      moduleID: Constant.MODULE_ID.CUSTOMER,
      action: Constant.MODULE_ACTIONS.CUSTOMER.ADD
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view',
    component: ListComponent,
    canActivate: [AuthGuard,PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CUSTOMER_LIST',
      moduleID: Constant.MODULE_ID.CUSTOMER,
      action: Constant.MODULE_ACTIONS.CUSTOMER.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard,PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CUSTOMER_EDIT',
      moduleID: Constant.MODULE_ID.CUSTOMER,
      action: Constant.MODULE_ACTIONS.CUSTOMER.EDIT
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view/:id',
    component: ViewComponent,
    canActivate: [AuthGuard,PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CUSTOMER_VIEW',
      moduleID: Constant.MODULE_ID.CUSTOMER,
      action: Constant.MODULE_ACTIONS.CUSTOMER.VIEW
    },
    resolve: { permission: PermissionResolver }
  }
];
