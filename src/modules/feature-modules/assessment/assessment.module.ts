import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AssessmentRoutingModule } from './assessment-routing.module';
import { AssessmentLayoutComponent } from './base/assessment-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';

import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationAssessmentOverviewComponent } from './pages/innovation/assessment/assessment-overview.component';
import { InnovationAssessmentNewComponent } from './pages/innovation/assessment/assessment-new.component';
import { InnovationAssessmentEditComponent } from './pages/innovation/assessment/assessment-edit.component';
import { InnovationSupportOrganisationsSupportStatusInfoComponent } from './pages/innovation/support/organisations-support-status-info.component';
import { PageAssessmentAccountManageAccountInfoComponent } from './pages/manage-account/manage-account-info.component';

// Services.
import { AssessmentService } from './services/assessment.service';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';

@NgModule({
  imports: [ThemeModule, SharedModule, AssessmentRoutingModule],
  declarations: [
    AssessmentLayoutComponent,

    // Pages.
    DashboardComponent,
    ReviewInnovationsComponent,

    InnovationOverviewComponent,
    InnovationAssessmentOverviewComponent,
    InnovationAssessmentNewComponent,
    InnovationAssessmentEditComponent,
    InnovationSupportOrganisationsSupportStatusInfoComponent,
    PageAssessmentAccountManageAccountInfoComponent,
  ],
  providers: [
    // Services.
    AssessmentService,

    // Resolvers.
    InnovationDataResolver,
  ],
})
export class AssessmentModule {}
