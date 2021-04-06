import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-triage-innovator-pack-survey-end',
  templateUrl: './end.component.html',
})
export class SurveyEndComponent implements OnInit {

  surveyId: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

    this.surveyId = this.activatedRoute.snapshot.queryParams.surveyId;

  }

  ngOnInit(): void { }

}
