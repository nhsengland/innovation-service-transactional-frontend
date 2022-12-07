import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Base layout.
import { RoutesDataType, TransactionalLayoutComponent } from '@modules/theme/base/transactional-layout.component';
import { ContextInnovationOutletComponent } from './base/context-innovation-outlet.component';
import { SidebarInnovationMenuOutletComponent } from './base/sidebar-innovation-menu-outlet.component';

// Pages.
// // Account.
import { PageAccountManageAccountInfoComponent } from './pages/account/manage-account-info.component';
// // Admin Users.
import { PageAdminUsersFindComponent } from './pages/admin-users/admin-users-find.component';
import { PageAdminUserInfoComponent } from './pages/admin-users/admin-user-info.component';
import { PageAdminUserNewComponent } from './pages/admin-users/admin-user-new.component';
import { PageAdminUserDeleteComponent } from './pages/admin-users/admin-user-delete.component';
// // Dashboard.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
// // Innovation
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
// // Organisations.
import { PageOrganisationEditComponent } from './pages/organisations/organisation-edit.component';
import { PageOrganisationInfoComponent } from './pages/organisations/organisation-info.component';
import { PageOrganisationsListComponent } from './pages/organisations/organisations-list.component';
// // Service Users.
import { PageServiceUserChangeOrganisationUnitComponent } from './pages/service-users/service-user-change-organisation-unit.component';
import { PageServiceUserChangeRoleComponent } from './pages/service-users/service-user-change-role.component';
import { PageServiceUserFindComponent } from './pages/service-users/service-user-find.component';
import { PageServiceUserInfoComponent } from './pages/service-users/service-user-info.component';
import { PageServiceUserLockComponent } from './pages/service-users/service-user-lock.component';
import { PageServiceUserNewComponent } from './pages/service-users/service-user-new.component';
import { PageServiceUserUnlockComponent } from './pages/service-users/service-user-unlock.component';
// // Terms of use.
import { PageTermsOfUseInfoComponent } from './pages/terms-of-use/terms-of-use-info.component';
import { PageTermsOfUseListComponent } from './pages/terms-of-use/terms-of-use-list.component';
import { PageTermsOfUseNewComponent } from './pages/terms-of-use/terms-of-use-new.component';
// // Shared.
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
// // // Innovations
import { PageInnovationsAdvancedReviewComponent } from '@modules/shared/pages/innovations/innovations-advanced-review.component';
// // // Innovation
import { PageInnovationSectionEvidenceInfoComponent } from '@modules/shared/pages/innovation/sections/section-evidence-info.component';
import { PageInnovationSectionInfoComponent } from '@modules/shared/pages/innovation/sections/section-info.component';
import { PageInnovationRecordComponent } from '@modules/shared/pages/innovation/record/innovation-record.component';
import { PageActionStatusListComponent } from '@modules/shared/pages/innovation/actions/action-status-list.component';
import { PageInnovationActionTrackerInfoComponent } from '@modules/shared/pages/innovation/actions/action-tracker-info.component';
import { PageInnovationActionTrackerListComponent } from '@modules/shared/pages/innovation/actions/action-tracker-list.component';
import { PageInnovationDataSharingAndSupportComponent } from '@modules/shared/pages/innovation/data-sharing-and-support/data-sharing-and-support.component';
import { PageInnovationSupportStatusListComponent } from '@modules/shared/pages/innovation/support/innovation-support-status-list.component';
// Wizards.
import { WizardOrganisationUnitActivateComponent } from './wizards/organisation-unit-activate/organisation-unit-activate.component';
import { WizardOrganisationUnitInactivateComponent } from './wizards/organisation-unit-inactivate/organisation-unit-inactivate.component';

// Resolvers.
import { OrganisationDataResolver } from './resolvers/organisation-data.resolver';
import { ServiceUserDataResolver } from './resolvers/service-user-data.resolver';
import { PageOrganisationNewComponent } from './pages/organisations/organisation-new.component';
import { InnovationDataResolver } from '@modules/shared/resolvers/innovation-data.resolver';
import { InnovationActionDataResolver } from '@modules/shared/resolvers/innovation-action-data.resolver';
import { InnovationAssessmentOverviewComponent } from './pages/innovation/assessment/assessment-overview.component';

const header: RoutesDataType['header'] = {
  menuBarItems: {
    left: [
      { id: 'adminUsers', label: 'Admin users', url: '/admin/administration-users' },
      { id: 'serviceUsers', label: 'Service users', url: '/admin/service-users' },
      {
        id: 'management',
        label: 'Management',
        children: [
          { label: 'Organisations', url: '/admin/organisations', description: 'Manage organisations and associated units' },
          { label: 'Terms of use', url: '/admin/terms-conditions', description: 'Create a new version and trigger acceptance by the users' }
        ]
      },
      { id: 'innovations', label: 'Innovations', url: '/admin/innovations' },
    ],
    right: [
      { id: 'account', label: 'My account', url: '/admin/account' },
    ]
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
          {
            path: '', pathMatch: 'full', component: PageOrganisationsListComponent,
            data: { breadcrumb: null },
          },
          {
            path: 'new', pathMatch: 'full', component: PageOrganisationNewComponent,
          },
          {
            path: ':organisationId',
            runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
            resolve: { organisation: OrganisationDataResolver },
            data: { breadcrumb: (data: { organisation: { id: string, name: string } }) => `${data.organisation.name}` },
            children: [
              {
                path: '', pathMatch: 'full', component: PageOrganisationInfoComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'edit', pathMatch: 'full', component: PageOrganisationEditComponent,
                data: { module: 'Organisation' }
              },
              {
                path: 'unit/:organisationUnitId/edit', pathMatch: 'full', component: PageOrganisationEditComponent,
                data: { module: 'Unit' }
              },
              { path: 'unit/:organisationUnitId/activate', pathMatch: 'full', component: WizardOrganisationUnitActivateComponent },
              { path: 'unit/:organisationUnitId/inactivate', pathMatch: 'full', component: WizardOrganisationUnitInactivateComponent }
            ]
          }
        ]
      },

      // NOTE: When creating the future admin-users routes, a guard should be created to protect those routes!
      {
        path: 'administration-users',
        data: { breadcrumb: 'administration users' },
        children: [
          {
            path: '', pathMatch: 'full', component: PageAdminUsersFindComponent,
            data: { breadcrumb: null }
          },
          { path: 'new', pathMatch: 'full', component: PageAdminUserNewComponent },
          {
            path: ':userId',
            // pathMatch: 'full',
            resolve: { user: ServiceUserDataResolver },
            data: {
              breadcrumb: (data: { user: { id: string, displayName: string } }) => `${data.user.displayName}`
            },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAdminUserInfoComponent,
                data: { breadcrumb: null }
              },
              { path: 'delete', pathMatch: 'full', component: PageAdminUserDeleteComponent }
            ]
          }
        ]
      },
      {
        path: 'service-users',
        data: { breadcrumb: 'Service users' },
        children: [
          {
            path: '', pathMatch: 'full', component: PageServiceUserFindComponent,
            data: { breadcrumb: null }
          },
          { path: 'new', pathMatch: 'full', component: PageServiceUserNewComponent },
          {
            path: ':userId',
            resolve: { user: ServiceUserDataResolver },
            data: {
              breadcrumb: (data: { user: { id: string, displayName: string } }) => `${data.user.displayName}`
            },
            children: [
              {
                path: '', pathMatch: 'full', component: PageServiceUserInfoComponent,
                data: { breadcrumb: null }
              },
              { path: 'lock', pathMatch: 'full', component: PageServiceUserLockComponent },
              { path: 'unlock', pathMatch: 'full', component: PageServiceUserUnlockComponent },
              { path: 'change-role', pathMatch: 'full', component: PageServiceUserChangeRoleComponent },
              { path: 'change-unit', pathMatch: 'full', component: PageServiceUserChangeOrganisationUnitComponent }
            ]
          }

        ]
      },
      {
        path: 'account',
        data: { breadcrumb: 'Account' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'manage-details', data: { breadcrumb: null } },
          {
            path: 'manage-account', pathMatch: 'full', component: PageAccountManageAccountInfoComponent,
            data: { layoutOptions: { type: 'userAccountMenu' } }
          },
          {
            path: 'manage-details',
            data: { breadcrumb: null },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAccountManageDetailsInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              },
              { path: 'edit', pathMatch: 'full', redirectTo: 'edit/1' },
              { path: 'edit/:stepId', pathMatch: 'full', component: PageAccountManageDetailsEditComponent }
            ]
          },
        ]
      },
      {
        path: 'terms-conditions',
        data: { breadcrumb: 'Terms of use' },
        children: [
          {
            path: '', pathMatch: 'full', component: PageTermsOfUseListComponent,
            data: { breadcrumb: null }
          },
          {
            path: 'new-version', pathMatch: 'full', component: PageTermsOfUseNewComponent,
            data: { module: 'New' }
          },
          {
            path: 'edit-version/:id', pathMatch: 'full', component: PageTermsOfUseNewComponent,
            data: { module: 'Edit' }
          },
          { path: 'show-version/:id', pathMatch: 'full', component: PageTermsOfUseInfoComponent }
        ]
      },
      {
        path: 'innovations',
        data: { breadcrumb: 'Innovations' },
        children: [
          {
            path: '', pathMatch: 'full', component: PageInnovationsAdvancedReviewComponent,
            data: {
              layout: { type: 'full', backgroundColor: 'bg-color-white' }
            }
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
                            data: { module: 'admin', breadcrumb: null }
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
                        path: '', pathMatch: 'full', component: PageInnovationActionTrackerInfoComponent,
                        data: { breadcrumb: null }
                      }
                    ]
                  }

                ]
              },
              {
                path: 'assessments',
                data: { breadcrumb: null },
                children: [
                  {
                    path: ':assessmentId',
                    data: { breadcrumb: null },
                    children: [
                      {
                        path: '', pathMatch: 'full', component: InnovationAssessmentOverviewComponent,
                        data: { breadcrumb: null }
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
                    path: '', pathMatch: 'full', component: PageInnovationDataSharingAndSupportComponent,
                    data: { breadcrumb: null }
                  },
                  {
                    path: 'statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent
                  }
                ]
              },
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
export class AdminRoutingModule { }
