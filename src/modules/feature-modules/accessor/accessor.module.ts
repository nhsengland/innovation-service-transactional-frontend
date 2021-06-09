import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AccessorRoutingModule } from './accessor-routing.module';
import { AccessorLayoutComponent } from './base/accessor-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support-update/support-update.component';
import { InnovationSupportInfoComponent } from './pages/innovation/support-update/support-info.component';

// Services.
import { AccessorService } from './services/accessor.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AccessorRoutingModule
  ],
  declarations: [
    AccessorLayoutComponent,

    // Pages.
    DashboardComponent,
    ReviewInnovationsComponent,
    InnovationOverviewComponent,
    InnovationNeedsAssessmentOverviewComponent,
    InnovationSupportUpdateComponent,
    InnovationSupportInfoComponent
  ],
  providers: [
    AccessorService
  ]
})
export class AccessorModule { }
