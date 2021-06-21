import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { InnovatorRoutingModule } from './innovator-routing.module';
import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';

import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationActionTrackerComponent } from './pages/innovation/action-tracker/action-tracker.component';
import { InnovationCommentsComponent } from './pages/innovation/comments/comments.component';
import { InnovationDataSharingComponent } from './pages/innovation/data-sharing/data-sharing.component';

// Services.
import { InnovatorService } from './services/innovator.service';

// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerDeclineComponent } from './pages/innovation/action-tracker/action-tracker-decline.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    InnovatorRoutingModule
  ],
  declarations: [
    InnovatorLayoutComponent,

    // Pages.
    DashboardComponent,
    FirstTimeSigninComponent,
    InnovationOverviewComponent,
    InnovationSectionEditComponent,
    InnovationSectionEvidenceEditComponent,
    InnovationActionTrackerComponent,
    InnovationCommentsComponent,
    InnovationDataSharingComponent,
    InnovationActionTrackerInfoComponent,
    InnovationActionTrackerDeclineComponent,
  ],
  providers: [
    InnovatorService,

    // Guards.
    FirstTimeSigninGuard,

  ]
})
export class InnovatorModule { }
