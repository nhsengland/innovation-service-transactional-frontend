import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layout.
import { RoutesDataType, TransactionalLayoutComponent } from '@modules/theme/base/transactional-layout.component';

// Base
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Accessor module pages.
// // Account.
import { PageAccessorAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Actions.
import { ActionsListComponent } from './pages/actions/actions-list.component';
// // Dashboard.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation.
import { InnovationExportRequestComponent } from './pages/innovation/export/export-request.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSupportOrganisationsSupportStatusSuggestComponent } from './pages/innovation/support/organisations-support-status-suggest.component';
import { InnovationSupportInfoComponent } from './pages/innovation/support/support-info.component';
import { InnovationSupportUpdateComponent } from './pages/innovation/support/support-update.component';
import { InnovationsReviewComponent } from './pages/innovations/innovations-review.component';
import { InnovationSupportOrganisationReferralCriteriaComponent } from './pages/organisation-referral-criteria/organisation-referral-criteria.component';
import { InnovationSupportRequestUpdateStatusComponent } from './pages/innovation/support/support-request-update-status.component';

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
import { PageInnovationDocumentsNewditComponent } from '@modules/shared/pages/innovation/documents/document-newdit.component';
import { PageInnovationDocumentInfoComponent } from '@modules/shared/pages/innovation/documents/document-info.component';
import { PageInnovationDocumentsListComponent } from '@modules/shared/pages/innovation/documents/documents-list.component';
import { PageEveryoneWorkingOnInnovationComponent } from '@modules/shared/pages/innovation/everyone-working-on-innovation/everyone-working-on-innovation.component';
import { PageExportRecordInfoComponent } from '@modules/shared/pages/innovation/export/export-record-info.component';
import { PageExportRecordListComponent } from '@modules/shared/pages/innovation/export/export-record-list.component';
import { PageInnovationThreadMessageEditComponent } from '@modules/shared/pages/innovation/messages/thread-message-edit.component';
import { PageInnovationThreadMessagesListComponent } from '@modules/shared/pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadNewComponent } from '@modules/shared/pages/innovation/messages/thread-new.component';
import { PageInnovationThreadsListComponent } from '@modules/shared/pages/innovation/messages/threads-list.component';
import { PageInnovationRecordComponent } from '@modules/shared/pages/innovation/record/innovation-record.component';
import { PageInnovationSectionInfoComponent } from '@modules/shared/pages/innovation/sections/section-info.component';
import { PageInnovationSectionEvidenceInfoComponent } from '@modules/shared/pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from '@modules/shared/pages/innovation/support/support-summary-list.component';
// // Innovations.
import { PageInnovationsAdvancedReviewComponent } from '@modules/shared/pages/innovations/innovations-advanced-review.component';
// // Notifications.
import { PageNotificationsListComponent } from '@modules/shared/pages/notifications/notifications-list.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Resolvers.
import { InnovationActionDataResolver } from './resolvers/innovation-action-data.resolver';
import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { InnovationDocumentDataResolver } from '@modules/shared/resolvers/innovation-document-data.resolver';
import { InnovationThreadDataResolver } from '@modules/shared/resolvers/innovation-thread-data.resolver';


const header: RoutesDataType['header'] = {
  menuBarItems: {
    left: [
      { id: 'innovations', label: 'Innovations', url: '/accessor/innovations' },
      { id: 'actions', label: 'Actions', url: '/accessor/actions' },
      { id: 'notifications', label: 'Notifications', url: '/accessor/notifications' },
      { id: 'account', label: 'Your account', url: '/accessor/account' }
    ],
    right: []
  },
  notifications: {}
};


const routes: Routes = [

  {
    path: '', component: TransactionalLayoutComponent,
    data: { header, module: 'accessor', breadcrumb: 'Home' },
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
            path: '', pathMatch: 'full', component: InnovationsReviewComponent,
            data: {
              breadcrumb: null,
              layout: { type: 'full', backgroundColor: 'bg-color-white' }
            }
          },

          {
            path: 'advanced-search', pathMatch: 'full', component: PageInnovationsAdvancedReviewComponent,
            data: { layout: { type: 'full', backgroundColor: 'bg-color-white' } }
          },

          {
            path: ':innovationId',
            data: {
              module: 'accessor',
              layout: { type: '1.third-2.thirds' },
              breadcrumb: (data: RoutesDataType) => data.innovationData?.name
            },
            runGuardsAndResolvers: 'always',
            resolve: { innovationData: InnovationDataResolver },
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
                path: 'assessments/:assessmentId', pathMatch: 'full', component: PageInnovationAssessmentOverviewComponent,
                data: {
                  breadcrumb: 'Needs assessment',
                  layout: { type: 'full' }
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
                                path: ':evidenceId',
                                // resolve: { innovationSectionEvidenceData: InnovationSectionEvidenceDataResolver },
                                data: { breadcrumb: 'Evidence Info' },
                                pathMatch: 'full',
                                component: PageInnovationSectionEvidenceInfoComponent
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
                path: 'export',
                data: { breadcrumb: 'Export', layout: { type: 'full' } },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'list' },
                  { path: 'request', pathMatch: 'full', component: InnovationExportRequestComponent, data: { breadcrumb: null } },
                  { path: 'list', pathMatch: 'full', component: PageExportRecordListComponent, data: { breadcrumb: null } },
                  { path: ':requestId', pathMatch: 'full', component: PageExportRecordInfoComponent, data: { breadcrumb: 'Export information' } }
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
                data: { breadcrumb: 'Data Sharing and Support' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: InnovationSupportInfoComponent,
                    data: { breadcrumb: null }
                  },
                  { path: 'statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent },
                  { path: 'new', pathMatch: 'full', component: InnovationSupportUpdateComponent },
                  { path: 'organisations', pathMatch: 'full', component: PageInnovationDataSharingAndSupportComponent },
                  { path: 'organisations/suggest', pathMatch: 'full', component: InnovationSupportOrganisationsSupportStatusSuggestComponent },
                  { path: ':supportId', pathMatch: 'full', component: InnovationSupportUpdateComponent },
                  {
                    path: ':supportId/request-update', pathMatch: 'full', component: InnovationSupportRequestUpdateStatusComponent,
                    data: { layout: { type: 'full' } }
                  }
                ]
              },

              {
                path: 'support-summary',
                data: { breadcrumb: 'Support summary' },
                children: [
                  {
                    path: '', pathMatch: 'full', component: PageInnovationSupportSummaryListComponent,
                    data: { breadcrumb: null, layout: { type: 'full' } }
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

      { path: 'organisations/referral-criteria', pathMatch: 'full', component: InnovationSupportOrganisationReferralCriteriaComponent },

      {
        path: 'actions',
        data: {
          breadcrumb: 'Actions',
          layout: { type: 'full', chosenMenu: 'actions', backgroundColor: 'bg-color-white' }
        },
        children: [
          {
            path: '', pathMatch: 'full', component: ActionsListComponent,
            data: { breadcrumb: null }
          },
          { path: 'statuses', pathMatch: 'full', component: PageActionStatusListComponent },
          { path: 'advanced-filter', pathMatch: 'full', component: PageActionsAdvancedSearchComponent }
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
            path: 'manage-account',
            data: { breadcrumb: 'Manage account' },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccessorAccountManageAccountInfoComponent,
                data: { breadcrumb: null }
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
