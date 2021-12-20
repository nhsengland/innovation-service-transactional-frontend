import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { TriageInnovatorPackLayoutComponent } from './base/triage-innovator-pack-layout.component';

// Pages.
import { SurveyStartComponent } from './pages/survey/start.component';
import { SurveyStepComponent } from './pages/survey/step.component';

const routes: Routes = [
  {
    path: '',
    component: TriageInnovatorPackLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: SurveyStartComponent },
      { path: 'survey/:id', pathMatch: 'full', component: SurveyStepComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TriageInnovatorPackRoutingModule { }
