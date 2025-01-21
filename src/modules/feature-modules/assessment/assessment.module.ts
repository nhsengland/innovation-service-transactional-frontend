import { NgModule } from '@angular/core';

import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';

import { AssessmentRoutingModule } from './assessment-routing.module';

// Base.
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Pages.
// // Account.
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationAssessmentEditComponent } from './pages/innovation/assessment/assessment-edit.component';
import { InnovationAssessmentNewComponent } from './pages/innovation/assessment/assessment-new.component';
import { InnovationAssessmentExemptionInfoComponent } from './pages/innovation/assessment/exemption-info.component';
import { InnovationAssessmentExemptionUpsertComponent } from './pages/innovation/assessment/exemption-upsert.component';
import { InnovationChangeAssessorComponent } from './pages/innovation/change-assessor/change-assessor.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { PageInnovationAssessmentEditReasonComponent } from './pages/innovation/assessment/assessment-edit-reason.component';
// // Innovations.
import { InnovationsListComponent } from './pages/innovations/innovations-list.component';

// Services.
import { AssessmentService } from './services/assessment.service';
import { AnnouncementsService } from '../announcements/services/announcements.service';

import { InnovationRecordSidebarComponent } from '@modules/shared/components/innovation-record-sidebar/innovation-record-sidebar.component';

@NgModule({
  imports: [ThemeModule, SharedModule, AssessmentRoutingModule, InnovationRecordSidebarComponent],
  declarations: [
    // Base.
    ContextInnovationOutletComponent,
    SidebarAccountMenuOutletComponent,
    SidebarInnovationMenuOutletComponent,

    // Pages.

    // // Dashboard.
    DashboardComponent,
    // // Innovation.
    InnovationAssessmentEditComponent,
    InnovationAssessmentNewComponent,
    InnovationAssessmentExemptionInfoComponent,
    InnovationAssessmentExemptionUpsertComponent,
    InnovationOverviewComponent,
    InnovationChangeAssessorComponent,
    PageInnovationAssessmentEditReasonComponent,
    // // Innovations.
    InnovationsListComponent
  ],
  providers: [
    // Services.
    AssessmentService,
    AnnouncementsService
  ]
})
export class AssessmentModule {}
