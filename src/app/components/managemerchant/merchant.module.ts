import { DetailMerchantComponent } from './detailMerchant/detail-merchant.component';
import { AuthorizedSignatureComponent } from './addmerchant/authorized-signature/authsignature.component';
import { PlatformComponent } from './addmerchant/platform/platform.component';
import { FinanceinfoComponent } from './addmerchant/finance-info/financeInfo.component';
;
import { ContactmerchantComponent } from './addmerchant/contact-merchant/contactMerchant.component';
import { CompanyinfoComponent } from './addmerchant/company-info/companyInfo.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { AuthGuard } from '../../services/auth_guard.service';
import { SharedModule } from '../../shared/shared.module';
import { MerchantsRoutes } from './merchant.routing';
import { AddmerchantComponent } from './addmerchant/addmerchant.component';

import { ContactfinanceComponent } from './addmerchant/contact-finance/contactFinance.component';
import { DocumentuploadComponent } from './addmerchant/document-upload/documentUpload.component';


import { MerchantViewComponent } from './view/merchant-view.component';
import { MerchantService } from '../../services/merchant.service';
import { SchemeTypesService } from '../../services/schemetypes.service';
import { PermissionGuard } from '../../services/permission_guard.service';
import {MerchantAddressComponent} from "./addmerchant/platform/address/address.component";
import {AddEditAdddressComponent} from "./addmerchant/platform/address/add/add-edit-address.component";
import {SchemeFeeComponent} from "./addmerchant/platform/scheme-fee/scheme-fee.component";
import {DeliveryComponent} from "./addmerchant/platform/delivery/delivery.component";
import {ProductsRevenueComponent} from "./addmerchant/platform/product-revenue/product-revenue.component";
import { AssignsalepersonComponent } from './assignsaleperson/assignsaleperson.component';
import { UserService } from '../../services/user.service';
import { MerchantExportComponent } from './merchant-export/merchant-export.component';
import { MerchantImportComponent } from './merchant-import/merchant-import.component';

@NgModule({
  imports: [
  SharedModule,
    RouterModule.forChild(MerchantsRoutes),
    TranslateModule
  ],
  declarations: [
    AddmerchantComponent,
    CompanyinfoComponent,
    ContactfinanceComponent,
    ContactmerchantComponent,
    DocumentuploadComponent,
    FinanceinfoComponent,
    PlatformComponent,
    MerchantViewComponent,
    AuthorizedSignatureComponent,
    MerchantAddressComponent,
    AddEditAdddressComponent,
    SchemeFeeComponent,
    DeliveryComponent,
    DetailMerchantComponent,
    ProductsRevenueComponent,
    AssignsalepersonComponent,
    MerchantExportComponent,
    MerchantImportComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    PermissionGuard,
    MerchantService,
    SchemeTypesService,
    UserService
  ],
  entryComponents: [
    AddEditAdddressComponent,AssignsalepersonComponent
  ]

})

export class MerchantModule {}
