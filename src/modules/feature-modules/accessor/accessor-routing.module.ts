import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessorLayoutComponent } from './base/accessor-layout.component';

// Pages.
import { ActionsListComponent } from './pages/actions/actions-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActionAdvancedFilterComponent } from './pages/actions/actions-advanced-filter.component';
import { InnovationsAdvancedReviewComponent } from './pages/innovations/innovations-advanced-review.component';
import { InnovationsReviewComponent } from './pages/innovations/innovations-review.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationActionTrackerListComponent } from './pages/innovation/action-tracker/action-tracker-list.component';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerNewComponent } from './pages/innovation/action-tracker/action-tracker-new.component';
import { InnovationActionTrackerEditComponent } from './pages/innovation/action-tracker/action-tracker-edit.component';
import { InnovationNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';

import { InnovationSupportOrganisationsSupportStatusInfoComponent } from './pages/innovation/support/organisations-support-status-info.component';
import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './pages/innovation/support/organisations-support-status-suggest.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support/support-update.component';
import { InnovationSupportInfoComponent } from './pages/innovation/support/support-info.component';

import { PageAccountManageDetailsInfoComponent } from '@shared-module/pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from '@shared-module/pages/account/manage-details/manage-details-edit.component';
import { PageAccountEmailNotificationsComponent } from '@shared-module/pages/account/email-notifications/email-notifications.component';

import { InnovationSectionViewComponent } from '@shared-module/pages/innovation/section-view.component';
import { InnovationSectionEvidenceViewComponent } from '@shared-module/pages/innovation/evidence-view.component';
import { PageActionStatusListComponent } from '@shared-module/pages/innovation/action-status-list.component';
import { PageInnovationActivityLogComponent } from '@shared-module/pages/innovation/innovation-activity-log.component';
import { PageInnovationCommentsListComponent } from '@shared-module/pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from '@shared-module/pages/innovation/comments/comments-new.component';
import { PageInnovationRecordComponent } from '@shared-module/pages/innovation/innovation-record.component';
import { PageInnovationSupportStatusListComponent } from '@shared-module/pages/innovation/innovation-support-status-list.component';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';
import { PageInnovationCommentsEditComponent } from '@modules/shared/pages/innovation/comments/comments-edit.component';

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: '',
    component: AccessorLayoutComponent,
    data: { module: 'accessor' },
    children: [

      {
        path: 'dashboard',
        pathMatch: 'full',
        component: DashboardComponent
      },

      {
        path: 'actions',
        pathMatch: 'full',
        component: ActionsListComponent
      },
      {
        path: 'actions/statuses', pathMatch: 'full', component: PageActionStatusListComponent,
        data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/actions', label: 'Go back' } } }
      },
      { path: 'actions/advanced-filter', pathMatch: 'full', component: ActionAdvancedFilterComponent },
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
          },
          {
            path: 'email-notifications', pathMatch: 'full', component: PageAccountEmailNotificationsComponent,
            data: { layoutOptions: { type: 'userAccountMenu' } }
          }
        ]
      },

      {
        path: 'innovations',
        children: [
          { path: '', pathMatch: 'full', component: InnovationsReviewComponent },
          { path: 'advanced-search', pathMatch: 'full', component: InnovationsAdvancedReviewComponent },
          {
            path: ':innovationId',
            data: { module: 'accessor' },
            runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
            resolve: { innovationData: InnovationDataResolver },
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'overview' },
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },
              {
                path: 'activity-log', pathMatch: 'full', component: PageInnovationActivityLogComponent,
                // data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
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
                path: 'action-tracker', pathMatch: 'full', component: InnovationActionTrackerListComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },
              {
                path: 'action-tracker/statuses', pathMatch: 'full', component: PageActionStatusListComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/action-tracker', label: 'Go back' } } }
              },
              {
                path: 'action-tracker/new', pathMatch: 'full', component: InnovationActionTrackerNewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/action-tracker', label: 'Go back' } } }
              },
              {
                path: 'action-tracker/:actionId', pathMatch: 'full', component: InnovationActionTrackerInfoComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/action-tracker', label: 'Action tracker' } } }
              },
              {
                path: 'action-tracker/:actionId/edit', pathMatch: 'full', component: InnovationActionTrackerEditComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations/:innovationId/action-tracker/:actionId', label: 'Go back' } } }
              },
              {
                path: 'comments',
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } },
                children: [
                  {
                    path: '', component: PageInnovationCommentsListComponent,
                    pathMatch: 'full'
                  },
                  {
                    path: 'new', pathMatch: 'full', component: PageInnovationCommentsNewComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/comments', label: 'Go back' } } }
                  },
                  {
                    path: ':commentId', pathMatch: 'full', component: PageInnovationCommentsEditComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/comments', label: 'Go back' } }, subModule: 'comment' }
                  },
                  {
                    path: ':commentId/reply/:replyId', pathMatch: 'full', component: PageInnovationCommentsEditComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/comments', label: 'Go back' } }, subModule: 'reply' }
                  }
                ]
              },
              {
                path: 'assessments/:assessmentId', pathMatch: 'full', component: InnovationNeedsAssessmentOverviewComponent
              },
              {
                path: 'support', pathMatch: 'full', component: InnovationSupportInfoComponent,
                resolve: { innovationData: InnovationDataResolver }, // Needed to repeat this resolver as support can be updated from this routes.
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },
              {
                path: 'support/statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/support', label: 'Go back' } } }
              },
              {
                path: 'support/new', pathMatch: 'full', component: InnovationSupportUpdateComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/support', label: 'Go back' } } }
              },
              {
                path: 'support/organisations', pathMatch: 'full', component: InnovationSupportOrganisationsSupportStatusInfoComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/support', label: 'Go back' } } }
              },
              {
                path: 'support/organisations/suggest',
                children: [
                  { path: '', pathMatch: 'full', redirectTo: '1' },
                  {
                    path: ':stepId', pathMatch: 'full', component: InnovationSupportOrganisationsSupportStatusSuggestComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/support', label: 'Back to innovation' } } }
                  }
                ]
              },
              {
                path: 'support/:supportId', pathMatch: 'full', component: InnovationSupportUpdateComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/support', label: 'Go back' } } }
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
