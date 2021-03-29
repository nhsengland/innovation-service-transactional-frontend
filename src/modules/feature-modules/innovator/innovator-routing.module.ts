import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashboardComponent
  },

  {
    path: 'first-time-signin',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '1'
      },
      { path: ':id', pathMatch: 'full', component: FirstTimeSigninComponent }

      // { path: 'survey/end', pathMatch: 'full', component: SurveyEndComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InnovatorRoutingModule { }
