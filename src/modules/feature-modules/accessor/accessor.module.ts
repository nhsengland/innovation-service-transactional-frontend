import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AccessorRoutingModule } from './accessor-routing.module';

// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Pages.
// // Account.
import { PageAccessorAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Actions.
import { ActionsAdvancedSearchComponent } from './pages/actions/actions-advanced-search.component';
import { ActionsListComponent } from './pages/actions/actions-list.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationActionTrackerEditComponent } from './pages/innovation/action-tracker/action-tracker-edit.component';
import { InnovationActionTrackerCancelComponent } from './pages/innovation/action-tracker/action-tracker-cancel.component';
import { InnovationActionTrackerNewComponent } from './pages/innovation/action-tracker/action-tracker-new.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './pages/innovation/support/organisations-support-status-suggest.component';
import { InnovationSupportInfoComponent } from './pages/innovation/support/support-info.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support/support-update.component';
import { InnovationSupportRequestUpdateStatusComponent } from './pages/innovation/support/support-request-update-status.component';
import { InnovationsReviewComponent } from './pages/innovations/innovations-review.component';
import { InnovationSupportOrganisationReferralCriteriaComponent } from './pages/organisation-referral-criteria/organisation-referral-criteria.component';
import { InnovationExportRequestComponent } from './pages/innovation/export/export-request.component';


// Services.
import { AccessorService } from './services/accessor.service';

// Resolvers.
import { InnovationActionDataResolver } from './resolvers/innovation-action-data.resolver';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AccessorRoutingModule
  ],
  declarations: [
    // Base.
    ContextInnovationOutletComponent,
    SidebarAccountMenuOutletComponent,
    SidebarInnovationMenuOutletComponent,

    // Pages.
    // // Account.
    PageAccessorAccountManageAccountInfoComponent,
    // // Actions.
    ActionsAdvancedSearchComponent,
    ActionsListComponent,
    // // Dashboard.
    DashboardComponent,
    // // Innovation.
    InnovationActionTrackerEditComponent,
    InnovationActionTrackerCancelComponent,
    InnovationActionTrackerNewComponent,
    InnovationOverviewComponent,
    InnovationSupportOrganisationsSupportStatusSuggestComponent,
    InnovationSupportInfoComponent,
    InnovationSupportUpdateComponent,
    InnovationSupportRequestUpdateStatusComponent,
    InnovationsReviewComponent,
    InnovationSupportOrganisationReferralCriteriaComponent,
    InnovationExportRequestComponent
  ],
  providers: [
    // Services.
    AccessorService,

    // Resolvers.
    InnovationActionDataResolver,
  ]
})
export class AccessorModule { }
