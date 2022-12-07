import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AssessmentRoutingModule } from './assessment-routing.module';

// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Pages.
// // Account.
import { PageAssessmentAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationAssessmentEditComponent } from './pages/innovation/assessment/assessment-edit.component';
import { InnovationAssessmentNewComponent } from './pages/innovation/assessment/assessment-new.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
// // Innovations.
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';

// Services.
import { AssessmentService } from './services/assessment.service';


@NgModule({
  imports: [ThemeModule, SharedModule, AssessmentRoutingModule],
  declarations: [
    // Base.
    ContextInnovationOutletComponent,
    SidebarAccountMenuOutletComponent,
    SidebarInnovationMenuOutletComponent,

    // Pages.
    // // Account.
    PageAssessmentAccountManageAccountInfoComponent,
    // // Dashboard.
    DashboardComponent,
    // // Innovation.
    InnovationAssessmentEditComponent,
    InnovationAssessmentNewComponent,
    InnovationOverviewComponent,
    // // Innovations.
    ReviewInnovationsComponent,
  ],
  providers: [
    // Services.
    AssessmentService
  ]
})
export class AssessmentModule { }
