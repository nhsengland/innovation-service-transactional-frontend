import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssessmentLayoutComponent } from './base/assessment-layout.component';

// Assessment module pages.
// Pages.
// // Account.
import { PageAssessmentAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationAssessmentEditComponent } from './pages/innovation/assessment/assessment-edit.component';
import { InnovationAssessmentNewComponent } from './pages/innovation/assessment/assessment-new.component';
import { InnovationAssessmentOverviewComponent } from './pages/innovation/assessment/assessment-overview.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSupportOrganisationsSupportStatusInfoComponent } from './pages/innovation/support/organisations-support-status-info.component';
// // Innovations.
import { ReviewInnovationsComponent } from './pages/innovations/review-innovations.component';

// Shared module pages.
// // Account.
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
// // Innovation.
import { PageInnovationActivityLogComponent } from '@modules/shared/pages/innovation/activity-log/innovation-activity-log.component';
import { PageInnovationCommentsEditComponent } from '@modules/shared/pages/innovation/comments/comments-edit.component';
import { PageInnovationCommentsListComponent } from '@modules/shared/pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from '@modules/shared/pages/innovation/comments/comments-new.component';
import { PageInnovationThreadMessageEditComponent } from '@modules/shared/pages/innovation/messages/thread-message-edit.component';
import { PageInnovationThreadMessagesListComponent } from '@modules/shared/pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadNewComponent } from '@modules/shared/pages/innovation/messages/thread-new.component';
import { PageInnovationThreadsListComponent } from '@modules/shared/pages/innovation/messages/threads-list.component';
import { PageInnovationRecordComponent } from '@modules/shared/pages/innovation/record/innovation-record.component';
import { PageInnovationSectionInfoComponent } from '@modules/shared/pages/innovation/sections/section-info.component';
import { PageInnovationSectionEvidenceInfoComponent } from '@modules/shared/pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/innovation-support-status-list.component';
// // Notifications.
import { PageNotificationsListComponent } from '@modules/shared/pages/notifications/notifications-list.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },

  {
    path: 'terms-of-use',
    pathMatch: 'full',
    component: PageTermsOfUseAcceptanceComponent
  },

  {
    path: '',
    component: AssessmentLayoutComponent,
    data: { module: 'assessment' },
    children: [

      { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },

      { path: 'notifications', pathMatch: 'full', component: PageNotificationsListComponent },

      {
        path: 'account',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'manage-details' },
          {
            path: 'manage-details',
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountManageDetailsInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } },
              },
              { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
              { path: 'edit/:stepId', pathMatch: 'full', component: PageAccountManageDetailsEditComponent }
            ],
          },
          {
            path: 'manage-account',
            data: { breadcrumb: 'Manage account' },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAssessmentAccountManageAccountInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              }
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
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/assessment/innovations', label: 'Innovations' } } },
              },
              { path: 'activity-log', pathMatch: 'full', component: PageInnovationActivityLogComponent },
              {
                path: 'assessments',
                children: [
                  {
                    path: 'new', pathMatch: 'full', component: InnovationAssessmentNewComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/assessment/innovations/:innovationId', label: 'Go back' } } },
                  },
                  {
                    path: ':assessmentId',
                    children: [
                      { path: '', pathMatch: 'full', component: InnovationAssessmentOverviewComponent },
                      { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                      {
                        path: 'edit/:stepId', pathMatch: 'full', component: InnovationAssessmentEditComponent,
                        data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/assessment/innovations/:innovationId', label: 'Back to innovation' } } }
                      }]
                  }
                ]
              },
              {
                path: 'record', pathMatch: 'full', component: PageInnovationRecordComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/assessment/innovations', label: 'Innovations' } } }
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
                path: 'support', pathMatch: 'full', component: InnovationSupportOrganisationsSupportStatusInfoComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/assessment/innovations', label: 'Innovations' } } }
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
                path: 'threads',
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: 'innovations', label: 'Innovations' } } },
                children: [
                  { path: '', pathMatch: 'full', component: PageInnovationThreadsListComponent },
                  {
                    path: 'new', pathMatch: 'full', component: PageInnovationThreadNewComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/threads', label: 'Go back' } } }
                  },
                  {
                    path: ':threadId',
                    children: [
                      {
                        path: '', pathMatch: 'full', component: PageInnovationThreadMessagesListComponent,
                        data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/threads', label: 'Back to messages' } } }
                      },
                      {
                        path: 'messages/:messageId', pathMatch: 'full', component: PageInnovationThreadMessageEditComponent,
                        data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/threads/:threadId', label: 'Go back' } } }
                      }
                    ]
                  }
                ]
              },
              {
                path: 'comments',
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/assessment/innovations', label: 'Innovations' } } },
                children: [
                  {
                    path: '', pathMatch: 'full', component: PageInnovationCommentsListComponent,
                  },
                  {
                    path: 'new', pathMatch: 'full', component: PageInnovationCommentsNewComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: '/assessment/innovations/:innovationId/comments', label: 'Go back' } } }
                  },
                  {
                    path: ':commentId', pathMatch: 'full', component: PageInnovationCommentsEditComponent,
                    data: {
                      subModule: 'comment',
                      layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/comments', label: 'Go back' } }
                    }
                  },
                  {
                    path: ':commentId/replies/:replyId', pathMatch: 'full', component: PageInnovationCommentsEditComponent,
                    data: {
                      subModule: 'reply',
                      layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/comments', label: 'Go back' } }
                    }
                  }
                ]
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
  exports: [RouterModule],
})
export class AssessmentRoutingModule { }
