import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { CurrencyRoutes } from './currency.routing';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { CurrencyRatesComponent } from './currency-rates/add/add.component';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyRatesService} from '../../services/currency-rates.service';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(CurrencyRoutes)
  ],
  declarations: [
    AddComponent,
    ListComponent,
    ViewComponent,
    CurrencyRatesComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    PermissionGuard,
    PermissionResolver,
    CurrencyService,
    CurrencyRatesService
  ]
})

export class CurrencyModule {}
