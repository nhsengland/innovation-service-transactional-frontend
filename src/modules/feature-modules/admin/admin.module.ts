import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent } from './base/admin-layout.component';

// Pages.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
import { PageServiceUsersDeleteComponent } from './pages/service-users/service-users-delete.component';
import { PageServiceUsersEditComponent } from './pages/service-users/service-users-edit.component';
import { PageServiceUsersInfoComponent } from './pages/service-users/service-users-info.component';
import { PageServiceUsersListComponent } from './pages/service-users/service-users-list.component';
import { PageServiceUsersNewComponent } from './pages/service-users/service-users-new.component';



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
    PageServiceUsersListComponent,
    PageServiceUsersEditComponent,
    PageServiceUsersInfoComponent,
    PageServiceUsersNewComponent
  ]
})
export class AdminModule { }
