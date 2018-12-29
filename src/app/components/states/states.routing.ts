import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { ListComponent } from '../states/list/list.component';
import { AddComponent } from '../states/add/add.component';
import { ViewComponent } from '../states/view/view.component';

export const StatesRoutes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.STATES_LIST',
      moduleID: Constant.MODULE_ID.STATES,
      action: Constant.MODULE_ACTIONS.STATES.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'add',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.STATES_ADD',
      moduleID: Constant.MODULE_ID.STATES,
      action: Constant.MODULE_ACTIONS.STATES.ADD
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'view',
    component: ListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.STATES_LIST',
      moduleID: Constant.MODULE_ID.STATES,
      action: Constant.MODULE_ACTIONS.STATES.VIEW
    },
    resolve: { permission: PermissionResolver }
  },
  {
    path: 'edit/:id',
    component: AddComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      title: 'COMMON.TITLES.STATES_EDIT',
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
      title: 'COMMON.TITLES.STATES_VIEW',
      moduleID: Constant.MODULE_ID.STATES,
      action: Constant.MODULE_ACTIONS.STATES.VIEW
    },
    resolve: { permission: PermissionResolver }
  }
];
