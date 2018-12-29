import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardRoutes } from './dashboard.routing';
import { IncomeCounterComponent } from './dashboard-components/income-counter/income-counter.component';
import { RecentcommentComponent } from './dashboard-components/recent-comment/recent-comment.component';
import { AuthGuard } from '../../services/auth_guard.service';
import { PermissionGuard } from '../../services/permission_guard.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [
    DashboardComponent,
    IncomeCounterComponent,
    RecentcommentComponent,
  ],
  providers: [
    AuthGuard,
    PermissionGuard
  ]
})
export class DashboardModule { }
