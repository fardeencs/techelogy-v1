import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';

export const RolesRoutes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.ROLE_LIST',
      moduleID: Constant.MODULE_ID.ROLE,
      action: Constant.MODULE_ACTIONS.ROLE.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'add',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.ROLE_ADD',
      moduleID: Constant.MODULE_ID.ROLE,
      action: Constant.MODULE_ACTIONS.ROLE.ADD
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.ROLE_LIST',
      moduleID: Constant.MODULE_ID.ROLE,
      action: Constant.MODULE_ACTIONS.ROLE.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.ROLE_EDIT',
      moduleID: Constant.MODULE_ID.ROLE,
      action: Constant.MODULE_ACTIONS.ROLE.EDIT
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view/:id',
    component: ViewComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.ROLE_VIEW',
      moduleID: Constant.MODULE_ID.ROLE,
      action: Constant.MODULE_ACTIONS.ROLE.VIEW
    },
    resolve: { permission: PermissionResolver }
  }
];
