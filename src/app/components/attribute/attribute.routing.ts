import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { AttributeComponent } from './attribute.component';
import { ListComponent } from './list/list.component';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';

export const AttributeRoutes: Routes = [
  {
    path: '',
    component: AttributeComponent,
    children: [
      {
        path: 'add',
        component: AddComponent,
        canActivate: [AuthGuard,PermissionGuard],
        data: {
          title: 'COMMON.TITLES.ATTRIBUTE_ADD',
          moduleID: Constant.MODULE_ID.ATTRIBUTE,
          action: Constant.MODULE_ACTIONS.ATTRIBUTE.ADD
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthGuard,PermissionGuard],
        data: {
          title: 'COMMON.TITLES.ATTRIBUTE_LIST',
          moduleID: Constant.MODULE_ID.ATTRIBUTE,
          action: Constant.MODULE_ACTIONS.ATTRIBUTE.VIEW
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'edit/:id',
        component: AddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'COMMON.TITLES.ATTRIBUTE_EDIT',
          moduleID: Constant.MODULE_ID.ATTRIBUTE,
          action: Constant.MODULE_ACTIONS.ATTRIBUTE.EDIT
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'view/:id',
        component: ViewComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'COMMON.TITLES.ATTRIBUTE_VIEW',
          moduleID: Constant.MODULE_ID.ATTRIBUTE,
          action: Constant.MODULE_ACTIONS.ATTRIBUTE.VIEW
        },
        resolve: { permission: PermissionResolver }
      }
    ]
  }
];
