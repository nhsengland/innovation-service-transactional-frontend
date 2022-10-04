import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseLayoutComponent } from './base/base-layout.component';

// Assessment module pages.
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
import { InnovationDataResolverType } from '@modules/stores/innovation/innovation.models';
import { InnovationThreadDataResolver } from '@modules/shared/resolvers/innovation-thread-data.resolver';


export type RoutesDataType = {
  module?: string, // TODO: To remove.
  breadcrumb?: string,
  layout?: {
    type?: 'full' | '1.third-2.thirds',
    chosenMenu?: null | 'home' | 'innovations' | 'actions' | 'notifications' | 'yourAccount',
    backgroundColor?: null | string
  },
  innovationActionData: { id: null | string, name: string },
  innovationData?: InnovationDataResolverType,
  innovationSectionEvidenceData: { id: null | string, name: string }
  innovationThreadData: { id: null | string, name: string }
};


const routes: Routes = [

  {
    path: '',
    component: BaseLayoutComponent,
    data: {
      module: 'assessment',
      breadcrumb: 'Home'
    },
    children: [

      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },

      {
        path: 'terms-of-use', pathMatch: 'full', component: PageTermsOfUseAcceptanceComponent,
        data: { layout: { type: 'full', chosenMenu: null } }
      },

      {
        path: 'innovations',
        data: {
          breadcrumb: 'Innovations'
        },
        children: [
          {
            path: '', pathMatch: 'full', component: ReviewInnovationsComponent,
            data: {
              breadcrumb: null,
              layout: { type: 'full', chosenMenu: null, backgroundColor: 'bg-color-white' }
            }
          },

          {
            path: ':innovationId',
            resolve: { innovationData: InnovationDataResolver },
            data: {
              layout: { type: '1.third-2.thirds', chosenMenu: 'innovations' },
              breadcrumb: (data: RoutesDataType) => data.innovationData?.name
            },
            children: [

              { path: '', pathMatch: 'full', redirectTo: 'overview' },
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { breadcrumb: null }
                // data: { layoutOptions: { type: 'innovationLeftAsideMenu', backLink: { url: '/accessor/innovations', label: 'Innovations' } } }
              },

              {
                path: 'assessments',
                data: {
                  data: { breadcrumb: null },
                  layout: { type: 'full', chosenMenu: 'innovations' }
                },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: '../:innovationId/overview' },
                  {
                    path: 'new', pathMatch: 'full', component: InnovationAssessmentNewComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: ':assessmentId',
                    data: { breadcrumb: null },
                    children: [
                      {
                        path: '', pathMatch: 'full', component: InnovationAssessmentOverviewComponent,
                        data: { breadcrumb: null }
                      },
                      { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                      {
                        path: 'edit/:stepId', pathMatch: 'full', component: InnovationAssessmentEditComponent,
                        data: {
                          data: { breadcrumb: null },
                          layout: { type: 'full', chosenMenu: 'innovations' }
                        }
                      }]
                  }
                ]
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
                        children: [
                          {
                            path: '', pathMatch: 'full', component: PageInnovationSectionInfoComponent,
                            data: { breadcrumb: null }
                          },
                          {
                            path: 'evidences',
                            data: { breadcrumb: null },
                            children: [
                              { path: '', pathMatch: 'full', redirectTo: '../:sectionId' },
                              {
                                path: ':evidenceId', pathMatch: 'full', component: PageInnovationSectionEvidenceInfoComponent,
                                data: { breadcrumb: 'Evidence Info' },
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
                path: 'threads',
                // resolve: { innovationData: InnovationDataResolver },
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
                data: { breadcrumb: 'Support status' },
                resolve: { innovationData: InnovationDataResolver }, // Needed to repeat this resolver as support can be updated from this routes.
                children: [
                  {
                    path: '', pathMatch: 'full', component: InnovationSupportOrganisationsSupportStatusInfoComponent,
                    data: { breadcrumb: null }
                  },
                  { path: 'statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent }
                ]
              },

              {
                path: 'activity-log', pathMatch: 'full', component: PageInnovationActivityLogComponent,
                data: {
                  breadcrumb: 'Activity Log',
                  layout: { type: 'full', chosenMenu: 'innovations', backgroundColor: 'bg-color-white' }
                }
              }

            ]
          }
        ]
      },

      { path: 'notifications', pathMatch: 'full', component: PageNotificationsListComponent },

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
            ],
          },
          {
            path: 'manage-account',
            data: { breadcrumb: 'Manage account' },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAssessmentAccountManageAccountInfoComponent,
                data: { breadcrumb: null }
              }
            ]
          }
        ]
      },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentRoutingModule { }
