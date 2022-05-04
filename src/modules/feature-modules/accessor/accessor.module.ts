import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AccessorRoutingModule } from './accessor-routing.module';
import { AccessorLayoutComponent } from './base/accessor-layout.component';

// Pages.
import { ActionsListComponent } from './pages/actions/actions-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InnovationsAdvancedReviewComponent } from './pages/innovations/innovations-advanced-review.component';
import { InnovationsReviewComponent } from './pages/innovations/innovations-review.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationActionTrackerListComponent } from './pages/innovation/action-tracker/action-tracker-list.component';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerNewComponent } from './pages/innovation/action-tracker/action-tracker-new.component';
import { InnovationActionTrackerEditComponent } from './pages/innovation/action-tracker/action-tracker-edit.component';
import { InnovationNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';

import { InnovationSupportOrganisationsSupportStatusInfoComponent } from './pages/innovation/support/organisations-support-status-info.component';
import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './pages/innovation/support/organisations-support-status-suggest.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support/support-update.component';
import { InnovationSupportInfoComponent } from './pages/innovation/support/support-info.component';
import { ActionAdvancedFilterComponent } from './pages/actions/actions-advanced-filter.component';
import { PageAccessorAccountManageAccountInfoComponent } from './pages/manage-account/manage-account-info.component';
// Services.
import { AccessorService } from './services/accessor.service';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';

@NgModule({
  imports: [ThemeModule, SharedModule, AccessorRoutingModule],
  declarations: [
    AccessorLayoutComponent,

    // Pages.
    ActionsListComponent,
    DashboardComponent,
    InnovationsAdvancedReviewComponent,
    InnovationsReviewComponent,
    InnovationOverviewComponent,
    InnovationActionTrackerListComponent,
    InnovationActionTrackerInfoComponent,
    InnovationActionTrackerNewComponent,
    InnovationActionTrackerEditComponent,
    InnovationNeedsAssessmentOverviewComponent,

    InnovationSupportOrganisationsSupportStatusInfoComponent,
    InnovationSupportOrganisationsSupportStatusSuggestComponent,
    InnovationSupportUpdateComponent,
    InnovationSupportInfoComponent,
    ActionAdvancedFilterComponent,
    PageAccessorAccountManageAccountInfoComponent
  ],
  providers: [
    // Services.
    AccessorService,

    // Resolvers.
    InnovationDataResolver,
  ],
})
export class AccessorModule {}
