import { Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth_guard.service';
import { ProfileComponent } from './profile.component';

export const ProfileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'COMMON.TITLES.MY_PROFILE',
      urls: [{ url: '/profile' }]
    }
  }
];
