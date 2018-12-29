import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './list/category-list.component';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';

export const CategoryRoutes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    children: [
      {
        path: 'add',
        component: AddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'COMMON.TITLES.CATEGORY_ADD',
          moduleID: Constant.MODULE_ID.CATALOG,
          action: Constant.MODULE_ACTIONS.CATEGORY.ADD
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'list',
        component: CategoryListComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'COMMON.TITLES.CATEGORY_LIST',
          moduleID: Constant.MODULE_ID.CATALOG,
          action: Constant.MODULE_ACTIONS.CATEGORY.VIEW
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'edit/:id',
        component: AddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'COMMON.TITLES.CATEGORY_EDIT',
          moduleID: Constant.MODULE_ID.CATALOG,
          action: Constant.MODULE_ACTIONS.CATEGORY.EDIT
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'view/:id',
        component: ViewComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'COMMON.TITLES.CATEGORY_VIEW',
          moduleID: Constant.MODULE_ID.CATALOG,
          action: Constant.MODULE_ACTIONS.CATEGORY.VIEW
        },
        resolve: { permission: PermissionResolver }
      }
    ]
  }
];
