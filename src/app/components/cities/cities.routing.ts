import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';

export const CitiesRoutes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CITIES_LIST',
      moduleID: Constant.MODULE_ID.CITIES,
      action: Constant.MODULE_ACTIONS.CITIES.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'add',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CITIES_ADD',
      moduleID: Constant.MODULE_ID.CITIES,
      action: Constant.MODULE_ACTIONS.CITIES.ADD
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CITIES_LIST',
      moduleID: Constant.MODULE_ID.CITIES,
      action: Constant.MODULE_ACTIONS.CITIES.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CITIES_EDIT',
      moduleID: Constant.MODULE_ID.CITIES,
      action: Constant.MODULE_ACTIONS.CITIES.EDIT
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view/:id',
    component: ViewComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.CITIES_VIEW',
      moduleID: Constant.MODULE_ID.CITIES,
      action: Constant.MODULE_ACTIONS.CITIES.VIEW
    },
    resolve: { permission: PermissionResolver }
  }
];
