// import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../services/auth_guard.service';
import { CategoryRoutes } from './category.routing';
import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './list/category-list.component';
import { SharedModule } from '../../shared/shared.module';
import { CategoryService } from '../../services/category.service';
import { RoleService } from '../../services/role.service';
import { HttpLoaderFactory } from '../../app.module';
import { PermissionResolver } from '../../services/permission-resolver.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import { MerchantService } from '../../services/merchant.service';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileUploadModule } from '../../shared/fileupload/fileupload.module';
import { PipeModule } from '../../pipes/pipe.module';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(CategoryRoutes),
    NgbModule,
    TranslateModule,
    PipeModule.forRoot(),
    ColorPickerModule,FileUploadModule
  ],
  declarations: [
    CategoryComponent,
    CategoryListComponent,
    AddComponent,
    ViewComponent
  ],
  providers: [
    CategoryService,
    AuthGuard,
    MerchantService,
    PermissionGuard,
    RoleService,
    PermissionResolver
  ]
})
export class CategoryModule { }
