import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';


// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';
// Pages.
// // Account.
import { PageAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Users
import { PageUserFindComponent } from './pages/users/user-find.component';
import { PageUserInfoComponent } from './pages/users/user-info.component';
import { PageUserNewComponent } from './pages/users/user-new.component';
// // Admin Users.
import { PageAdminUserDeleteComponent } from './pages/admin-users/admin-user-delete.component';
// // Announcements.
import { PageAnnouncementInfoComponent } from './pages/announcements/announcement-info.component';
import { PageAnnouncementNewditComponent } from './pages/announcements/announcement-newdit.component';
import { PageAnnouncementsListComponent } from './pages/announcements/announcements-list.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
// // Organisations.
import { PageOrganisationNewComponent } from './pages/organisations/organisation-new.component';
import { PageOrganisationEditComponent } from './pages/organisations/organisation-edit.component';
import { PageOrganisationInfoComponent } from './pages/organisations/organisation-info.component';
import { PageOrganisationsListComponent } from './pages/organisations/organisations-list.component';
import { PageOrganisationUnitNewComponent } from './pages/organisations/organisation-unit-new/organisation-unit-new.component';
import { PageOrganisationUnitInfoComponent } from './pages/organisations/organisation-unit-info/organisation-unit-info.component';
import { PageOrganisationUnitUserEditComponent } from './pages/organisations/organisation-unit-user/organisation-unit-user-edit.component';

// // Service Users.
import { PageServiceUserChangeOrganisationUnitComponent } from './pages/service-users/service-user-change-organisation-unit.component';
import { PageServiceUserChangeRoleComponent } from './pages/service-users/service-user-change-role.component';
import { PageServiceUserLockComponent } from './pages/service-users/service-user-lock.component';
import { PageServiceUserUnlockComponent } from './pages/service-users/service-user-unlock.component';
// // Terms of use.
import { PageTermsOfUseInfoComponent } from './pages/terms-of-use/terms-of-use-info.component';
import { PageTermsOfUseListComponent } from './pages/terms-of-use/terms-of-use-list.component';
import { PageTermsOfUseNewComponent } from './pages/terms-of-use/terms-of-use-new.component';

// Wizards.
import { WizardOrganisationUnitActivateComponent } from './wizards/organisation-unit-activate/organisation-unit-activate.component';
import { WizardOrganisationUnitActivateUsersStepComponent } from './wizards/organisation-unit-activate/steps/users-step.component';
import { WizardOrganisationUnitInactivateComponent } from './wizards/organisation-unit-inactivate/organisation-unit-inactivate.component';
import { WizardOrganisationUnitInactivateUsersStepComponent } from './wizards/organisation-unit-inactivate/steps/users-step.component';
import { WizardOrganisationUnitInactivateInnovationsStepComponent } from './wizards/organisation-unit-inactivate/steps/innovations-step.component';

// Services.
import { AdminOrganisationsService } from './services/admin-organisations.service';
import { AnnouncementsService } from './services/announcements.service';
import { ServiceUsersService } from './services/service-users.service';
import { UsersValidationRulesService } from './services/users-validation-rules.service';
import { AdminUsersService } from './services/admin-users.service';

// Resolvers.
import { AnnouncementDataResolver } from './resolvers/announcement-data.resolver';
import { OrganisationDataResolver } from './resolvers/organisation-data.resolver';
import { ServiceUserDataResolver } from './resolvers/service-user-data.resolver';
import { OrganisationUnitDataResolver } from './resolvers/organisation-unit-data.resolver';
import { PageServiceUserInactivateRoleComponent } from './pages/service-users/service-user-inactivate-role.component';
import { PageServiceUserActivateRoleComponent } from './pages/service-users/service-user-activate-role.component';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AdminRoutingModule
  ],
  declarations: [
    // Base
    ContextInnovationOutletComponent,
    SidebarInnovationMenuOutletComponent,

    // Pages.
    PageAccountManageAccountInfoComponent,
    // Users
    PageUserFindComponent,
    PageUserInfoComponent,
    PageUserNewComponent,
    // // Admin Users.
    PageAdminUserDeleteComponent,
    // // Announcements.
    PageAnnouncementInfoComponent,
    PageAnnouncementNewditComponent,
    PageAnnouncementsListComponent,
    // // Dashboard.
    PageDashboardComponent,
    // // Innovation
    InnovationOverviewComponent,
    // // Organisations.
    PageOrganisationNewComponent,
    PageOrganisationEditComponent,
    PageOrganisationInfoComponent,
    PageOrganisationsListComponent,
    PageOrganisationUnitNewComponent,
    PageOrganisationUnitInfoComponent,
    PageOrganisationUnitUserEditComponent,
    // // Service Users.
    PageServiceUserChangeOrganisationUnitComponent,
    PageServiceUserChangeRoleComponent,
    PageServiceUserLockComponent,
    PageServiceUserUnlockComponent,
    PageServiceUserInactivateRoleComponent,
    PageServiceUserActivateRoleComponent,
    // // Terms of use.
    PageTermsOfUseInfoComponent,
    PageTermsOfUseListComponent,
    PageTermsOfUseNewComponent,

    // Wizards.
    WizardOrganisationUnitActivateComponent,
    WizardOrganisationUnitActivateUsersStepComponent,
    WizardOrganisationUnitInactivateComponent,
    WizardOrganisationUnitInactivateUsersStepComponent,
    WizardOrganisationUnitInactivateInnovationsStepComponent,
  ],
  providers: [
    // Services.
    AdminOrganisationsService,
    AnnouncementsService,
    ServiceUsersService,
    UsersValidationRulesService,
    AdminUsersService,

    // Resolvers.
    AnnouncementDataResolver,
    OrganisationDataResolver,
    ServiceUserDataResolver,
    OrganisationUnitDataResolver
  ]
})
export class AdminModule { }
