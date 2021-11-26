import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssessmentLayoutComponent } from './base/assessment-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';

import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationAssessmentOverviewComponent } from './pages/innovation/assessment/assessment-overview.component';
import { InnovationAssessmentNewComponent } from './pages/innovation/assessment/assessment-new.component';
import { InnovationAssessmentEditComponent } from './pages/innovation/assessment/assessment-edit.component';
import { InnovationSupportOrganisationsSupportStatusInfoComponent } from './pages/innovation/support/organisations-support-status-info.component';

import { PageAccountManageDetailsInfoComponent } from '@shared-module/pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from '@shared-module/pages/account/manage-details/manage-details-edit.component';

import { InnovationSectionViewComponent } from '@shared-module/pages/innovation/section-view.component';
import { InnovationSectionEvidenceViewComponent } from '@shared-module/pages/innovation/evidence-view.component';
import { PageInnovationActivityLogComponent } from '@shared-module/pages/innovation/innovation-activity-log.component';
import { PageInnovationRecordComponent } from '@shared-module/pages/innovation/innovation-record.component';
import { PageInnovationCommentsListComponent } from '@shared-module/pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from '@shared-module/pages/innovation/comments/comments-new.component';
import { PageInnovationSupportStatusListComponent } from '@shared-module/pages/innovation/innovation-support-status-list.component';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: '',
    component: AssessmentLayoutComponent,
    data: { module: 'assessment' },
    children: [

      {
        path: 'dashboard',
        pathMatch: 'full',
        component: DashboardComponent
      },

      {
        path: 'account',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'manage-details' },
          {
            path: 'manage-details',
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountManageDetailsInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              },
              { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
              { path: 'edit/:stepId', pathMatch: 'full', component: PageAccountManageDetailsEditComponent }
            ]
          }
        ]
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
              { path: 'activity-log', pathMatch: 'full', component: PageInnovationActivityLogComponent },
              {
                path: 'assessments',
                children: [
                  {
                    path: 'new', pathMatch: 'full', component: InnovationAssessmentNewComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/assessment/innovations/:innovationId', label: 'Go back' } } }
                  },
                  {
                    path: ':assessmentId',
                    children: [
                      { path: '', pathMatch: 'full', component: InnovationAssessmentOverviewComponent },
                      { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                      {
                        path: 'edit/:stepId', pathMatch: 'full', component: InnovationAssessmentEditComponent,
                        data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/assessment/innovations/:innovationId', label: 'Back to innovation' } } }
                      }
                    ]
                  }
                ]
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
              {
                path: 'support', pathMatch: 'full', component: InnovationSupportOrganisationsSupportStatusInfoComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/assessment/innovations/:innovationId/support', label: 'Go back' } } }
              },
              {
                path: 'support/statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/assessment/innovations/:innovationId/support', label: 'Go back' } } }
              },
              // {
              //   path: 'action-tracker', pathMatch: 'full', component: InnovationActionTrackerComponent,
              //   data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: false } }
              // },
              // {
              //   path: 'comments', pathMatch: 'full', component: InnovationCommentsComponent,
              //   data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: false } }
              // }
              {
                path: 'comments', pathMatch: 'full', component: PageInnovationCommentsListComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },
              {
                path: 'comments/new', pathMatch: 'full', component: PageInnovationCommentsNewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/comments', label: 'Go back' } } }
              },
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
