import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { DocumentTypeComponent } from './document-type.component';
import { DocumentTypeViewComponent } from './view/document-type-view.component';
import { DocumentTypeAddComponent } from './add/document-type-add.component';
import { DocumentTypeDetailComponent } from './detailType/detail-type.component';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';

export const DocumentTypeRoutes: Routes = [
  {
    path: '',
    component: DocumentTypeComponent,
    children: [
      {
        path: 'view',
        component: DocumentTypeViewComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'DOCUMENT_TYPE.LIST_DOCUMENT_TYPE.LIST_TYPE_LBL',
          moduleID: Constant.MODULE_ID.DOCUMENT,
          action: Constant.MODULE_ACTIONS.DOCUMENT.VIEW
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'add',
        component: DocumentTypeAddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'DOCUMENT_TYPE.ADD_DOCUMENT_TYPE.ADD_TYPE_LBL',
          moduleID: Constant.MODULE_ID.DOCUMENT,
          action: Constant.MODULE_ACTIONS.DOCUMENT.ADD
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'edit/:id',
        component: DocumentTypeAddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'DOCUMENT_TYPE.EDIT_DOCUMENT_TYPE.EDIT_TYPE_LBL',
          moduleID: Constant.MODULE_ID.DOCUMENT,
          action: Constant.MODULE_ACTIONS.DOCUMENT.EDIT
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'docTypeDetail/:id',
        component: DocumentTypeDetailComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'DOCUMENT_TYPE.DOCUMENT_TYPE_DETAIL.DETAIL_TYPE_LBL',
          moduleID: Constant.MODULE_ID.DOCUMENT,
          action: Constant.MODULE_ACTIONS.DOCUMENT.VIEW
        },
        resolve: { permission: PermissionResolver }
      }
    ]
  }
];
