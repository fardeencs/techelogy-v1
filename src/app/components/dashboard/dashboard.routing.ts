import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { DashboardComponent } from './dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'COMMON.TITLES.DASHBOARD',
      urls: [{ url: '/dashboard' }]
    }
  }
];
