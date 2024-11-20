import { NgModule } from '@angular/core';
import { mapToCanActivate, mapToCanActivateChild, mapToResolve, RouterModule, Routes } from '@angular/router';

// Layout.
import { RoutesDataType, TransactionalLayoutComponent } from '@modules/theme/base/transactional-layout.component';

// Base
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Innovator module pages.
// // Account.
import { PageSharedAccountManageAccountInfoComponent } from '@modules/shared/pages/account/manage-account-info/manage-account-info.component';
import { PageAccountDeleteComponent } from './pages/account/account-delete.component';
// // Collaboration Invites.
import { PageCollaborationInviteComponent } from './pages/collaboration-invite/collaboration-invite.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // First time signin.
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
// // Innovation.
import { InnovationNewComponent } from './pages/innovation-new/innovation-new.component';
import { InnovationDataSharingChangeComponent } from './pages/innovation/data-sharing/data-sharing-change.component';
import { PageInnovationExportRequestRejectComponent } from './pages/innovation/export-requests/export-request-reject.component';
import { PageInnovationHowToProceedComponent } from './pages/innovation/how-to-proceed/how-to-proceed.component';
import { PageInnovationManageCollaboratorsInfoComponent } from './pages/innovation/manage/manage-collaborators-info.component';
import { PageInnovationManageCollaboratorsOverviewComponent } from './pages/innovation/manage/manage-collaborators-overview.component';
import { PageInnovationManageCollaboratorsWizardComponent } from './pages/innovation/manage/manage-collaborators-wizard.component';
import { PageInnovationManageOverviewComponent } from './pages/innovation/manage/manage-overview.component';
import { PageInnovationManageTransferComponent } from './pages/innovation/manage/manage-transfer.component';
import { PageInnovationNeedsReassessmentSendComponent } from './pages/innovation/needs-reassessment/needs-reassessment-send.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationDataSharingEditComponent } from './pages/innovation/record/data-sharing-edit.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';

// // Shared module pages.
// // Account.
import { PageAccountEmailNotificationsEditComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-edit.component';
import { PageAccountEmailNotificationsListComponent } from '@modules/shared/pages/account/email-notifications/email-notifications-list.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';
// // Innovation.
import { PageInnovationActivityLogComponent } from '@modules/shared/pages/innovation/activity-log/innovation-activity-log.component';
import { PageInnovationAssessmentOverviewComponent } from '@modules/shared/pages/innovation/assessment/assessment-overview.component';
import { PageInnovationDataSharingAndSupportComponent } from '@modules/shared/pages/innovation/data-sharing-and-support/data-sharing-and-support.component';
import { PageInnovationDocumentInfoComponent } from '@modules/shared/pages/innovation/documents/document-info.component';
import { PageInnovationDocumentsNewditComponent } from '@modules/shared/pages/innovation/documents/document-newdit.component';
import { PageInnovationDocumentsListComponent } from '@modules/shared/pages/innovation/documents/documents-list.component';
import { PageEveryoneWorkingOnInnovationComponent } from '@modules/shared/pages/innovation/everyone-working-on-innovation/everyone-working-on-innovation.component';
import { PageInnovationExportRequestInfoComponent } from '@modules/shared/pages/innovation/export-requests/export-request-info.component';
import { PageInnovationExportRequestsListComponent } from '@modules/shared/pages/innovation/export-requests/export-requests-list.component';
import { PageInnovationThreadMessageEditComponent } from '@modules/shared/pages/innovation/messages/thread-message-edit.component';
import { PageInnovationThreadMessagesListComponent } from '@modules/shared/pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadsListComponent } from '@modules/shared/pages/innovation/messages/threads-list.component';
import { WizardInnovationThreadNewComponent } from '@modules/shared/pages/innovation/messages/wizard-thread-new/thread-new.component';
import { PageInnovationTaskDetailsComponent } from '@modules/shared/pages/innovation/tasks/task-details.component';
import { PageTaskStatusListComponent } from '@modules/shared/pages/innovation/tasks/task-status-list.component';
import { PageInnovationTaskToDoListComponent } from '@modules/shared/pages/innovation/tasks/task-to-do-list.component';
// import { PageInnovationRecordDownloadComponent } from '@modules/shared/pages/innovation/record/innovation-record-download.component';
import { PageInnovationRecordComponent } from '@modules/shared/pages/innovation/record/innovation-record.component';
import { PageInnovationSectionEvidenceInfoComponent } from '@modules/shared/pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSectionInfoComponent } from '@modules/shared/pages/innovation/sections/section-info.component';
import { PageInnovationStatusListComponent } from '@modules/shared/pages/innovation/status/innovation-status-list.component';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from '@modules/shared/pages/innovation/support/support-summary-list.component';
import { InnovationStatusEnum, InnovationTaskStatusEnum } from '@modules/stores';
import { InnovationSectionSubmittedComponent } from './pages/innovation/record/section-submitted.component';
import { WizardInnovationManageArchiveComponent } from './pages/innovation/manage/wizard-manage-archive/manage-archive.component';
import { WizardInnovationHowToProceedArchiveComponent } from './pages/innovation/how-to-proceed/wizard-how-to-proceed-archive/how-to-proceed-archive.component';
// // Notifications.
import { PageNotificationsListComponent } from '@modules/shared/pages/notifications/notifications-list.component';
// // Terms of use.
import { PageTermsOfUseAcceptanceComponent } from '@modules/shared/pages/terms-of-use/terms-of-use-acceptance.component';

// Guards.
import { InnovationCollaborationRedirectionGuard } from '@modules/core/guards/innovation-collaboration-redirection.guard';
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';
import { ManageGuard } from './guards/manage.guard';
import { ShareInnovationRecordGuard } from './guards/share-innovation-record.guard';

// Resolvers.
import { PageAccountMFAEditComponent } from '@modules/shared/pages/account/mfa/mfa-edit.component';
import { PageInnovationThreadRecipientsComponent } from '@modules/shared/pages/innovation/messages/thread-recipients.component';
import { PageInnovationAllSectionsInfoComponent } from '@modules/shared/pages/innovation/sections/section-info-all.component';
import { PageInnovationTaskActionComponent } from '@modules/shared/pages/innovation/tasks/task-action.component';
import { PageProgressCategoriesWrapperComponent } from '@modules/shared/pages/progress-categories/progress-categories-wrapper.component';
import { InnovationAssessmentDataResolver } from '@modules/shared/resolvers/innovation-assessment-data.resolver';
import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { InnovationDocumentDataResolver } from '@modules/shared/resolvers/innovation-document-data.resolver';
import { innovationRecordSchemaResolver } from '@modules/shared/resolvers/innovation-record-schema.resolver';
import { innovationSectionDataResolverV3 } from '@modules/shared/resolvers/innovation-section-data-v3.resolver';
import { InnovationSectionEvidenceDataResolver } from '@modules/shared/resolvers/innovation-section-evidence-data.resolver';
import { InnovationTaskDataResolver } from '@modules/shared/resolvers/innovation-task-data.resolver';
import { InnovationThreadDataResolver } from '@modules/shared/resolvers/innovation-thread-data.resolver';
import { checkStatusGuard } from './guards/check-status.guard';
import { PageInnovationManageAccessLeaveInnovationComponent } from './pages/innovation/manage-access/manage-access-leave-innovation.component';
import { PageInnovationManageAccessOverviewComponent } from './pages/innovation/manage-access/manage-access-overview.component';
import { PageInnovationSupportSurveysComponent } from './pages/innovation/surveys/support-surveys.component';
import { EndSupportSurveyJourneyComponent } from './pages/innovation/surveys/journeys/end-support.component';
import { PageInnovationRecommendNeedsReassessmentComponent } from './pages/innovation/how-to-proceed/recommend-need-reassessment/recommend-needs-reassessment';

const header: RoutesDataType['header'] = {
  menuBarItems: {
    left: [
      { id: 'innovations', label: 'Your innovations', url: '/innovator/dashboard' },
      { id: 'notifications', label: 'Notifications', url: '/innovator/notifications' },
      { id: 'account', label: 'Your account', url: '/innovator/account/manage-details' }
    ],
    right: []
  }
};

const routes: Routes = [
  {
    path: '',
    component: TransactionalLayoutComponent,
    canActivateChild: mapToCanActivateChild([FirstTimeSigninGuard]),
    data: { header, module: 'innovator', breadcrumb: 'Home' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', pathMatch: 'full', component: PageDashboardComponent },
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
        path: 'first-time-signin',
        pathMatch: 'full',
        component: FirstTimeSigninComponent,
        data: {
          header: { menuBarItems: { left: [], right: [], notifications: {} } },
          layout: { type: 'full' }
        }
      },

      {
        path: 'innovations',
        children: [
          { path: '', pathMatch: 'full', redirectTo: '../dashboard' },

          {
            path: 'new',
            resolve: { irSchemaData: innovationRecordSchemaResolver },
            runGuardsAndResolvers: 'always',
            pathMatch: 'full',
            component: InnovationNewComponent
          },
          {
            canActivate: mapToCanActivate([InnovationCollaborationRedirectionGuard]),
            path: ':innovationId/collaborations/:collaboratorId',
            pathMatch: 'full',
            component: PageCollaborationInviteComponent,
            data: {
              breadcrumb: 'Collaboration Invite'
            }
          },
          {
            path: ':innovationId',
            resolve: {
              innovationData: mapToResolve(InnovationDataResolver),
              irSchemaData: innovationRecordSchemaResolver
            },
            data: {
              module: 'innovator',
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
                resolve: {
                  innovationAssessmentData: mapToResolve(InnovationAssessmentDataResolver)
                },
                pathMatch: 'full',
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
                  { path: '', pathMatch: 'full', component: PageInnovationRecordComponent, data: { breadcrumb: null } },

                  // { path: 'download', pathMatch: 'full', component: PageInnovationRecordDownloadComponent, data: { breadcrumb: null } },

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
                      { path: ':requestId', pathMatch: 'full', component: PageInnovationExportRequestInfoComponent },
                      {
                        path: ':requestId/reject',
                        pathMatch: 'full',
                        component: PageInnovationExportRequestRejectComponent
                      }
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
                        resolve: { innovationSectionData: innovationSectionDataResolverV3 },
                        data: {
                          breadcrumb: (data: RoutesDataType) => data.innovationSectionData?.name ?? ''
                        },
                        children: [
                          {
                            path: '',
                            pathMatch: 'full',
                            component: PageInnovationSectionInfoComponent,
                            data: { breadcrumb: null }
                          },

                          {
                            path: 'submitted',
                            pathMatch: 'full',
                            component: InnovationSectionSubmittedComponent,
                            data: { layout: { type: 'full' } }
                          },

                          { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                          {
                            path: 'edit/:questionId',
                            pathMatch: 'full',
                            component: InnovationSectionEditComponent,
                            data: { layout: { type: 'full' } }
                          },

                          {
                            path: 'evidences',
                            data: { breadcrumb: null },
                            children: [
                              { path: '', pathMatch: 'full', redirectTo: '../:sectionId' },

                              { path: 'new', pathMatch: 'full', redirectTo: 'new/1' },
                              {
                                path: 'new/:questionId',
                                pathMatch: 'full',
                                component: InnovationSectionEvidenceEditComponent,
                                data: {
                                  breadcrumb: 'New',
                                  layout: { type: 'full' }
                                }
                              },
                              {
                                path: ':evidenceId',
                                resolve: {
                                  innovationSectionEvidenceData: mapToResolve(InnovationSectionEvidenceDataResolver)
                                },
                                data: {
                                  breadcrumb: (data: RoutesDataType) => {
                                    const name = data.innovationSectionEvidenceData?.name ?? '';
                                    return name.length > 30 ? `${name.substring(0, 30)}...` : name;
                                  }
                                },
                                children: [
                                  {
                                    path: '',
                                    pathMatch: 'full',
                                    component: PageInnovationSectionEvidenceInfoComponent,
                                    data: { breadcrumb: null }
                                  },
                                  { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
                                  {
                                    path: 'edit/:questionId',
                                    pathMatch: 'full',
                                    component: InnovationSectionEvidenceEditComponent,
                                    data: {
                                      data: { breadcrumb: 'Edit' },
                                      layout: { type: 'full' }
                                    }
                                  }
                                ]
                              }
                            ]
                          },

                          {
                            path: 'tasks',
                            pathMatch: 'full',
                            component: PageInnovationTaskDetailsComponent,
                            data: {
                              breadcrumb: null,
                              layout: { type: 'full' }
                            }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    path: 'support',
                    canActivate: mapToCanActivate([ShareInnovationRecordGuard]),
                    component: InnovationDataSharingEditComponent,
                    data: { breadcrumb: null, layout: { type: 'full' } }
                  }
                ]
              },

              {
                path: 'how-to-proceed',
                data: {
                  breadcrumb: 'How to proceed',
                  layout: { type: 'full' }
                },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationHowToProceedComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'recommend-needs-reassessment',
                    pathMatch: 'full',
                    component: PageInnovationRecommendNeedsReassessmentComponent
                  },
                  {
                    path: 'needs-reassessment-send',
                    pathMatch: 'full',
                    component: PageInnovationNeedsReassessmentSendComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'archive',
                    data: { breadcrumb: null },
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        component: WizardInnovationHowToProceedArchiveComponent,
                        data: { breadcrumb: null }
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
                path: 'surveys',
                data: { breadcrumb: 'Surveys', layout: { type: 'full' } },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationSupportSurveysComponent,
                    data: { layout: { type: 'full' }, breadcrumb: null }
                  },
                  {
                    path: ':surveyId',
                    pathMatch: 'full',
                    component: EndSupportSurveyJourneyComponent,
                    data: { breadcrumb: null }
                  }
                ]
              },

              {
                path: 'documents',
                data: { breadcrumb: 'Documents' },
                children: [
                  {
                    path: '',
                    canActivate: [checkStatusGuard([InnovationStatusEnum.CREATED], true)],
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
                      {
                        path: 'edit',
                        pathMatch: 'full',
                        redirectTo: 'edit/1'
                      },
                      {
                        path: 'edit/:stepId',
                        canActivate: [checkStatusGuard([InnovationStatusEnum.CREATED], true)],
                        pathMatch: 'full',
                        component: PageInnovationDocumentsNewditComponent
                      }
                    ]
                  }
                ]
              },

              {
                path: 'tasks',
                data: { breadcrumb: 'Tasks to do' },
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
                        path: 'accept',
                        pathMatch: 'full',
                        component: PageInnovationTaskActionComponent,
                        data: { breadcrumb: null, layout: { type: 'full' }, status: InnovationTaskStatusEnum.DONE }
                      },
                      {
                        path: 'decline',
                        pathMatch: 'full',
                        component: PageInnovationTaskActionComponent,
                        data: { breadcrumb: null, layout: { type: 'full' }, status: InnovationTaskStatusEnum.DECLINED }
                      }
                    ]
                  }
                ]
              },

              {
                path: 'threads',
                resolve: { innovationData: mapToResolve(InnovationDataResolver) },
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
                data: { breadcrumb: 'Data Sharing' },
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    component: PageInnovationDataSharingAndSupportComponent,
                    data: { breadcrumb: null }
                  },
                  { path: 'edit', pathMatch: 'full', component: InnovationDataSharingChangeComponent },
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
                canActivate: [checkStatusGuard([InnovationStatusEnum.CREATED], true)],
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
              },

              {
                path: 'manage',
                data: { breadcrumb: null },
                canActivate: mapToCanActivate([ManageGuard]),
                children: [
                  {
                    path: 'innovation',
                    data: { breadcrumb: 'Manage innovation' },
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        component: PageInnovationManageOverviewComponent,
                        data: { breadcrumb: null }
                      },
                      {
                        path: 'collaborators',
                        data: { breadcrumb: 'Collaborators', layout: { type: 'full' } },
                        children: [
                          {
                            path: '',
                            pathMatch: 'full',
                            component: PageInnovationManageCollaboratorsOverviewComponent,
                            data: { breadcrumb: null }
                          },
                          {
                            path: 'new',
                            pathMatch: 'full',
                            component: PageInnovationManageCollaboratorsWizardComponent,
                            data: { breadcrumb: null }
                          },
                          {
                            path: ':collaboratorId',
                            children: [
                              {
                                path: '',
                                pathMatch: 'full',
                                component: PageInnovationManageCollaboratorsInfoComponent,
                                data: { breadcrumb: null }
                              },
                              {
                                path: 'invite-again',
                                pathMatch: 'full',
                                component: PageInnovationManageCollaboratorsWizardComponent,
                                data: { breadcrumb: null }
                              },
                              {
                                path: 'edit',
                                pathMatch: 'full',
                                component: PageInnovationManageCollaboratorsWizardComponent,
                                data: { breadcrumb: null }
                              }
                            ]
                          }
                        ]
                      },
                      {
                        path: 'archive',
                        data: { breadcrumb: 'Archive innovation', layout: { type: 'full' } },
                        children: [
                          {
                            path: '',
                            pathMatch: 'full',
                            component: WizardInnovationManageArchiveComponent,
                            data: { breadcrumb: null }
                          }
                        ]
                      },
                      {
                        path: 'transfer',
                        data: { breadcrumb: 'Transfer ownership', layout: { type: 'full' } },
                        children: [
                          {
                            path: '',
                            pathMatch: 'full',
                            redirectTo: '1',
                            data: { breadcrumb: null }
                          },
                          {
                            path: ':stepId',
                            pathMatch: 'full',
                            component: PageInnovationManageTransferComponent,
                            data: { breadcrumb: null }
                          }
                        ]
                      }
                    ]
                  },
                  {
                    path: 'access',
                    data: { breadcrumb: 'Manage access' },
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        component: PageInnovationManageAccessOverviewComponent,
                        data: { breadcrumb: null }
                      },
                      {
                        path: 'leave',
                        pathMatch: 'full',
                        component: PageInnovationManageAccessLeaveInnovationComponent,
                        data: { breadcrumb: 'Leave innovation', layout: { type: 'full' } }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },

      { path: 'innovation-statuses', pathMatch: 'full', component: PageInnovationStatusListComponent },

      {
        path: 'notifications',
        pathMatch: 'full',
        component: PageNotificationsListComponent,
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
                path: 'delete',
                pathMatch: 'full',
                component: PageAccountDeleteComponent,
                data: { breadcrumb: 'null', layout: { type: 'full' } }
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
export class InnovatorRoutingModule {}
