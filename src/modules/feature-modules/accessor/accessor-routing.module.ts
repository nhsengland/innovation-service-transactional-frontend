import { NgModule } from '@angular/core';
import { mapToResolve, RouterModule, Routes } from '@angular/router';

// Layout.
import { RoutesDataType, TransactionalLayoutComponent } from '@modules/theme/base/transactional-layout.component';

// Base
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Accessor module pages.
// // Account.
import { PageSharedAccountManageAccountInfoComponent } from '@modules/shared/pages/account/manage-account-info/manage-account-info.component';
// // Tasks.
import { TasksListComponent } from './pages/tasks/tasks-list.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationCustomNotificationsComponent } from './pages/innovation/custom-notifications/custom-notifications.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './pages/innovation/support/organisations-support-status-suggest.component';
import { InnovationSupportRequestUpdateStatusComponent } from './pages/innovation/support/support-request-update-status.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support/support-update.component';
import { InnovationsReviewComponent } from './pages/innovations/innovations-review.component';
import { InnovationSupportOrganisationReferralCriteriaComponent } from './pages/organisation-referral-criteria/organisation-referral-criteria.component';
import { InnovationsNeedingActionComponent } from './pages/innovations-needing-action/innovations-needing-action.component';

// Shared module pages.
// // Account.
import { PageAccountEmailNotificationsEditComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-edit.component';
import { PageAccountEmailNotificationsListComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-list.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';
import { AccountManageCustomNotificationsComponent } from './pages/account/manage-custom-notifications/manage-custom-notifications.component';
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
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from '@modules/shared/pages/innovation/support/support-summary-list.component';
import { PageInnovationSupportSummaryProgressUpdateDeleteComponent } from '@modules/shared/pages/innovation/support/support-summary-progress-update-delete.component';
import { PageInnovationSupportSummaryProgressUpdateWrapperComponent } from '@modules/shared/pages/innovation/support/support-summary-progress-update-wrapper.component';
import { PageInnovationTaskActionComponent } from '@modules/shared/pages/innovation/tasks/task-action.component';
import { PageInnovationTaskDetailsComponent } from '@modules/shared/pages/innovation/tasks/task-details.component';
import { PageTaskStatusListComponent } from '@modules/shared/pages/innovation/tasks/task-status-list.component';
import { PageInnovationTaskToDoListComponent } from '@modules/shared/pages/innovation/tasks/task-to-do-list.component';
import { PageInnovationTaskNewComponent } from '@modules/shared/pages/innovation/tasks/wizard-task-new/task-new.component';
import { WizardInnovationCustomNotificationNewComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-new/custom-notification-new.component';
// // Innovations.
import { PageInnovationsAdvancedReviewComponent } from '@modules/shared/pages/innovations/innovations-advanced-review.component';
// // Notifications.
import { PageNotificationsListComponent } from '@modules/shared/pages/notifications/notifications-list.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Resolvers.
import { PageAccountMFAEditComponent } from '@modules/shared/pages/account/mfa/mfa-edit.component';
import { PageInnovationThreadRecipientsComponent } from '@modules/shared/pages/innovation/messages/thread-recipients.component';
import { PageInnovationAllSectionsInfoComponent } from '@modules/shared/pages/innovation/sections/section-info-all.component';
import { PageProgressCategoriesWrapperComponent } from '@modules/shared/pages/progress-categories/progress-categories-wrapper.component';
import { InnovationAssessmentDataResolver } from '@modules/shared/resolvers/innovation-assessment-data.resolver';
import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { InnovationDocumentDataResolver } from '@modules/shared/resolvers/innovation-document-data.resolver';
import { innovationRecordSchemaResolver } from '@modules/shared/resolvers/innovation-record-schema.resolver';
import { InnovationTaskDataResolver } from '@modules/shared/resolvers/innovation-task-data.resolver';
import { InnovationThreadDataResolver } from '@modules/shared/resolvers/innovation-thread-data.resolver';
import { InnovationTaskStatusEnum } from '@modules/stores';
import { WizardInnovationCustomNotificationDeleteComponent } from './pages/innovation/custom-notifications/wizard-custom-notification-delete/custom-notification-delete.component';
import { InnovationChangeAccessorsComponent } from './pages/innovation/support/support-change-accessors.component';
import { TrainingAndResourcesComponent } from './pages/training-and-resources/training-and-resources/training-and-resources.component';
import { AccessorAndInnovationListComponent } from './pages/unit/accessor-and-innovation-list.component';

const header: RoutesDataType['header'] = {
  menuBarItems: {
    left: [
      { id: 'innovations', label: 'Innovations', url: '/accessor/innovations' },
      { id: 'tasks', label: 'Tasks', url: '/accessor/tasks' },
      { id: 'notifications', label: 'Notifications', url: '/accessor/notifications' },
      { id: 'account', label: 'Your account', url: '/accessor/account/manage-details' },
      { id: 'account', label: 'Training and resources', url: '/accessor/training-and-resources' }
    ],
    right: []
  }
};

const routes: Routes = [
  {
    path: '',
    component: TransactionalLayoutComponent,
    data: { header, module: 'accessor', breadcrumb: 'Home' },
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
            component: InnovationsReviewComponent,
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
          {
            path: 'needing-action',
            pathMatch: 'full',
            component: InnovationsNeedingActionComponent,
            data: {
              breadcrumb: 'Needing action',
              layout: { type: 'full', backgroundColor: 'bg-color-white' }
            }
          },
          {
            path: ':innovationId',
            resolve: {
              innovationData: mapToResolve(InnovationDataResolver)
            },
            data: {
              module: 'accessor',
              layout: { type: '1.third-2.thirds' },
              breadcrumb: (data: RoutesDataType) => data.innovationData?.name
            },
            runGuardsAndResolvers: 'always',
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
                path: 'assessments/:assessmentId',
                pathMatch: 'full',
                resolve: {
                  innovationAssessmentData: mapToResolve(InnovationAssessmentDataResolver)
                },
                component: PageInnovationAssessmentOverviewComponent,
                data: {
                  breadcrumb: 'Needs assessment',
                  layout: { type: 'full' }
                }
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
                                // resolve: { innovationSectionEvidenceData: InnovationSectionEvidenceDataResolver },
                                data: { breadcrumb: 'Evidence Info' },
                                pathMatch: 'full',
                                component: PageInnovationSectionEvidenceInfoComponent
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
                // resolve: { innovationData: InnovationDataResolver },
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
                data: { breadcrumb: 'Data sharing preferences' },
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
                  },
                  {
                    path: 'new',
                    pathMatch: 'full',
                    component: InnovationSupportUpdateComponent,
                    data: { layout: { type: 'full' }, breadcrumb: null }
                  },
                  {
                    path: 'suggest',
                    pathMatch: 'full',
                    component: InnovationSupportOrganisationsSupportStatusSuggestComponent,
                    data: { layout: { type: 'full' }, breadcrumb: null }
                  },
                  {
                    path: ':supportId',
                    pathMatch: 'full',
                    component: InnovationSupportUpdateComponent,
                    data: { layout: { type: 'full' }, breadcrumb: null }
                  },
                  {
                    path: ':supportId/request-update',
                    pathMatch: 'full',
                    data: { layout: { type: 'full' }, breadcrumb: null },
                    component: InnovationSupportRequestUpdateStatusComponent
                  },
                  {
                    path: ':supportId/change-accessors',
                    pathMatch: 'full',
                    component: InnovationChangeAccessorsComponent,
                    data: { layout: { type: 'full' }, breadcrumb: null }
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
                  },
                  {
                    path: 'progress-update-new',
                    pathMatch: 'full',
                    component: PageInnovationSupportSummaryProgressUpdateWrapperComponent,
                    data: { layout: { type: 'full' } }
                  },
                  {
                    path: ':supportSummaryHistoryId',
                    children: [
                      { path: '', pathMatch: 'full', redirectTo: '../support-summary' },
                      {
                        path: 'progress-update-delete-confirmation',
                        pathMatch: 'full',
                        component: PageInnovationSupportSummaryProgressUpdateDeleteComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      }
                    ]
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
              },

              {
                path: 'custom-notifications',
                data: { breadcrumb: 'Custom notifications' },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: InnovationCustomNotificationsComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'new',
                    pathMatch: 'full',
                    component: WizardInnovationCustomNotificationNewComponent,
                    data: { layout: { type: 'full' } }
                  },
                  {
                    path: 'delete',
                    pathMatch: 'full',
                    component: WizardInnovationCustomNotificationDeleteComponent,
                    data: { layout: { type: 'full' } }
                  },
                  {
                    path: ':subscriptionId',
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: '../custom-notifications'
                      },
                      {
                        path: 'edit',
                        pathMatch: 'full',
                        component: WizardInnovationCustomNotificationNewComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
                      },
                      {
                        path: 'delete',
                        pathMatch: 'full',
                        component: WizardInnovationCustomNotificationDeleteComponent,
                        data: { breadcrumb: null, layout: { type: 'full' } }
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
        path: 'organisations/referral-criteria',
        pathMatch: 'full',
        component: InnovationSupportOrganisationReferralCriteriaComponent
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
          {
            path: '',
            pathMatch: 'full',
            component: TasksListComponent,
            data: { breadcrumb: null }
          },
          {
            path: 'statuses',
            pathMatch: 'full',
            component: PageTaskStatusListComponent,
            data: { breadcrumb: 'Statuses' }
          },
          { path: 'advanced-filter', pathMatch: 'full', component: PageTasksAdvancedSearchComponent }
        ]
      },

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
          layout: { type: '1.third-2.thirds', chosenMenu: 'yourAccount' }
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
          },
          {
            path: 'manage-custom-notifications',
            data: { breadcrumb: 'Manage custom notifications' },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: AccountManageCustomNotificationsComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'delete',
                pathMatch: 'full',
                component: WizardInnovationCustomNotificationDeleteComponent,
                data: { layout: { type: 'full' } }
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
          }
        ]
      },

      {
        path: 'training-and-resources',
        data: {
          breadcrumb: 'Training and resources',
          layout: { type: 'full' }
        },
        children: [
          { path: '', data: { breadcrumb: null }, pathMatch: 'full', component: TrainingAndResourcesComponent }
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
      },

      {
        path: 'accessor-list',
        pathMatch: 'full',
        component: AccessorAndInnovationListComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessorRoutingModule { }
