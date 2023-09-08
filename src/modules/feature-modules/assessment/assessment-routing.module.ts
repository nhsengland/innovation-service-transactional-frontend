import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layout.
import { RoutesDataType, TransactionalLayoutComponent } from '@modules/theme/base/transactional-layout.component';

// Base
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Assessment module pages.
// // Account.
import { PageAssessmentAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationAssessmentEditComponent } from './pages/innovation/assessment/assessment-edit.component';
import { InnovationAssessmentNewComponent } from './pages/innovation/assessment/assessment-new.component';
import { InnovationAssessmentExemptionInfoComponent } from './pages/innovation/assessment/exemption-info.component';
import { InnovationAssessmentExemptionUpsertComponent } from './pages/innovation/assessment/exemption-upsert.component';
import { InnovationChangeAssessorComponent } from './pages/innovation/change-assessor/change-assessor.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
// // Innovations.
import { InnovationsListComponent } from './pages/innovations/innovations-list.component';

// Shared module pages.
// // Account.
import { PageAccountEmailNotificationsEditComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-edit.component';
import { PageAccountEmailNotificationsListComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-list.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';
// // Actions.
import { PageActionsAdvancedSearchComponent } from '@modules/shared/pages/actions/actions-advanced-search.component';
// // Innovation.
import { PageInnovationActionSectionInfoComponent } from '@modules/shared/pages/innovation/actions/action-section-info.component';
import { PageActionStatusListComponent } from '@modules/shared/pages/innovation/actions/action-status-list.component';
import { PageInnovationActionTrackerCancelComponent } from '@modules/shared/pages/innovation/actions/action-tracker-cancel.component';
import { PageInnovationActionTrackerEditComponent } from '@modules/shared/pages/innovation/actions/action-tracker-edit.component';
import { PageInnovationActionTrackerListComponent } from '@modules/shared/pages/innovation/actions/action-tracker-list.component';
import { PageInnovationActionTrackerNewComponent } from '@modules/shared/pages/innovation/actions/action-tracker-new.component';
import { PageInnovationActivityLogComponent } from '@modules/shared/pages/innovation/activity-log/innovation-activity-log.component';
import { PageInnovationAssessmentOverviewComponent } from '@modules/shared/pages/innovation/assessment/assessment-overview.component';
import { PageInnovationDataSharingAndSupportComponent } from '@modules/shared/pages/innovation/data-sharing-and-support/data-sharing-and-support.component';
import { PageInnovationDocumentInfoComponent } from '@modules/shared/pages/innovation/documents/document-info.component';
import { PageInnovationDocumentsNewditComponent } from '@modules/shared/pages/innovation/documents/document-newdit.component';
import { PageInnovationDocumentsListComponent } from '@modules/shared/pages/innovation/documents/documents-list.component';
import { PageEveryoneWorkingOnInnovationComponent } from '@modules/shared/pages/innovation/everyone-working-on-innovation/everyone-working-on-innovation.component';
import { PageInnovationExportRequestInfoComponent } from '@modules/shared/pages/innovation/export-requests/export-request-info.component';
import { PageInnovationExportRequestNewComponent } from '@modules/shared/pages/innovation/export-requests/export-request-new.component';
import { PageInnovationExportRequestsListComponent } from '@modules/shared/pages/innovation/export-requests/export-requests-list.component';
import { WizardInnovationThreadNewComponent } from '@modules/shared/pages/innovation/messages/wizard-thread-new/thread-new.component';
import { PageInnovationThreadMessageEditComponent } from '@modules/shared/pages/innovation/messages/thread-message-edit.component';
import { PageInnovationThreadMessagesListComponent } from '@modules/shared/pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadsListComponent } from '@modules/shared/pages/innovation/messages/threads-list.component';
import { PageInnovationRecordDownloadComponent } from '@modules/shared/pages/innovation/record/innovation-record-download.component';
import { PageInnovationRecordComponent } from '@modules/shared/pages/innovation/record/innovation-record.component';
import { PageInnovationSectionEvidenceInfoComponent } from '@modules/shared/pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSectionInfoComponent } from '@modules/shared/pages/innovation/sections/section-info.component';
import { PageInnovationStatusListComponent } from '@modules/shared/pages/innovation/status/innovation-status-list.component';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from '@modules/shared/pages/innovation/support/support-summary-list.component';
// // Notifications.
import { PageNotificationsListComponent } from '@modules/shared/pages/notifications/notifications-list.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Resolvers.
import { InnovationActionDataResolver } from '@modules/shared/resolvers/innovation-action-data.resolver';
import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { InnovationDocumentDataResolver } from '@modules/shared/resolvers/innovation-document-data.resolver';
import { InnovationThreadDataResolver } from '@modules/shared/resolvers/innovation-thread-data.resolver';


const header: RoutesDataType['header'] = {
  menuBarItems: {
    left: [
      { id: 'innovations', label: 'Innovations', url: '/assessment/innovations' },
      { id: 'actions', label: 'Actions', url: '/assessment/actions', },
      { id: 'notifications', label: 'Notifications', url: '/assessment/notifications' },
      { id: 'account', label: 'Your account', url: '/assessment/account/manage-details' },
    ],
    right: []
  },
  notifications: {}
};


const routes: Routes = [
  {
    path: '', component: TransactionalLayoutComponent,
    data: { header, module: 'assessment', breadcrumb: 'Home' },
    children: [

      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },

      {
        path: 'terms-of-use', pathMatch: 'full', component: PageTermsOfUseAcceptanceComponent,
        data: {
          header: { menuBarItems: { left: [], right: [], notifications: {} } },
          layout: { type: 'full' }
        }
      },

      {
        path: 'innovations',
        data: { breadcrumb: 'Innovations' },
        children: [
          {
            path: '', pathMatch: 'full', component: InnovationsListComponent,
            data: {
              breadcrumb: null,
              layout: { type: 'full', backgroundColor: 'bg-color-white' }
            }
          },

          { path: 'statuses', pathMatch: 'full', component: PageInnovationStatusListComponent },

          {
            path: ':innovationId',
            runGuardsAndResolvers: 'always', // TODO: Try to remove this in the future. triggering update when doing actions (Ex: new).
            resolve: { innovationData: InnovationDataResolver },
            data: {
              layout: { type: '1.third-2.thirds' },
              breadcrumb: (data: RoutesDataType) => data.innovationData?.name
            },
            children: [

              { path: '', outlet: 'page-context-outlet', component: ContextInnovationOutletComponent },

              { path: '', outlet: 'page-sidebar-outlet', component: SidebarInnovationMenuOutletComponent },
              { path: '', outlet: 'page-sidebar-mobile-outlet', component: SidebarInnovationMenuOutletComponent },

              { path: '', pathMatch: 'full', redirectTo: 'overview' },

              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { breadcrumb: null }
              },

              {
                path: 'assessments',
                data: {
                  data: { breadcrumb: null },
                  layout: { type: 'full' }
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
                        path: '', pathMatch: 'full', component: PageInnovationAssessmentOverviewComponent,
                        data: { breadcrumb: null }
                      },
                      { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                      {
                        path: 'edit/:stepId', pathMatch: 'full', component: InnovationAssessmentEditComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      },
                      {
                        path: 'change-assessor', pathMatch: 'full', component: InnovationChangeAssessorComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      },
                      {
                        path: 'exemption-info', pathMatch: 'full', component: InnovationAssessmentExemptionInfoComponent,
                        data: { layout: { type: 'full' } }
                      },
                      {
                        path: 'exemption-upsert', pathMatch: 'full', component: InnovationAssessmentExemptionUpsertComponent,
                        data: { layout: { type: 'full' } }
                      }
                    ]
                  }
                ]
              },

              {
                path: 'record',
                data: { breadcrumb: 'Innovation record' },
                children: [
                  { path: '', pathMatch: 'full', component: PageInnovationRecordComponent, data: { breadcrumb: null } },

                  { path: 'download', pathMatch: 'full', component: PageInnovationRecordDownloadComponent, data: { layout: { type: 'full' } } },

                  {
                    path: 'export-requests',
                    data: { breadcrumb: 'Permission requests', layout: { type: 'full' } },
                    children: [
                      { path: '', pathMatch: 'full', redirectTo: 'list' },
                      { path: 'list', pathMatch: 'full', component: PageInnovationExportRequestsListComponent, data: { breadcrumb: null } },
                      { path: 'new', pathMatch: 'full', component: PageInnovationExportRequestNewComponent },
                      { path: ':requestId', pathMatch: 'full', component: PageInnovationExportRequestInfoComponent }
                    ]
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
                          },
                          {
                            path: 'actions',
                            pathMatch: 'full',
                            component: PageInnovationActionSectionInfoComponent,
                            data: {
                              breadcrumb: null,
                              layout: { type: 'full' }
                            }
                          }
                        ]
                      }

                    ]
                  }
                ]
              },

              {
                path: 'everyone', pathMatch: 'full', component: PageEveryoneWorkingOnInnovationComponent
              },

              {
                path: 'documents',
                data: { breadcrumb: 'Documents' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: PageInnovationDocumentsListComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'new', pathMatch: 'full', component: PageInnovationDocumentsNewditComponent,
                    data: { layout: { type: 'full' } }
                  },
                  {
                    path: ':documentId',
                    resolve: { document: InnovationDocumentDataResolver },
                    data: {
                      layout: { type: 'full' },
                      breadcrumb: (data: { document: { id: string, name: string } }) => `${data.document.name}`
                    },
                    children: [
                      {
                        path: '', pathMatch: 'full', component: PageInnovationDocumentInfoComponent,
                        data: { breadcrumb: null }
                      },
                      { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                      { path: 'edit/:stepId', pathMatch: 'full', component: PageInnovationDocumentsNewditComponent }
                    ]
                  }
                ]
              },

              {
                path: 'action-tracker',
                data: { breadcrumb: 'Action Tracker' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: PageInnovationActionTrackerListComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'statuses', pathMatch: 'full', component: PageActionStatusListComponent,
                    data: { breadcrumb: 'Statuses' }
                  },
                  {
                    path: 'new', pathMatch: 'full', component: PageInnovationActionTrackerNewComponent,
                    data: { breadcrumb: 'New' }
                  },
                  {
                    path: ':actionId',
                    resolve: { innovationActionData: InnovationActionDataResolver },
                    data: {
                      breadcrumb: (data: RoutesDataType) => {
                        const name = data.innovationActionData?.name ?? '';
                        return name.length > 30 ? `${name.substring(0, 30)}...` : name;
                      }
                    },
                    children: [
                      {
                        path: '', pathMatch: 'full', component: PageInnovationActionSectionInfoComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      },
                      {
                        path: 'edit', pathMatch: 'full', component: PageInnovationActionTrackerEditComponent,
                        data: { breadcrumb: 'Edit' }
                      },
                      {
                        path: 'cancel', pathMatch: 'full', component: PageInnovationActionTrackerCancelComponent,
                        data: { breadcrumb: 'Cancel' }
                      }
                    ]
                  }
                ]
              },

              {
                path: 'threads',
                data: { breadcrumb: 'Messages' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: PageInnovationThreadsListComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'new', pathMatch: 'full', component: WizardInnovationThreadNewComponent,
                    data: { breadcrumb: 'New', layout: { type: 'full' } }
                  },
                  {
                    path: ':threadId',
                    resolve: { innovationThreadData: InnovationThreadDataResolver },
                    data: {
                      breadcrumb: (data: RoutesDataType) => {
                        const name = data.innovationThreadData?.name ?? '';
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
                    path: '', pathMatch: 'full', component: PageInnovationDataSharingAndSupportComponent,
                    data: { breadcrumb: null }
                  },
                  { path: 'statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent }
                ]
              },

              {
                path: 'support-summary',
                data: { breadcrumb: 'Support summary' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: PageInnovationSupportSummaryListComponent,
                    data: { breadcrumb: null }
                  }
                ]
              },

              {
                path: 'activity-log', pathMatch: 'full', component: PageInnovationActivityLogComponent,
                data: {
                  breadcrumb: 'Activity Log',
                  layout: { type: 'full', backgroundColor: 'bg-color-white' }
                }
              }

            ]
          }
        ]
      },

      {
        path: 'actions',
        data: {
          breadcrumb: 'Actions',
          layout: { type: 'full', chosenMenu: 'actions', backgroundColor: 'bg-color-white' }
        },
        children: [
          {
            path: '', pathMatch: 'full', component: PageActionsAdvancedSearchComponent,
            data: { breadcrumb: null }
          },
          { path: 'statuses', pathMatch: 'full', component: PageActionStatusListComponent },
        ]
      },


      {
        path: 'notifications', pathMatch: 'full', component: PageNotificationsListComponent,
        data: {
          breadcrumb: 'Notifications',
          layout: { type: 'full', backgroundColor: 'bg-color-white' }
        }
      },

      {
        path: 'account',
        data: {
          breadcrumb: 'Your account',
          layout: { type: '1.third-2.thirds' }
        },
        children: [

          { path: '', outlet: 'page-sidebar-outlet', component: SidebarAccountMenuOutletComponent },
          { path: '', outlet: 'page-sidebar-mobile-outlet', component: SidebarAccountMenuOutletComponent },

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
                  layout: { type: 'full' }
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
