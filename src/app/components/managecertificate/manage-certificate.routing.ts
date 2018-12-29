import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { ManageCertificateComponent } from './manage-certificate.component';
import { ManageCertificateViewComponent } from './view/manage-certificate-view.component';
import { ManageCertificateAddComponent } from './add/manage-certificate-add.component';
import { ManageCertificateDetailComponent } from './detailCertificate/detail-certificate.component';
import * as Constant from '../../modules/constants';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';

export const AdminCertificatesRoutes: Routes = [
  {
    path: '',
    component: ManageCertificateComponent,
    children: [
      {
        path: 'view',
        component: ManageCertificateViewComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'MANAGE_CERTIFICATE.LIST_CERTIFICATE.LIST_CERTIFICATE_LBL',
          moduleID: Constant.MODULE_ID.CERTIFICATES,
          action: Constant.MODULE_ACTIONS.CERTIFICATE.VIEW
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'add',
        component: ManageCertificateAddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'MANAGE_CERTIFICATE.ADD_CERTIFICATE.ADD_CERTIFICATE_LBL',
          moduleID: Constant.MODULE_ID.CERTIFICATES,
          action: Constant.MODULE_ACTIONS.CERTIFICATE.ADD
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'edit/:id',
        component: ManageCertificateAddComponent,
        canActivate: [AuthGuard, PermissionGuard],
        data: {
          title: 'MANAGE_CERTIFICATE.EDIT_CERTIFICATE.EDIT_CERTIFICATE_LBL',
          moduleID: Constant.MODULE_ID.CERTIFICATES,
          action: Constant.MODULE_ACTIONS.CERTIFICATE.EDIT
        },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'certificateDetail/:id',
        canActivate: [AuthGuard, PermissionGuard],
        component: ManageCertificateDetailComponent,
        data: {
          title: 'MANAGE_CERTIFICATE.CERTIFICATE_DETAIL.DETAIL_CERTIFICATE_LBL',
          moduleID: Constant.MODULE_ID.CERTIFICATES,
          action: Constant.MODULE_ACTIONS.CERTIFICATE.VIEW
        },
        resolve: { permission: PermissionResolver }
      }
    ]
  }
];
