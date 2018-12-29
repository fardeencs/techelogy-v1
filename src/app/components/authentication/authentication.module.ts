import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutes } from './authentication.routing';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './resetpassword/resetpassword.component';
import { PermissionGuard } from '../../services/permission_guard.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AuthenticationRoutes)
  ],
  declarations: [
    LoginComponent,
    ResetPasswordComponent
  ],
  providers: [
    AuthService,
    PermissionGuard
  ]
})

export class AuthenticationModule {}
