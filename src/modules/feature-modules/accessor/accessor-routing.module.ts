import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessorLayoutComponent } from './base/accessor-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support-update/support-update.component';
import { InnovationSupportInfoComponent } from './pages/innovation/support-update/support-info.component';

import { PageInnovationRecordComponent } from '@shared-module/pages/innovation/innovation-record.component';
import { InnovationSectionViewComponent } from '@shared-module/pages/innovation/section-view.component';
import { InnovationSectionEvidenceViewComponent } from '@shared-module/pages/innovation/evidence-view.component';


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
            data: { module: 'accessor' },
            children: [
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },
              {
                path: 'record', pathMatch: 'full', component: PageInnovationRecordComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },
              {
                path: 'record/sections/:sectionId', pathMatch: 'full', component: InnovationSectionViewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record', label: 'Innovation record' } } }
              },
              {
                path: 'record/sections/:sectionId/evidence/:evidenceId', pathMatch: 'full', component: InnovationSectionEvidenceViewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record/sections/:sectionId', label: 'Innovation section' } } }
              },

              {
                path: 'assessments/:assessmentId', pathMatch: 'full', component: InnovationNeedsAssessmentOverviewComponent,
                // data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Go back' } } }
              },
              {
                path: 'support', pathMatch: 'full', component: InnovationSupportInfoComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
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
