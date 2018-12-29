import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { ThemeComponent } from './theme.component';
import { ListComponent } from './list/list.component';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';

export const ThemeRoutes: Routes = [
  {
    path: '',
    component: ThemeComponent,
    children: [
      {
        path: 'add',
        component: AddComponent,
        canActivate: [AuthGuard,PermissionGuard],
        data: {
          title: 'COMMON.TITLES.THEMES_ADD',
          moduleID: Constant.MODULE_ID.THEMES,
          action: Constant.MODULE_ACTIONS.THEMES.ADD
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthGuard,PermissionGuard],
        data: {
          title: 'COMMON.TITLES.THEMES_LIST',
          moduleID: Constant.MODULE_ID.THEMES,
          action: Constant.MODULE_ACTIONS.THEMES.VIEW
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'edit/:id',
        component: AddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'COMMON.TITLES.THEMES_EDIT',
          moduleID: Constant.MODULE_ID.THEMES,
          action: Constant.MODULE_ACTIONS.THEMES.EDIT
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'view/:id',
        component: ViewComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'COMMON.TITLES.THEMES_VIEW',
          moduleID: Constant.MODULE_ID.THEMES,
          action: Constant.MODULE_ACTIONS.THEMES.VIEW
        },
        resolve: { permission: PermissionResolver }
      }
    ]
  }
];
