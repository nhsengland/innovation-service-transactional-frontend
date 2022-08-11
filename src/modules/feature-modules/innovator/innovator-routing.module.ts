import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Innovator module pages.
// // Account.
import { PageAccountDeleteComponent } from './pages/account/account-delete.component';
import { PageAccountInfoComponent } from './pages/account/account-info.component';
import { PageAccountInnovationsArchivalComponent } from './pages/account/innovations-archival.component';
import { PageAccountInnovationsInfoComponent } from './pages/account/innovations-info.component';
import { PageAccountInnovationsTransferComponent } from './pages/account/innovations-transfer.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // First time signin.
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
// // Innovation.
import { InnovationActionTrackerDeclineComponent } from './pages/innovation/action-tracker/action-tracker-decline.component';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerComponent } from './pages/innovation/action-tracker/action-tracker.component';
import { InnovationDataSharingChangeComponent } from './pages/innovation/data-sharing/data-sharing-change.component';
import { InnovationDataSharingComponent } from './pages/innovation/data-sharing/data-sharing.component';
import { InnovatorNeedsAssessmentOverviewComponent } from './pages/innovation/needs-assessment-overview/needs-assessment-overview.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';
import { InnovationNewComponent } from './pages/innovation-new/innovation-new.component';
import { InnovationTransferAcceptanceComponent } from './pages/innovation-transfer-acceptance/innovation-transfer-acceptance.component';

// // Shared module pages.
// // Account.
import { PageAccountEmailNotificationsEditComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-edit.component';
import { PageAccountEmailNotificationsListComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-list.component';
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
// // Innovation.
import { PageActionStatusListComponent } from '@modules/shared/pages/innovation/actions/action-status-list.component';
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

// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';


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
    canActivateChild: [FirstTimeSigninGuard],
    path: '',
    component: InnovatorLayoutComponent,
    data: { module: 'innovator' },
    children: [

      {
        path: 'first-time-signin',
        pathMatch: 'full',
        component: FirstTimeSigninComponent
      },

      {
        path: 'innovation-transfer-acceptance',
        children: [
          { path: '', pathMatch: 'full', redirectTo: '1' },
          { path: ':stepId', pathMatch: 'full', component: InnovationTransferAcceptanceComponent }
        ]
      },

      { path: 'dashboard', pathMatch: 'full', component: PageDashboardComponent },

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
            path: 'manage-innovations',
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountInnovationsInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              },
              {
                path: 'transfer', pathMatch: 'full', component: PageAccountInnovationsTransferComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'account/manage-innovations', label: 'Manage innovations' } } }
              },
              {
                path: 'archive', pathMatch: 'full', component: PageAccountInnovationsArchivalComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'account/manage-innovations', label: 'Manage innovations' } } }
              }
            ]
          },
          {
            path: 'manage-account',
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              },
              {
                path: 'delete', pathMatch: 'full', component: PageAccountDeleteComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'account/manage-account', label: 'Manage account' } } }
              }]
          }
        ]
      },

      {
        path: 'innovations',
        children: [
          { path: '', pathMatch: 'full', redirectTo: '../dashboard' },

          { path: 'new', pathMatch: 'full', component: InnovationNewComponent },
          {
            path: ':innovationId',
            data: { module: 'innovator' },
            resolve: { innovationData: InnovationDataResolver },
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'overview' },
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              { path: 'activity-log', pathMatch: 'full', component: PageInnovationActivityLogComponent },
              {
                path: 'record', pathMatch: 'full', component: PageInnovationRecordComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'record/sections/:sectionId', pathMatch: 'full', component: PageInnovationSectionInfoComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record', label: 'Innovation record' } } }
              },
              { path: 'record/sections/:sectionId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/edit/1' },
              { path: 'record/sections/:sectionId/edit/:questionId', pathMatch: 'full', component: InnovationSectionEditComponent },

              { path: 'record/sections/:sectionId/evidence/new', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/new/1' },
              { path: 'record/sections/:sectionId/evidence/new/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent },
              {
                path: 'record/sections/:sectionId/evidence/:evidenceId', pathMatch: 'full', component: PageInnovationSectionEvidenceInfoComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record/sections/:sectionId', label: 'Innovation section' } } }
              },
              { path: 'record/sections/:sectionId/evidence/:evidenceId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/:evidenceId/edit/1' },
              { path: 'record/sections/:sectionId/evidence/:evidenceId/edit/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent },

              {
                path: 'action-tracker', pathMatch: 'full', component: InnovationActionTrackerComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'action-tracker/statuses', pathMatch: 'full', component: PageActionStatusListComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/action-tracker', label: 'Go back' } } }
              },
              {
                path: 'action-tracker/:actionId', pathMatch: 'full', component: InnovationActionTrackerInfoComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/action-tracker', label: 'Action tracker' } } }
              },
              {
                path: 'action-tracker/:actionId/decline', pathMatch: 'full', component: InnovationActionTrackerDeclineComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/action-tracker', label: 'Action tracker' } } }
              },
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
                resolve: { innovationData: InnovationDataResolver },
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } },
                children: [
                  { path: '', pathMatch: 'full', component: PageInnovationCommentsListComponent },
                  {
                    path: 'new', pathMatch: 'full', component: PageInnovationCommentsNewComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/comments', label: 'Go back' } } }
                  },
                  {
                    path: ':commentId', pathMatch: 'full', component: PageInnovationCommentsEditComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/comments', label: 'Go back' } }, subModule: 'comment' }
                  },
                  {
                    path: ':commentId/replies/:replyId', pathMatch: 'full', component: PageInnovationCommentsEditComponent,
                    data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/comments', label: 'Go back' } }, subModule: 'reply' }
                  },
                ]
              },
              {
                path: 'support', pathMatch: 'full', component: InnovationDataSharingComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'support/edit', pathMatch: 'full', component: InnovationDataSharingChangeComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/support', label: 'Go back' } } }
              },
              {
                path: 'support/statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/support', label: 'Go back' } } }
              },

              { path: 'assessments/:assessmentId', pathMatch: 'full', component: InnovatorNeedsAssessmentOverviewComponent }
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
