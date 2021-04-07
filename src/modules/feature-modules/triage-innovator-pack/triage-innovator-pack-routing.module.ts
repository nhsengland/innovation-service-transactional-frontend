import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Base layout.
import { BaseLayoutComponent } from '@modules/theme/base/base-layout.component';

// Pages.
import { SurveyStartComponent } from '@triage-innovator-pack-feature-module/pages/survey/start.component';
import { SurveyStepComponent } from '@triage-innovator-pack-feature-module/pages/survey/step.component';
import { SurveyEndComponent } from '@triage-innovator-pack-feature-module/pages/survey/end.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: SurveyStartComponent },
      { path: 'survey/end', pathMatch: 'full', component: SurveyEndComponent },
      { path: 'survey/:id', pathMatch: 'full', component: SurveyStepComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TriageInnovatorPackRoutingModule { }
