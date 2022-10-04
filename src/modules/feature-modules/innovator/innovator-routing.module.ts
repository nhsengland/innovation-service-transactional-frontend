import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layouts.
import { BaseLayoutComponent } from './base/base-layout.component';

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
import { InnovationActionDataResolver } from '@modules/shared/resolvers/innovation-action-data.resolver';
import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { InnovationDataResolverType } from '@modules/stores/innovation';
import { InnovationSectionDataResolver } from '@modules/shared/resolvers/innovation-section-data.resolver';
import { InnovationSectionEvidenceDataResolver } from '@modules/shared/resolvers/innovation-section-evidence-data.resolver';
import { InnovationThreadDataResolver } from '@modules/shared/resolvers/innovation-thread-data.resolver';


export type RoutesDataType = {
  module?: string, // TODO: To remove.
  breadcrumb?: string,
  layout?: {
    type?: 'full' | '1.third-2.thirds',
    chosenMenu?: null | 'home' | 'innovation' | 'notifications' | 'yourAccount',
    backgroundColor?: null | string
  },
  innovationActionData: { id: null | string, name: string },
  innovationData?: InnovationDataResolverType,
  innovationSectionData: { id: null | string, name: string },
  innovationSectionEvidenceData: { id: null | string, name: string }
  innovationThreadData: { id: null | string, name: string }
};


const routes: Routes = [

  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [FirstTimeSigninGuard],
    data: {
      module: 'innovator',
      breadcrumb: 'Home'
    },
    children: [

      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', pathMatch: 'full', component: PageDashboardComponent },

      {
        path: 'terms-of-use', pathMatch: 'full', component: PageTermsOfUseAcceptanceComponent,
        data: { layout: { type: 'full', chosenMenu: null } }
      },

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
        path: 'innovations',
        children: [

          { path: '', pathMatch: 'full', redirectTo: '../dashboard' },

          { path: 'new', pathMatch: 'full', component: InnovationNewComponent },
          {
            path: ':innovationId',
            resolve: { innovationData: InnovationDataResolver },
            data: {
              module: 'innovator',
              layout: { type: '1.third-2.thirds', chosenMenu: 'innovation' },
              breadcrumb: (data: RoutesDataType) => data.innovationData?.name
            },
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'overview' },
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { breadcrumb: null }
              },

              {
                path: 'assessments/:assessmentId', pathMatch: 'full', component: InnovatorNeedsAssessmentOverviewComponent,
                data: {
                  breadcrumb: 'Needs assessment',
                  layout: { type: 'full', chosenMenu: 'innovation' }
                }
              },

              {
                path: 'record',
                data: { breadcrumb: 'Innovation Record' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: PageInnovationRecordComponent,
                    data: { breadcrumb: null }
                  },

                  {
                    path: 'sections',
                    data: { breadcrumb: null },
                    children: [

                      { path: '', pathMatch: 'full', redirectTo: '../record' },

                      {
                        path: ':sectionId',
                        resolve: { innovationSectionData: InnovationSectionDataResolver },
                        data: {
                          breadcrumb: (data: RoutesDataType) => data.innovationSectionData.name
                        },
                        children: [
                          {
                            path: '', pathMatch: 'full', component: PageInnovationSectionInfoComponent,
                            data: { breadcrumb: null }
                          },

                          { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                          {
                            path: 'edit/:questionId', pathMatch: 'full', component: InnovationSectionEditComponent,
                            data: { layout: { type: 'full', chosenMenu: 'innovation' } }
                          },

                          {
                            path: 'evidences',
                            data: { breadcrumb: null },
                            children: [

                              { path: '', pathMatch: 'full', redirectTo: '../:sectionId' },

                              { path: 'new', pathMatch: 'full', redirectTo: 'new/1' },
                              {
                                path: 'new/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent,
                                data: {
                                  breadcrumb: 'New',
                                  layout: { type: 'full', chosenMenu: 'innovation' }
                                }
                              },
                              {
                                path: ':evidenceId',
                                resolve: { innovationSectionEvidenceData: InnovationSectionEvidenceDataResolver },
                                data: {
                                  breadcrumb: (data: RoutesDataType) => {
                                    const name = data.innovationSectionEvidenceData.name;
                                    return name.length > 30 ? `${name.substring(0, 30)}...` : name;
                                  }
                                },
                                children: [
                                  {
                                    path: '', pathMatch: 'full', component: PageInnovationSectionEvidenceInfoComponent,
                                    data: { breadcrumb: null }
                                  },
                                  { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                                  {
                                    path: 'edit/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent,
                                    data: {
                                      data: { breadcrumb: 'Edit' },
                                      layout: { type: 'full', chosenMenu: 'innovation' }
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
                ]
              },

              {
                path: 'action-tracker',
                data: { breadcrumb: 'Action Tracker' },
                children: [

                  {
                    path: '', pathMatch: 'full', component: InnovationActionTrackerComponent,
                    data: { breadcrumb: null }
                  },

                  {
                    path: 'statuses', pathMatch: 'full', component: PageActionStatusListComponent,
                    data: { breadcrumb: 'Statuses' }
                  },

                  {
                    path: ':actionId',
                    resolve: { innovationActionData: InnovationActionDataResolver },
                    data: {
                      breadcrumb: (data: RoutesDataType) => {
                        const name = data.innovationActionData.name;
                        return name.length > 30 ? `${name.substring(0, 30)}...` : name;
                      }
                    },
                    children: [
                      {
                        path: '', pathMatch: 'full', component: InnovationActionTrackerInfoComponent,
                        data: { breadcrumb: null }
                      },
                      {
                        path: 'decline', pathMatch: 'full', component: InnovationActionTrackerDeclineComponent,
                        data: { breadcrumb: 'Decline' }
                      }
                    ]
                  }

                ]
              },

              {
                path: 'threads',
                resolve: { innovationData: InnovationDataResolver },
                data: { breadcrumb: 'Messages' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: PageInnovationThreadsListComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'new', pathMatch: 'full', component: PageInnovationThreadNewComponent,
                    data: {
                      data: { breadcrumb: 'New' }
                    }
                  },
                  {
                    path: ':threadId',
                    resolve: { innovationThreadData: InnovationThreadDataResolver },
                    data: {
                      breadcrumb: (data: RoutesDataType) => {
                        const name = data.innovationThreadData.name;
                        return name.length > 30 ? `${name.substring(0, 30)}...` : name;
                      }
                    },
                    children: [
                      {
                        path: '', pathMatch: 'full', component: PageInnovationThreadMessagesListComponent,
                        data: { breadcrumb: null }
                      },
                      {
                        path: 'messages/:messageId', pathMatch: 'full', component: PageInnovationThreadMessageEditComponent,
                        data: { breadcrumb: 'Edit' }
                      }
                    ]
                  }
                ]
              },

              {
                path: 'support',
                data: { breadcrumb: 'Data Sharing and Support' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: InnovationDataSharingComponent,
                    data: { breadcrumb: null }
                  },

                  { path: 'edit', pathMatch: 'full', component: InnovationDataSharingChangeComponent },
                  {
                    path: 'statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent
                  }
                ]
              },

              {
                path: 'activity-log', pathMatch: 'full', component: PageInnovationActivityLogComponent,
                data: {
                  breadcrumb: 'Activity Log',
                  layout: { type: 'full', chosenMenu: 'innovation', backgroundColor: 'bg-color-white' }
                }
              }

            ]

          }
        ]
      },

      {
        path: 'notifications', pathMatch: 'full', component: PageNotificationsListComponent,
        data: {
          layout: { backgroundColor: 'bg-color-white' }
        }
      },

      {
        path: 'account',
        data: {
          breadcrumb: 'Your account',
          layout: { type: '1.third-2.thirds', chosenMenu: 'yourAccount' }
        },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'manage-details' },
          {
            path: 'manage-details',
            data: { breadcrumb: null },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountManageDetailsInfoComponent,
                data: { breadcrumb: null }
              },
              { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
              {
                path: 'edit/:stepId', pathMatch: 'full', component: PageAccountManageDetailsEditComponent,
                data: {
                  breadcrumb: 'Edit',
                  layout: { type: 'full', chosenMenu: 'yourAccount' }
                }
              }
            ]
          },
          {
            path: 'email-notifications',
            data: { breadcrumb: 'Email notifications' },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountEmailNotificationsListComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'edit/:notificationType', pathMatch: 'full', component: PageAccountEmailNotificationsEditComponent,
                data: {
                  breadcrumb: 'Edit',
                  layout: { type: 'full', chosenMenu: 'yourAccount' }
                }
              }
            ]
          },
          {
            path: 'manage-innovations',
            data: { breadcrumb: 'Manage innovations' },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountInnovationsInfoComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'transfer', pathMatch: 'full', component: PageAccountInnovationsTransferComponent
              },
              {
                path: 'archive', pathMatch: 'full', component: PageAccountInnovationsArchivalComponent
              }
            ]
          },
          {
            path: 'manage-account',
            data: { breadcrumb: 'Manage account' },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountInfoComponent,
                data: { breadcrumb: null }
              },
              { path: 'delete', pathMatch: 'full', component: PageAccountDeleteComponent }
            ]
          }
        ]
      },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnovatorRoutingModule { }
