import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { BaseLayoutComponent } from '@modules/theme/base/base-layout.component';

// Pages.
import { PageAccountDeleteMessageComponent } from '@modules/shared/pages/account/delete-message/delete-message.component';
import { PageErrorComponent } from '@modules/shared/pages/error/error.component';
import { PageNotFoundComponent } from '@modules/shared/pages/error/not-found.component';

// Guards.
import { AuthenticationGuard } from '@modules/core/guards/authentication.guard';
import { AuthenticationRedirectionGuard } from '@modules/core/guards/authentication-redirection.guard';
import { InnovationTransferRedirectionGuard } from '@modules/core/guards/innovation-transfer-redirection.guard';


const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/triage-innovator-pack'
  },

  {
    path: 'auth', loadChildren: () => import('@modules/feature-modules/authentication/authentication.module').then(m => m.AuthenticationModule)
  },

  {
    canActivate: [InnovationTransferRedirectionGuard],
    path: 'transfers/:id',
    pathMatch: 'full',
    children: []
  },

  {
    path: 'triage-innovator-pack', loadChildren: () => import('@modules/feature-modules/triage-innovator-pack/triage-innovator-pack.module').then(m => m.TriageInnovatorPackModule)
  },

  {
    path: 'policies', loadChildren: () => import('@modules/feature-modules/policies/policies.module').then(m => m.PoliciesModule)
  },

  {
    canActivate: [AuthenticationGuard],
    path: '',
    children: [
      {
        canActivate: [AuthenticationRedirectionGuard],
        path: 'dashboard',
        pathMatch: 'full',
        children: []
      },
      {
        canActivate: [AuthenticationRedirectionGuard],
        path: 'admin', loadChildren: () => import('@modules/feature-modules/admin/admin.module').then(m => m.AdminModule)
      },
      {
        canActivate: [AuthenticationRedirectionGuard],
        path: 'assessment', loadChildren: () => import('@modules/feature-modules/assessment/assessment.module').then(m => m.AssessmentModule)
      },
      {
        canActivate: [AuthenticationRedirectionGuard],
        path: 'innovator', loadChildren: () => import('@modules/feature-modules/innovator/innovator.module').then(m => m.InnovatorModule)
      },
      {
        canActivate: [AuthenticationRedirectionGuard],
        path: 'accessor', loadChildren: () => import('@modules/feature-modules/accessor/accessor.module').then(m => m.AccessorModule)
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
    redirectTo: 'not-found',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
