import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { CitiesRoutes } from './cities.routing';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { CitiesService } from '../../services/cities.service';
import { HttpClient } from '@angular/common/http';
import { CustomTranslateLoader } from '../../modules/translate-loader/custom-translate-loader';

export function CityLoaderFactory(httpClient: HttpClient) {
  return new CustomTranslateLoader(httpClient, './assets/i18n/cities/', '.json');
}

@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (CityLoaderFactory),
        deps: [HttpClient]
      },
      isolate: true
    }),
    RouterModule.forChild(CitiesRoutes)
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
    CitiesService
  ]
})

export class CitiesModule{
}
