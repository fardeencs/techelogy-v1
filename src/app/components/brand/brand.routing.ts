import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { ListComponent } from '../brand/list/list.component';
import { AddComponent } from '../brand/add/add.component';
import { ViewComponent } from '../brand/view/view.component';

export const BrandRoutes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.BRANDS_LIST',
      moduleID: Constant.MODULE_ID.BRANDS,
      action: Constant.MODULE_ACTIONS.BRANDS.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'add',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.BRANDS_ADD',
      moduleID: Constant.MODULE_ID.BRANDS,
      action: Constant.MODULE_ACTIONS.BRANDS.ADD
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.BRANDS_LIST',
      moduleID: Constant.MODULE_ID.BRANDS,
      action: Constant.MODULE_ACTIONS.BRANDS.VIEW
    },
    resolve: { permission: PermissionResolver }
  }
  , {
    path: 'edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.BRANDS_EDIT',
      moduleID: Constant.MODULE_ID.STATES,
      action: Constant.MODULE_ACTIONS.STATES.EDIT
    },
    resolve: { permission: PermissionResolver }
  }
  ,{
    path: 'view/:id',
    component: ViewComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.BRANDS_VIEW',
      moduleID: Constant.MODULE_ID.BRANDS,
      action: Constant.MODULE_ACTIONS.BRANDS.VIEW
    },
    resolve: { permission: PermissionResolver }
  }
];
