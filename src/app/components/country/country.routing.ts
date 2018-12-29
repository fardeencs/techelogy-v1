import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';

export const CountryRoutes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.COUNTRY_LIST',
      moduleID: Constant.MODULE_ID.COUNTRY,
      action: Constant.MODULE_ACTIONS.COUNTRY.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'add',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.COUNTRY_ADD',
      moduleID: Constant.MODULE_ID.COUNTRY,
      action: Constant.MODULE_ACTIONS.COUNTRY.ADD
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.COUNTRY_LIST',
      moduleID: Constant.MODULE_ID.COUNTRY,
      action: Constant.MODULE_ACTIONS.COUNTRY.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.COUNTRY_EDIT',
      moduleID: Constant.MODULE_ID.COUNTRY,
      action: Constant.MODULE_ACTIONS.COUNTRY.EDIT
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view/:id',
    component: ViewComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.COUNTRY_VIEW',
      moduleID: Constant.MODULE_ID.COUNTRY,
      action: Constant.MODULE_ACTIONS.COUNTRY.VIEW
    },
    resolve: { permission: PermissionResolver }
  }
];
