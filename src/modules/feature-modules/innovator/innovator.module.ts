import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { InnovatorRoutingModule } from './innovator-routing.module';
import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
import { InnovationOverviewComponent } from './pages/innovations/overview.component';
import { InnovationsSectionEditComponent } from './pages/innovations/sections/section-edit.component';
import { InnovationsSectionViewComponent } from './pages/innovations/sections/section-view.component';
import { InnovationsSectionEvidenceEditComponent } from './pages/innovations/sections/evidence-edit.component';
import { InnovationsSectionEvidenceViewComponent } from './pages/innovations/sections/evidence-view.component';

// Services.
import { InnovatorService } from './services/innovator.service';

// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';


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
    InnovationsSectionEditComponent,
    InnovationsSectionViewComponent,
    InnovationsSectionEvidenceEditComponent,
    InnovationsSectionEvidenceViewComponent
  ],
  providers: [
    InnovatorService,

    // Guards.
    FirstTimeSigninGuard
  ]
})
export class InnovatorModule { }
