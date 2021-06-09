import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';

import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationActionTrackerComponent } from './pages/innovation/action-tracker/action-tracker.component';
import { InnovationCommentsComponent } from './pages/innovation/comments/comments.component';
import { InnovationDataSharingComponent } from './pages/innovation/data-sharing/data-sharing.component';

import { PageInnovationRecordComponent } from '@shared-module/pages/innovation/innovation-record.component';
import { InnovationSectionViewComponent } from '@shared-module/pages/innovation/section-view.component';
import { InnovationSectionEvidenceViewComponent } from '@shared-module/pages/innovation/evidence-view.component';

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
                path: 'record/sections/:sectionId', pathMatch: 'full', component: InnovationSectionViewComponent,
                data: { layoutOptions: { type: 'leftAsideBackLink', backLink: { url: 'innovations/:innovationId/record', label: 'Innovation record' } } }
              },
              { path: 'record/sections/:sectionId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/edit/1' },
              { path: 'record/sections/:sectionId/edit/:questionId', pathMatch: 'full', component: InnovationSectionEditComponent },

              { path: 'record/sections/:sectionId/evidence/new', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/new/1' },
              { path: 'record/sections/:sectionId/evidence/new/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent },
              {
                path: 'record/sections/:sectionId/evidence/:evidenceId', pathMatch: 'full', component: InnovationSectionEvidenceViewComponent,
                data: { layoutOptions: { type: 'leftAsideBackLink', backLink: { url: 'innovations/:innovationId/record/sections/:sectionId', label: 'Innovation section' } } }
              },
              { path: 'record/sections/:sectionId/evidence/:evidenceId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/:evidenceId/edit/1' },
              { path: 'record/sections/:sectionId/evidence/:evidenceId/edit/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent },

              {
                path: 'action-tracker', pathMatch: 'full', component: InnovationActionTrackerComponent,
                data: { layoutOptions: { type: 'leftAsideMenu', showInnovationHeader: false } }
              },
              {
                path: 'comments', pathMatch: 'full', component: InnovationCommentsComponent,
                data: { layoutOptions: { type: 'leftAsideMenu', showInnovationHeader: false } }
              },
              {
                path: 'data-sharing', pathMatch: 'full', component: InnovationDataSharingComponent,
                data: { layoutOptions: { type: 'leftAsideMenu', showInnovationHeader: false } }
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
export class InnovatorRoutingModule { }
