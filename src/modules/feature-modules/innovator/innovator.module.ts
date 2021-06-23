import { NgModule } from '@angular/core';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/innovation-support-status-list.component';
import { SharedModule } from '@modules/shared/shared.module';
import { ThemeModule } from '@modules/theme/theme.module';
import { InnovatorLayoutComponent } from './base/innovator-layout.component';
// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';
import { InnovatorRoutingModule } from './innovator-routing.module';
// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
import { InnovationActionTrackerDeclineComponent } from './pages/innovation/action-tracker/action-tracker-decline.component';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerComponent } from './pages/innovation/action-tracker/action-tracker.component';
import { InnovationCommentsComponent } from './pages/innovation/comments/comments.component';
import { InnovationDataSharingChangeComponent } from './pages/innovation/data-sharing/data-sharing-change.component';
import { InnovationDataSharingComponent } from './pages/innovation/data-sharing/data-sharing.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';
// Services.
import { InnovatorService } from './services/innovator.service';







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
    InnovationDataSharingChangeComponent,
    InnovationActionTrackerInfoComponent,
    InnovationActionTrackerDeclineComponent,
    PageInnovationSupportStatusListComponent,

  ],
  providers: [
    InnovatorService,

    // Guards.
    FirstTimeSigninGuard,

  ]
})
export class InnovatorModule { }
