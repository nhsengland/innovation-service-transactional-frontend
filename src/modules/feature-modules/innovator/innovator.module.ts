import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { InnovatorRoutingModule } from './innovator-routing.module';
import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { PageAccountManageInnovationsInfoComponent } from './pages/account/manage-innovations/manage-innovations-info.component';
import { PageAccountManageInnovationsTransferComponent } from './pages/account/manage-innovations/manage-innovations-transfer.component';
import { PageAccountManageInnovationsArchivalComponent } from './pages/account/manage-innovations/manage-innovations-archival.component';
import { PageAccountManageAccountInfoComponent } from './pages/account/manage-account/manage-account-info.component';
import { PageAccountManageUserAccountComponent } from './pages/account/manage-account/manage-account-delete.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
import { InnovationActionTrackerDeclineComponent } from './pages/innovation/action-tracker/action-tracker-decline.component';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerComponent } from './pages/innovation/action-tracker/action-tracker.component';
import { InnovationDataSharingChangeComponent } from './pages/innovation/data-sharing/data-sharing-change.component';
import { InnovationDataSharingComponent } from './pages/innovation/data-sharing/data-sharing.component';
import { InnovatorNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';
import { InnovationTransferAcceptanceComponent } from './pages/innovation-transfer-acceptance/innovation-transfer-acceptance.component';

// Components.
import { OrganisationSuggestionsCardComponent } from './components/organisation-suggestion-card.component';

// Services.
import { InnovatorService } from './services/innovator.service';

// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';



@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    InnovatorRoutingModule
  ],
  declarations: [
    InnovatorLayoutComponent,

    // Pages.
    PageAccountManageInnovationsInfoComponent,
    PageAccountManageInnovationsTransferComponent,
    PageAccountManageInnovationsArchivalComponent,
    PageAccountManageAccountInfoComponent,
    PageAccountManageUserAccountComponent,
    DashboardComponent,
    FirstTimeSigninComponent,
    InnovationActionTrackerDeclineComponent,
    InnovationActionTrackerInfoComponent,
    InnovationActionTrackerComponent,
    InnovationDataSharingChangeComponent,
    InnovationDataSharingComponent,
    InnovatorNeedsAssessmentOverviewComponent,
    InnovationOverviewComponent,
    InnovationSectionEvidenceEditComponent,
    InnovationSectionEditComponent,
    InnovationTransferAcceptanceComponent,

    // Components.
    OrganisationSuggestionsCardComponent
  ],
  providers: [
    // Services.
    InnovatorService,

    // Guards.
    FirstTimeSigninGuard,

    // Resolvers.
    InnovationDataResolver
  ]
})
export class InnovatorModule { }
