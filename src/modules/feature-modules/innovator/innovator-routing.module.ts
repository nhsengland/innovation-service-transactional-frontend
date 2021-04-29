import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
import { InnovationOverviewComponent } from './pages/innovations/overview.component';
import { InnovationsSectionViewComponent } from './pages/innovations/sections/section-view.component';
import { InnovationsSectionEditComponent } from './pages/innovations/sections/section-edit.component';

import { PageInnovationRecordComponent } from '@shared-module/pages/innovation/innovation-record.component';



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
        path: 'first-time-signin',
        children: [
          { path: '', pathMatch: 'full', redirectTo: '1' },
          { path: ':id', pathMatch: 'full', component: FirstTimeSigninComponent }
        ]
      },
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
              { path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent },
              { path: 'record', pathMatch: 'full', data: { module: 'innovator' }, component: PageInnovationRecordComponent },
              { path: 'record/sections/:sectionId', pathMatch: 'full', component: InnovationsSectionViewComponent },
              { path: 'record/sections/:sectionId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/edit/1' },
              { path: 'record/sections/:sectionId/edit/:questionId', pathMatch: 'full', component: InnovationsSectionEditComponent }
            ]
          }
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
