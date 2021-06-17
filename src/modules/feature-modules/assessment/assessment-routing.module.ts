import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssessmentLayoutComponent } from './base/assessment-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';

import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationAssessmentNewComponent } from './pages/innovation/assessment/assessment-new.component';
import { InnovationAssessmentEditComponent } from './pages/innovation/assessment/assessment-edit.component';
import { PageInnovationRecordComponent } from '@modules/shared/pages/innovation/innovation-record.component';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';
import { InnovationSectionViewComponent } from '@modules/shared/pages/innovation/section-view.component';
import { InnovationSectionEvidenceViewComponent } from '@modules/shared/pages/innovation/evidence-view.component';

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: '',
    component: AssessmentLayoutComponent,
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
            data: { module: 'assessment' },
            resolve: { innovationData: InnovationDataResolver },
            children: [
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/assessment/innovations', label: 'Innovations' } } }
              },
              {
                path: 'assessments/new', pathMatch: 'full', component: InnovationAssessmentNewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/assessment/innovations/:innovationId', label: 'Go back' } } }
              },

              {
                path: 'assessments/:assessmentId', pathMatch: 'full', redirectTo: 'assessments/:assessmentId/edit/1' // component: InnovationAssessmentEditComponent,
              },
              { path: 'assessments/:assessmentId/edit', pathMatch: 'full', redirectTo: 'assessments/:assessmentId/edit/1' },
              {
                path: 'assessments/:assessmentId/edit/:stepId', pathMatch: 'full', component: InnovationAssessmentEditComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/assessment/innovations/:innovationId', label: 'Back to innovation' } } }
              },
              {
                path: 'record', pathMatch: 'full', component: PageInnovationRecordComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/assessment/innovations', label: 'Innovations' } } }
              },
              {
                path: 'record/sections/:sectionId', pathMatch: 'full', component: InnovationSectionViewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record', label: 'Innovation record' } } }
              },
              {
                path: 'record/sections/:sectionId/evidence/:evidenceId', pathMatch: 'full', component: InnovationSectionEvidenceViewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record/sections/:sectionId', label: 'Innovation section' } } }
              },
              // {
              //   path: 'action-tracker', pathMatch: 'full', component: InnovationActionTrackerComponent,
              //   data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: false } }
              // },
              // {
              //   path: 'comments', pathMatch: 'full', component: InnovationCommentsComponent,
              //   data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: false } }
              // }
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
export class AssessmentRoutingModule { }
