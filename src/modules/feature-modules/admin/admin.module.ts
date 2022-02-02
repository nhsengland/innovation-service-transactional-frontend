import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent } from './base/admin-layout.component';

// Pages.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
import { PageServiceUsersDeleteComponent } from './pages/service-users/service-users-delete.component';
import { PageServiceUsersEditComponent } from './pages/service-users/service-users-edit.component';
import { PageServiceUsersFindComponent } from './pages/service-users/service-users-find.component';
import { PageServiceUsersInfoComponent } from './pages/service-users/service-users-info.component';
import { PageServiceUsersLockComponent } from './pages/service-users/service-users-lock.component';
import { PageServiceUsersNewComponent } from './pages/service-users/service-users-new/service-users-new.component';

// Services.
import { ServiceUsersService } from './services/service-users.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AdminRoutingModule
  ],
  declarations: [
    AdminLayoutComponent,

    // Pages.
    PageDashboardComponent,
    PageServiceUsersDeleteComponent,
    PageServiceUsersEditComponent,
    PageServiceUsersFindComponent,
    PageServiceUsersInfoComponent,
    PageServiceUsersLockComponent,
    PageServiceUsersNewComponent
  ],
  providers: [
    // Services.
    ServiceUsersService
  ]
})
export class AdminModule { }
