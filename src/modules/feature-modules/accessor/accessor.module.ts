import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AccessorRoutingModule } from './accessor-routing.module';
import { AccessorLayoutComponent } from './base/accessor-layout.component';

// Pages.
import { ActionsListComponent } from './pages/actions/actions-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationActionTrackerListComponent } from './pages/innovation/action-tracker/action-tracker-list.component';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerNewComponent } from './pages/innovation/action-tracker/action-tracker-new.component';
import { InnovationActionTrackerEditComponent } from './pages/innovation/action-tracker/action-tracker-edit.component';
import { InnovationNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support-update/support-update.component';
import { InnovationSupportInfoComponent } from './pages/innovation/support-update/support-info.component';

// Services.
import { AccessorService } from './services/accessor.service';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AccessorRoutingModule
  ],
  declarations: [
    AccessorLayoutComponent,

    // Pages.
    ActionsListComponent,
    DashboardComponent,
    ReviewInnovationsComponent,
    InnovationOverviewComponent,
    InnovationActionTrackerListComponent,
    InnovationActionTrackerInfoComponent,
    InnovationActionTrackerNewComponent,
    InnovationActionTrackerEditComponent,
    InnovationNeedsAssessmentOverviewComponent,
    InnovationSupportUpdateComponent,
    InnovationSupportInfoComponent
  ],
  providers: [
    // Services.
    AccessorService,

    // Resolvers.
    InnovationDataResolver
  ]
})
export class AccessorModule { }
