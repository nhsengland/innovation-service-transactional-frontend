import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreComponent } from '@app/base';

@Component({
  selector: 'app-triage-innovator-pack-survey-end',
  templateUrl: './end.component.html',
})
export class SurveyEndComponent extends CoreComponent implements OnInit {

  surveyId: string;
  signupUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    super();

    this.surveyId = this.activatedRoute.snapshot.queryParams.surveyId;
    this.signupUrl = `${this.stores.environment.APP_URL}/signup?surveyId=${this.surveyId}`;

  }

  ngOnInit(): void { }

}
