import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from '@shared-module/pages/not-found.component';

import { AuthenticationGuard } from '@modules/core/guards/authentication.guard';

import { StoresResolver } from '@modules/core/resolvers/stores.resolver';

const triageInnovatorPackModule: Promise<any> = import('@triage-innovator-pack-feature-module/triage-innovator-pack.module');
const innovatorModule: Promise<any> = import('@innovator-feature-module/innovator.module');

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/triage-innovator-pack'
    // TODO: NHSAAC-135: https://jupiter.bjss.com/browse/NHSAAC-135
  },

  {
    resolve: { storesResolver: StoresResolver },
    path: 'triage-innovator-pack', loadChildren: () => triageInnovatorPackModule.then(m => m.TriageInnovatorPackModule)
  },

  {
    canActivate: [AuthenticationGuard],
    resolve: { storesResolver: StoresResolver },
    path: 'innovator', loadChildren: () => innovatorModule.then(m => m.InnovatorModule)
  },

  {
    path: 'not-found',
    pathMatch: 'full',
    component: PageNotFoundComponent,
  },

  {
    path: '**',
    redirectTo: 'not-found',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
