import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent } from './base/admin-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    AdminRoutingModule
  ],
  declarations: [
    AdminLayoutComponent,

    // Pages.
    DashboardComponent
  ]
})
export class AdminModule { }
