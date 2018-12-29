import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { TrainingVideosRoutes } from './training-videos.routing';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { TrainingVideosService } from '../../services/training-videos.service';
import { FileUploadModule } from '../../shared/fileupload/fileupload.module';


@NgModule({
  imports: [
    SharedModule,
    TranslateModule,
    FileUploadModule,
    RouterModule.forChild(TrainingVideosRoutes)
  ],
  declarations: [
    AddComponent,
    ListComponent,
    ViewComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    PermissionGuard,
    PermissionResolver,
    TrainingVideosService
  ]
})

export class TrainingVideosModule {}
