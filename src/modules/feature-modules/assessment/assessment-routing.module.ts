import { NgModule } from '@angular/core';
import { mapToResolve, RouterModule, Routes } from '@angular/router';

// Layout.
import { RoutesDataType, TransactionalLayoutComponent } from '@modules/theme/base/transactional-layout.component';

// Base
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Assessment module pages.
// // Account.
import { PageSharedAccountManageAccountInfoComponent } from '@modules/shared/pages/account/manage-account-info/manage-account-info.component';
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
// // Tasks.
import { PageTasksAdvancedSearchComponent } from '@modules/shared/pages/tasks/tasks-advanced-search.component';
// // Innovation.
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
import { PageInnovationThreadMessageEditComponent } from '@modules/shared/pages/innovation/messages/thread-message-edit.component';
import { PageInnovationThreadMessagesListComponent } from '@modules/shared/pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadsListComponent } from '@modules/shared/pages/innovation/messages/threads-list.component';
import { WizardInnovationThreadNewComponent } from '@modules/shared/pages/innovation/messages/wizard-thread-new/thread-new.component';
import { PageInnovationRecordDownloadComponent } from '@modules/shared/pages/innovation/record/innovation-record-download.component';
import { PageInnovationRecordWrapperComponent } from '@modules/shared/pages/innovation/record/innovation-record-wrapper.component';
import { PageInnovationSectionEvidenceInfoComponent } from '@modules/shared/pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSectionInfoComponent } from '@modules/shared/pages/innovation/sections/section-info.component';
import { PageInnovationStatusListComponent } from '@modules/shared/pages/innovation/status/innovation-status-list.component';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from '@modules/shared/pages/innovation/support/support-summary-list.component';
import { PageInnovationTaskActionComponent } from '@modules/shared/pages/innovation/tasks/task-action.component';
import { PageInnovationTaskDetailsComponent } from '@modules/shared/pages/innovation/tasks/task-details.component';
import { PageTaskStatusListComponent } from '@modules/shared/pages/innovation/tasks/task-status-list.component';
import { PageInnovationTaskToDoListComponent } from '@modules/shared/pages/innovation/tasks/task-to-do-list.component';
import { PageInnovationTaskNewComponent } from '@modules/shared/pages/innovation/tasks/wizard-task-new/task-new.component';
// // Notifications.
import { PageNotificationsListComponent } from '@modules/shared/pages/notifications/notifications-list.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Resolvers.
import { PageAccountMFAEditComponent } from '@modules/shared/pages/account/mfa/mfa-edit.component';
import { PageInnovationThreadRecipientsComponent } from '@modules/shared/pages/innovation/messages/thread-recipients.component';
import { PageInnovationAllSectionsInfoComponent } from '@modules/shared/pages/innovation/sections/section-info-all.component';
import { PageInnovationsAdvancedReviewComponent } from '@modules/shared/pages/innovations/innovations-advanced-review.component';
import { PageProgressCategoriesWrapperComponent } from '@modules/shared/pages/progress-categories/progress-categories-wrapper.component';
import { InnovationAssessmentDataResolver } from '@modules/shared/resolvers/innovation-assessment-data.resolver';
import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { InnovationDocumentDataResolver } from '@modules/shared/resolvers/innovation-document-data.resolver';
import { innovationRecordSchemaResolver } from '@modules/shared/resolvers/innovation-record-schema.resolver';
import { InnovationTaskDataResolver } from '@modules/shared/resolvers/innovation-task-data.resolver';
import { InnovationThreadDataResolver } from '@modules/shared/resolvers/innovation-thread-data.resolver';
import { InnovationTaskStatusEnum } from '@modules/stores';
import { PageInnovationAssessmentEditReasonComponent } from './pages/innovation/assessment/assessment-edit-reason.component';
import { NeedsAssessorAndInnovationListComponent } from './pages/needs-assessor-and-innovation-list/needs-assessor-and-innovation-list.component';
import { KeyProgressAreasPageComponent } from '@modules/shared/pages/innovation/key-progress-areas/key-progress-areas-page.component';

const header: RoutesDataType['header'] = {
  menuBarItems: {
    left: [
      { id: 'innovations', label: 'Innovations', url: '/assessment/innovations' },
      { id: 'tasks', label: 'Tasks', url: '/assessment/tasks' },
      { id: 'notifications', label: 'Notifications', url: '/assessment/notifications' },
      { id: 'account', label: 'Your account', url: '/assessment/account/manage-details' }
    ],
    right: []
  }
};

const routes: Routes = [
  {
    path: '',
    component: TransactionalLayoutComponent,
    data: { header, module: 'assessment', breadcrumb: 'Home' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },

      {
        path: 'terms-of-use',
        pathMatch: 'full',
        component: PageTermsOfUseAcceptanceComponent,
        data: {
          header: { menuBarItems: { left: [], right: [], notifications: {} } },
          layout: { type: 'full' }
        }
      },

      {
        path: 'innovations',
        data: { breadcrumb: 'Innovations' },
        resolve: { irSchemaData: innovationRecordSchemaResolver },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: InnovationsListComponent,
            data: {
              breadcrumb: null,
              layout: { type: 'full', backgroundColor: 'bg-color-white' }
            }
          },

          {
            path: 'advanced-search',
            pathMatch: 'full',
            component: PageInnovationsAdvancedReviewComponent,
            data: { layout: { type: 'full', backgroundColor: 'bg-color-white' } }
          },

          { path: 'statuses', pathMatch: 'full', component: PageInnovationStatusListComponent },

          {
            path: ':innovationId',
            runGuardsAndResolvers: 'always', // TODO: Try to remove this in the future. triggering update when doing actions (Ex: new).
            resolve: {
              innovationData: mapToResolve(InnovationDataResolver),
              irSchemaData: innovationRecordSchemaResolver
            },
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
                path: 'overview',
                pathMatch: 'full',
                component: InnovationOverviewComponent,
                data: { breadcrumb: null }
              },

              {
                path: 'key-progress-areas',
                pathMatch: 'full',
                component: KeyProgressAreasPageComponent,
                data: { breadcrumb: 'Key progress areas' }
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
                    path: 'new',
                    pathMatch: 'full',
                    component: InnovationAssessmentNewComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: ':assessmentId',
                    data: { breadcrumb: null },
                    resolve: {
                      innovationAssessmentData: mapToResolve(InnovationAssessmentDataResolver)
                    },
                    runGuardsAndResolvers: 'always',
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        component: PageInnovationAssessmentOverviewComponent,
                        data: { breadcrumb: null }
                      },
                      {
                        path: 'edit',
                        data: {
                          data: { breadcrumb: null },
                          layout: { type: 'full' }
                        },
                        children: [
                          { path: '', pathMatch: 'full', redirectTo: '1' },
                          {
                            path: 'reason',
                            pathMatch: 'full',
                            component: PageInnovationAssessmentEditReasonComponent,
                            data: { breadcrumb: null }
                          },
                          {
                            path: ':stepId',
                            pathMatch: 'full',
                            component: InnovationAssessmentEditComponent,
                            data: { breadcrumb: null }
                          }
                        ]
                      },
                      {
                        path: 'change-assessor',
                        pathMatch: 'full',
                        component: InnovationChangeAssessorComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      },
                      {
                        path: 'exemption-info',
                        pathMatch: 'full',
                        component: InnovationAssessmentExemptionInfoComponent,
                        data: { layout: { type: 'full' } }
                      },
                      {
                        path: 'exemption-upsert',
                        pathMatch: 'full',
                        component: InnovationAssessmentExemptionUpsertComponent,
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
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationRecordWrapperComponent,
                    data: { breadcrumb: null }
                  },

                  {
                    path: 'download',
                    pathMatch: 'full',
                    component: PageInnovationRecordDownloadComponent,
                    data: { layout: { type: 'full' } }
                  },

                  {
                    path: 'export-requests',
                    data: { breadcrumb: 'Permission requests', layout: { type: 'full' } },
                    children: [
                      { path: '', pathMatch: 'full', redirectTo: 'list' },
                      {
                        path: 'list',
                        pathMatch: 'full',
                        component: PageInnovationExportRequestsListComponent,
                        data: { breadcrumb: null }
                      },
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
                        path: 'all',
                        pathMatch: 'full',
                        component: PageInnovationAllSectionsInfoComponent,
                        data: {
                          breadcrumb: (data: RoutesDataType) => 'All sections'
                        }
                      },
                      {
                        path: ':sectionId',
                        children: [
                          {
                            path: '',
                            pathMatch: 'full',
                            component: PageInnovationSectionInfoComponent,
                            data: { breadcrumb: null }
                          },
                          {
                            path: 'evidences',
                            data: { breadcrumb: null },
                            children: [
                              { path: '', pathMatch: 'full', redirectTo: '../:sectionId' },
                              {
                                path: ':evidenceId',
                                pathMatch: 'full',
                                component: PageInnovationSectionEvidenceInfoComponent,
                                data: { breadcrumb: 'Evidence Info' }
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
                path: 'everyone',
                pathMatch: 'full',
                component: PageEveryoneWorkingOnInnovationComponent
              },

              {
                path: 'documents',
                data: { breadcrumb: 'Documents' },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationDocumentsListComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'new',
                    pathMatch: 'full',
                    component: PageInnovationDocumentsNewditComponent,
                    data: { layout: { type: 'full' } }
                  },
                  {
                    path: ':documentId',
                    resolve: { document: mapToResolve(InnovationDocumentDataResolver) },
                    data: {
                      layout: { type: 'full' },
                      breadcrumb: (data: { document: { id: string; name: string } }) => `${data.document.name}`
                    },
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        component: PageInnovationDocumentInfoComponent,
                        data: { breadcrumb: null }
                      },
                      { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                      { path: 'edit/:stepId', pathMatch: 'full', component: PageInnovationDocumentsNewditComponent }
                    ]
                  }
                ]
              },

              {
                path: 'tasks',
                data: { breadcrumb: 'Tasks' },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationTaskToDoListComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'statuses',
                    pathMatch: 'full',
                    component: PageTaskStatusListComponent,
                    data: { breadcrumb: 'Statuses' }
                  },
                  {
                    path: 'new',
                    pathMatch: 'full',
                    component: PageInnovationTaskNewComponent,
                    data: { breadcrumb: 'New', layout: { type: 'full' } }
                  },
                  {
                    path: ':taskId',
                    resolve: { innovationActionData: mapToResolve(InnovationTaskDataResolver) },
                    data: {
                      breadcrumb: (data: RoutesDataType) => {
                        const name = data.innovationActionData?.name ?? '';
                        return name.length > 30 ? `${name.substring(0, 30)}...` : name;
                      }
                    },
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        component: PageInnovationTaskDetailsComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      },
                      {
                        path: 'cancel',
                        pathMatch: 'full',
                        component: PageInnovationTaskActionComponent,
                        data: { breadcrumb: null, layout: { type: 'full' }, status: InnovationTaskStatusEnum.CANCELLED }
                      },
                      {
                        path: 'reopen',
                        pathMatch: 'full',
                        component: PageInnovationTaskActionComponent,
                        data: { breadcrumb: null, layout: { type: 'full' }, status: InnovationTaskStatusEnum.OPEN }
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
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationThreadsListComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'new',
                    pathMatch: 'full',
                    component: WizardInnovationThreadNewComponent,
                    data: { breadcrumb: 'New', layout: { type: 'full' } }
                  },
                  {
                    path: ':threadId',
                    resolve: { innovationThreadData: mapToResolve(InnovationThreadDataResolver) },
                    data: {
                      breadcrumb: (data: RoutesDataType) => {
                        const name = data.innovationThreadData?.name ?? '';
                        return name.length > 30 ? `${name.substring(0, 30)}...` : name;
                      }
                    },
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        component: PageInnovationThreadMessagesListComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      },
                      {
                        path: 'recipients',
                        pathMatch: 'full',
                        component: PageInnovationThreadRecipientsComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      },
                      {
                        path: 'messages/:messageId',
                        pathMatch: 'full',
                        component: PageInnovationThreadMessageEditComponent,
                        data: { breadcrumb: 'Edit' }
                      }
                    ]
                  }
                ]
              },

              {
                path: 'support',
                data: { breadcrumb: 'Support status' },
                resolve: { innovationData: mapToResolve(InnovationDataResolver) }, // Needed to repeat this resolver as support can be updated from this routes.
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationDataSharingAndSupportComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'statuses',
                    pathMatch: 'full',
                    component: PageInnovationSupportStatusListComponent,
                    data: { breadcrumb: 'Statuses' }
                  }
                ]
              },

              {
                path: 'support-summary',
                data: { breadcrumb: 'Support summary' },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationSupportSummaryListComponent,
                    data: { breadcrumb: null }
                  }
                ]
              },

              {
                path: 'activity-log',
                pathMatch: 'full',
                component: PageInnovationActivityLogComponent,
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
        path: 'tasks',
        data: {
          breadcrumb: 'Tasks',
          layout: { type: 'full', chosenMenu: 'tasks', backgroundColor: 'bg-color-white' }
        },
        resolve: { irSchemaData: innovationRecordSchemaResolver },
        runGuardsAndResolvers: 'always',
        children: [
          { path: '', pathMatch: 'full', component: PageTasksAdvancedSearchComponent, data: { breadcrumb: null } },
          {
            path: 'statuses',
            pathMatch: 'full',
            component: PageTaskStatusListComponent,
            data: { breadcrumb: 'Statuses' }
          }
        ]
      },

      {
        path: 'needs-assessor-list',
        pathMatch: 'full',
        component: NeedsAssessorAndInnovationListComponent
      },

      { path: 'innovation-statuses', pathMatch: 'full', component: PageInnovationStatusListComponent },

      {
        path: 'notifications',
        pathMatch: 'full',
        component: PageNotificationsListComponent,
        resolve: { irSchemaData: innovationRecordSchemaResolver },
        runGuardsAndResolvers: 'always',
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
                path: '',
                pathMatch: 'full',
                component: PageAccountManageDetailsInfoComponent,
                data: { breadcrumb: null }
              },
              { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
              {
                path: 'edit/:stepId',
                pathMatch: 'full',
                component: PageAccountManageDetailsEditComponent,
                data: {
                  breadcrumb: 'Edit',
                  layout: { type: 'full' }
                }
              }
            ]
          },
          {
            path: 'manage-account',
            data: { breadcrumb: 'Manage account' },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: PageSharedAccountManageAccountInfoComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'mfa',
                data: { layout: { type: 'full' } },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'edit'
                  },
                  {
                    path: 'edit',
                    pathMatch: 'full',
                    component: PageAccountMFAEditComponent,
                    data: { breadcrumb: null, layout: { type: 'full' } }
                  }
                ]
              }
            ]
          },
          {
            path: 'email-notifications',
            data: { breadcrumb: 'Email notifications' },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: PageAccountEmailNotificationsListComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'edit',
                pathMatch: 'full',
                component: PageAccountEmailNotificationsEditComponent,
                data: {
                  breadcrumb: 'Edit',
                  layout: { type: 'full', chosenMenu: 'yourAccount' }
                }
              }
            ]
          }
        ]
      },

      {
        path: 'organisation/:organisationId/progress-categories',
        pathMatch: 'full',
        data: {
          breadcrumb: 'Progress categories',
          layout: { type: 'full' }
        },
        component: PageProgressCategoriesWrapperComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentRoutingModule {}
