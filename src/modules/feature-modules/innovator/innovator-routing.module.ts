import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InnovatorLayoutComponent } from './base/innovator-layout.component';

// Pages.
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FirstTimeSigninComponent } from './pages/first-time-signin/first-time-signin.component';
import { InnovationActionTrackerDeclineComponent } from './pages/innovation/action-tracker/action-tracker-decline.component';
import { InnovationActionTrackerInfoComponent } from './pages/innovation/action-tracker/action-tracker-info.component';
import { InnovationActionTrackerComponent } from './pages/innovation/action-tracker/action-tracker.component';
import { InnovationDataSharingChangeComponent } from './pages/innovation/data-sharing/data-sharing-change.component';
import { InnovationDataSharingComponent } from './pages/innovation/data-sharing/data-sharing.component';
import { InnovationOverviewComponent } from './pages/innovation/overview/overview.component';
import { InnovationSectionEvidenceEditComponent } from './pages/innovation/record/evidence-edit.component';
import { InnovationSectionEditComponent } from './pages/innovation/record/section-edit.component';

import { PageInnovationCommentsListComponent } from '@shared-module/pages/innovation/comments/comments-list.component';
import { PageInnovationCommentsNewComponent } from '@shared-module/pages/innovation/comments/comments-new.component';
import { PageInnovationRecordComponent } from '@shared-module/pages/innovation/innovation-record.component';
import { PageActionStatusListComponent } from '@shared-module/pages/innovation/action-status-list.component';
import { PageInnovationSupportStatusListComponent } from '@shared-module/pages/innovation/innovation-support-status-list.component';
import { InnovationSectionEvidenceViewComponent } from '@shared-module/pages/innovation/evidence-view.component';
import { InnovationSectionViewComponent } from '@shared-module/pages/innovation/section-view.component';

// Guards.
import { FirstTimeSigninGuard } from './guards/first-time-signin.guard';

// Resolvers.
import { InnovationDataResolver } from './resolvers/innovation-data.resolver';


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
            resolve: { innovationData: InnovationDataResolver },
            children: [
              {
                path: 'overview', pathMatch: 'full', component: InnovationOverviewComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'record', pathMatch: 'full', component: PageInnovationRecordComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'record/sections/:sectionId', pathMatch: 'full', component: InnovationSectionViewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record', label: 'Innovation record' } } }
              },
              { path: 'record/sections/:sectionId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/edit/1' },
              { path: 'record/sections/:sectionId/edit/:questionId', pathMatch: 'full', component: InnovationSectionEditComponent },

              { path: 'record/sections/:sectionId/evidence/new', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/new/1' },
              { path: 'record/sections/:sectionId/evidence/new/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent },
              {
                path: 'record/sections/:sectionId/evidence/:evidenceId', pathMatch: 'full', component: InnovationSectionEvidenceViewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/record/sections/:sectionId', label: 'Innovation section' } } }
              },
              { path: 'record/sections/:sectionId/evidence/:evidenceId/edit', pathMatch: 'full', redirectTo: 'record/sections/:sectionId/evidence/:evidenceId/edit/1' },
              { path: 'record/sections/:sectionId/evidence/:evidenceId/edit/:questionId', pathMatch: 'full', component: InnovationSectionEvidenceEditComponent },

              {
                path: 'action-tracker', pathMatch: 'full', component: InnovationActionTrackerComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'action-tracker/statuses', pathMatch: 'full', component: PageActionStatusListComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/action-tracker', label: 'Go back' } } }
              },
              {
                path: 'action-tracker/:actionId', pathMatch: 'full', component: InnovationActionTrackerInfoComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/action-tracker', label: 'Action tracker' } } }
              },
              {
                path: 'action-tracker/:actionId/decline', pathMatch: 'full', component: InnovationActionTrackerDeclineComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/action-tracker', label: 'Action tracker' } } }
              },
              {
                path: 'comments', pathMatch: 'full', component: PageInnovationCommentsListComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'comments/new', pathMatch: 'full', component: PageInnovationCommentsNewComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/comments', label: 'Go back' } } }
              },
              {
                path: 'data-sharing', pathMatch: 'full', component: InnovationDataSharingComponent,
                data: { layoutOptions: { type: 'innovationLeftAsideMenu', showInnovationHeader: true } }
              },
              {
                path: 'data-sharing/edit', pathMatch: 'full', component: InnovationDataSharingChangeComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/data-sharing', label: 'Go back' } } }
              },
              {
                path: 'data-sharing/statuses', pathMatch: 'full', component: PageInnovationSupportStatusListComponent,
                data: { layoutOptions: { type: 'emptyLeftAside', backLink: { url: 'innovations/:innovationId/data-sharing', label: 'Go back' } } }
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
