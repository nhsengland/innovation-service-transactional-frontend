import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
import { InnovationOverviewComponent } from './pages/innovations/overview.component';

// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    canActivateChild: [FirstTimeSigninGuard],
    path: '',
    component: InnovatorLayoutComponent,
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        component: DashboardComponent
      },
      {
        path: 'innovations',
        children: [
          { path: '', pathMatch: 'full', component: DashboardComponent },
          { path: ':innovationId', pathMatch: 'full', redirectTo: ':innovationId/overview' },
          {
            path: ':innovationId',
            children: [
              { path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent }
            ]
          },
        ]
      },
      {
        path: 'first-time-signin',
        children: [
          { path: '', pathMatch: 'full', redirectTo: '1' },
          { path: ':id', pathMatch: 'full', component: FirstTimeSigninComponent }
        ]
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnovatorRoutingModule { }
