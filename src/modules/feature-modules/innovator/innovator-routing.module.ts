import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
import { InnovationOverviewComponent } from './pages/innovations/overview.component';
import { InnovationsSectionViewComponent } from './pages/innovations/sections/section-view.component';
import { InnovationsSectionEditComponent } from './pages/innovations/sections/section-edit.component';
import { InnovationsSectionEvidenceEditComponent } from './pages/innovations/sections/evidence-edit.component';
import { InnovationsSectionEvidenceViewComponent } from './pages/innovations/sections/evidence-view.component';

import { PageInnovationRecordComponent } from '@shared-module/pages/innovation/innovation-record.component';


// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    canActivateChild: [FirstTimeSigninGuard],
    path: '',
    component: InnovatorLayoutComponent,
    children: [
      {
        path: 'first-time-signin',
        children: [
          { path: '', pathMatch: 'full', redirectTo: '1' },
          { path: ':id', pathMatch: 'full', component: FirstTimeSigninComponent }
        ]
      },
      {
        path: 'dashboard',
        pathMatch: 'full',
        component: DashboardComponent
      },
      {
        path: 'innovations',
        children: [
          { path: '', pathMatch: 'full', component: DashboardComponent },
          { path: ':innovationId', pathMatch: 'full', redirectTo: ':innovationId/overview' },
          {
            path: ':innovationId',
            data: { module: 'innovator' },
            children: [
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { layoutOptions: { type: 'leftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'record', pathMatch: 'full', component: PageInnovationRecordComponent,
                data: { layoutOptions: { type: 'leftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'record/sections/:sectionId', pathMatch: 'full', component: InnovationsSectionViewComponent,
                data: { layoutOptions: { type: 'leftAsideBackLink', backLink: { url: 'innovations/:innovationId/record', label: 'Innovation record' } } }
              },
              { path: 'record/sections/:sectionId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/edit/1' },
              { path: 'record/sections/:sectionId/edit/:questionId', pathMatch: 'full', component: InnovationsSectionEditComponent },

              { path: 'record/sections/:sectionId/evidence/new', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/new/1' },
              { path: 'record/sections/:sectionId/evidence/new/:questionId', pathMatch: 'full', component: InnovationsSectionEvidenceEditComponent },
              {
                path: 'record/sections/:sectionId/evidence/:evidenceId', pathMatch: 'full', component: InnovationsSectionEvidenceViewComponent,
                data: { layoutOptions: { type: 'leftAsideBackLink', backLink: { url: 'innovations/:innovationId/record/sections/:sectionId', label: 'Innovation section' } } }
              },
              { path: 'record/sections/:sectionId/evidence/:evidenceId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/:evidenceId/edit/1' },
              { path: 'record/sections/:sectionId/evidence/:evidenceId/edit/:questionId', pathMatch: 'full', component: InnovationsSectionEvidenceEditComponent }
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
export class InnovatorRoutingModule { }
