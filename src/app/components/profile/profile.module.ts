import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../services/auth_guard.service';
import { ProfileRoutes } from './profile.routing';
import { ProfileComponent } from './profile.component';
import { ProfileService } from '../../services/profile.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    NgbModule,
    RouterModule.forChild(ProfileRoutes)
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    AuthGuard,
    ProfileService
  ]
})
export class ProfileModule { }
