import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AssessmentRoutingModule } from './assessment-routing.module';

// Layouts.
import { BaseLayoutComponent } from './base/base-layout.component';

// Pages.
// // Account.
import { PageAssessmentAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationAssessmentEditComponent } from './pages/innovation/assessment/assessment-edit.component';
import { InnovationAssessmentNewComponent } from './pages/innovation/assessment/assessment-new.component';
import { InnovationAssessmentOverviewComponent } from './pages/innovation/assessment/assessment-overview.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSupportOrganisationsSupportStatusInfoComponent } from './pages/innovation/support/organisations-support-status-info.component';
// // Innovations.
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';

// Services.
import { AssessmentService } from './services/assessment.service';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';

@NgModule({
  imports: [ThemeModule, SharedModule, AssessmentRoutingModule],
  declarations: [
    BaseLayoutComponent,

    // Pages.
    // // Account.
    PageAssessmentAccountManageAccountInfoComponent,
    // // Dashboard.
    DashboardComponent,
    // // Innovation.
    InnovationAssessmentEditComponent,
    InnovationAssessmentNewComponent,
    InnovationAssessmentOverviewComponent,
    InnovationOverviewComponent,
    InnovationSupportOrganisationsSupportStatusInfoComponent,
    // // Innovations.
    ReviewInnovationsComponent,
  ],
  providers: [
    // Services.
    AssessmentService,

    // Resolvers.
    InnovationDataResolver
  ]
})
export class AssessmentModule { }
