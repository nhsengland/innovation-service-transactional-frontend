import { NgModule } from '@angular/core';

import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AccessorRoutingModule } from './accessor-routing.module';

// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Pages.
// // Account.
import { PageAccessorAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Tasks.
import { TasksListComponent } from './pages/tasks/tasks-list.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './pages/innovation/support/organisations-support-status-suggest.component';
import { InnovationSupportRequestUpdateStatusComponent } from './pages/innovation/support/support-request-update-status.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support/support-update.component';
import { InnovationsReviewComponent } from './pages/innovations/innovations-review.component';
import { InnovationSupportOrganisationReferralCriteriaComponent } from './pages/organisation-referral-criteria/organisation-referral-criteria.component';

// Services.
import { AccessorService } from './services/accessor.service';
import { TrainingAndResourcesComponent } from './pages/training-and-resources/training-and-resources/training-and-resources.component';
import { InnovationChangeAccessorsComponent } from './pages/innovation/support/support-change-accessors.component';

@NgModule({
  imports: [ThemeModule, SharedModule, AccessorRoutingModule],
  declarations: [
    // Base.
    ContextInnovationOutletComponent,
    SidebarAccountMenuOutletComponent,
    SidebarInnovationMenuOutletComponent,

    // Pages.
    // // Account.
    PageAccessorAccountManageAccountInfoComponent,
    // // Actions.
    TasksListComponent,
    // // Dashboard.
    DashboardComponent,
    // // Innovation.
    InnovationOverviewComponent,
    InnovationSupportOrganisationsSupportStatusSuggestComponent,
    InnovationSupportUpdateComponent,
    InnovationSupportRequestUpdateStatusComponent,
    InnovationChangeAccessorsComponent,
    InnovationsReviewComponent,
    InnovationSupportOrganisationReferralCriteriaComponent,
    // // Training.
    TrainingAndResourcesComponent
  ],
  providers: [
    // Services.
    AccessorService
  ]
})
export class AccessorModule {}
