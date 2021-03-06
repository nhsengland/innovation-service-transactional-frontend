import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { AdminLayoutComponent } from './base/admin-layout.component';
import { PageAdminUsersFindComponent } from './pages/admin-users/admin-users-find/admin-users-find.component';
import { PageServiceChangeUserRoleComponent } from './pages/change-user-role/change-user-role.component';
import { PageAdminUsersInfoComponent } from './pages/admin-users/admin-users-info/admin-users-info.component';

// Pages.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
import { PageServiceUsersDeleteComponent } from './pages/service-users/service-users-delete.component';
import { PageServiceUsersEditComponent } from './pages/service-users/service-users-edit.component';
import { PageServiceUsersFindComponent } from './pages/service-users/service-users-find.component';
import { PageServiceUsersInfoComponent } from './pages/service-users/service-users-info.component';
import { PageServiceUsersLockComponent } from './pages/service-users/service-users-lock.component';
import { PageServiceUsersNewComponent } from './pages/service-users/service-users-new/service-users-new.component';
import { PageServiceUsersUnlockComponent } from './pages/service-users/service-users-unlock.component';
import { PageAdminUsersNewComponent } from './pages/admin-users/admin-users-new/admin-users-new.component';
import { PageAdminDeleteComponent } from './pages/admin-users/admin-users-delete/admin-users-delete.component';

// Resolvers.
import { ServiceUserDataResolver } from './resolvers/service-user-data.resolver';
import { PageListOrganisationsAndUnitsComponent } from './pages/organisations/organisations-list/organisations-list.component';
import { PageAdminOrganisationInfoComponent } from './pages/organisations/organisations-info/organisation-info.component';
import { PageAdminOrganisationEditComponent } from './pages/organisations/organisations-edit/organisations-edit.component';
import { OrganisationDataResolver } from './resolvers/organisation-data.resolver';
import { PageServiceChangeOrganisationUserUnitComponent } from './pages/change-organisation-user-unit/change-organisation-user-unit.component';
import { PageAdminAccountManageAccountInfoComponent } from './pages/account/manage-account/manage-account-info.component';
import { PageAdminTermsOfUseListComponent } from './pages/terms-of-use/terms-of-use-list/list-terms-of-use.component';
import { PageAdminTermsOfUseNewComponent } from './pages/terms-of-use/terms-of-use-new/terms-of-use-new.component';
import { PageAccountManageDetailsInfoComponent } from '@modules/shared/pages/account/manage-details/manage-details-info.component';
import { PageAccountManageDetailsEditComponent } from '@modules/shared/pages/account/manage-details/manage-details-edit.component';
import { PageAdminTermsOfUseInfoComponent } from './pages/terms-of-use/terms-of-use-info/terms-of-use-info.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  {
    path: '',
    component: AdminLayoutComponent,
    data: { breadcrumb: 'Home', module: 'admin' },
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        component: PageDashboardComponent
      },
      {
        path: 'organisations',
        data: { breadcrumb: 'Organisations' },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: PageListOrganisationsAndUnitsComponent,
            data: { breadcrumb: null },
          },
          {
            path: ':orgId',
            runGuardsAndResolvers: 'pathParamsOrQueryParamsChange',
            resolve: { organisation: OrganisationDataResolver },
            data: { breadcrumb: (data: { organisation: { id: string, name: string } }) => `${data.organisation.name}` },
            children: [
              {
                path: '',
                pathMatch: 'full',
                component: PageAdminOrganisationInfoComponent,
                data: { breadcrumb: null }
              },
              {
                path: 'edit',
                pathMatch: 'full',
                component: PageAdminOrganisationEditComponent,
                data: { module: 'Organisation' }
              },
              {
                path: 'unit/:unitId/edit',
                pathMatch: 'full',
                component: PageAdminOrganisationEditComponent,
                data: { module: 'Unit' }
              }
            ]
          },

        ]
      },

      // NOTE: When creating the future admin-users routes, a guard should be created to protect those routes!
      {
        path: 'administration-users',
        data: { breadcrumb: 'administration users' },
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { breadcrumb: null },
            component: PageAdminUsersFindComponent
          },
          {
            path: 'new',
            pathMatch: 'full',
            component: PageAdminUsersNewComponent
          },
          {
            path: ':userId',
            // pathMatch: 'full',
            resolve: { user: ServiceUserDataResolver },
            data: {
              breadcrumb: (data: { user: { id: string, displayName: string } }) => `${data.user.displayName}`
            },
            children: [
              {
                path: '',
                pathMatch: 'full',
                data: { breadcrumb: null },
                component: PageAdminUsersInfoComponent
              },
              {
                path: 'delete',
                pathMatch: 'full',
                component: PageAdminDeleteComponent
              }
            ]
          }
        ]
      },
      {
        path: 'service-users',
        data: { breadcrumb: 'Service users' },
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { breadcrumb: null },
            component: PageServiceUsersFindComponent
          },
          {
            path: 'new',
            pathMatch: 'full',
            component: PageServiceUsersNewComponent
          },
          {
            path: ':userId',
            resolve: { user: ServiceUserDataResolver },
            data: {
              breadcrumb: (data: { user: { id: string, displayName: string } }) => `${data.user.displayName}`
            },
            children: [
              {
                path: '',
                pathMatch: 'full',
                data: { breadcrumb: null },
                component: PageServiceUsersInfoComponent
              },
              {
                path: 'edit',
                pathMatch: 'full',
                component: PageServiceUsersEditComponent
              },
              {
                path: 'lock',
                pathMatch: 'full',
                component: PageServiceUsersLockComponent
              },
              {
                path: 'unlock',
                pathMatch: 'full',
                component: PageServiceUsersUnlockComponent
              },
              {
                path: 'delete',
                pathMatch: 'full',
                component: PageServiceUsersDeleteComponent
              },
              {
                path: 'change-role',
                pathMatch: 'full',
                component: PageServiceChangeUserRoleComponent
              },
              {
                path: 'change-unit',
                pathMatch: 'full',
                component: PageServiceChangeOrganisationUserUnitComponent
              }
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
            path: 'manage-account',
            data: { breadcrumb: 'Manage account' },
            children: [
              {
                path: '', pathMatch: 'full', component: PageAdminAccountManageAccountInfoComponent,
                data: { layoutOptions: { type: 'userAccountMenu' } }
              }
            ]
          },
          {
            path: 'manage-details',
            data: { breadcrumb: 'Manage details' },
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
          { path: '', pathMatch: 'full', component: PageAdminTermsOfUseListComponent },
          { path: 'new-version', pathMatch: 'full', component: PageAdminTermsOfUseNewComponent, data: { module: 'New' } },
          { path: 'edit-version/:id', pathMatch: 'full', component: PageAdminTermsOfUseNewComponent, data: { module: 'Edit' } },
          { path: 'show-version/:id', pathMatch: 'full', component: PageAdminTermsOfUseInfoComponent }
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
