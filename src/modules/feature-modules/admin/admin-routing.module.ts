import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { AdminLayoutComponent } from './base/admin-layout.component';

// Pages.
import { PageDashboardComponent } from './pages/dashboard/dashboard.component';
import { PageServiceUsersDeleteComponent } from './pages/service-users/service-users-delete.component';
import { PageServiceUsersListComponent } from './pages/service-users/service-users-list.component';
import { PageServiceUsersEditComponent } from './pages/service-users/service-users-edit.component';
import { PageServiceUsersInfoComponent } from './pages/service-users/service-users-info.component';
import { PageServiceUsersNewComponent } from './pages/service-users/service-users-new.component';


const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  {
    path: '',
    component: AdminLayoutComponent,
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        component: PageDashboardComponent
      },

      // NOTE: When creating the future admin-users routes, a guard should be created to protect those routes!

      {
        path: 'service-users',
        data: { breadcrumb: 'Service users' },
        children: [
          {
            path: '',
            pathMatch: 'full',
            data: { breadcrumb: null },
            component: PageServiceUsersListComponent
          },
          {
            path: 'new',
            pathMatch: 'full',
            component: PageServiceUsersNewComponent
          },
          {
            path: ':userId',
            data: {
              breadcrumb: (data: { user: { name: string } }) => `${data.user.name}`,
              user: { name: 'Morgan Freeman' }
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
                path: 'delete',
                pathMatch: 'full',
                component: PageServiceUsersDeleteComponent
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
export class AdminRoutingModule { }
