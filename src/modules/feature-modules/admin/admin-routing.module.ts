import { NgModule } from '@angular/core';
import { mapToResolve, RouterModule, Routes } from '@angular/router';

// Layout.
import { RoutesDataType, TransactionalLayoutComponent } from '@modules/theme/base/transactional-layout.component';
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Base
import { SidebarAccountMenuOutletComponent } from './base/sidebar-account-menu-outlet.component';

// Admin module pages.

// // Users
import { PageUsersRoleActivateComponent } from './pages/users/roles/role-activate.component';
import { PageUsersRoleChangeComponent } from './pages/users/roles/role-change.component';
import { PageUsersRoleInactivateComponent } from './pages/users/roles/role-inactivate.component';
import { PageRoleNewComponent } from './pages/users/roles/role-new.component';
import { PageUserFindComponent } from './pages/users/user-find.component';
import { PageUserInfoComponent } from './pages/users/user-info.component';
import { PageUserLockComponent } from './pages/users/user-lock.component';
import { PageUserNewComponent } from './pages/users/user-new.component';
import { PageUserUnlockComponent } from './pages/users/user-unlock.component';
// // Announcements.
import { PageAnnouncementDetailsComponent } from './pages/announcements/announcement-details.component';
import { PageAnnouncementNewditComponent } from './pages/announcements/announcement-newdit.component';
import { PageAnnouncementsListComponent } from './pages/announcements/announcements-list.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { PageInnovationManageTransferComponent } from './pages/innovation/transfer/manage-transfer.component';
// // Organisations.
import { PageOrganisationEditComponent } from './pages/organisations/organisation-edit.component';
import { PageOrganisationInfoComponent } from './pages/organisations/organisation-info.component';
import { PageOrganisationNewComponent } from './pages/organisations/organisation-new.component';
import { PageOrganisationUnitNewComponent } from './pages/organisations/organisation-unit-new/organisation-unit-new.component';
import { PageOrganisationsListComponent } from './pages/organisations/organisations-list.component';
import { OrganisationUnitInfoComponent } from './pages/organisations/organisation-unit-info.component';
// // Terms of use.
import { PageTermsOfUseInfoComponent } from './pages/terms-of-use/terms-of-use-info.component';
import { PageTermsOfUseListComponent } from './pages/terms-of-use/terms-of-use-list.component';
import { PageTermsOfUseNewComponent } from './pages/terms-of-use/terms-of-use-new.component';
// // Elastic Search
import { PageElasticSearchComponent } from './pages/elastic-search/elastic-search.component';

// Shared module pages.
// // Account.
import { PageSharedAccountManageAccountInfoComponent } from '@modules/shared/pages/account/manage-account-info/manage-account-info.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';

// // Innovation.
import { PageInnovationActivityLogComponent } from '@modules/shared/pages/innovation/activity-log/innovation-activity-log.component';
import { PageInnovationAssessmentOverviewComponent } from '@modules/shared/pages/innovation/assessment/assessment-overview.component';
import { PageInnovationDataSharingAndSupportComponent } from '@modules/shared/pages/innovation/data-sharing-and-support/data-sharing-and-support.component';
import { PageInnovationDocumentInfoComponent } from '@modules/shared/pages/innovation/documents/document-info.component';
import { PageInnovationDocumentsListComponent } from '@modules/shared/pages/innovation/documents/documents-list.component';
import { PageEveryoneWorkingOnInnovationComponent } from '@modules/shared/pages/innovation/everyone-working-on-innovation/everyone-working-on-innovation.component';
import { PageInnovationThreadMessagesListComponent } from '@modules/shared/pages/innovation/messages/thread-messages-list.component';
import { PageInnovationThreadsListComponent } from '@modules/shared/pages/innovation/messages/threads-list.component';
import { PageInnovationRecordWrapperComponent } from '@modules/shared/pages/innovation/record/innovation-record-wrapper.component';
import { PageInnovationSectionEvidenceInfoComponent } from '@modules/shared/pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSectionInfoComponent } from '@modules/shared/pages/innovation/sections/section-info.component';
import { PageInnovationStatusListComponent } from '@modules/shared/pages/innovation/status/innovation-status-list.component';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/support-status-list.component';
import { PageInnovationSupportSummaryListComponent } from '@modules/shared/pages/innovation/support/support-summary-list.component';
import { PageInnovationTaskDetailsComponent } from '@modules/shared/pages/innovation/tasks/task-details.component';
import { PageTaskStatusListComponent } from '@modules/shared/pages/innovation/tasks/task-status-list.component';
import { PageInnovationTaskToDoListComponent } from '@modules/shared/pages/innovation/tasks/task-to-do-list.component';
// // Innovations.
import { PageInnovationsAdvancedReviewComponent } from '@modules/shared/pages/innovations/innovations-advanced-review.component';

// Wizards.
import { WizardOrganisationUnitActivateComponent } from './wizards/organisation-unit-activate/organisation-unit-activate.component';
import { WizardOrganisationUnitInactivateComponent } from './wizards/organisation-unit-inactivate/organisation-unit-inactivate.component';

// Resolvers.
import { PageAccountMFAEditComponent } from '@modules/shared/pages/account/mfa/mfa-edit.component';
import { PageInnovationAllSectionsInfoComponent } from '@modules/shared/pages/innovation/sections/section-info-all.component';
import { PageProgressCategoriesWrapperComponent } from '@modules/shared/pages/progress-categories/progress-categories-wrapper.component';
import { InnovationAssessmentDataResolver } from '@modules/shared/resolvers/innovation-assessment-data.resolver';
import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { innovationRecordSchemaResolver } from '@modules/shared/resolvers/innovation-record-schema.resolver';
import { InnovationTaskDataResolver } from '@modules/shared/resolvers/innovation-task-data.resolver';
import { InnovationThreadDataResolver } from '@modules/shared/resolvers/innovation-thread-data.resolver';
import { PageUserDeleteComponent } from './pages/users/user-delete.component';
import { PageUserEmailComponent } from './pages/users/user-email.component';
import { PageUserInnovationsComponent } from './pages/users/user-innovations.component';
import { PageUserManageComponent } from './pages/users/user-manage.component';
import { AnnouncementDataResolver } from './resolvers/announcement-data.resolver';
import { OrganisationDataResolver } from './resolvers/organisation-data.resolver';
import { OrganisationUnitDataResolver } from './resolvers/organisation-unit-data.resolver';
import { ServiceUserDataResolver } from './resolvers/service-user-data.resolver';

const header: RoutesDataType['header'] = {
  menuBarItems: {
    left: [
      {
        id: 'management',
        label: 'Management',
        children: [
          {
            label: 'Users',
            url: '/admin/users',
            description: 'Find or add a new user'
          },
          /*           {
            label: 'Innovation record',
            url: '#',
            description: 'Manage and update the questions in the innovation record'
          }, */
          {
            label: 'Organisations',
            url: '/admin/organisations',
            description: 'Manage organisations and associated units'
          },
          {
            label: 'Elastic Search',
            url: '/admin/elastic-search',
            description: 'Reindex elastic search - for developer use only'
          }
        ]
      },
      {
        id: 'communications',
        label: 'Communications',
        children: [
          {
            label: 'Announcements',
            url: '/admin/announcements',
            description: 'Manage and create announcements'
          },
          {
            label: 'Terms of use',
            url: '/admin/terms-conditions',
            description: 'Update the terms of use and send it to users to accept'
          }
        ]
      },
      { id: 'innovations', label: 'Innovations', url: '/admin/innovations' }
    ],
    right: [{ id: 'account', label: 'My account', url: '/admin/account/manage-details' }]
  },
  notifications: {}
};

const routes: Routes = [
  {
    path: '',
    component: TransactionalLayoutComponent,
    data: { header, breadcrumb: 'Home', module: 'admin' },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', pathMatch: 'full', component: PageDashboardComponent },

      {
        path: 'organisations',
        data: { breadcrumb: 'Organisations' },
        children: [
          { path: '', pathMatch: 'full', component: PageOrganisationsListComponent, data: { breadcrumb: null } },

          { path: 'new', pathMatch: 'full', component: PageOrganisationNewComponent },

          { path: 'ASSESSMENT', pathMatch: 'full', component: OrganisationUnitInfoComponent },
          { path: 'ADMIN', pathMatch: 'full', component: OrganisationUnitInfoComponent },

          {
            path: ':organisationId',
            runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
            resolve: { organisation: mapToResolve(OrganisationDataResolver) },
            data: {
              breadcrumb: (data: { organisation: { id: string; name: string; acronym: string } }) =>
                `${data.organisation.name}`
            },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: PageOrganisationInfoComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'edit',
                pathMatch: 'full',
                component: PageOrganisationEditComponent,
                data: { module: 'Organisation' }
              },
              {
                path: 'unit',
                data: { breadcrumb: null },
                children: [
                  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
                  {
                    path: 'new',
                    pathMatch: 'full',
                    component: PageOrganisationUnitNewComponent
                  },
                  {
                    path: ':organisationUnitId',
                    resolve: { organisationUnit: mapToResolve(OrganisationUnitDataResolver) },
                    runGuardsAndResolvers: 'always',
                    data: {
                      breadcrumb: (data: { organisationUnit: { id: string; name: string; acronym: string } }) =>
                        `${data.organisationUnit.name}`
                    },
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        data: { breadcrumb: null },
                        component: OrganisationUnitInfoComponent
                      },
                      {
                        path: 'edit',
                        pathMatch: 'full',
                        component: PageOrganisationEditComponent,
                        data: { module: 'Unit' }
                      },
                      {
                        path: 'activate',
                        pathMatch: 'full',
                        component: WizardOrganisationUnitActivateComponent
                      },
                      {
                        path: 'inactivate',
                        pathMatch: 'full',
                        component: WizardOrganisationUnitInactivateComponent
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
        path: 'users',
        data: { breadcrumb: 'Users' },
        children: [
          { path: '', pathMatch: 'full', component: PageUserFindComponent, data: { breadcrumb: null } },
          { path: 'new', pathMatch: 'full', component: PageUserNewComponent },
          {
            path: ':userId',
            runGuardsAndResolvers: 'always',
            resolve: { user: mapToResolve(ServiceUserDataResolver) },
            data: { breadcrumb: (data: { user: { id: string; name: string } }) => `${data.user.name}` },
            children: [
              { path: '', pathMatch: 'full', component: PageUserInfoComponent, data: { breadcrumb: null } },
              { path: 'email', pathMatch: 'full', component: PageUserEmailComponent, data: { breadcrumb: null } },
              { path: 'lock', pathMatch: 'full', component: PageUserLockComponent, data: { breadcrumb: null } },
              { path: 'unlock', pathMatch: 'full', component: PageUserUnlockComponent, data: { breadcrumb: null } },
              {
                path: 'change-role',
                pathMatch: 'full',
                component: PageUsersRoleChangeComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'manage',
                data: { breadcrumb: 'Manage account' },
                children: [
                  { path: '', pathMatch: 'full', component: PageUserManageComponent },
                  { path: 'lock', pathMatch: 'full', component: PageUserLockComponent },
                  { path: 'unlock', pathMatch: 'full', component: PageUserUnlockComponent },
                  { path: 'delete', pathMatch: 'full', component: PageUserDeleteComponent },
                  { path: 'innovations', pathMatch: 'full', component: PageUserInnovationsComponent },
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
                path: 'role',
                data: { breadcrumb: null },
                children: [
                  { path: 'new', pathMatch: 'full', component: PageRoleNewComponent, data: { breadcrumb: null } },
                  {
                    path: ':roleId',
                    data: { breadcrumb: null },
                    children: [
                      {
                        path: 'inactivate',
                        pathMatch: 'full',
                        component: PageUsersRoleInactivateComponent,
                        data: { breadcrumb: null }
                      },
                      {
                        path: 'activate',
                        pathMatch: 'full',
                        component: PageUsersRoleActivateComponent,
                        data: { breadcrumb: null }
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
        path: 'announcements',
        data: { breadcrumb: 'Announcements' },
        resolve: {
          irSchemaData: innovationRecordSchemaResolver
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: PageAnnouncementsListComponent,
            data: { breadcrumb: null }
          },
          { path: 'new', pathMatch: 'full', component: PageAnnouncementNewditComponent },
          {
            path: ':announcementId',
            resolve: { announcement: mapToResolve(AnnouncementDataResolver) },
            data: {
              breadcrumb: (data: { announcement: { id: string; title: string } }) => `${data.announcement.title}`
            },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: PageAnnouncementDetailsComponent,
                data: { breadcrumb: null }
              },
              { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
              { path: 'edit/:stepId', pathMatch: 'full', component: PageAnnouncementNewditComponent }
            ]
          }
        ]
      },

      {
        path: 'elastic-search',
        pathMatch: 'full',
        component: PageElasticSearchComponent,
        data: { breadcrumb: null }
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
                component: PageSharedAccountManageAccountInfoComponent
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
        path: 'terms-conditions',
        data: { breadcrumb: 'Terms of use' },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: PageTermsOfUseListComponent,
            data: { breadcrumb: null }
          },
          {
            path: 'new-version',
            pathMatch: 'full',
            component: PageTermsOfUseNewComponent,
            data: { module: 'New' }
          },
          {
            path: 'edit-version/:id',
            pathMatch: 'full',
            component: PageTermsOfUseNewComponent,
            data: { module: 'Edit' }
          },
          { path: 'show-version/:id', pathMatch: 'full', component: PageTermsOfUseInfoComponent }
        ]
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
            component: PageInnovationsAdvancedReviewComponent,
            data: {
              breadcrumb: null,
              layout: { type: 'full', backgroundColor: 'bg-color-white' }
            }
          },

          {
            path: ':innovationId',
            resolve: {
              innovationData: mapToResolve(InnovationDataResolver),
              irSchemaData: innovationRecordSchemaResolver
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
                path: 'assessments',
                data: { breadcrumb: null },
                children: [
                  {
                    path: ':assessmentId',
                    resolve: {
                      innovationAssessmentData: mapToResolve(InnovationAssessmentDataResolver)
                    },
                    data: { breadcrumb: null },
                    children: [
                      {
                        path: '',
                        pathMatch: 'full',
                        component: PageInnovationAssessmentOverviewComponent,
                        data: { breadcrumb: null }
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
                            data: { module: 'admin', breadcrumb: null }
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
                  { path: ':documentId', pathMatch: 'full', component: PageInnovationDocumentInfoComponent }
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
                        data: { breadcrumb: null }
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
              },

              {
                path: 'statuses',
                pathMatch: 'full',
                component: PageInnovationStatusListComponent,
                data: { breadcrumb: 'Statuses' }
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
export class AdminRoutingModule {}
