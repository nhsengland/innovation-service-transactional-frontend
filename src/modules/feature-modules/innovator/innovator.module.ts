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
import { PageAccountInnovationsWithdrawComponent } from './pages/account/innovations-withdraw.component';
import { PageAccountInnovationsInfoComponent } from './pages/account/innovations-info.component';
import { PageAccountInnovationsTransferComponent } from './pages/account/innovations-transfer.component';
import { PageAccountInnovationsStopSharingComponent } from './pages/account/innovations-stop-sharing.component';
import { PageAccountInnovationsStopSharingOverviewComponent } from './pages/account/innovations-stop-sharing-overview.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // First time signin.
import { FirstTimeSigninInnovationNewComponent } from './pages/first-time-signin/innovation-new.component';
import { FirstTimeSigninInnovationTransferComponent } from './pages/first-time-signin/innovation-transfer.component';
// // Innovation.
import { InnovationActionTrackerDeclineComponent } from './pages/innovation/action-tracker/action-tracker-decline.component';
import { InnovationDataSharingChangeComponent } from './pages/innovation/data-sharing/data-sharing-change.component';
import { PageInnovationHowToProceedComponent } from './pages/innovation/how-to-proceed/how-to-proceed.component';
import { PageInnovationNeedsReassessmentSendComponent } from './pages/innovation/needs-reassessment/needs-reassessment-send.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';
import { InnovationNewComponent } from './pages/innovation-new/innovation-new.component';
import { InnovationExportRequestRejectComponent } from './pages/innovation/export/export-request-reject.component';
import { InnovationActionCompleteConfirmationComponent } from './pages/innovation/action-complete-confirmation/action-complete-confirmation.component';
import { PageCollaborationInviteComponent } from './pages/collaboration-invite/collaboration-invite.component';

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
    PageAccountInnovationsWithdrawComponent,
    PageAccountInnovationsInfoComponent,
    PageAccountInnovationsTransferComponent,
    PageAccountInnovationsStopSharingComponent,
    PageAccountInnovationsStopSharingOverviewComponent,
    // // Dashboard.
    PageDashboardComponent,
    // // First time signin.
    FirstTimeSigninInnovationNewComponent,
    FirstTimeSigninInnovationTransferComponent,
    // // Innovation.
    InnovationActionTrackerDeclineComponent,
    InnovationDataSharingChangeComponent,
    PageInnovationHowToProceedComponent,
    PageInnovationNeedsReassessmentSendComponent,
    InnovationOverviewComponent,
    InnovationSectionEvidenceEditComponent,
    InnovationSectionEditComponent,
    InnovationNewComponent,
    InnovationExportRequestRejectComponent,
    InnovationActionCompleteConfirmationComponent,
    PageCollaborationInviteComponent,

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
