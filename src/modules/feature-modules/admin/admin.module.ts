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
import { PageServiceUsersUnlockComponent } from './pages/service-users/service-users-unlock.component';
import { PageAdminUsersFindComponent } from './pages/admin-users/admin-users-find/admin-users-find.component';
import { PageServiceChangeUserRoleComponent } from './pages/change-user-role/change-user-role.component';
import { PageAdminUsersNewComponent } from './pages/admin-users/admin-users-new/admin-users-new.component';
import { PageAdminDeleteComponent } from './pages/admin-users/admin-users-delete/admin-users-delete.component';

// Services.
import { ServiceUsersService } from './services/service-users.service';

// Resolvers.
import { ServiceUserDataResolver } from './resolvers/service-user-data.resolver';
import { PageAdminUsersInfoComponent } from './pages/admin-users/admin-users-info/admin-users-info.component';
import { PageListOrganisationsAndUnitsComponent } from './pages/organisations/organisations-list/organisations-list.component';
import { PageAdminOrganisationInfoComponent } from './pages/organisations/organisations-info/organisation-info.component';
import { PageAdminOrganisationEditComponent } from './pages/organisations/organisations-edit/organisations-edit.component';
import { OrganisationDataResolver } from './resolvers/organisation-data.resolver';
import { PageServiceChangeOrganisationUserUnitComponent } from './pages/change-organisation-user-unit/change-organisation-user-unit.component';

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
    PageServiceUsersNewComponent,
    PageServiceUsersUnlockComponent,
    PageAdminUsersFindComponent,
    PageServiceChangeUserRoleComponent,
    PageAdminUsersInfoComponent,
    PageListOrganisationsAndUnitsComponent,
    PageAdminUsersNewComponent,
    PageAdminOrganisationInfoComponent,
    PageAdminOrganisationEditComponent,
    PageServiceChangeOrganisationUserUnitComponent,
    PageAdminDeleteComponent
  ],
  providers: [
    // Services.
    ServiceUsersService,

    // Resolvers.
    ServiceUserDataResolver,
    OrganisationDataResolver
  ]
})
export class AdminModule { }
