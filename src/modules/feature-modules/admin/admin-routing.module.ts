import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { AdminLayoutComponent } from './base/admin-layout.component';

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

// Wizards.
import { WizardOrganisationUnitActivateComponent } from './wizards/organisation-unit-activate/organisation-unit-activate.component';
import { WizardOrganisationUnitInactivateComponent } from './wizards/organisation-unit-inactivate/organisation-unit-inactivate.component';

// Resolvers.
import { OrganisationDataResolver } from './resolvers/organisation-data.resolver';
import { ServiceUserDataResolver } from './resolvers/service-user-data.resolver';


const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  {
    path: '',
    component: AdminLayoutComponent,
    data: { breadcrumb: 'Home', module: 'admin' },
    children: [

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
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
