import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import {UserComponent} from './user.component';
import {UserViewComponent} from './view/user-view.component';
import {UserAddComponent} from './add/user-add.component';
import { DetailUserComponent } from './detailUser/detail-user.component';
import {PermissionResolver} from '../../services/permission-resolver.service';
import * as Constant from '../../modules/constants';
import { PermissionGuard } from '../../services/permission_guard.service';

export const UserRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'view',
        component: UserViewComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'USER.LIST_USER.LIST_USER_LBL',
          moduleID : Constant.MODULE_ID.USER,
          action: Constant.MODULE_ACTIONS.USER.VIEW
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'add',
        component: UserAddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'USER.ADD_USER.ADD_USER_LBL',
          moduleID : Constant.MODULE_ID.USER,
          action: Constant.MODULE_ACTIONS.USER.ADD
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'edit/:id',
        canActivate: [AuthGuard, PermissionGuard],
        component: UserAddComponent,
        data: {
          title: 'USER.EDIT_USER.EDIT_USER_LBL',
          moduleID : Constant.MODULE_ID.USER,
          action: Constant.MODULE_ACTIONS.USER.EDIT
        },
        resolve: { permission: PermissionResolver }
      }
      ,
      {
        path: 'userDetail/:id',
        canActivate: [AuthGuard, PermissionGuard],
        component: DetailUserComponent,
        data: {
          title: 'USER.USER_DETAIL.USER_DETAIL_LBL',
          moduleID : Constant.MODULE_ID.USER,
          action: Constant.MODULE_ACTIONS.USER.VIEW
        },
        resolve: { permission: PermissionResolver }
      }
    ]
  }
];
