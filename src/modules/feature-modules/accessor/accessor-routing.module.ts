import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessorLayoutComponent } from './base/accessor-layout.component';

// Pages.
// // Accessor module.
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
// // Shared module.
import { PageAccountEmailNotificationsEditComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-edit.component';
import { PageAccountEmailNotificationsListComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-list.component';
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
import { PageActionStatusListComponent } from '@modules/shared/pages/innovation/actions/action-status-list.component';
import { PageInnovationActivityLogComponent } from '@modules/shared/pages/innovation/activity-log/innovation-activity-log.component';
import { PageInnovationCommentsListComponent } from '@modules/shared/pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from '@modules/shared/pages/innovation/comments/comments-new.component';
import { PageInnovationRecordComponent } from '@modules/shared/pages/innovation/record/innovation-record.component';
import { PageInnovationSectionInfoComponent } from '@modules/shared/pages/innovation/sections/section-info.component';
import { PageInnovationSectionEvidenceInfoComponent } from '@modules/shared/pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/innovation-support-status-list.component';
import { PageNotificationsListComponent } from '@modules/shared/pages/notifications/notifications-list.component';
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';
import { PageInnovationCommentsEditComponent } from '@modules/shared/pages/innovation/comments/comments-edit.component';
import { PageAccessorAccountManageAccountInfoComponent } from './pages/manage-account/manage-account-info.component';

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: 'terms-of-use',
    pathMatch: 'full',
    component: PageTermsOfUseAcceptanceComponent
  },

  {
    path: '',
    component: AccessorLayoutComponent,
    data: { module: 'accessor' },
    children: [

      { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },

      { path: 'notifications', pathMatch: 'full', component: PageNotificationsListComponent },

      {
        path: 'actions',
        children: [
          { path: '', pathMatch: 'full', component: ActionsListComponent },
          {
            path: 'statuses', pathMatch: 'full', component: PageActionStatusListComponent,
            data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/actions', label: 'Go back' } } }
          },
          { path: 'advanced-filter', pathMatch: 'full', component: ActionAdvancedFilterComponent }
        ]
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
          },
          {
            path: 'email-notifications',
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountEmailNotificationsListComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              },
              { path: 'edit/:notificationType', pathMatch: 'full', component: PageAccountEmailNotificationsEditComponent }
            ]
          },
          {
            path: 'manage-account',
            data: { breadcrumb: 'Manage account' },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccessorAccountManageAccountInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              }
            ]
          },
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
              { path: 'activity-log', pathMatch: 'full', component: PageInnovationActivityLogComponent },
              {
                path: 'record', pathMatch: 'full', component: PageInnovationRecordComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },
              {
                path: 'record/sections/:sectionId', pathMatch: 'full', component: PageInnovationSectionInfoComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record', label: 'Innovation record' } } }
              },
              {
                path: 'record/sections/:sectionId/evidence/:evidenceId', pathMatch: 'full', component: PageInnovationSectionEvidenceInfoComponent,
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
                    path: ':commentId/replies/:replyId', pathMatch: 'full', component: PageInnovationCommentsEditComponent,
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
                path: 'support/organisations/suggest', pathMatch: 'full', component: InnovationSupportOrganisationsSupportStatusSuggestComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/accessor/innovations/:innovationId/support', label: 'Back to innovation' } } }
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
