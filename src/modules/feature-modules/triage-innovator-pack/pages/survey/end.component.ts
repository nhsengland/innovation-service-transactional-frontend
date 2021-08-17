import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-triage-innovator-pack-survey-end',
  templateUrl: './end.component.html',
})
export class SurveyEndComponent extends CoreComponent {

  surveyId: string;
  signupUrl: string;
  starterInnovationGuideUrl: string;
  advancedInnovationGuideUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.setPageTitle('Submitted successfully');

    this.surveyId = this.activatedRoute.snapshot.queryParams.surveyId;
    this.signupUrl = `${this.stores.environment.APP_URL}/signup?surveyId=${this.surveyId}`;
    this.starterInnovationGuideUrl = `${this.stores.environment.BASE_URL}/innovation-guides/starter-innovation-guide`;
    this.advancedInnovationGuideUrl = `${this.stores.environment.BASE_URL}/innovation-guides/advanced-innovation-guide`;

  }

}
