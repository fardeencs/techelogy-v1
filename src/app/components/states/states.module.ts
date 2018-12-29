import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { ViewComponent } from './view/view.component';
import { StatesRoutes } from './states.routing';
import { ListComponent } from './list/list.component';
import { StatesService } from '../../services/states.service';
import { AddComponent } from './add/add.component';
import { HttpClient } from '@angular/common/http';
import { CustomTranslateLoader } from '../../modules/translate-loader/custom-translate-loader';

export function StatesLoaderFactory(httpClient: HttpClient) {
  return new CustomTranslateLoader(httpClient, './assets/i18n/states/', '.json');
}

@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (StatesLoaderFactory),
        deps: [HttpClient]
      },
      isolate: true
    }),
    RouterModule.forChild(StatesRoutes)
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
    StatesService
  ]
})

export class StatesModule {}
