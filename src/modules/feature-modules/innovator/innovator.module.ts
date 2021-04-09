import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { InnovatorRoutingModule } from './innovator-routing.module';
import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
import { InnovationOverviewComponent } from './pages/innovations/overview.component';

// Services.
import { InnovationsService } from './services/innovations.service';
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
    InnovationOverviewComponent
  ],
  providers: [
    InnovationsService,
    InnovatorService,

    // Guards.
    FirstTimeSigninGuard
  ]
})
export class InnovatorModule { }
