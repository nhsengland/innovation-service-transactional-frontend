import { NgModule } from '@angular/core';

import { ThemeModule } from '@modules/theme/theme.module';
import { SharedModule } from '@modules/shared/shared.module';

import { TriageInnovatorPackRoutingModule } from './triage-innovator-pack-routing.module';

// Pages.
import { SurveyStartComponent } from '@triage-innovator-pack-feature-module/pages/survey/start.component';
import { SurveyStepComponent } from '@triage-innovator-pack-feature-module/pages/survey/step.component';
import { SurveyEndComponent } from '@triage-innovator-pack-feature-module/pages/survey/end.component';

// Services.
import { SurveyService } from './services/survey.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    TriageInnovatorPackRoutingModule
  ],
  declarations: [
    // Pages.
    SurveyStartComponent,
    SurveyStepComponent,
    SurveyEndComponent
  ],
  providers: [
    SurveyService
  ]
})
export class TriageInnovatorPackModule { }
