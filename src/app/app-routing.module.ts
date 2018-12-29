import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as Constant from './modules/constants';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { NotFoundComponent } from './components/404/not-found.component';
import { PermissionResolver } from './services/permission-resolver.service';

export const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: './components/authentication/authentication.module#AuthenticationModule'
      }
    ]
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard', loadChildren: './components/dashboard/dashboard.module#DashboardModule',
        data: {}
      },
      {
        path: 'profile', loadChildren: './components/profile/profile.module#ProfileModule',
        data: {}
      },
      {
        path: 'role', loadChildren: './components/role/role.module#RoleModule',
        data: { moduleID: Constant.MODULE_ID.ROLE },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'user', loadChildren: './components/user/user.module#UserModule',
        data: { moduleID: Constant.MODULE_ID.USER },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'merchant', loadChildren: './components/managemerchant/merchant.module#MerchantModule',
        data: { moduleID: Constant.MODULE_ID.MERCHANT },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'scheme', loadChildren: './components/merchantscheme/merchant-scheme.module#MerchantSchemeModule',
        data: { moduleID: Constant.MODULE_ID.SCHEME },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'document-type', loadChildren: './components/document-type/document-type.module#DocumentTypeModule',
        data: { moduleID: Constant.MODULE_ID.DOCUMENT },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'certificate', loadChildren: './components/managecertificate/manage-certificate.module#CertificateModule',
        data: { moduleID: Constant.MODULE_ID.CERTIFICATES },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'catalog', loadChildren: './components/category/category.module#CategoryModule',
        data: { moduleID: Constant.MODULE_ID.CATALOG },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'approval', loadChildren: './components/approval/approval.module#ApprovalModule',
        data: { moduleID: Constant.MODULE_ID.APPROVAL },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'country', loadChildren: './components/country/country.module#CountryModule',
        data: { moduleID: Constant.MODULE_ID.COUNTRY },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'group', loadChildren: './components/group/group.module#GroupModule',
        data: { moduleID: Constant.MODULE_ID.COUNTRYGROUP },
        resolve: { permission: PermissionResolver }
      },     
      {
        path: 'currency', loadChildren: './components/currency/currency.module#CurrencyModule',
        data: { moduleID: Constant.MODULE_ID.CURRENCY },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'state', loadChildren: './components/states/states.module#StatesModule',
        data: { moduleID: Constant.MODULE_ID.STATES },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'cities', loadChildren: './components/cities/cities.module#CitiesModule',
        data: { moduleID: Constant.MODULE_ID.CITIES },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'banner', loadChildren: './components/banners/banners.module#BannersModule',
        data: { moduleID: Constant.MODULE_ID.BANNERS },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'themes', loadChildren: './components/theme/theme.module#ThemeModule',
        data: { moduleID: Constant.MODULE_ID.THEMES },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'brand', loadChildren: './components/brand/brand.module#BrandModule',
        data: { moduleID: Constant.MODULE_ID.BRANDS },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'customer', loadChildren: './components/managecustomer/customer.module#CustomerModule',
        data: { moduleID: Constant.MODULE_ID.CUSTOMER },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'attributes', loadChildren: './components/attribute/attribute.module#AttributeModule',
        data: { moduleID: Constant.MODULE_ID.ATTRIBUTE },
        resolve: { permission: PermissionResolver }
      },
      {
        path: 'trainingvideo', loadChildren: './components/training-videos/training-videos.module#TrainingVideosModule',
        data: { moduleID: Constant.MODULE_ID.TRAINING_VIDEOS },
        resolve: { permission: PermissionResolver }
      }
    ]
  },
  {
    path: '404.html',
    component: NotFoundComponent,
    data: {
      title: 'Oops!'
    }
  },
  {
    path: '**',
    redirectTo: '404.html',
    data: {
      title: 'Oops!'
    }
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules
  }), NgbModule.forRoot()],
  exports: [RouterModule]
})
export class AppRoutingModule { }
