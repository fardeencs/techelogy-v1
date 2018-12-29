import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../services/auth_guard.service';
import {UserRoutes} from './user.routing';
import {UserViewComponent} from './view/user-view.component';
import {UserComponent} from './user.component';
import {UserAddComponent} from './add/user-add.component';
import {SharedModule} from '../../shared/shared.module';
import {UserService} from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { DetailUserComponent } from './detailUser/detail-user.component';
import { HttpLoaderFactory } from '../../app.module';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(UserRoutes),
    TranslateModule
  ],
  declarations: [
    UserComponent,
    UserViewComponent,
    UserAddComponent,
    DetailUserComponent
  ],
  providers: [
    UserService,
    AuthGuard,
    PermissionGuard,
    RoleService,
    PermissionResolver
  ]
})
export class UserModule { }
