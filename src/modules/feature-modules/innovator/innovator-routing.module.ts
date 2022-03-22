import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { PageAccountManageInnovationsInfoComponent } from './pages/account/manage-innovations/manage-innovations-info.component';
import { PageAccountManageInnovationsTransferComponent } from './pages/account/manage-innovations/manage-innovations-transfer.component';
import { PageAccountManageInnovationsArchivalComponent } from './pages/account/manage-innovations/manage-innovations-archival.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
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
import { InnovationsListComponent } from './pages/innovations/innovations-list.component';
import { PageAccountManageAccountInfoComponent } from './pages/account/manage-account/manage-account-info.component';
import { PageAccountManageUserAccountComponent } from './pages/account/manage-account/manage-account-delete.component';

import { PageAccountManageDetailsInfoComponent } from '@shared-module/pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from '@shared-module/pages/account/manage-details/manage-details-edit.component';
import { PageAccountEmailNotificationsComponent } from '@shared-module/pages/account/email-notifications/email-notifications.component';

import { InnovationSectionViewComponent } from '@shared-module/pages/innovation/section-view.component';
import { InnovationSectionEvidenceViewComponent } from '@shared-module/pages/innovation/evidence-view.component';
import { PageActionStatusListComponent } from '@shared-module/pages/innovation/action-status-list.component';
import { PageInnovationActivityLogComponent } from '@modules/shared/pages/innovation/innovation-activity-log.component';
import { PageInnovationRecordComponent } from '@shared-module/pages/innovation/innovation-record.component';
import { PageInnovationCommentsListComponent } from '@shared-module/pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from '@shared-module/pages/innovation/comments/comments-new.component';
import { PageInnovationSupportStatusListComponent } from '@shared-module/pages/innovation/innovation-support-status-list.component';


// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';

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
          },
          {
            path: 'email-notifications', pathMatch: 'full', component: PageAccountEmailNotificationsComponent,
            data: { layoutOptions: { type: 'userAccountMenu' } }
          },
          {
            path: 'manage-innovations',
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountManageInnovationsInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              },
              {
                path: 'transfer', pathMatch: 'full', component: PageAccountManageInnovationsTransferComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'account/manage-innovations', label: 'Manage innovations' } } }
              },
              {
                path: 'archive', pathMatch: 'full', component: PageAccountManageInnovationsArchivalComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'account/manage-innovations', label: 'Manage innovations' } } }
              }
            ]
          },
          {
            path: 'manage-account',
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountManageAccountInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              },
              {
                path: 'delete', pathMatch: 'full', component: PageAccountManageUserAccountComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'account/manage-account', label: 'Manage account' } } }
              }]
          }
        ]
      },

      {
        path: 'innovations',
        children: [
          { path: '', pathMatch: 'full', component: InnovationsListComponent },
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
                path: 'record/sections/:sectionId', pathMatch: 'full', component: InnovationSectionViewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record', label: 'Innovation record' } } }
              },
              { path: 'record/sections/:sectionId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/edit/1' },
              { path: 'record/sections/:sectionId/edit/:questionId', pathMatch: 'full', component: InnovationSectionEditComponent },

              { path: 'record/sections/:sectionId/evidence/new', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/new/1' },
              { path: 'record/sections/:sectionId/evidence/new/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent },
              {
                path: 'record/sections/:sectionId/evidence/:evidenceId', pathMatch: 'full', component: InnovationSectionEvidenceViewComponent,
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
                path: 'comments',
                resolve: { innovationData: InnovationDataResolver },
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationCommentsListComponent,
                  },
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
              {
                path: 'assessments/:assessmentId', pathMatch: 'full', component: InnovatorNeedsAssessmentOverviewComponent,
                // data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/innovations/:innovationId', label: 'Go back' } } }
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
export class InnovatorRoutingModule { }
