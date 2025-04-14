import { NgModule } from '@angular/core';

import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AdminRoutingModule } from './admin-routing.module';

// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';
// Pages.

// // Users
import { PageUsersRoleActivateComponent } from './pages/users/roles/role-activate.component';
import { PageUsersRoleChangeComponent } from './pages/users/roles/role-change.component';
import { PageUsersRoleInactivateComponent } from './pages/users/roles/role-inactivate.component';
import { PageRoleNewComponent } from './pages/users/roles/role-new.component';
import { PageUserDeleteComponent } from './pages/users/user-delete.component';
import { PageUserEmailComponent } from './pages/users/user-email.component';
import { PageUserFindComponent } from './pages/users/user-find.component';
import { PageUserInfoComponent } from './pages/users/user-info.component';
import { PageUserInnovationsComponent } from './pages/users/user-innovations.component';
import { PageUserLockComponent } from './pages/users/user-lock.component';
import { PageUserManageComponent } from './pages/users/user-manage.component';
import { PageUserNewComponent } from './pages/users/user-new.component';
import { PageUserUnlockComponent } from './pages/users/user-unlock.component';
// // Announcements.
import { PageAnnouncementDetailsComponent } from './pages/announcements/announcement-details.component';
import { PageAnnouncementNewditComponent } from './pages/announcements/announcement-newdit.component';
import { PageAnnouncementsListComponent } from './pages/announcements/announcements-list.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { PageInnovationManageTransferComponent } from './pages/innovation/transfer/manage-transfer.component';
// // Organisations.
import { PageOrganisationEditComponent } from './pages/organisations/organisation-edit.component';
import { PageOrganisationInfoComponent } from './pages/organisations/organisation-info.component';
import { PageOrganisationNewComponent } from './pages/organisations/organisation-new.component';
import { OrganisationUnitInfoComponent } from './pages/organisations/organisation-unit-info.component';
import { PageOrganisationUnitNewComponent } from './pages/organisations/organisation-unit-new/organisation-unit-new.component';
import { PageOrganisationsListComponent } from './pages/organisations/organisations-list.component';

// // Terms of use.
import { PageTermsOfUseInfoComponent } from './pages/terms-of-use/terms-of-use-info.component';
import { PageTermsOfUseListComponent } from './pages/terms-of-use/terms-of-use-list.component';
import { PageTermsOfUseNewComponent } from './pages/terms-of-use/terms-of-use-new.component';

// // Elastic Search
import { PageElasticSearchComponent } from './pages/elastic-search/elastic-search.component';

// Wizards.
import { WizardOrganisationUnitActivateComponent } from './wizards/organisation-unit-activate/organisation-unit-activate.component';
import { WizardOrganisationUnitActivateUsersStepComponent } from './wizards/organisation-unit-activate/steps/users-step.component';
import { WizardOrganisationUnitInactivateComponent } from './wizards/organisation-unit-inactivate/organisation-unit-inactivate.component';
import { WizardOrganisationUnitInactivateInnovationsStepComponent } from './wizards/organisation-unit-inactivate/steps/innovations-step.component';
import { WizardOrganisationUnitInactivateUsersStepComponent } from './wizards/organisation-unit-inactivate/steps/users-step.component';

// Components.
import { UserInformationComponent } from './components/user-information.component';

// Services.
import { AdminOrganisationsService } from './services/admin-organisations.service';
import { AnnouncementsService } from './services/announcements.service';
import { ElasticSearchService } from './services/elastic-search.service';
import { UsersValidationRulesService } from './services/users-validation-rules.service';
import { AdminUsersService } from './services/users.service';

// Resolvers.
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { AnnouncementDataResolver } from './resolvers/announcement-data.resolver';
import { OrganisationDataResolver } from './resolvers/organisation-data.resolver';
import { OrganisationUnitDataResolver } from './resolvers/organisation-unit-data.resolver';
import { ServiceUserDataResolver } from './resolvers/service-user-data.resolver';

import { InnovationRecordSidebarComponent } from '@modules/shared/components/innovation-record-sidebar/innovation-record-sidebar.component';
import { InnovatorContactDetailsComponent } from '@modules/shared/components/innovator-contact-details/innovator-contact-details.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    AdminRoutingModule,
    InnovationRecordSidebarComponent,
    InnovatorContactDetailsComponent
  ],
  declarations: [
    // Base
    ContextInnovationOutletComponent,
    SidebarInnovationMenuOutletComponent,
    SidebarAccountMenuOutletComponent,

    // Pages.

    // Users
    PageUserEmailComponent,
    PageUserFindComponent,
    PageUserInfoComponent,
    PageUserNewComponent,
    PageRoleNewComponent,
    // // Announcements.
    PageAnnouncementDetailsComponent,
    PageAnnouncementNewditComponent,
    PageAnnouncementsListComponent,
    // // Dashboard.
    PageDashboardComponent,
    // // Innovation
    InnovationOverviewComponent,
    PageInnovationManageTransferComponent,
    // // Organisations.
    PageOrganisationNewComponent,
    PageOrganisationEditComponent,
    PageOrganisationInfoComponent,
    PageOrganisationsListComponent,
    PageOrganisationUnitNewComponent,
    OrganisationUnitInfoComponent,
    // // Service Users.
    PageUsersRoleChangeComponent,
    PageUserDeleteComponent,
    PageUserInnovationsComponent,
    PageUserManageComponent,
    PageUserLockComponent,
    PageUserUnlockComponent,
    PageUsersRoleInactivateComponent,
    PageUsersRoleActivateComponent,
    // // Terms of use.
    PageTermsOfUseInfoComponent,
    PageTermsOfUseListComponent,
    PageTermsOfUseNewComponent,
    // // Elastic Search
    PageElasticSearchComponent,

    // Wizards.
    WizardOrganisationUnitActivateComponent,
    WizardOrganisationUnitActivateUsersStepComponent,
    WizardOrganisationUnitInactivateComponent,
    WizardOrganisationUnitInactivateUsersStepComponent,
    WizardOrganisationUnitInactivateInnovationsStepComponent,

    // Components.
    UserInformationComponent
  ],
  providers: [
    // Services.
    AdminOrganisationsService,
    AnnouncementsService,
    AdminUsersService,
    UsersValidationRulesService,
    ElasticSearchService,

    // Resolvers.
    AnnouncementDataResolver,
    OrganisationDataResolver,
    ServiceUserDataResolver,
    OrganisationUnitDataResolver
  ]
})
export class AdminModule {}
