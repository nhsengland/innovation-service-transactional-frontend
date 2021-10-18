import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { BaseLayoutComponent } from '@modules/theme/base/base-layout.component';

// Pages.
import { PageErrorComponent } from '@shared-module/pages/error/error.component';
import { PageNotFoundComponent } from '@shared-module/pages/not-found/not-found.component';
import { PageAccountManageUserDeleteAccountMesasageComponent } from '@modules/shared/pages/account/manage-deleteaccoount/manage-deleteaccount-message.component';

// Guards.
import { AuthenticationGuard } from '@modules/core/guards/authentication.guard';
import { AuthenticationRedirectionGuard } from '@modules/core/guards/authentication-redirection.guard';
import { InnovationTransferRedirectionGuard } from '@modules/core/guards/innovation-transfer-redirection.guard';


const authenticationModule: Promise<any> = import('@modules/feature-modules/authentication/authentication.module');
const triageInnovatorPackModule: Promise<any> = import('@modules/feature-modules/triage-innovator-pack/triage-innovator-pack.module');
const assessmentModule: Promise<any> = import('@modules/feature-modules/assessment/assessment.module');
const innovatorModule: Promise<any> = import('@modules/feature-modules/innovator/innovator.module');
const accessorModule: Promise<any> = import('@modules/feature-modules/accessor/accessor.module');
const policiesModule: Promise<any> = import('@modules/feature-modules/policies/policies.module');

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/triage-innovator-pack'
    // TODO: NHSAAC-135: https://jupiter.bjss.com/browse/NHSAAC-135
  },

  {
    path: 'auth', loadChildren: () => authenticationModule.then(m => m.AuthenticationModule)
  },

  {
    canActivate: [InnovationTransferRedirectionGuard],
    path: 'transfers/:id',
    pathMatch: 'full',
    children: []
  },

  {
    path: 'triage-innovator-pack', loadChildren: () => triageInnovatorPackModule.then(m => m.TriageInnovatorPackModule)
  },

  {
    path: 'policies', loadChildren: () => policiesModule.then(m => m.PoliciesModule)
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
        path: 'assessment', loadChildren: () => assessmentModule.then(m => m.AssessmentModule)
      },
      {
        canActivate: [AuthenticationRedirectionGuard],
        path: 'innovator', loadChildren: () => innovatorModule.then(m => m.InnovatorModule)
      },
      {
        canActivate: [AuthenticationRedirectionGuard],
        path: 'accessor', loadChildren: () => accessorModule.then(m => m.AccessorModule)
      },
    ]
  },

  {
    path: 'error',
    component: BaseLayoutComponent,
    children: [{ path: '', pathMatch: 'full', component: PageErrorComponent }]
  },

  {
    path: 'not-found',
    component: BaseLayoutComponent,
    children: [{ path: '', pathMatch: 'full', component: PageNotFoundComponent }]
  },

  {
    path: 'manage-deleteaccount',
    children: [{ path: '', pathMatch: 'full', component: PageAccountManageUserDeleteAccountMesasageComponent }]
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
