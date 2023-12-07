import { NgModule } from '@angular/core';
import { mapToCanActivate, RouterModule, Routes } from '@angular/router';

// Base layout.
import { BaseLayoutComponent } from '@modules/theme/base/base-layout.component';

// Pages.
import { PageAccountDeleteMessageComponent } from '@modules/shared/pages/account/delete-message/delete-message.component';
import { PageErrorComponent } from '@modules/shared/pages/error/error.component';
import { PageNotFoundComponent } from '@modules/shared/pages/error/not-found.component';
import { PageSwitchContextComponent } from '@modules/shared/pages/switch-context/switch-context.component';

// Guards.
import { AuthenticationRedirectionGuard } from '@modules/core/guards/authentication-redirection.guard';
import { AuthenticationGuard } from '@modules/core/guards/authentication.guard';
import { InnovationCollaborationRedirectionGuard } from '@modules/core/guards/innovation-collaboration-redirection.guard';
import { InnovationTransferRedirectionGuard } from '@modules/core/guards/innovation-transfer-redirection.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('@modules/feature-modules/authentication/authentication.module').then(m => m.AuthenticationModule)
  },

  {
    canActivate: mapToCanActivate([InnovationTransferRedirectionGuard]),
    path: 'transfers/:id',
    pathMatch: 'full',
    children: []
  },

  {
    canActivate: mapToCanActivate([InnovationCollaborationRedirectionGuard]),
    path: 'innovations/:innovationId/collaborations/:collaboratorId',
    pathMatch: 'full',
    children: []
  },

  {
    path: 'home',
    loadChildren: () => import('@modules/feature-modules/home/home.module').then(m => m.HomeModule)
  },

  {
    path: 'policies',
    loadChildren: () => import('@modules/feature-modules/policies/policies.module').then(m => m.PoliciesModule)
  },

  {
    canActivate: mapToCanActivate([AuthenticationGuard]),
    path: '',
    children: [
      {
        canActivate: mapToCanActivate([AuthenticationRedirectionGuard]),
        path: 'dashboard',
        pathMatch: 'full',
        children: []
      },
      {
        path: 'switch-user-context',
        component: BaseLayoutComponent,
        children: [{ path: '', pathMatch: 'full', component: PageSwitchContextComponent }]
      },
      {
        path: 'announcements',
        loadChildren: () =>
          import('@modules/feature-modules/announcements/announcements.module').then(m => m.AnnouncementsModule)
      },
      {
        canActivate: mapToCanActivate([AuthenticationRedirectionGuard]),
        path: 'admin',
        loadChildren: () => import('@modules/feature-modules/admin/admin.module').then(m => m.AdminModule)
      },
      {
        canActivate: mapToCanActivate([AuthenticationRedirectionGuard]),
        path: 'assessment',
        loadChildren: () =>
          import('@modules/feature-modules/assessment/assessment.module').then(m => m.AssessmentModule)
      },
      {
        canActivate: mapToCanActivate([AuthenticationRedirectionGuard]),
        path: 'innovator',
        loadChildren: () => import('@modules/feature-modules/innovator/innovator.module').then(m => m.InnovatorModule)
      },
      {
        canActivate: mapToCanActivate([AuthenticationRedirectionGuard]),
        path: 'accessor',
        loadChildren: () => import('@modules/feature-modules/accessor/accessor.module').then(m => m.AccessorModule)
      }
    ]
  },

  {
    path: 'delete-account-message',
    component: BaseLayoutComponent,
    children: [{ path: '', pathMatch: 'full', component: PageAccountDeleteMessageComponent }]
  },

  {
    path: 'error/:errorType',
    component: BaseLayoutComponent,
    children: [{ path: '', pathMatch: 'full', component: PageErrorComponent }]
  },

  {
    path: 'not-found',
    component: BaseLayoutComponent,
    children: [{ path: '', pathMatch: 'full', component: PageNotFoundComponent }]
  },

  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
