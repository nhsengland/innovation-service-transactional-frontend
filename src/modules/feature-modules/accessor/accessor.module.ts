import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AccessorRoutingModule } from './accessor-routing.module';
import { AccessorLayoutComponent } from './base/accessor-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';

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
    ReviewInnovationsComponent
  ],
  providers: [
    AccessorService
  ]
})
export class AccessorModule { }
