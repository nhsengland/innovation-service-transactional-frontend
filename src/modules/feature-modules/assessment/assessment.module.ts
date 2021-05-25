import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AssessmentRoutingModule } from './assessment-routing.module';
import { AssessmentLayoutComponent } from './base/assessment-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';

// Services.
import { AssessmentService } from './services/assessment.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AssessmentRoutingModule
  ],
  declarations: [
    AssessmentLayoutComponent,

    // Pages.
    DashboardComponent,
    ReviewInnovationsComponent
  ],
  providers: [
    AssessmentService
  ]
})
export class AssessmentModule { }
