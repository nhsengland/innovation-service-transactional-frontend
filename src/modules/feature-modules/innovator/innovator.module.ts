import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { InnovatorRoutingModule } from './innovator-routing.module';

// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Pages.
// // Account.
import { PageAccountDeleteComponent } from './pages/account/account-delete.component';
import { PageAccountInfoComponent } from './pages/account/account-info.component';
import { PageAccountInnovationsArchivalComponent } from './pages/account/innovations-archival.component';
import { PageAccountInnovationsInfoComponent } from './pages/account/innovations-info.component';
import { PageAccountInnovationsTransferComponent } from './pages/account/innovations-transfer.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // First time signin.
import { FirstTimeSigninInnovationNewComponent } from './pages/first-time-signin/innovation-new.component';
import { FirstTimeSigninInnovationTransferComponent } from './pages/first-time-signin/innovation-transfer.component';
// // Innovation.
import { InnovationActionTrackerDeclineComponent } from './pages/innovation/action-tracker/action-tracker-decline.component';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerComponent } from './pages/innovation/action-tracker/action-tracker.component';
import { InnovationDataSharingChangeComponent } from './pages/innovation/data-sharing/data-sharing-change.component';
import { InnovationDataSharingComponent } from './pages/innovation/data-sharing/data-sharing.component';
import { InnovatorNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';
import { InnovationNewComponent } from './pages/innovation-new/innovation-new.component';

// Components.
import { OrganisationSuggestionsCardComponent } from './components/organisation-suggestion-card.component';

// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';

// Services.
import { InnovatorService } from './services/innovator.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    InnovatorRoutingModule
  ],
  declarations: [
    // Base.
    ContextInnovationOutletComponent,
    SidebarAccountMenuOutletComponent,
    SidebarInnovationMenuOutletComponent,

    // Pages.
    // // Account.
    PageAccountDeleteComponent,
    PageAccountInfoComponent,
    PageAccountInnovationsArchivalComponent,
    PageAccountInnovationsInfoComponent,
    PageAccountInnovationsTransferComponent,
    // // Dashboard.
    PageDashboardComponent,
    // // First time signin.
    FirstTimeSigninInnovationNewComponent,
    FirstTimeSigninInnovationTransferComponent,
    // // Innovation.
    InnovationActionTrackerDeclineComponent,
    InnovationActionTrackerInfoComponent,
    InnovationActionTrackerComponent,
    InnovationDataSharingChangeComponent,
    InnovationDataSharingComponent,
    InnovatorNeedsAssessmentOverviewComponent,
    InnovationOverviewComponent,
    InnovationSectionEvidenceEditComponent,
    InnovationSectionEditComponent,
    InnovationNewComponent,

    // Components.
    OrganisationSuggestionsCardComponent
  ],
  providers: [
    // Guards.
    FirstTimeSigninGuard,

    // Services.
    InnovatorService
  ]
})
export class InnovatorModule { }
