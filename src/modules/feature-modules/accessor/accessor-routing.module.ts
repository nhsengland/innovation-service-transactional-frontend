import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessorLayoutComponent } from './base/accessor-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support-update/support-update.component';


const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: '',
    component: AccessorLayoutComponent,
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        component: DashboardComponent
      },

      {
        path: 'innovations',
        children: [
          { path: '', pathMatch: 'full', component: ReviewInnovationsComponent },
          { path: ':innovationId', pathMatch: 'full', redirectTo: ':innovationId/overview' },
          {
            path: ':innovationId',
            children: [
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },
              {
                path: 'assessments/:assessmentId', pathMatch: 'full', component: InnovationNeedsAssessmentOverviewComponent,
                // data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Go back' } } }
              },
              {
                path: 'support', pathMatch: 'full', component: InnovationSupportUpdateComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId', label: 'Go back' } } }
              },
              {
                path: 'support/:supportId', pathMatch: 'full', component: InnovationSupportUpdateComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId', label: 'Go back' } } }
              }
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
export class AccessorRoutingModule { }
